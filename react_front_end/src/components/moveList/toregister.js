import React from "react";
import { connect } from "react-redux";


class ToRegister extends React.Component {
    constructor(props) {
      super(props);
      this.showLogIn = this.showLogIn.bind(this);
    }

    
    showLogIn(){
        this.props.navigate("/register");
     }
    
    render() {
          return <button
          onClick={this.showLogIn} style={{border: "0px", backgroundColor: "#DAFCF7"}}>Register</button>;
    }

}


const mapStateToProps = state => {
  return {
  };
};

export default connect(mapStateToProps)(ToRegister);


