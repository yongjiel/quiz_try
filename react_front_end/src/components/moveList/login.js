import React from "react";
import { connect } from "react-redux";
import { fetchUser} from "../../redux/actions/actions";
import { Formik, Field, Form } from "formik";


class LogIn extends React.Component {
    constructor(props) {
      super(props);
      this.handleLogInSubmit = this.handleLogInSubmit.bind(this);
      this.getLoginPart = this.getLoginPart.bind(this);
    }

    getUserAndMovies(values){
      this.props.dispatch(
            fetchUser(values, this.props.user_movies, this.props.navigate, "/search")
        );
    }

    handleLogInSubmit(values){
      this.getUserAndMovies(values);
    }
  
    getLoginContent(){
        let text = "";
          text = (<Formik
                      initialValues={{ username: "example", password: "sample_12" }}
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
            const text = (<p className="text-base our-red our-background leading-normal" >{this.props.error}</p>);
            return text;
        }
        return '';
      }

    getLoginPart(){
      return (
        <div className="ml-6 pt-1">
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
    error: state.movieListReducer.error,
    user_movies: state.movieListReducer.user_movies
  };
};

export default connect(mapStateToProps)(LogIn);


