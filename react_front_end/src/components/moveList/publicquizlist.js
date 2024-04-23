import React from "react";
import { connect } from "react-redux";
import { fetchAllQuizsInDjango, fetchQuizByID } from "../../redux/actions/actions";
import { cookies } from "../../redux/api/todo-api";
import HeaderBar from "./headerbar";


class PublicQuizList extends React.Component {
  constructor(props) {
    super(props);
    this.getQuizPart = this.getQuizPart.bind(this);
  }

  redirectToQuiz(Id, permalink){
    this.props.dispatch(fetchQuizByID(Id, this.props.navigate, "/quizs/"+ Id + '/'+permalink));
  }

  getQuizContent(){
    let text = "";
      text = (<div>
              <table key="quiz_table">
              <tbody key="quiz_tbody">
                <tr key="quiz_table_header">
                  <th key="quiz_table_header1"  style={{textAlign: 'left', width: '600px'}}>Title</th>
                  <th key="quiz_table_header2"  style={{textAlign: 'left', width: '150px'}}>Number</th>
                </tr>
              
                {this.props.quizs.map((qz, i) => (
                    <tr key={'row'+i}>
                    <td key={qz.Title} style={{width: '600px'}}>

                      <a onClick={()=>{this.redirectToQuiz(qz.Id, qz.permalink)}} style={{color: "#2F020C"}}>
                        <u>{qz.Title}</u></a>
                    </td>
                    <td style={{width: '150px'}}>
                      <a onClick={()=>{this.redirectToQuiz(qz.Id, qz.permalink)}} style={{color: "#2F020C"}}>
                        <u>{qz.permalink}</u></a></td>
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
          Hi, {this.props.user || cookies.get("user") || "Visitor"}. List of All Quizs.
        </h1>
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

  fetchAllQuizList(){
    this.props.dispatch(fetchAllQuizsInDjango(this.props.quizs));
  }
  
  render() {
    this.fetchAllQuizList();
    return this.getQuizPart();
  }
}


const mapStateToProps = state => {
  return {
    error: state.movieListReducer.error,
    user: state.movieListReducer.user,
    quizs: state.movieListReducer.quizs,
    quizs_with_questions: state.movieListReducer.quizs_with_questions
  };
};

export default connect(mapStateToProps)(PublicQuizList);


