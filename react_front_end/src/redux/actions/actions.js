import {
  fetchOMDBMoviesByPageNumber,
  postDjangoMovie,
  fetchOMDBMovieByID,
  deleteMovieInDjango,
  fetchTokenInDjango,
  fetchUserMovieListInDjango,
  cookies
} from "../api/todo-api";

export const FETCH_MOVIE_LIST_BEGIN   = 'FETCH_MOVIE_LIST_BEGIN';
export const FETCH_MOVIE_IN_PROGRESS = 'FETCH_MOVIE_IN_PROGRESS';
export const FETCH_MOVIE_LIST_SUCCESS = 'FETCH_MOVIE_LIST_SUCCESS';
export const FETCH_MOVIE_LIST_FAILURE = 'FETCH_MOVIE_LIST_FAILURE';
export const FETCH_MOVIE_LIST_SUCCESS_EMPTY_RESULT = 'FETCH_MOVIE_LIST_SUCCESS_EMPTY_RESULT';
export const BACK_TO_SEARCH_PART = "BACK_TO_SEARCH_PART";

export const fetchMovieListBegin = (text, page) => ({
  type: FETCH_MOVIE_LIST_BEGIN,
  payload: {search_text: text,
            page: page}
});

export const fetchMovieListInProgress = (payload) => ({
  type: FETCH_MOVIE_IN_PROGRESS,
  payload: payload
});

export const fetchMovieListSuccess = state => ({
  type: FETCH_MOVIE_LIST_SUCCESS,
  payload: { ...state }
});

export const fetchMovieListSuccessEmptyResult = error => ({
    type: FETCH_MOVIE_LIST_SUCCESS_EMPTY_RESULT,
    payload: { error } 
});

export const fetchMovieListFailure = error => ({
  type: FETCH_MOVIE_LIST_FAILURE,
  payload: { error }
});

export const backToSearchPart  = () => ({
  type: BACK_TO_SEARCH_PART
});

export function backtoSearchPart() {
  return dispatch => {
    dispatch(backToSearchPart());
  }
}

function fetchMoviesByPage(moviePartialText, page) {
  
  return async(dispatch) => {
    
    try{
      const st = await fetchOMDBMoviesByPageNumber(moviePartialText, page)
      dispatch(fetchMovieListSuccess(st));
      if (st.page !== st.totalPages){
        dispatch(fetchMovieListInProgress({page: st.page}));
      }
    }catch(error){
        console.log("......////");
        console.log(error.message);
        dispatch(fetchMovieListFailure({error: error.message}));
    };

  }
}

export function fetchMovieList(text, page) {
  return dispatch => {
    if (! text){
      dispatch(fetchMovieListSuccessEmptyResult("Error: Search Box could not be empty"));
      return;
    }
    dispatch(fetchMovieListBegin(text, page));
    dispatch(fetchMoviesByPage(text, page));
  };
}

export const FETCH_USER_BEGIN   = 'FETCH_USER_BEGIN';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';
export const FETCH_USER_SUCCESS_EMPTY_RESULT = 'FETCH_USER_SUCCESS_EMPTY_RESULT';
export const FETCH_USER_MOVIE_SUCCESS = 'FETCH_USER_MOVIE_SUCCESS';
export const LOG_OUT = 'LOG_OUT';
export const ADD_MOVIE = 'ADD_MOVIE';
export const SHOW_USER_MOVIES = "SHOW_USER_MOVIES";
export const DELETE_MOVIE = "DELETE_MOVIE";
export const ADD_MOVIE_SUCCESS = 'ADD_MOVIE_SUCCESS';
export const ADD_MOVIE_FAILURE = 'ADD_MOVIE_FAILURE';
export const DELETE_MOIVIE_FAILURE = 'DELETE_MOIVIE_FAILURE';
export const DELETE_MOIVIE_SUCCESS = 'DELETE_MOIVIE_SUCCESS';
export const ADD_MOVIE_ENTIRE_RECORD = 'ADD_MOVIE_ENTIRE_RECORD';
export const CLOSE_MODAL = "CLOSE_MODAL";
export const OPEN_MODAL = "OPEN_MODAL";
export const CLEAR_SEARCH_MOVIES = "CLEAR_SEARCH_MOVIES";

export const closeModal = () => ({
  type: CLOSE_MODAL
});

export const openModal = (imdbID)  => ({
  type: OPEN_MODAL,
  payload: {imdbID}
});

export const fetccUserBegin = () => ({
  type: FETCH_USER_BEGIN
});

export const fetccUserSuccess = () => ({
  type: FETCH_USER_SUCCESS
});

export const fetchUserMovieSuccess = (movies) =>({
  type: FETCH_USER_MOVIE_SUCCESS,
  payload: {movies}
});

export const addMovieToUserMovies = (post) =>({
  type: ADD_MOVIE,
  payload: {post}
});

export const addMovieSuccess = () =>({
  type: ADD_MOVIE_SUCCESS
});

export const addMovieFailure = () => ({
  type: ADD_MOVIE_FAILURE
});

export const showUserMovies = ()=> ({
  type: SHOW_USER_MOVIES
});

export const clearSearchMovies = ()=>({
  type: CLEAR_SEARCH_MOVIES
});

export const fetccUserFailure = error => ({
  type: FETCH_USER_FAILURE,
  payload: { error }
});

export const logOut = () => ({
  type: LOG_OUT
});

export const deleteMovie = (i) => ({
  type: DELETE_MOVIE,
  payload: {i}
});

export const deleteMovieSuccess =()=>({
  type: DELETE_MOIVIE_SUCCESS
});

export const deleteMovieFailure =()=>({
  type: DELETE_MOIVIE_FAILURE
});

export const addMovieEntireRecord =(data)=>({
  type: ADD_MOVIE_ENTIRE_RECORD,
  payload:  {data}
});

export function closemodal(){
  return dispatch => {
    dispatch(closeModal())};
}

export function openmodal(imdbID){
  return dispatch => {
    dispatch(openModal(imdbID))};
}

export function logout(){
  return dispatch => {
    dispatch(logOut())};
}

export function add_movie_entire_record(data){
  return dispatch => {
    dispatch(addMovieEntireRecord(data));
  }
}

export function addmovie(post, navigate){
  return dispatch => {
    dispatch(addMovieToUserMovies(post));
    // be careful, those axios returns  only promise.
    const resp_promise = fetchOMDBMovieByID(post.imdbID);
    resp_promise.then(resp=>{
      dispatch(add_movie_entire_record(resp.data));
      const res_prmomise = postDjangoMovie(resp.data);
      res_prmomise.then(res=>{
        if ( [200, 201].includes(res.status) ) {
          dispatch(addMovieSuccess());
        } else {
            if ( [401].includes(res.status) ) {
              alert("Token timeout! Back to login")
              dispatch(logOut());
              navigate("/login");
            }else{
              dispatch(addMovieFailure());
            }
        }
      });
    })
  };
}

export function deletmovie(i, imdbID, navigate){
  return dispatch => {
    dispatch(deleteMovie(i));
    const resp = deleteMovieInDjango(imdbID);
    resp.then(res=>{
      if ( [204].includes(res.status) ) {
        dispatch(deleteMovieSuccess());
      } else {
          if ( [401].includes(res.status) ){
            alert("Token timeout! Back to login");
            dispatch(logOut());
            navigate('/login');
          }else{
            dispatch(deleteMovieFailure());
          }
          
      }
    });
    
  };
}

export function showUsermovies(){
  return dispatch => {
    dispatch(showUserMovies());
  }
}

function is_not_in_user_movies(mvs, id){
  return mvs.filter(m => m.imdbID === id).length === 0;
}

export function fetchMovieListInDjango(token, mvs, navigate, uri) {
  return dispatch => {
    if (token === null){
      dispatch(fetccUserFailure("Could not get user's movies"));
      return;
    }
    fetchUserMovieListInDjango(token)
    .then(movies=> {
      movies.map(m => {
        if ( is_not_in_user_movies(mvs, m.imdbID) ){
          dispatch(addmovie(m));
        }
      });
      cookies.set('token', token);
      dispatch(fetccUserSuccess());
      if (navigate !== null){
        navigate(uri);
      }
      return movies;
    }).catch(
      error => {
        console.log(error);
        dispatch(fetccUserFailure("Could not get user's movies"));
      }
    );
  };
}

export function fetchUser(value, mvs, navigate, uri) {
  return dispatch => {
    dispatch(fetccUserBegin(value));
    
    fetchTokenInDjango(value)
        .then(data => {
          dispatch(fetchMovieListInDjango(data.access, mvs, navigate, uri)); // for jwt token
          //    dispatch(fetchMovieListInDjango(data.key, mvs, navigate, uri)); // for normal token
              //dispatch(fetchUserMovieSuccess(mvss)); //search_movies for loading 10 records from source site.
              return data.key;
          })
      .catch(
        error => {
          console.log(error);
          dispatch(fetccUserFailure(error));
        }
      );
  };

}
