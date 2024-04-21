import React from "react";
import { connect } from "react-redux";
import {  showQuizform } from "../../redux/actions/actions";


class ToQuizForm extends React.Component {
    constructor(props) {
      super(props);
      this.showQuizForm = this.showQuizForm.bind(this);
    }

    
    showQuizForm(){
        this.props.dispatch(showQuizform());
        this.props.navigate("/user_quiz_form");
     }
    
    render() {
          return <button
          onClick={this.showQuizForm} style={{border: "0px", backgroundColor: "#DAFCF7"}}>Quiz Form</button>;
    }

}


const mapStateToProps = state => {
  return {
  };
};

export default connect(mapStateToProps)(ToQuizForm);


