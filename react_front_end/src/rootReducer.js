import { combineReducers } from "redux";
import quizReducer from "./redux/reducers/reducers";

const rootReducers =  combineReducers({
    quizReducer
});

export default rootReducers;