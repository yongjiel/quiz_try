import {
  fetchOMDBMoviesByPageNumber,
  postDjangoMovie,
  fetchOMDBMovieByID,
  deleteMovieInDjango,
  deleteQuizInDjango,
  fetchTokenInDjango,
  fetchUserMovieListInDjango,
  fetchUserQuizListInDjango,
  fetchAllQuizListInDjango,
  fetchQuizByIDInDjango,
  postQuizInDjango,
  createNewUser,
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
export const SHOW_QUIZ_FORM = "SHOW_QUIZ_FORM";
export const SHOW_QUIZ_LIST = "SHOW_QUIZ_LIST";
export const DELETE_MOVIE = "DELETE_MOVIE";

export const ADD_MOVIE_SUCCESS = 'ADD_MOVIE_SUCCESS';
export const ADD_MOVIE_FAILURE = 'ADD_MOVIE_FAILURE';
export const DELETE_MOIVIE_FAILURE = 'DELETE_MOIVIE_FAILURE';
export const DELETE_MOIVIE_SUCCESS = 'DELETE_MOIVIE_SUCCESS';
export const DELETE_QUIZ_SUCCESS = 'DELETE_QUIZ_SUCCESS';
export const DELETE_QUIZ_FAILURE = 'DELETE_QUIZ_FAILURE';
export const FETCH_QUIZ_FAILURE = 'FETCH_QUIZ_FAILURE';
export const FETCH_QUIZ_SUCCESS = 'FETCH_QUIZ_SUCCESS';
export const DELETE_QUIZ = "DELETE_QUIZ";
export const ADD_QUIZ = 'ADD_QUIZ';
export const ADD_QUIZ_FULL = 'ADD_QUIZ_FULL';
export const DELETE_QUIZ_FULL = 'DELETE_QUIZ_FULL';
export const ADD_MOVIE_ENTIRE_RECORD = 'ADD_MOVIE_ENTIRE_RECORD';
export const CLOSE_MODAL = "CLOSE_MODAL";
export const OPEN_MODAL = "OPEN_MODAL";
export const OPEN_QUIZ_MODAL = 'OPEN_QUIZ_MODAL';
export const CLOSE_QUIZ_MODAL = 'CLOSE_QUIZ_MODAL';
export const CLEAR_SEARCH_MOVIES = "CLEAR_SEARCH_MOVIES";
export const ERROR = "ERROR";

export const errorDirect = (msg) => ({
  type: ERROR,
  payload: {msg}
});

export const closeModal = () => ({
  type: CLOSE_MODAL
});

export const openModal = (imdbID)  => ({
  type: OPEN_MODAL,
  payload: {imdbID}
});

export const openQuizModal = (Id)  => ({
  type: OPEN_QUIZ_MODAL,
  payload: {Id}
});

export const closeQuizModal = ()  => ({
  type: CLOSE_QUIZ_MODAL
});

export const fetchUserBegin = (user) => ({
  type: FETCH_USER_BEGIN,
  payload: {user}
});

export const fetchUserSuccess = () => ({
  type: FETCH_USER_SUCCESS
});

export const fetchQuizSuccess = () => ({
  type: FETCH_QUIZ_SUCCESS
});

export const fetchQuizFailure = (error) => ({
  type: FETCH_QUIZ_FAILURE,
  payload: { error }
});

export const fetchUserMovieSuccess = (movies) =>({
  type: FETCH_USER_MOVIE_SUCCESS,
  payload: {movies}
});

export const addMovieToUserMovies = (post) =>({
  type: ADD_MOVIE,
  payload: {post}
});

export const addQuizToQuizs = (quiz) =>({
  type: ADD_QUIZ,
  payload: {quiz}
});

export const addQuizToQuizWithQuestions=(quiz) =>({
  type: ADD_QUIZ_FULL,
  payload: {quiz}
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

export const showQuizForm = ()=> ({
  type: SHOW_QUIZ_FORM
});

export const showQuizList = ()=> ({
  type: SHOW_QUIZ_LIST
});

export const clearSearchMovies = ()=>({
  type: CLEAR_SEARCH_MOVIES
});

export const fetchUserFailure = error => ({
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

export const deleteQuiz = (i) => ({
  type: DELETE_QUIZ,
  payload: {i}
});

export const deleteQuizFull = (i) => ({
  type: DELETE_QUIZ_FULL,
  payload: {i}
});

export const deleteMovieSuccess =()=>({
  type: DELETE_MOIVIE_SUCCESS
});

export const deleteQuizSuccess =()=>({
  type: DELETE_QUIZ_SUCCESS
});

export const deleteMovieFailure =()=>({
  type: DELETE_MOIVIE_FAILURE
});

export const deleteQuizFailure =()=>({
  type: DELETE_QUIZ_FAILURE
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

export function closequizmodal(){
  return dispatch => {
    dispatch(closeQuizModal())};
}

export function openquizmodal(Id){
  return dispatch => {
    dispatch(openQuizModal(Id))};
}

export function logout(){
  return dispatch => {
    cookies.remove('token');
    cookies.remove('user')
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

export function addquiz(quiz){
  return dispatch => {
    dispatch(addQuizToQuizs(quiz));
  };
}

export function deletequiz(i, i_in_full, id, navigate){
  return dispatch => {
    const resp = deleteQuizInDjango(id);
    resp.then(res=>{
      if ( [204].includes(res.status) ) {
        dispatch(deleteQuiz(i));
        if (i_in_full >= 0){
          dispatch(deleteQuizFull(i_in_full));
        }
        dispatch(deleteQuizSuccess());
      } else {
          if ( [401].includes(res.status) ){
            alert("Token timeout! Back to login");
            dispatch(logOut());
            if (!! navigate){
              navigate('/login');
            }
          }else{
            dispatch(deleteQuizFailure());
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

export function showQuizform(){
  return dispatch => {
    dispatch(showQuizForm());
  }
}

export function showQuizlist(){
  return dispatch => {
    dispatch(showQuizList());
  }
}

function is_not_in_user_movies(mvs, id){
  return mvs.filter(m => m.imdbID === id).length === 0;
}

function is_not_in_quizs(qzs, id){
  return qzs.filter(q => q.Id === id).length === 0;
}

export function fetchMovieListInDjango(token, mvs, navigate, uri) {
  return dispatch => {
    if (token === null){
      dispatch(fetchUserFailure("Token missing"));
      return;
    }
    fetchUserMovieListInDjango(token)
    .then(movies=> {
      movies.map(m => {
        if ( is_not_in_user_movies(mvs, m.imdbID) ){
          dispatch(addmovie(m));
        }
      });
      dispatch(fetchUserSuccess());
      if (navigate !== null){
        navigate(uri);
      }
      return movies;
    }).catch(
      error => {
        console.log(error);
        dispatch(fetchUserFailure("Authentication failed"));
      }
    );
  };
}

export function fetchUserQuizsInDjango(token, qzs, navigate, uri) {
  return dispatch => {
    if (token === null){
      dispatch(fetchUserFailure("Could not pass user anthentication"));
      return;
    }
    fetchUserQuizListInDjango(token)
    .then(quizs=> {
      let Ids = [];
      quizs.map(q => {
        Ids.push(q.Id);
        if ( is_not_in_quizs(qzs, q.Id) ){
          dispatch(addquiz(q));
        }
      });
      // delete extra from props.quizs
      qzs.map((q,i) =>{
        if (! Ids.includes(q.Id) ){
          dispatch(deleteQuiz(i));
        }  
      });
      dispatch(fetchQuizSuccess());
      if (navigate !== null){
        navigate(uri);
      }
      return quizs;
    }).catch(
      error => {
        console.log(error);
        dispatch(fetchQuizFailure("Could not get user's quiz"));
      }
    );
  };
}

export function fetchAllQuizsInDjango(qzs) {
  return dispatch => {
    fetchAllQuizListInDjango()
    .then(quizs=> {
      quizs.map(q => {
        if ( is_not_in_quizs(qzs, q.Id) ){
          dispatch(addquiz(q));
        }
      });
      dispatch(fetchQuizSuccess());
      return quizs;
    }).catch(
      error => {
        console.log(error);
        dispatch(fetchQuizFailure("Could not get user's quiz"));
      }
    );
  };
}


export function fetchUserAndGetQuizs(value, quizs, navigate, uri) {
  return dispatch => {
    if ( !! value ){
      cookies.set('user', value.username);
      var username = value.username || cookies.get('user');
      dispatch(fetchUserBegin(username));
      fetchTokenInDjango(value)
        .then(data => {
          cookies.set('token', data.access);
          dispatch(fetchUserQuizsInDjango(data.access, quizs, navigate, uri));
          return data.key;
          })
      .catch(
        error => {
          console.log(error);
          dispatch(fetchUserFailure(error));
        }
      );
      
    }else{
      let token = cookies.get('token');
      dispatch(fetchUserQuizsInDjango(token, quizs, navigate, uri));
    }
  };

}

export function fetchQuizByID(Id){
  return dispatch => {
    fetchQuizByIDInDjango(Id)
        .then(data => {
          dispatch(addquiztoquizwithquestions(data)); // for jwt token
          return data;
          })
      .catch(
        error => {
          console.log(error);
          dispatch(fetchUserFailure(error));
        }
      );
  };
}

export function addquiztoquizwithquestions(data){
  return dispatch =>{
    dispatch(addQuizToQuizWithQuestions(data));
  };
}

export function postQuiz(d, navigate, uri){
  return dispatch => {
    postQuizInDjango(d)
        .then(data => {
          if (navigate !== null){
            navigate(uri);
          }
        })
      .catch(
        error => {
          console.log(error);
          dispatch(fetchQuizFailure(error));
        }
      );
  }
}

export function postNewUser(values,  navigate, uri){
  return dispatch => {
    createNewUser(values)
      .then(data => {
        if (navigate !== null){
          navigate(uri);
        }
      })
      .catch(
        error => {
          console.log(error);
          dispatch(error(error));
        }
      );
  }
}

export function error(message){
  return dispatch => {
    dispatch(errorDirect(message))
  }
}