import React from "react";
import { connect } from "react-redux";
import { 
    showUsermovies, backtoSearchPart,
    deletmovie, closemodal, openmodal} from "../../redux/actions/actions";
import Modal from "react-modal";
import LogOut from "./logout";


class ToSearchList extends React.Component {
    constructor(props) {
      super(props);
      this.showSearchPart = this.showSearchPart.bind(this);
    }

    showSearchPart(){
        this.props.dispatch(backtoSearchPart());
        this.props.navigate("/search");
    }
    
    render() {
        return <button onClick={this.showSearchPart}  style={{border: "0px", backgroundColor: "#DAFCF7"}}> Back to search </button>;
    }

}


const mapStateToProps = state => {
  return {
  };
};

export default connect(mapStateToProps)(ToSearchList);


