import React from "react";
import { connect } from "react-redux";
import { fetchUserAndGetQuizs } from "../../redux/actions/actions";
import { Formik, Field, Form } from "formik";
import HeaderBar from "./headerbar";


class LogIn extends React.Component {
    constructor(props) {
      super(props);
      this.handleLogInSubmit = this.handleLogInSubmit.bind(this);
      this.getLoginPart = this.getLoginPart.bind(this);
    }

    getUserAndQuizs(values){
      this.props.dispatch(
        fetchUserAndGetQuizs(values, this.props.quizs, this.props.navigate, "/user_quiz_list")
        );
    }

    handleLogInSubmit(values){
      this.getUserAndQuizs(values);
    }
  
    getLoginContent(){
        let text = "";
          text = (<Formik
                      initialValues={{ }}
                      onSubmit={async (values) => {
                      await new Promise((resolve) => setTimeout(resolve, 500));
                      this.handleLogInSubmit(values);
                      }}
                  >
                      <Form>
                          <table key="login_table">
                              <tbody key="login_tbody">
                          <tr key="user_row"><td><label htmlFor="username">Username:</label></td>
                              <td><Field name="username" label='Userame' type="text" /></td></tr>
                          <tr key='password_row'><td><label htmlFor="password">Password:</label></td>
                              <td><Field name="password" label='password' type="password" /></td></tr>
                              </tbody>
                          </table>
                      <button className="text-base our-red our-background leading-normal" type="submit">Submit</button>
                      </Form>
                  </Formik>
                  );
  
        return text;
    }

    checkError(){
        if (!!this.props.error){
          if (this.props.error.search(/Invalid user email format/i) > -1){
            return (<div><p>&nbsp;</p></div>);
          }
          const text = (<div><p className="text-base our-blue our-background" >{this.props.error}</p></div>);
          return text;
        }
        return (<div><p>&nbsp;</p></div>);
      }

    getLoginPart(){
      return (
        <div className="ml-6 pt-1">
          <HeaderBar navigate={this.props.navigate}/>
          <h1 className="text-2xl text-blue-700 leading-tight">
            Log in
          </h1>

            { this.checkError() }
            { this.getLoginContent() }
        </div>
      );
    }

    

    render() {
          return this.getLoginPart();
      }
}


const mapStateToProps = state => {
  return {
    error: state.quizReducer.error,
    quizs: state.quizReducer.quizs
  };
};

export default connect(mapStateToProps)(LogIn);


