import React from "react";
import { connect } from "react-redux";
import { fetchUserAndGetQuizs, error } from "../../redux/actions/actions";
import { cookies } from "../../redux/api/todo-api";


class ToUserQuizList extends React.Component {
    constructor(props) {
      super(props);
      this.showQuizList = this.showQuizList.bind(this);
    }

    loginRequired(){
      let token = null;
      if (!!cookies.get('token')){
        token = cookies.get('token');
      }
      if (!! token ) {
        return true;
      }else{
        this.props.dispatch(error("Log in first!"));
        this.props.navigate("/login");
        return false;
      }
    }


    showQuizList(){
      if(this.loginRequired()){
        this.props.dispatch(
          fetchUserAndGetQuizs(null, this.props.quizs, this.props.navigate, "/user_quiz_list")
          );
      } 
     }
    
    render() {
          return <button
          onClick={() => {this.showQuizList()}} style={{border: "0px", backgroundColor: "#DAFCF7"}}>User Quiz List</button>;
    }

}


const mapStateToProps = state => {
  return {
    quizs: state.movieListReducer.quizs,
    user: state.movieListReducer.user
  };
};

export default connect(mapStateToProps)(ToUserQuizList);


