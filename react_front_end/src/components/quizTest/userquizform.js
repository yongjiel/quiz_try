import React from "react";
import { connect } from "react-redux";
import { Formik, Field, Form } from "formik";
import { postQuiz } from "../../redux/actions/actions";
import HeaderBar from "./headerbar";
import { cookies } from "../../redux/api/todo-api";


class QuizForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleQuizSubmit = this.handleQuizSubmit.bind(this);
    this.getQuizPart = this.getQuizPart.bind(this);
    this.creatDBRecords = this.creatDBRecords.bind(this);
  }
  
  creatDBRecords(d){
    this.props.dispatch(
          postQuiz(d, this.props.quizs, this.props.navigate, '/user_quiz_list')
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
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
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
                                  <tr><td>&nbsp;</td><td></td><td></td></tr>
                                <tr>
                                  <td><label htmlFor={"Question"+i}>{"Question"+(i+1)}:</label></td>
                                  <td><Field name={"Question"+i} label={"Question"+i} type="text" style={{width: '500px'}}/></td>
                                  <td>Correct</td>
                                </tr> 
                               
                                {Array.from({ length: 5 }).map(function(t, j) {
                                  return (
          
                                    <tr>
                                    <td><label htmlFor={"Answer"+i+'_'+j}>{"Answer"+(j+1)}:</label></td>
                                    <td><Field name={"Answer"+i+'_'+j} label={"Answer"+i+'_'+j} type="text"  style={{width: '300px'}} /></td>
                                    <td><Field name={"Check"+i+'_'+j} className="mr-2 leading-tight" type="checkbox" /></td>
                                    
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

  getQuizPart(){
    return (
      <div className="ml-6 pt-1">
        <HeaderBar navigate={this.props.navigate}/>
        <h1 className="text-2xl text-blue-700 leading-tight">
          Hi, { this.get_user() }
        </h1>

          { this.checkError() }
          { this.getQuizContent() }
      </div>
    );
  }

  get_user(){
    return this.props.user || cookies.get('user');
  }

  checkError(){
    if (!!this.props.error){
        const text = (<p className="text-base our-red our-background leading-normal" >{this.props.error}</p>);
        return text;
    }
    return '';
  }

  render() {
    return this.getQuizPart();
  }
}


const mapStateToProps = state => {
  return {
    error: state.quizReducer.error,
    user: state.quizReducer.user, 
    quizs: state.quizReducer.quizs
  };
};

export default connect(mapStateToProps)(QuizForm);


