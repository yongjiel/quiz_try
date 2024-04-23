import React from "react";
import { connect } from "react-redux";
import { emptyanswers } from "../../redux/actions/actions";

class ToAllQuizList extends React.Component {
    constructor(props) {
      super(props);
      this.showLogIn = this.showLogIn.bind(this);
    }

    
    showLogIn(){
        this.props.dispatch(emptyanswers());
        this.props.navigate("/quizlist");
     }
    
    render() {
          return <button
          onClick={this.showLogIn} style={{border: "0px", backgroundColor: "#DAFCF7"}}>All Quizs</button>;
    }

}


const mapStateToProps = state => {
  return {
  };
};

export default connect(mapStateToProps)(ToAllQuizList);


