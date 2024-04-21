import React from "react";
import { connect } from "react-redux";
import { 
    showUsermovies, deletmovie, closemodal, openmodal} 
    from "../../redux/actions/actions";
import Modal from "react-modal";
import LogOut from "./logout";
import ToQuizForm from "./toquizform";
import ToUserQuizList from "./touserquizlist";
import ToSearchList from "./tosearch";
import { fetchMovieListInDjango, fetchUserFailure } from "../../redux/actions/actions";
import { cookies } from "../../redux/api/todo-api";


class UserMovieList extends React.Component {
    constructor(props) {
      super(props);
      this.showUserMovies = this.showUserMovies.bind(this);
      this.delete = this.delete.bind(this);
      this.closeModal = this.closeModal.bind(this);
      this.openModal = this.openModal.bind(this);
      this.showModal = this.showModal.bind(this);
      this.first_time= true;
    }

    delete(post){
      if(window.confirm('Are you sure to delete this record?')){ 
        let index = this.props.user_movies.indexOf(post);
        this.props.dispatch(deletmovie(index, post.imdbID, this.props.navigate));
      }
    }

    showUserMovies(){
      this.props.dispatch(showUsermovies());
    }

    checkInUserMovies(imdbID){
      if (this.props.user_movies.length === 0){
        return false;
      }
      let tmp = this.props.user_movies.map((each)=> each.imdbID);
      if (tmp.includes(imdbID)){
        return true;
      }
      return false;
    }
   
    showLogoutButton(){
        return <LogOut navigate={this.props.navigate}/>;            
    }
    
    showQuizFormButton(){
      return <ToQuizForm navigate={this.props.navigate}/>;            
    }

    openModal(imdbID){
      this.props.dispatch(openmodal(imdbID));
    }

    getUserMoviesPart(){
      let text = "";
        text = (<div>
                {this.showLogoutButton()}&nbsp;&nbsp;&nbsp;{this.showQuizFormButton()}&nbsp;&nbsp;&nbsp;
                <ToUserQuizList navigate={this.props.navigate}/> &nbsp;&nbsp;&nbsp;
                <ToSearchList navigate={this.props.navigate}/>
                <br/><br/>
                <h1>Hi, User, your Movie List. </h1>
                <table key='table'>
                <tbody key='tbody'>
                <tr key='head_row'><th style={{textAlign: 'left'}}>Title</th>
                <th style={{textAlign: 'left'}}>Year</th><th>Delete?</th></tr>
                  {this.props.user_movies.map((post, i) => (
                    <tr key={'row'+i}>
                    <td key={post.imdbID} style={{width: '600px'}}>
                      <a onClick={()=>{this.openModal(post.imdbID)}} style={{color: "#2F020C"}}>
                        <u>{post.Title}</u></a>
                    </td>
                    <td style={{width: '150px'}}>{post.Year}</td>
                    <td><button 
                      className="text-base our-red our-light-grey-background leading-normal"
                      onClick={ () => {this.delete(post)} } >
                        Delete</button></td>
                    </tr>
                  ))}
                </tbody>
                </table>
                {this.props.isOpenModal && this.showModal()}
                </div>);

      return text;
    }

    closeModal(){
      this.props.dispatch(closemodal());
    }

    showModal(){
      let movies = [];
      let imdbID = this.props.modalImdbID;
      if (!!this.props.user_movies_entire_records){
        movies = this.props.user_movies_entire_records.filter( movie =>{
                    if (movie.imdbID === imdbID){
                      return true;
                    }
                });
      }
      let movie = movies[0];
      let keys = Object.keys(movie);
      let table_content = keys.map((k, i) => (
          <tr key={'modal_row' + i}><td>{k}</td><td>{JSON.stringify(movie[k], null, 2)}</td></tr>
      ))
      const modalStyle = {
        overlay: {
            position: 'absolute',
            top: '95px',
            bottom: '70px',
            left: '50%',
            width: '650px',
            marginLeft: '35px',
            marginRight: 'auto',
            transform: 'translate(-50%, -0%)',
            backgroundColor: 'white',
            border: '1px',
            borderStyle: 'solid',
            borderColor: 'blue',
            borderRadius: '3px'
        },
        content: {
            position: 'absolute',
            top: '0px',
            left: '0px',
            right: '0px',
            bottom: '0px',
            background: '#dddddd',
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            padding: '10px',
            border: '5px',
            borderStyle: 'solid',
            borderColor: 'white'
        }
    };
      return (
        <div>
          <Modal
          isOpen={this.props.isOpenModal}
          onRequestClose={this.closeModal}
          style={modalStyle}
        >
         <button type="button" className="close"
                 onClick={()=>this.closeModal()}>&times;</button>
          <table  key={'modal_table'}>
            <tbody key={'modal_tbody'}>
          {table_content}
          </tbody>
          </table>
        </Modal> 
          
        </div>
       
      );
    }
    
    refetchUserMovieList(token){
        if (token === null){
            this.props.dispatch(fetchUserFailure("Could not get user's movies"));
          }
        this.props.dispatch(fetchMovieListInDjango(token, this.props.user_movies, null,null));
      }

    render() {
        
        if (this.props.user_movies.length === 0 && !! this.first_time){
            let token = null;
            if (!!cookies.get('token')){
              token = cookies.get('token');
              
              if (!this.props.loading){
                // do not need to refetch user movies again. in /search did it. 
                // after log in, it goes to /search automatically. user_movies is filled up.
                // if refectch again, the last one in user_movies will trigger the django
                // /userlist again to get the non-deleted record back. the refetch and 
                // /movies/<id> (HTTP DELETE ) competing.
                //this.refetchUserMovieList(token);
              }
            } else{
              if (this.props.loading){
                this.refetchUserMovieList(token);
                return <><p>Loading......</p></>;
              }
              else if (!this.props.loggedIn){
                return <><p>Please <a href="/login">login</a> first.</p></>;
              }
            }
            
            //alert("loading " + this.props.loading)
            //alert("error " + this.props.error )
            
            
            this.first_time = false;
          }
        return this.getUserMoviesPart();
        
    }

}


const mapStateToProps = state => {
  return {
    error: state.movieListReducer.error,
    user_movies: state.movieListReducer.user_movies,
    isOpenModal: state.movieListReducer.isOpenModal,
    user_movies_entire_records: state.movieListReducer.user_movies_entire_records,
    modalImdbID: state.movieListReducer.modalImdbID,
    loading: state.movieListReducer.loading,
    loggedIn: state.movieListReducer.loggedIn
  };
};

export default connect(mapStateToProps)(UserMovieList);


