import React from "react";
import { connect } from "react-redux";
import { logout} from "../../redux/actions/actions";


class QuizForm extends React.Component {
    constructor(props) {
      super(props);
      this.logout = this.logout.bind(this);
    }


    logout(){
      this.props.dispatch(logout());
      this.props.navigate("/login");
    }

    render() {
        return <button onClick={this.logout} 
                style={{border: "0px", backgroundColor: "#DAFCF7"}}>
                QuizForm
                </button>;  
    }

}


const mapStateToProps = state => {
  return {
  };
};

export default connect(mapStateToProps)(QuizForm);


