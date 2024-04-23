import React from "react";
import LogOut from "./components/quizTest/logout";
import LogIn from "./components/quizTest/login";
import Register from "./components/quizTest/register";
import QuizForm from "./components/quizTest/userquizform";
import UserQuizList from "./components/quizTest/userquizlist";
import PublicQuizList from './components/quizTest/publicquizlist';
import Quiz from './components/quizTest/quiz';
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
import './tailwind.output.css';


const store = createStore(
  rootReducers,
  {},
  composeWithDevTools(applyMiddleware(thunk))
)

function AppRoutes() {
  const navigate = useNavigate();
  return (
      <div className=" our-width max-w-8xl mx-auto flex p-6 bg-gray-100 mt-10 rounded-lg shadow-xl">
      <Routes>        
        <Route index path='/' element={ <Navigate to='/quizlist' /> } />
        <Route index path='/quizlist' element={ <PublicQuizList navigate={navigate}/>} />
        <Route exact path="/quizs/:permalink"  element={<Quiz navigate={navigate}/>} />
        <Route index path='/login' element={ <LogIn navigate={navigate}/>} />
        <Route index path='/logout' element={ <LogOut navigate={navigate}/>} />
        <Route index path='/register' element={ <Register navigate={navigate}/>} />
        <Route index path='/user_quiz_form' element={ <QuizForm  navigate={navigate}/>} />
        <Route index path='/user_quiz_list' element={ <UserQuizList  navigate={navigate}/>} />
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

const container = document.getElementById('root');
Modal.setAppElement(container);
const root = createRoot(container);
root.render(<App />);

reportWebVitals();