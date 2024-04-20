import React from "react";
import MovieList from "./components/moveList/movielist";
import LogIn from "./components/moveList/login";
//import LogOut from "./components/moveList/logout";
import UserMovieList from "./components/moveList/usermovielist";
import { BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import NoPage from "./components/nopage";
import reportWebVitals from './reportWebVitals';
import rootReducers from "./rootReducer";
import { createRoot } from 'react-dom/client';
import thunk from 'redux-thunk';
import { legacy_createStore  as createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import Modal from "react-modal";
import { useNavigate } from 'react-router-dom';
// composeWithDevTools is tools that gonna be connecting our application for debugging the redux into the browser
import { composeWithDevTools } from 'redux-devtools-extension';
// This is the middleware that we gonna use redux-saga
import createSagaMiddleware from 'redux-saga';
import rootSaga from './redux/sagas';

import './tailwind.output.css';

//const store = createStore(rootReducers, applyMiddleware(thunk));
const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  rootReducers,
  {},
  composeWithDevTools(applyMiddleware(thunk),
                      applyMiddleware(sagaMiddleware))
)

function AppRoutes() {
  const navigate = useNavigate();
  return (
      <div className=" our-width max-w-3xl mx-auto flex p-6 bg-gray-100 mt-10 rounded-lg shadow-xl">
      <Routes>        
        <Route index path='/' element={ <Navigate to='/login' /> } />
        <Route index path='/login' element={ <LogIn navigate={navigate}/>} />
        <Route index path='/search' element={ <MovieList  navigate={navigate}/>} />
        <Route index path='/userlist' element={ <UserMovieList navigate={navigate}/> } />
        <Route path="/*"  element={ <NoPage url={window.location.href} status={404} />} />
      </Routes>
      </div>
  );
}

const App = () =>{
  return(
    <Provider store={store}>
      <BrowserRouter basename='/'>
        <AppRoutes/>  
      </BrowserRouter>
    </Provider>
    );
  
};
// 
// Run redux-saga
sagaMiddleware.run(rootSaga)

const container = document.getElementById('root');
Modal.setAppElement(container);
const root = createRoot(container);
root.render(<App />);

reportWebVitals();