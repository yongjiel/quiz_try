import React from "react";
import { connect } from "react-redux";
import {  showUsermovies} from "../../redux/actions/actions";


class ToUserMovieList extends React.Component {
    constructor(props) {
      super(props);
      this.showUserMovies = this.showUserMovies.bind(this);
    }

    
    showUserMovies(){
        this.props.dispatch(showUsermovies());
        this.props.navigate("/userlist");
     }
    
    render() {
          return <button
          onClick={this.showUserMovies} style={{border: "0px", backgroundColor: "#DAFCF7"}}>User&lsquo;s movies</button>;
    }

}


const mapStateToProps = state => {
  return {
  };
};

export default connect(mapStateToProps)(ToUserMovieList);


