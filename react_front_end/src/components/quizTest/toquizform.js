import React from "react";
import { connect } from "react-redux";
import {  showQuizform, error, emptyanswers } from "../../redux/actions/actions";
import { cookies } from "../../redux/api/todo-api";


class ToQuizForm extends React.Component {
    constructor(props) {
      super(props);
      this.showQuizForm = this.showQuizForm.bind(this);
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

    showQuizForm(){
      this.props.dispatch(emptyanswers());
        if(this.loginRequired()){
          this.props.dispatch(showQuizform());
          this.props.navigate("/user_quiz_form");
        }  
     }

    
    render() {
          return <button
          onClick={this.showQuizForm} style={{border: "0px", backgroundColor: "#DAFCF7"}}>New Quiz Form</button>;
    }

}


const mapStateToProps = state => {
  return {
  };
};

export default connect(mapStateToProps)(ToQuizForm);


