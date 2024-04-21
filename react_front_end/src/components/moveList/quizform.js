import React from "react";
import { connect } from "react-redux";
import { Formik, Field, Form } from "formik";
import { fetchUser} from "../../redux/actions/actions";
import LogOut from "./logout";
import ToQuizForm from "./toquizform";
import ToUserQuizList from "./touserquizlist";
import ToUserMovieList from "./touserlist";
import ToSearchList from "./tosearch";


class QuizForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleQuizSubmit = this.handleQuizSubmit.bind(this);
    this.getQuizPart = this.getQuizPart.bind(this);
  }
  
  creatDBRecords(values){
    this.props.dispatch(
          fetchUser(values, this.props.user_movies, this.props.navigate, "/search")
      );
  }

  handleQuizSubmit(values){
    console.log(values)
    // this.creatDBRecords(values);
    // this.props.navigate("/user_quiz_list")
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
                                <tr key={"Question"+(i+1)}>
                                  <td><label htmlFor={"Question"+(i+1)}>{"Question"+(i+1)}:</label></td>
                                  <td><Field name={"Question"+(i+1)} label={"Question"+(i+1)} type="text" style={{width: '500px'}}/></td>
                                </tr>
                                {Array.from({ length: 5 }).map(function(t, j) {
                                  return (
                                    <tr>
                                    <td><label htmlFor={"Answer"+(i+1)+'_'+(j+1)}>{"Answer"+(j+1)}:</label></td>
                                    <td><Field name={"Answer"+(i+1)+'_'+(j+1)} label={"Answer"+(i+1)+'_'+(j+1)} type="text"  style={{width: '300px'}} /></td>
                                    <td><Field name={"Check"+(i+1)+'_'+(j+1)} className="mr-2 leading-tight" type="checkbox" /></td>
                                    <td><label htmlFor={"Check"+(i+1)+'_'+(j+1)}>Correct</label></td>
                                    </tr>
                                  );
                                })}
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

  get_header_link_part(){
    return (
      <div>
        <LogOut navigate={this.props.navigate}/> &nbsp;&nbsp;&nbsp;
        <ToQuizForm navigate={this.props.navigate}/>&nbsp;&nbsp;&nbsp;
        <ToUserQuizList navigate={this.props.navigate}/>&nbsp;&nbsp;&nbsp;
        <ToUserMovieList navigate={this.props.navigate}/> &nbsp;&nbsp;&nbsp;
        <ToSearchList navigate={this.props.navigate}/>
      </div>);
  }

  getQuizPart(){
    return (
      <div className="ml-6 pt-1">
        { this.get_header_link_part() }
        <h1 className="text-2xl text-blue-700 leading-tight">
          Hi, { this.get_user() }
        </h1>

          { this.checkError() }
          { this.getQuizContent() }
      </div>
    );
  }

  get_user(){
    return this.props.user;
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
    error: state.movieListReducer.error,
    user: state.movieListReducer.user
  };
};

export default connect(mapStateToProps)(QuizForm);


