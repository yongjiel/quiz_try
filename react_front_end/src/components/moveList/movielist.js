import React from "react";
import { connect } from "react-redux";
import SearchBox from "../searchBox";
import { 
    fetchMovieList,
    addmovie,
    backtoSearchPart,
    clearSearchMovies
} from "../../redux/actions/actions";
import LogOut from "./logout";
import QuizForm from "./quizform";
import ToUserMovieList from "./touserlist";
import { fetchMovieListInDjango, fetccUserFailure } from "../../redux/actions/actions";
import { cookies } from "../../redux/api/todo-api";

class MovieList extends React.Component {
    constructor(props) {
      super(props);
      this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
      this.save = this.save.bind(this);
      this.getSearchPart = this.getSearchPart.bind(this);
      this.checkUserList = this.checkUserList.bind(this);
      this.refetchUserMovieList= this.refetchUserMovieList.bind(this);
      this.first_time= true;
      this.getList = this.getList.bind(this);
      this.showSearchPart = this.showSearchPart.bind(this);
    }

    checkUserList(){
      if (!!this.props.user_movies && this.props.user_movies.length >= 5){
        const text = (<p style={{backgroundColor: "#F9D1C9"}}> User has 5 or more records! Please check <ToUserMovieList navigate={this.props.navigate}/></p>);

        return text;
      }
      return '';
    }

    getList(text, page){
      this.props.dispatch(fetchMovieList(text, page));
    }

    handleSearchSubmit(e){
      e.preventDefault();
      const form = e.target;
      this.props.dispatch(clearSearchMovies());
      this.getList(form.search.value, 1);
    }

    save(post){
      if ( this.props.user_movies.filter(m => m.imdbID === post.imdbID).length === 0 ){
        this.props.dispatch(addmovie(post, this.props.navigate));
      }
      
    }

    showQuizFormButton(){
      return <QuizForm navigate={this.props.navigate}/>;            
    }

    showLogoutButton(){
        return <LogOut navigate={this.props.navigate}/>;            
    }

    showSearchPart(){
        this.props.dispatch(backtoSearchPart());
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

    getTableContent(){
      let text = "";
      if (!this.props.error && this.props.search_movies.length > 0){
        text = (<table key='table'>
                <tbody key='tbody'>
                <tr key='head_row'><th style={{textAlign: 'left'}}>Title</th><th style={{textAlign: 'left'}}>Year</th><th>Save?</th></tr>
                  {this.props.search_movies.map((post, i) => (
                    <tr key={'row'+i}>
                    <td key={post.imdbID} style={{width: '600px'}}>
                      {post.Title}
                    </td>
                    <td style={{width: '150px'}}>{post.Year}</td>
                    <td><button className={ "text-base our-light-grey-background leading-normal " +  
                                              ((this.checkInUserMovies(post.imdbID) || 
                                                this.props.user_movies.length >=5)?
                                             "our-grey":"our-blue")} 
                                onClick={()=>this.save(post)}
                              disabled={ 
                                (this.checkInUserMovies(post.imdbID) || this.props.user_movies.length >=5)? true: false}>
                        Save</button></td>
                    </tr>
                  ))}
                </tbody>
                </table>);
      } else {
        text = (<p> {this.props.error}</p>);
      }

      return text;
    }

    getSearchPart(){
      return (
        <div>
          {this.showLogoutButton()}&nbsp;&nbsp;&nbsp;{this.showQuizFormButton()}&nbsp;&nbsp;&nbsp;
          <ToUserMovieList navigate={this.props.navigate}/>
          {this.checkUserList()}
          <br/><br/>
          <h1>Search Movie List. </h1>
          <SearchBox handleSearchSubmit={this.handleSearchSubmit}/>
          {!!this.props.page && !!this.props.totalPages &&
            (<div>Totally {this.props.totalResults} records. Show from 1 - 
                {(this.props.totalResults < this.props.page * 10)? this.props.totalResults : this.props.page * 10} </div>)}
          <br/>
          { this.getTableContent() }
          

        </div>
      );
    }
/*
          {this.props.totalPages >1 &&
            (<div><span><button onClick={()=>this.getList(this.props.search_text, 1)}> 1 </button></span>
                  <span><button onClick={()=>this.getList(this.props.search_text, this.props.page-1)}
                          disabled={(this.props.page === 1)? true: false}> &lt; </button></span>
                  <span><button onClick={()=>this.getList(this.props.search_text, this.props.page+1)}
                          disabled={(this.props.page === this.props.totalPages)? true: false}> &gt; </button></span>
                  <span><button onClick={()=>this.getList(this.props.search_text, this.props.totalPages)}> {this.props.totalPages} </button></span>
                  </div>)}*/
    refetchUserMovieList(token){
      if (token === null){
        this.props.dispatch(fetccUserFailure("Could not get user's movies"));
      }
      this.props.dispatch(fetchMovieListInDjango(token, this.props.user_movies, null, null));
    }
    
    render() {
          if (this.props.user_movies.length === 0 && !! this.first_time){
            let token = null;
            if (!!cookies.get('token')){
              token = cookies.get('token');
              this.refetchUserMovieList(token);
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
          //alert("2222error " + this.props.error )
          return this.getSearchPart();
    }

}


const mapStateToProps = state => {
  return {
    search_text: state.movieListReducer.search_text,
    search_movies: state.movieListReducer.search_movies,
    page: state.movieListReducer.page,
    totalPages: state.movieListReducer.totalPages,
    totalResults: state.movieListReducer.totalResults,
    error: state.movieListReducer.error,
    user_movies: state.movieListReducer.user_movies,
    userMovieListFromDB: state.movieListReducer.userMovieListFromDB,
    loading: state.movieListReducer.loading,
    show_user_movies_flag: state.movieListReducer.show_user_movies_flag,
    loggedIn: state.movieListReducer.loggedIn,
    user_movies: state.movieListReducer.user_movies,
    error: state.movieListReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchMovieListInDjango: ()=>dispatch(fetchMovieListInDjango)
    // Cannot use this.props.dispatch(fechMovieListInDjango) anymore. Or will
    // raise error "this.props.dispatch is not a function."
    // this function will affect all this.props.dispatch in this file.
  };
};

//export default connect(mapStateToProps, mapDispatchToProps)(MovieList);
export default connect(mapStateToProps)(MovieList);


