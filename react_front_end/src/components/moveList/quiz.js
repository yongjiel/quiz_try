import React from "react";
import { connect } from "react-redux";
import { Formik, Field, Form } from "formik";
import { postQuiz, fetchQuizByID } from "../../redux/actions/actions";
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
  }
  
  creatDBRecords(d){
    this.props.dispatch(
          postQuiz(d, this.props.navigate, '/user_quiz_list')
      );
  }

  handleQuizSubmit(){
    this.fetchDBRecordInDjango(this.props.match.permalink);
    this.props.navigate("/user_quiz_list")
  }

  get_question_part(){
    let text =  '';
    text = '';
    return text;
  }

  filtUpData(quiz){
      let data = {};
      data['quiz_title'] = quiz['Title']
      let questions = quiz.Questions_set;
      for (let i=0; i<questions.length; i++){
            let key = "Question"+i;
            data[key] = decodeURI(questions[i].Question);
            for (var j=0; j<5; j++){
                let key2 = "Answer"+i+"_"+j;
                data[key2] = questions[i]['Answer'+(j+1)]
            }
            
      }
      return data;
  }

  getQuizContent(quiz){
    let text = "";
    if(!!quiz){
      let data = this.filtUpData(quiz);
      text = (
      <Formik
                  initialValues={{...data }}
                  onSubmit={async (values) => {
                          await new Promise((resolve) => setTimeout(resolve, 500));
                          this.handleQuizSubmit(values);
                          }}
              >
                  <Form>
                      <table key="quiz_table">
                      <tbody key="quiz_tbody">
                      <tr key="quiz">
                          <tr key="quiz_t">
                          <th><label htmlFor="quiz_title">Quiz title:</label></th>
                          <td><div style={{width: '500px', textAlign: 'center',color: 'red'}}>
                                   {quiz.Title}</div>
                          </td></tr>
                               
                          <td></td>
                          </tr>
                          {quiz.Questions_set.map(function(q, i) {
                            let answers=[q.Answer1, q.Answer2, q.Answer3, q.Answer4, q.Answer5]
                            return (
                              <tr>
                                <table>
                                <tr>
                                  <td style={{width: '30px'}}>&bull;</td>
                                  <td  style={{width: '100%', whiteSpace:'nowrap'}}>
                                      <div><span  style={{color:'grey'}}>{q.Question}</span>&nbsp;
                                (&nbsp;
                                    {answers.map(function(t, j) {
                    
                                        if(t){
                                            return ( 
                                                <span>{ (j !=0 ) && "  /  "}<button name={"Answer"+i+'_'+j}
                                                    onClick={() => {this.showQuizList()}} 
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
                  <button className="text-base our-red our-background leading-normal" type="submit">Submit</button>
                  </Form>
              </Formik>
              );
    }
    return text;
  }

  back_to_origin_uri(){
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
      return Id;
  }

  getQuiz(permalink){
      const Id = this.getIdByPermalink(permalink);
      let quiz;
      this.props.quizs_with_questions.map( q =>{
        if (!!q && q.Id === Id){
            quiz = q;
        }
      });
      if (!quiz && this.first_time === 1){
          this.props.dispatch(fetchQuizByID(Id))
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
          {this.getQuizContent(q)}
      </div>
    );
  }

  render() {
    return this.getQuizPart();
  }
}


const mapStateToProps = state => {
  return {
    error: state.movieListReducer.error,
    user: state.movieListReducer.user,
    quizs_with_questions: state.movieListReducer.quizs_with_questions,
    quizs: state.movieListReducer.quizs
  };
};

export default connect(mapStateToProps)(withRouter(Quiz));


