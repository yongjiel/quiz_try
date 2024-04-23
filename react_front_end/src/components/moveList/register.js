import React from "react";
import { connect } from "react-redux";
import { postNewUser, error } from "../../redux/actions/actions";
import { Formik, Field, Form } from "formik";
import HeaderBar from "./headerbar";


class Register extends React.Component {
    constructor(props) {
      super(props);
      this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
      this.getRegisterPart = this.getRegisterPart.bind(this);
    }

    createUserAndRedirect(values){
      this.props.dispatch(
            postNewUser(values, this.props.navigate, "/login")
        );
    }

    validateEmail(email){
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      };

    handleRegisterSubmit(values){
      if (!this.validateEmail(values.useremail)){
        this.props.dispatch(
            error("Invalid user email format")
        );
      }else{
        this.createUserAndRedirect(values);
      }
      
    }
  
    getRegisterContent(){
        let text = "";
          text = (<Formik
                      initialValues={{ }}
                      onSubmit={async (values) => {
                      await new Promise((resolve) => setTimeout(resolve, 500));
                      this.handleRegisterSubmit(values);
                      }}
                  >
                      <Form>
                          <table key="login_table">
                              <tbody key="login_tbody">
                          <tr key="useremail_row"><td><label htmlFor="useremail">User Email:</label></td>
                              <td><Field name="useremail" label='useremail' type="text" /></td></tr>
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

    getRegisterPart(){
      return (
        <div className="ml-6 pt-1">
          <HeaderBar navigate={this.props.navigate}/>
          <h1 className="text-2xl text-blue-700 leading-tight">
            Register
          </h1>

            { this.checkError() }
            { this.getRegisterContent() }
        </div>
      );
    }

    

    render() {
          return this.getRegisterPart();
      }
}


const mapStateToProps = state => {
  return {
    error: state.movieListReducer.error,
    user_movies: state.movieListReducer.user_movies
  };
};

export default connect(mapStateToProps)(Register);


