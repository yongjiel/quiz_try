import React from "react";
import { connect } from "react-redux";
import {  showQuizlist } from "../../redux/actions/actions";


class ToUserQuizList extends React.Component {
    constructor(props) {
      super(props);
      this.showQuizList = this.showQuizList.bind(this);
    }

    
    showQuizList(){
        //this.props.dispatch(showQuizlist());
        this.props.navigate("/user_quiz_list");
     }
    
    render() {
          return <button
          onClick={this.showQuizList} style={{border: "0px", backgroundColor: "#DAFCF7"}}>Quiz List</button>;
    }

}


const mapStateToProps = state => {
  return {
  };
};

export default connect(mapStateToProps)(ToUserQuizList);


