import axios from "axios";
import Cookies from 'universal-cookie';
export const cookies = new Cookies();


export const deleteQuizInDjango = (permalink) => {
  const url = `${process.env.REACT_APP_PROXY_HOST}/api/quizs/`+ permalink;
  try{
    // not for saga generator. return promise.
      const res = fetch(url
              ,{
                headers: {
                  'Content-type': 'application/json',
                  'Accept': 'application/json',
                  'Authorization': 'Bearer ' + cookies.get("token"),
                },
                method: "DELETE"
              });
      return res;
  }catch(error) {
    console.log(error);
  };
};

export function fetchTokenInDjango(value) {
  const url = `${process.env.REACT_APP_PROXY_HOST}/api/token/?format=json`;
  // not for saga generator. return promise.
  return axios.post(url, {
    username: value.username,
    password: value.password
  }).then(res=>{
    console.log(res);
    return res.data;
  }).catch(
    error => {
      console.log(error);
      return "Could not get token";
    }
  );
}

export function fetchQuizByPermalinkInDjango(permalink){
  const url = `${process.env.REACT_APP_PROXY_HOST}/api/quizs/` + permalink;
  // not for saga generator. return promise.
  return axios.get(url)
          .then(res=>{
            return res.data;
          })
          .catch(
            error => {
              console.log(error);
            }
          );
}
export function fetchAllQuizListInDjango(){
  const url = `${process.env.REACT_APP_PROXY_HOST}/api/quiz_summary/`;
  // not for saga generator. return promise.
  return axios.get(url)
          .then(res=>{
            return res.data;
          })
          .catch(
            error => {
              console.log(error);
            }
          );
}

export function fetchUserQuizListInDjango(token){
  const url = `${process.env.REACT_APP_PROXY_HOST}/api/quiz_summary/`;
  const config = {
    headers: { 
      //Authorization: `Token ${token}` // for normal token
      Authorization: `Bearer ${token}`
    }  
  };
  // not for saga generator. return promise.
  return axios.get(url, config)
          .then(res=>{
            return res.data;
          })
          .catch(
            error => {
              console.log(error);
              return error;
            }
          );
}

export function postQuizInDjango(data_obj){
  const url = `${process.env.REACT_APP_PROXY_HOST}/api/quizs/`;
  const config = {
    headers: { 
      //Authorization: `Token ${token}` // for normal token
      Authorization: 'Bearer ' + cookies.get("token"),
    }  
  };
  // not for saga generator. return promise.
  return axios.post(url, data_obj, config)
          .then(res=>{
            return res.data;
          })
          .catch(
            error => {
              console.log(error);
            }
          );
}

export function createNewUser(values){
  const url = `${process.env.REACT_APP_PROXY_HOST}/api/users/`;

  const data = {'username': values.useremail,
         'email': values.useremail,
        'password': values.password };
  // not for saga generator. return promise.
  return axios.post(url, data)
          .then(res=>{
            return res.data;
          })
          .catch(
            error => {
              console.log(error);
            }
          );
}
