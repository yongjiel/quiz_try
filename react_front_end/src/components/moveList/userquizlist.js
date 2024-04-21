import React from "react";
import { connect } from "react-redux";
import { fetchUser, deletequiz, fetchUserQuizsInDjango, fetchUserFailure,
  openquizmodal, closequizmodal, fetchQuizByID } from "../../redux/actions/actions";
import LogOut from "./logout";
import ToQuizForm from "./toquizform";
import ToUserMovieList from "./touserlist";
import ToSearchList from "./tosearch";
import { cookies } from "../../redux/api/todo-api";
import Modal from "react-modal";


class UserQuizList extends React.Component {
  constructor(props) {
    super(props);
    this.handleQuizSubmit = this.handleQuizSubmit.bind(this);
    this.getQuizPart = this.getQuizPart.bind(this);
    this.closeQuizModal = this.closeQuizModal.bind(this);
    this.openQuizModal = this.openQuizModal.bind(this);
    this.showQuizModal = this.showQuizModal.bind(this);
  }
  
  getUserQuizList(values){
    this.props.dispatch(
          fetchUser(values, this.props.quizs, this.props.navigate, "/user_quiz_list")
      );
  }

  handleQuizSubmit(values){
    this.getUserQuizList(values);
    this.props.navigate("/user_quiz_list")
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  delete(qz){
    if(window.confirm('Are you sure to delete this record?')){ 
      let index = this.props.quizs.indexOf(qz);
      let index_full = this.props.quizs_with_questions.findIndex(
                                              item => item.Id === qz.Id);
      this.props.dispatch(deletequiz(index, index_full, qz.Id,  this.props.navigate));
    }
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
                      <a onClick={()=>{this.openQuizModal(qz.Id)}} style={{color: "#2F020C"}}>
                        <u>{qz.Title}</u></a>
                    </td>
                    <td style={{width: '150px'}}>
                      <a onClick={()=>{this.openQuizModal(qz.Id)}} style={{color: "#2F020C"}}>
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

  get_header_link_part(){
    return (
      <div>
        <LogOut navigate={this.props.navigate}/> &nbsp;&nbsp;&nbsp;
        <ToQuizForm navigate={this.props.navigate}/>&nbsp;&nbsp;&nbsp;
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

  refetchUserQuizList(token){
    if (token === null){
        this.props.dispatch(fetchUserFailure("Could not get user's movies"));
      }
    this.props.dispatch(fetchUserQuizsInDjango(token, this.props.quizs, null,null));
  }

  openQuizModal(Id){
    this.props.dispatch(openquizmodal(Id));
  }

  closeQuizModal(){
    this.props.dispatch(closequizmodal());
  }

  checkExistOrGetQuizFull(quiz_id){
    let qzs = [];
    qzs = this.props.quizs_with_questions.filter( qz =>{
      if (qz.Id === quiz_id){
        return true;
      }
    });
    if (qzs.length === 0){
      this.props.dispatch(fetchQuizByID(quiz_id));
    }
    qzs = this.props.quizs_with_questions.filter( qz =>{
        if (qz.Id === quiz_id){
          return true;
        }
    });
    this.props.quizs_with_questions.map( qz =>{
      delete qz.user;
    });
    return qzs;
  }


  showQuizModal(){
    let quiz_id = this.props.modalQuizId;
    let qzs = this.checkExistOrGetQuizFull(quiz_id);
    let qz = qzs[0];
    let keys = null;
    let table_content;
    if (!! qz){
      keys = Object.keys(qz);
      table_content = keys.map((k, i) => (
          <tr key={'modal_row' + i}><td>{k}</td><td>{JSON.stringify(qz[k], null, 2)}</td></tr>
      ));
    }
    const modalStyle = {
      overlay: {
          position: 'absolute',
          top: '95px',
          bottom: '70px',
          left: '50%',
          width: '650px',
          marginLeft: '35px',
          marginRight: 'auto',
          transform: 'translate(-50%, -0%)',
          backgroundColor: 'white',
          border: '1px',
          borderStyle: 'solid',
          borderColor: 'blue',
          borderRadius: '3px'
      },
      content: {
          position: 'absolute',
          top: '0px',
          left: '0px',
          right: '0px',
          bottom: '0px',
          background: '#dddddd',
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          padding: '10px',
          border: '5px',
          borderStyle: 'solid',
          borderColor: 'white'
      }
  };
    return (
      <div>
        <Modal
        isOpen={this.props.isOpenQuizModal}
        onRequestClose={this.closeQuizModal}
        style={modalStyle}
      >
       <button type="button" className="close"
               onClick={()=>this.closeQuizModal()}>&times;</button>
        <table  key={'modal_table'}>
          <tbody key={'modal_tbody'}>
        {table_content}
        </tbody>
        </table>
      </Modal> 
        
      </div>
     
    );
  }

  render() {
    let token = null;
    if (!!cookies.get('token')){
      token = cookies.get('token');
    }
    this.refetchUserQuizList(token);
      
    return this.getQuizPart();
  }
}


const mapStateToProps = state => {
  return {
    error: state.movieListReducer.error,
    user: state.movieListReducer.user,
    quizs: state.movieListReducer.quizs,
    isOpenQuizModal: state.movieListReducer.isOpenQuizModal,
    modalQuizId: state.movieListReducer.modalQuizId,
    quizs_with_questions: state.movieListReducer.quizs_with_questions
  };
};

export default connect(mapStateToProps)(UserQuizList);


