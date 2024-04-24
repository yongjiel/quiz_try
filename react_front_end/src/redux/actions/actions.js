import {
  deleteQuizInDjango,
  fetchTokenInDjango,
  fetchUserQuizListInDjango,
  fetchAllQuizListInDjango,
  fetchQuizByPermalinkInDjango,
  postQuizInDjango,
  createNewUser,
  cookies
} from "../api/todo-api";

export const FETCH_USER_BEGIN   = 'FETCH_USER_BEGIN';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';
export const FETCH_USER_SUCCESS_EMPTY_RESULT = 'FETCH_USER_SUCCESS_EMPTY_RESULT';
export const LOG_OUT = 'LOG_OUT';
export const SHOW_QUIZ_FORM = "SHOW_QUIZ_FORM";
export const SHOW_QUIZ_LIST = "SHOW_QUIZ_LIST";
export const DELETE_QUIZ_SUCCESS = 'DELETE_QUIZ_SUCCESS';
export const DELETE_QUIZ_FAILURE = 'DELETE_QUIZ_FAILURE';
export const FETCH_QUIZ_FAILURE = 'FETCH_QUIZ_FAILURE';
export const FETCH_QUIZ_SUCCESS = 'FETCH_QUIZ_SUCCESS';
export const DELETE_QUIZ = "DELETE_QUIZ";
export const ADD_QUIZ = 'ADD_QUIZ';
export const ADD_QUIZ_FULL = 'ADD_QUIZ_FULL';
export const DELETE_QUIZ_FULL = 'DELETE_QUIZ_FULL';
export const ERROR = "ERROR";
export const ADD_ANSWER = "ADD_ANSWER";
export const DELETE_ANSWER = "DELETE_ANSWER";
export const EMPTY_ANSWERS = "EMPTY_ANSWERS";
export const UPDATE_SCORE = "UPDATE_SCORE";

export const errorDirect = (msg) => ({
  type: ERROR,
  payload: {msg}
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

export const addQuizToQuizs = (quiz) =>({
  type: ADD_QUIZ,
  payload: {quiz}
});

export const addQuizToQuizWithQuestions=(quiz) =>({
  type: ADD_QUIZ_FULL,
  payload: {quiz}
});

export const showQuizForm = ()=> ({
  type: SHOW_QUIZ_FORM
});

export const showQuizList = ()=> ({
  type: SHOW_QUIZ_LIST
});

export const fetchUserFailure = error => ({
  type: FETCH_USER_FAILURE,
  payload: { error }
});

export const logOut = () => ({
  type: LOG_OUT
});

export const deleteQuiz = (i) => ({
  type: DELETE_QUIZ,
  payload: {i}
});

export const deleteQuizFull = (i) => ({
  type: DELETE_QUIZ_FULL,
  payload: {i}
});

export const deleteQuizSuccess =()=>({
  type: DELETE_QUIZ_SUCCESS
});

export const addAnswer =(key, answer)=>({
  type: ADD_ANSWER,
  payload: {[key]:answer}
});

export const deleteAnswer =(key)=>({
  type: DELETE_ANSWER,
  payload: {[key]:''}
});

export const emptyAnswers=() =>({
  type: EMPTY_ANSWERS
});

export const updateScore=(message, miss_correct_feed_back_answers) =>({
  type: UPDATE_SCORE,
  payload: {message, miss_correct_feed_back_answers}
});

export const deleteQuizFailure =()=>({
  type: DELETE_QUIZ_FAILURE
});

export function logout(){
  return dispatch => {
    cookies.remove('token');
    cookies.remove('user')
    dispatch(logOut())};
}

export function addquiz(quiz){
  return dispatch => {
    dispatch(addQuizToQuizs(quiz));
  };
}

export function deletequiz(i, i_in_full, permalink, navigate){
  return dispatch => {
    const resp = deleteQuizInDjango(permalink);
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
            if (typeof navigate === 'function'){
              navigate('/login');
            }
          }else{
            dispatch(deleteQuizFailure());
          }
          
      }
    });
    
  };
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

function is_not_in_quizs(qzs, id){
  return qzs.filter(q => q.Id === id).length === 0;
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
      if (typeof navigate === 'function'){
        navigate(uri);
      }
      return quizs;
    }).catch(
      err => {
        console.log(err);
        dispatch(fetchQuizFailure("Authentication failed"));
      }
    );
  };
}

export function fetchAllQuizsInDjango(qzs, navigate, uri) {
  return dispatch => {
    fetchAllQuizListInDjango()
    .then(quizs=> {
      quizs.map(q => {
        if ( is_not_in_quizs(qzs, q.Id) ){
          dispatch(addquiz(q));
        }
      });
      dispatch(fetchQuizSuccess());
      if (typeof navigate === 'function'){
        navigate(uri);
      }
      return quizs;
    }).catch(
      error => {
        console.log(error);
        dispatch(fetchQuizFailure("Authentication failed"));
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

export function fetchQuizByPermalink(permalink, navigate, uri){
  return dispatch => {
    fetchQuizByPermalinkInDjango(permalink)
        .then(quiz => {
          dispatch(addquiztoquizwithquestions(quiz)); // for jwt token
          if (typeof navigate === 'function'){
            navigate(uri);
          }
          return quiz;
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
    if (!!data){
      dispatch(addQuizToQuizWithQuestions(data));
    }
  };
}

export function postQuiz(d, quizs, navigate, uri){
  return dispatch => {
    postQuizInDjango(d)
        .then(data => {
          dispatch(fetchUserAndGetQuizs(null, quizs, navigate, uri))
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
        if (typeof navigate === 'function'){
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

export function addanswer(i, answer){
  return dispatch => {
    dispatch(addAnswer(i, answer));
  }
}

export function deleteanswer(i, j){
  return dispatch => {
    dispatch(deleteAnswer(i, j));
  }
}

export function emptyanswers(){
  return dispatch => {
    dispatch(emptyAnswers());
  }
}

export function updatescore(message, miss_correct_feed_back_answers){
  return dispatch=>{
    dispatch(updateScore(message, miss_correct_feed_back_answers))
  }
}
