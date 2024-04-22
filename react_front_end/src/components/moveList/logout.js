import React from "react";
import { connect } from "react-redux";
import { logout, error} from "../../redux/actions/actions";
import { cookies } from "../../redux/api/todo-api";

class LogOut extends React.Component {
    constructor(props) {
      super(props);
      this.logout = this.logout.bind(this);
    }


    logout(){
      cookies.remove("token")
      this.props.dispatch(logout());
      this.props.dispatch(error("Logged out!"));
      this.props.navigate("/login");
    }

    render() {
        return <button onClick={this.logout} 
                style={{border: "0px", backgroundColor: "#DAFCF7"}}>
              LogOut
              </button>;  
    }

}


const mapStateToProps = state => {
  return {
  };
};

export default connect(mapStateToProps)(LogOut);


