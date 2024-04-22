import React from "react";
import { connect } from "react-redux";
import { Formik, Field, Form } from "formik";
import { postQuiz } from "../../redux/actions/actions";
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
  }
  
  creatDBRecords(d){
    this.props.dispatch(
          postQuiz(d, this.props.navigate, '/user_quiz_list')
      );
  }

  convert_values_object_to_dic(values){
    let quiz = {}
    quiz.Title = values.quiz_title;
    let questions = [];
    for (var i=0; i<10; i++){
      let q = {}
      if (values.hasOwnProperty("Question" + i)){
        q.question = values["Question" + i]
      }
      for (var j=0; j<5; j++) {
        if (values.hasOwnProperty("Answer"+i+ "_"+j)){
          q['Answer'+(j+1)] = values["Answer"+i+ "_"+j]
        }else{
          q['Answer'+(j+1)] = '';
        }
        if (values.hasOwnProperty("Check"+i+ "_"+j)){
          q['CorrectAnswer'+(j+1)] = values["Answer"+i+ "_"+j]
        }else{
          q['CorrectAnswer'+(j+1)] = '';
        }
      }
      if (q.hasOwnProperty('question')){
        questions.push(q);
      }
    }
    quiz.Questions = questions;
    return quiz;
  }

  handleQuizSubmit(values){
    console.log(values)
    let d = this.convert_values_object_to_dic(values);
    this.creatDBRecords(d);
    this.props.navigate("/user_quiz_list")
  }

  get_question_part(){
    let text =  '';
    text = '';
    return text;
  }

  getQuizContent(){
    let text = "";
      text = (<Formik
                  initialValues={{}}
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
                          <td><Field name="quiz_title" label='quiz_title' type="text" style={{width: '500px'}}/></td></tr>
                          <td></td>
                          </tr>
                          {Array.from({ length: 10 }).map(function(e, i) {
                            return (
                              <tr>
                                <table>
                                <tr>
                                  <td><label htmlFor={"Question"+i}>{"Question"+(i+1)}:</label></td>
                                  <td><Field name={"Question"+i} label={"Question"+i} type="text" style={{width: '500px'}}/></td>
                                </tr>
                                {Array.from({ length: 5 }).map(function(t, j) {
                                  return (
                                    <tr>
                                    <td><label htmlFor={"Answer"+i+'_'+j}>{"Answer"+(j+1)}:</label></td>
                                    <td><Field name={"Answer"+i+'_'+j} label={"Answer"+i+'_'+j} type="text"  style={{width: '300px'}} /></td>
                                    <td><Field name={"Check"+i+'_'+j} className="mr-2 leading-tight" type="checkbox" /></td>
                                    <td><label htmlFor={"Check"+i+'_'+j}>Correct</label></td>
                                    </tr>
                                  );
                                })}
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

    return text;
  }

  back_to_origin_uri(){
    if (!!this.props.user || !!cookies.get('token') ){
        this.props.navigate("/user_quiz_list");
    }else{
        this.props.navigate("/quizlist");
    }
    
  }

  getQuizPart(){
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
            Quiz {this.props.match.permalink}.
        </h4>
          
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
    user: state.movieListReducer.user
  };
};

export default connect(mapStateToProps)(withRouter(Quiz));


