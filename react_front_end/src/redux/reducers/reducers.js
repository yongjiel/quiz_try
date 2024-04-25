
import {
    FETCH_USER_BEGIN,
    FETCH_USER_SUCCESS,
    FETCH_USER_FAILURE,
    LOG_OUT,
    CLEAR_USER,
    SHOW_QUIZ_FORM,
    SHOW_QUIZ_LIST,
    ADD_QUIZ,
    ADD_QUIZ_FULL,
    DELETE_QUIZ,
    DELETE_QUIZ_FAILURE,
    DELETE_QUIZ_SUCCESS,
    FETCH_QUIZ_SUCCESS,
    FETCH_QUIZ_FAILURE,
    DELETE_QUIZ_FULL,
    ERROR,
    DELETE_ANSWER,
    ADD_ANSWER,
    EMPTY_ANSWERS,
    UPDATE_SCORE
  } from '../actions/actions';
  
  const initialState = {
        error: null,
        show_quiz_form: false,
        show_quiz_list: false,
        modalQuizId: null,
        user: null, 
        quizs: [],
        quizs_with_questions: [],
        answers: {},
        score: null,
        miss_correct_feed_back_answers: {}
  };
  
  export default function quizReducer(state = initialState, action) {
    console.log('quizReducer', state, action);
    switch(action.type) {

      case FETCH_USER_BEGIN:
          return {
            ...state,
            error: null,
            show_quiz_list: false,
            show_quiz_form: false,
            user: action.payload.user
          };
    
      case FETCH_USER_SUCCESS:
        return {
          ...state,
          loggedIn: true,
          error: null,
          show_quiz_list: false,
          show_quiz_form: false,
          loading: false,
        };

      case ADD_QUIZ_FULL:
          return {
            ...state,
            quizs_with_questions: [...state.quizs_with_questions, action.payload.quiz],
            show_quiz_list: true,
            show_quiz_form: false,
            loading: false,
          };

      case LOG_OUT:
          return {
            ...initialState
          };
      
      case CLEAR_USER:
        return {
          ...state,
          user: null
        }

      case ADD_ANSWER:
          return {
            ...state,
            answers: {
              ...state.answers,
              ...action.payload
            },
            show_quiz_list: false,
            show_quiz_form: false
          }
      
      case DELETE_ANSWER:
            return {
              ...state,
              answers: {
                ...state.answers,
                ...action.payload
              },
              show_quiz_list: false,
              show_quiz_form: false
            }

      case EMPTY_ANSWERS:
        return {
          ...state,
          answers: {},
          score: null,
          miss_correct_feed_back_answers: null
        }
      
      case UPDATE_SCORE:
        return {
          ...state,
          score: action.payload.message,
          miss_correct_feed_back_answers: action.payload.miss_correct_feed_back_answers
        }

      case ADD_QUIZ:
          return {
            ...state,
            quizs: [...state.quizs, action.payload.quiz],
            show_quiz_list: true,
            show_quiz_form: false
          }
      
      case SHOW_QUIZ_FORM:
        return {
          ...state,
          show_quiz_form: true,
          show_quiz_list: false
        }

      case SHOW_QUIZ_LIST:
          return {
            ...state,
            show_quiz_list: true,
            show_quiz_form: false
          }
      
      case DELETE_QUIZ:
        return {
          ...state,
          quizs: [
                ...state.quizs.slice(0, action.payload.i),
                ...state.quizs.slice(action.payload.i+1)],
          show_quiz_list: true,
          show_quiz_form: false
        }

      case DELETE_QUIZ_FULL:
        return {
          ...state,
          quizs_with_questions: [
                ...state.quizs_with_questions.slice(0, action.payload.i),
                ...state.quizs_with_questions.slice(action.payload.i+1)],
          show_quiz_list: true,
          show_quiz_form: false
        }

      case FETCH_QUIZ_FAILURE:
        return {
          ...state,
          show_quiz_list: true,
          show_quiz_form: false,
          error: action.payload.error
        }

      case FETCH_QUIZ_SUCCESS:
          return {
            ...state,
            show_quiz_list: true,
            show_quiz_form: false
          }
      case DELETE_QUIZ_FAILURE:
        return {
          ...state,
          show_quiz_list: true,
          show_quiz_form: false
        }

      case DELETE_QUIZ_SUCCESS:
          return {
            ...state,
            show_quiz_list: true,
            show_quiz_form: false
          }

      case ERROR:
          return {...state,
                error: action.payload.msg
            };
      
      case FETCH_USER_FAILURE:
        return {
          ...state,
          loggedIn: false,
          error: action.payload.error,
          show_quiz_list: false,
          show_quiz_form: false,
          loading: false
        };
      default:
        return state;
    }
  }