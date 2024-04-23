import React from "react";
import { connect } from "react-redux";
import { error, emptyanswers } from "../../redux/actions/actions";

class ToRegister extends React.Component {
    constructor(props) {
      super(props);
      this.showRegister = this.showRegister.bind(this);
    }

    
    showRegister(){
        this.props.dispatch(emptyanswers());
        this.props.dispatch(error(''));
        this.props.navigate("/register");
     }
    
    render() {
          return <button
          onClick={this.showRegister} style={{border: "0px", backgroundColor: "#DAFCF7"}}>Register</button>;
    }

}


const mapStateToProps = state => {
  return {
  };
};

export default connect(mapStateToProps)(ToRegister);


