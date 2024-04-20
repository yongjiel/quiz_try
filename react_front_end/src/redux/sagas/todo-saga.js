// Import the redux-saga/effects
import {
    put,
    call,
    takeLatest,
    takeEvery,
    select,
  } from 'redux-saga/effects'
  
  // Import all actions and api's
  import {
    FETCH_MOVIE_LIST_BEGIN,
    FETCH_MOVIE_IN_PROGRESS,
    FETCH_MOVIE_LIST_SUCCESS,
    FETCH_MOVIE_LIST_FAILURE,
    FETCH_MOVIE_LIST_SUCCESS_EMPTY_RESULT,
    BACK_TO_SEARCH_PART,
    FETCH_USER_BEGIN,
    FETCH_USER_SUCCESS,
    FETCH_USER_FAILURE,
    FETCH_USER_SUCCESS_EMPTY_RESULT,
    FETCH_USER_MOVIE_SUCCESS,
    ADD_MOVIE,
    LOG_OUT,
    SHOW_USER_MOVIES,
    DELETE_MOVIE,
    ADD_MOVIE_SUCCESS,
    ADD_MOVIE_FAILURE,
    DELETE_MOIVIE_FAILURE,
    DELETE_MOIVIE_SUCCESS,
    ADD_MOVIE_ENTIRE_RECORD,
    CLOSE_MODAL,
    OPEN_MODAL,
    fetchMovieListSuccess
  } from '../actions/actions';
  
  // Import all api's
  import {
    fetchOMDBMoviesByPageNumber,
    fetchNewUser,
    deleteExistingMovie
  } from '../api/todo-api';
  
  // Here's the unique part, generator function*, function with asterisk(*)
  
  // Get Todos
  function* fetchAllMovies() {
    // 1 is in actions to trigger by the button.
    //yield call(fetchOMDBMoviesByPageNumber, 'social', 1);
    /// Could pick up new values right here after first time from actions 1
    const moviePartialText = yield select(state=> state.movieListReducer.search_text);
    const totalPages = yield select(state => state.movieListReducer.totalPages);
    const currentPage = yield select(state=> state.movieListReducer.page);
   // next page
   console.log(moviePartialText);
   console.log(totalPages);
   console.log(currentPage);
  if (currentPage === totalPages && totalPages !==0 && currentPage !== 0){
      let st = yield select(state=> state)
      yield put({ type: FETCH_MOVIE_LIST_SUCCESS, payload: st })
  }else if (currentPage < totalPages) {
      console.log("/////fdsafdsfdsfsd " + totalPages.toString() + " "+ (currentPage+1).toString());
      const st = yield call(fetchOMDBMoviesByPageNumber, moviePartialText, currentPage+1);
      // saga must constrol the dispatch, not it fetchOMDBMoviesByPageNumber.
      if (st.hasOwnProperty("Error")){
        //dispatch(fetchMovieListSuccessEmptyResult(res.data.Error));
       yield put( {type: FETCH_MOVIE_LIST_SUCCESS_EMPTY_RESULT,
        payload: { error: st.Error } 
                });
      } else{
        yield put({ type: FETCH_MOVIE_LIST_SUCCESS, payload: st});
        if (currentPage+1 !== totalPages){
          yield put({ type: FETCH_MOVIE_IN_PROGRESS, payload: {page: currentPage+1}});
        }
      }
      
  }else{
      yield put({ type: FETCH_MOVIE_LIST_BEGIN})
   }
  }
  
  // Delete todo
  function* deleteExistingMovieInList({ payload }) {
  
    const todo = yield call(deleteExistingMovie, payload)
  
    yield put({ type: DELETE_MOIVIE_SUCCESS, payload: todo })
  }
  
  // Export the saga (todo-saga)
  export default function* todoSaga() {
    yield takeLatest(FETCH_MOVIE_IN_PROGRESS, fetchAllMovies)
    //yield takeEvery(DELETE_MOIVIE_SUCCESS, deleteExistingMovieInList)
  }