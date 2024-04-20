import { combineReducers } from "redux";
import movieListReducer from "./redux/reducers/reducers";

const rootReducers =  combineReducers({
    movieListReducer
});

export default rootReducers;