import React from "react";
import { connect } from "react-redux";
import { postQuiz, fetchQuizByPermalink, fetchAllQuizsInDjango,
  addanswer, deleteanswer,updatescore, emptyanswers } from "../../redux/actions/actions";
import HeaderBar from "./headerbar";
import { useParams } from 'react-router-dom';
import { cookies } from "../../redux/api/todo-api";


const withRouter = WrappedComponent => props => {
    const match = useParams();
    // etc... other react-router-dom v6 hooks
  
    return (
      <WrappedComponent
        {...props}
        {...{ match } }
      />
    );
  };


class Quiz extends React.Component {
  constructor(props) {
    super(props);
    this.handleQuizSubmit = this.handleQuizSubmit.bind(this);
    this.getQuizPart = this.getQuizPart.bind(this);
    this.creatDBRecords = this.creatDBRecords.bind(this);
    this.first_time = 1;
    this.first_time_quizs = 1;
    this.getQuizContent = this.getQuizContent.bind(this);
    this.toggleAnswer = this.toggleAnswer.bind(this);
    this.calculate_score = this.calculate_score.bind(this);
  }
  
  creatDBRecords(d){
    this.props.dispatch(
          postQuiz(d, this.props.navigate, '/user_quiz_list')
      );
  }

  calculate_score(quiz){
    let correct_answers=[];
    let questions = [];
    quiz.Questions_set.map(function(q, i) {
      if (!!q.Question){
        questions.push(q.Question);
        let tmp=[q.CorrectAnswer1, q.CorrectAnswer2, q.CorrectAnswer3, 
                q.CorrectAnswer4, q.CorrectAnswer5]
        correct_answers.push(tmp);
      }
      
    });
    let answers = [];
    for (let i=0; i<correct_answers.length; i++){
      let tmp = [];
      for (let j=0; j<5; j++){
        if (this.props.answers.hasOwnProperty('Answer'+i+"_"+j)){
          tmp.push(this.props.answers['Answer'+i+"_"+j]);
        }else{
          tmp.push('');
        }
      }
      answers.push(tmp);
    }
    let scores = [];
    let miss_correct_feed_back_answers ={};
    for (let i=0; i<correct_answers.length; i++){
      var score = this.compare_answer(correct_answers[i], answers[i])
      if (score ===0){
        miss_correct_feed_back_answers[questions[i]] = correct_answers[i]
      }
      scores.push(score);
    }
    return [scores, miss_correct_feed_back_answers]
  }

  compare_answer(correct_answers, answers){
    let s = 1;
    for (let j=0; j<5; j++){
      if (correct_answers[j] != answers[j]){
        s = 0;
      }
    }
    return s;
  }

  handleQuizSubmit(quiz){
    let scores, miss_correct_feed_back_answers;
    let tmp = this.calculate_score(quiz);
    scores = tmp[0];
    miss_correct_feed_back_answers = tmp[1];
    let sum = scores.reduce((a, b) => a + b, 0)
    let message = "You answered " +sum+'/'+scores.length+ " questions correctly";
    this.props.dispatch(updatescore(message, miss_correct_feed_back_answers));
  }

  get_question_part(){
    let text =  '';
    text = '';
    return text;
  }

  addAnswer(i, j, answer_value){
    this.props.dispatch(addanswer("Answer"+i+"_"+j, answer_value ));
  }

  deleteAnswer(i,j){
    this.props.dispatch(deleteanswer("Answer"+i+"_"+j));
  }

  toggleAnswer = (event, i, j, answer_value)=>{
    let el = event.target;
    if (!el.style.color){
      el.style.color="red";
      this.addAnswer(i, j, answer_value);
    }else{
      el.style.color="";
      this.deleteAnswer(i, j);
    }
  }

  getQuizContent(quiz, thiss){
    let text = "";
    if(!!quiz){
      text = (
          <>
            <table key="quiz_table">
            <tbody key="quiz_tbody">
            <tr key="quiz">
                <tr key="quiz_t">
                <th><label htmlFor="quiz_title">Title:</label></th>
                <th><div style={{width: '500px', textAlign: 'center',
                        color: 'darkblue', fontSize:'25px'}}>
                          {quiz.Title}</div>
                </th>
                </tr>
                      
                <td></td>
            </tr>
                {quiz.Questions_set.map(function(q, i) {
                  let answers=[q.Answer1, q.Answer2, q.Answer3, q.Answer4, q.Answer5]
                  return (
                    <tr key={"row_q"+i}>
                      <table key={"tbl_q"+i}>
                      <tr key={'tbl_r'+i}>
                        <td style={{width: '30px'}}>&bull;</td>
                        <td key={'tbl_d'+i} style={{width: '100%', whiteSpace:'nowrap'}}>
                            <div key={"qa"+i}><span key={"q"+i} style={{color:'grey'}}>{q.Question}</span>&nbsp;
                      (&nbsp;
                          {answers.map(function(t, j) {
          
                              if(t){
                                  return ( 
                                      <span key={"a"+i+"_"+j}>{ (j !=0 ) && "  /  "}<button
                                          type="button"
                                          onClick={ (event) => {thiss.toggleAnswer(event, i, j, t)} }
                                          style={{border: "0px", backgroundColor: "white"}}>
                                              {t}
                                              
                                          </button></span>
                              )}
                          })}
                      &nbsp;) </div>
                      </td>
                      </tr>
                      </table>
                    </tr>
                  );
                  }
                )
                }
        
              </tbody>
              </table>
            <button onClick={ (event) => {thiss.handleQuizSubmit(quiz)}}
                  className="text-base our-red our-background leading-normal" 
                  type="submit">
            Submit
            </button>
            <div>{ this.props.score }</div>
            <div>{ !['{}', 'null'].includes(JSON.stringify(this.props.miss_correct_feed_back_answers)) && 
                  "Correct answers:"}</div>
            { this.list_correct_questions_answers() }
                  
          </>
              );
    }
    return text;
  }

  list_correct_questions_answers(){
    
    if (!['{}', 'null'].includes(JSON.stringify(this.props.miss_correct_feed_back_answers)) ){
      let text = '';
      text = (
        Object.keys(this.props.miss_correct_feed_back_answers).map((k, i)=>{
          let array = this.props.miss_correct_feed_back_answers[k].filter(e=>
            !! e
          );
          return (
            <div><span>{k}</span>::
            <span>{array.join(",")}</span>
            </div>
          );
          
        })
      );
      return text;
    }
  }

  back_to_origin_uri(){
    this.props.dispatch(emptyanswers())
    if (!!this.props.user || !!cookies.get('token') ){
        this.props.navigate("/user_quiz_list");
    }else{
        this.props.navigate("/quizlist");
    }
    
  }

  getIdByPermalink(permalink){
      let Id;
      this.props.quizs.map(q => {
        if (q.permalink === permalink){
            Id = q.Id;
        }
      });
      if (!Id && this.first_time_quizs === 1){
        this.props.dispatch(fetchAllQuizsInDjango( this.props.quizs, 
                              this.props.navigate, "/quizs/"+permalink ));
        this.first_time_quizs = 2;
      }
      this.props.quizs.map(q => {
        if (q.permalink === permalink){
            Id = q.Id;
        }
      });
      return Id;
  }

  getQuiz(permalink){
      let quiz;
      this.props.quizs_with_questions.map( q =>{
        if (!!q && q.permalink === permalink){
            quiz = q;
        }
      });
      if (!quiz && this.first_time === 1){
          this.props.dispatch(fetchQuizByPermalink(permalink, this.props.navigate,
                                                  '/quizs/'+permalink));
          this.first_time = 2;
      }
      return quiz;
  }

  getQuizPart(){
    let q = this.getQuiz(this.props.match.permalink);

    return (
      <div className="ml-6 pt-1">
        <HeaderBar navigate={this.props.navigate}/>
        <div> <a onClick={()=>{this.back_to_origin_uri()}} style={{color: "#2F020C"}}>
                        <u>Back to list</u></a> </div>
        <h1 className="text-2xl text-blue-700 leading-tight">
          Hi, {this.props.user || cookies.get('user') || "Visitor"}.  
        </h1>
        <br/>
        <h4  className="text-xl text-blue-700 leading-tight">
            {this.props.match.permalink}
        </h4>
          {this.getQuizContent(q, this)}
      </div>
    );
  }

  render() {
    return this.getQuizPart();
  }
}


const mapStateToProps = state => {
  return {
    error: state.quizReducer.error,
    user: state.quizReducer.user,
    quizs_with_questions: state.quizReducer.quizs_with_questions,
    quizs: state.quizReducer.quizs,
    answers: state.quizReducer.answers,
    score: state.quizReducer.score,
    miss_correct_feed_back_answers: state.quizReducer.miss_correct_feed_back_answers
  };
};

export default connect(mapStateToProps)(withRouter(Quiz));


