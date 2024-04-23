import React from "react";
import { connect } from "react-redux";
import { error, emptyanswers } from "../../redux/actions/actions";


class ToLogIn extends React.Component {
    constructor(props) {
      super(props);
      this.showLogIn = this.showLogIn.bind(this);
    }

    
    showLogIn(){
        this.props.dispatch(emptyanswers());
        this.props.dispatch(error(""));
        this.props.navigate("/login");
     }
    
    render() {
          return <button
          onClick={this.showLogIn} style={{border: "0px", backgroundColor: "#DAFCF7"}}>LogIn</button>;
    }

}


const mapStateToProps = state => {
  return {
  };
};

export default connect(mapStateToProps)(ToLogIn);


