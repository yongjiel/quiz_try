import React from "react";
import { connect } from "react-redux";
import { error, deletequiz, fetchUserQuizsInDjango, 
    fetchQuizByPermalink} from "../../redux/actions/actions";
import { cookies } from "../../redux/api/todo-api";
import HeaderBar from "./headerbar";


class UserQuizList extends React.Component {
  constructor(props) {
    super(props);
    this.getQuizPart = this.getQuizPart.bind(this);
  }

  delete(qz){
    if(window.confirm('Are you sure to delete this record?')){ 
      let index = this.props.quizs.indexOf(qz);
      let index_full = this.props.quizs_with_questions.findIndex(
                                              item => item.Id === qz.Id);
      this.props.dispatch(deletequiz(index, index_full, qz.permalink,  this.props.navigate));
    }
  }

  redirectToQuiz(permalink){
    this.props.dispatch(fetchQuizByPermalink(permalink, this.props.navigate, "/quizs/"+permalink));
  }

  getQuizContent(){
    let text = "";
      text = (<div>
              <table key="quiz_table">
              <tbody key="quiz_tbody">
                <tr key="quiz_table_header">
                  <th key="quiz_table_header1"  style={{textAlign: 'left', width: '600px'}}>Title</th>
                  <th key="quiz_table_header2"  style={{textAlign: 'left', width: '150px'}}>Number</th>
                  <th key="quiz_table_header3">Delete?</th>
                </tr>
              
                {this.props.quizs.map((qz, i) => (
                    <tr key={'row'+i}>
                    <td key={qz.Title} style={{width: '600px'}}>
                      <a onClick={()=>{this.redirectToQuiz(qz.permalink)}} style={{color: "#2F020C"}}>
                        <u>{qz.Title}</u></a>
                    </td>
                    <td style={{width: '150px'}}>
                      <a onClick={()=>{this.redirectToQuiz(qz.permalink)}} style={{color: "#2F020C"}}>
                        <u>{qz.permalink}</u></a></td>
                    <td><button 
                      className="text-base our-red our-light-grey-background leading-normal"
                      onClick={ () => {this.delete(qz)} } >
                        Delete</button></td>
                    </tr>
                  ))
                }
              </tbody>
              </table>
              {this.props.isOpenQuizModal && this.showQuizModal()}
            </div>
              );

    return text;
  }

  getQuizPart(){
    return (
      <div className="ml-6 pt-1">
        <HeaderBar navigate={this.props.navigate}/>
        <h1 className="text-2xl text-blue-700 leading-tight">
          Hi, { this.get_user() }. Quizs you own.
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

  checkTokenUser(token){
    if (token || this.props.user ){
      //
    }else{
      this.props.dispatch(error("Could not identify user"));
      this.props.navigate("/login");
    }
    
  }

  fetchUserQuizList(token){
    if (token || this.props.user ){
      this.props.dispatch(fetchUserQuizsInDjango(token, this.props.quizs, this.props,null));
    }else{
      this.props.dispatch(error("Could not identify user"));
      this.props.navigate("/login");
    } 
  }

  render() {
    
    let token = null;
    if (!!cookies.get('token')){
      token = cookies.get('token');
    }

    this.checkTokenUser(token);
    this.fetchUserQuizList(token);

    return this.getQuizPart();
  }
}


const mapStateToProps = state => {
  return {
    error: state.quizReducer.error,
    user: state.quizReducer.user,
    quizs: state.quizReducer.quizs,
    isOpenQuizModal: state.quizReducer.isOpenQuizModal,
    modalQuizId: state.quizReducer.modalQuizId,
    quizs_with_questions: state.quizReducer.quizs_with_questions
  };
};

export default connect(mapStateToProps)(UserQuizList);


