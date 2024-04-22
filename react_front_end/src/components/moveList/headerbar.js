import React from "react";
import LogOut from "./logout";
import ToLogIn from "./tologin";
import ToQuizForm from "./toquizform";
import ToUserQuizList from "./touserquizlist";
import ToUserMovieList from "./touserlist";
import ToSearchList from "./tosearch";
import ToRegister from "./toregister";
import ToAllQuizList from "./toallquizlist";

class HeaderBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<div className="ml-6 pt-1">
        <ToAllQuizList navigate={this.props.navigate}/> &nbsp;&nbsp;&nbsp;
        <ToLogIn navigate={this.props.navigate}/> &nbsp;&nbsp;&nbsp;
        <LogOut navigate={this.props.navigate}/> &nbsp;&nbsp;&nbsp;
        <ToRegister navigate={this.props.navigate}/>&nbsp;&nbsp;&nbsp;
        <ToQuizForm navigate={this.props.navigate}/>&nbsp;&nbsp;&nbsp;
        <ToUserQuizList navigate={this.props.navigate}/>&nbsp;&nbsp;&nbsp;
        <ToUserMovieList navigate={this.props.navigate}/> &nbsp;&nbsp;&nbsp;
        <ToSearchList navigate={this.props.navigate}/>
        </div>);
  }
}


export default HeaderBar;


