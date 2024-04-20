
import {
    FETCH_MOVIE_LIST_BEGIN,
    FETCH_MOVIE_IN_PROGRESS,
    FETCH_MOVIE_LIST_SUCCESS,
    FETCH_MOVIE_LIST_FAILURE,
    FETCH_MOVIE_LIST_SUCCESS_EMPTY_RESULT,
    FETCH_USER_BEGIN,
    FETCH_USER_SUCCESS,
    FETCH_USER_FAILURE,
    FETCH_USER_MOVIE_SUCCESS,
    CLEAR_SEARCH_MOVIES,
    LOG_OUT,
    ADD_MOVIE,
    SHOW_USER_MOVIES,
    BACK_TO_SEARCH_PART,
    DELETE_MOVIE,
    ADD_MOVIE_FAILURE,
    ADD_MOVIE_SUCCESS,
    DELETE_MOIVIE_FAILURE,
    DELETE_MOIVIE_SUCCESS,
    ADD_MOVIE_ENTIRE_RECORD,
    CLOSE_MODAL,
    OPEN_MODAL
  } from '../actions/actions';
  
  const initialState = {
        search_text: null,
        search_movies: [],
        page: 0,
        totalPages: 0,
        totalResults: 0,
        loggedIn: false,
        user_movies: [],
        user_mvoives_save: [],
        user_movies_entire_records: [],
        error: null,
        show_user_movies_flag: false,
        isOpenModal: false,
        modalImdbID: null,
        userMovieListFromDB: [],
        loading: true
  };
  
  export default function movieListReducer(state = initialState, action) {
    console.log('movieListReducer', state, action);
    switch(action.type) {
      case FETCH_MOVIE_LIST_BEGIN:
        return state;

      case FETCH_MOVIE_IN_PROGRESS:
        return {...state,
              ...action.payload};

      case FETCH_MOVIE_LIST_SUCCESS:
          return {
            ...state,
            ...action.payload,
            search_movies: [...state.search_movies, ...action.payload.search_movies],
            username: state.username,
            show_user_movies_flag: false
          };
      
      case CLEAR_SEARCH_MOVIES:
        return {...state, search_movies: []};
      
      case FETCH_MOVIE_LIST_SUCCESS_EMPTY_RESULT:
        return {
          ...state,
          search_movies: [],
          page: 0,
          totalPages: 0,
          totalResults: 0,
          error: "No movie found.",
          show_user_movies_flag: false
        };

      case FETCH_MOVIE_LIST_FAILURE:
        return {
          ...initialState,
          error: "Could not fetch movie list ",
          show_user_movies_flag: false
        };

        case FETCH_USER_BEGIN:
          return {
            ...state,
            error: null,
            show_user_movies_flag: false
          };
    
        case FETCH_USER_SUCCESS:
          return {
            ...state,
            loggedIn: true,
            error: null,
            show_user_movies_flag: false,
            loading: false,
          };
    
      case FETCH_USER_MOVIE_SUCCESS:
        return {
          ...state,
          user_movies: action.payload.movies,
          loading: false,
          error: null
        };
  
      case FETCH_USER_FAILURE:
        return {
          ...state,
          loggedIn: false,
          error: action.payload.error,
          show_user_movies_flag: false,
          loading: false
        };

      case LOG_OUT:
          return {
            ...initialState
          };
      
      case ADD_MOVIE:
        return {
          ...state,
          user_movies: [...state.user_movies, action.payload.post],
          show_user_movies_flag: false
        }
      
      case ADD_MOVIE_SUCCESS:
        return {
          ...state,
          user_mvoives_save: [...state.user_mvoives_save, true],
          show_user_movies_flag: false
        }
      
      case ADD_MOVIE_FAILURE:
        return {
          ...state,
          user_mvoives_save: [...state.user_mvoives_save, false],
          show_user_movies_flag: false
        }

      case SHOW_USER_MOVIES:
        return {
          ...state,
          show_user_movies_flag: true
        }
      
      case BACK_TO_SEARCH_PART:
        return {
          ...state,
          show_user_movies_flag: false
        }
      
      case DELETE_MOVIE:
        return {
          ...state,
          user_movies: [...state.user_movies.slice(0, action.payload.i),
                        ...state.user_movies.slice(action.payload.i+1)],
          user_mvoives_save: [...state.user_mvoives_save.slice(0, action.payload.i),
                              ...state.user_mvoives_save.slice(action.payload.i+1)],
          show_user_movies_flag: true
        }
      case DELETE_MOIVIE_FAILURE:
        return {
          ...state,
          show_user_movies_flag: true
        }

      case DELETE_MOIVIE_SUCCESS:
          return {
            ...state,
            show_user_movies_flag: true
          }

      case ADD_MOVIE_ENTIRE_RECORD:
          return {
            ...state,
            user_movies_entire_records: [...state.user_movies_entire_records,
                                        action.payload.data],
            show_user_movies_flag: false
          }
      
      case CLOSE_MODAL:
        return {
          ...state,
          isOpenModal: false,
          modalImdbID: null,
          show_user_movies_flag: true
        }

      case OPEN_MODAL:
        return {
          ...state,
          isOpenModal: true,
          modalImdbID: action.payload.imdbID,
          show_user_movies_flag: true
        }

      default:
        return state;
    }
  }