import axios from "axios";
import Cookies from 'universal-cookie';
export const cookies = new Cookies();

// this function must be async, it is used by to-saga.js generator. must 
// await for the result out.
export const fetchOMDBMoviesByPageNumber = async (moviePartialText, pageNumber)=>{
    try {
      const url = `${process.env.REACT_APP_OMDB_URL}&type=movie&s=`+moviePartialText+`&page=`+ pageNumber;
      console.log(url);
      // axiso.get returns not promise, but instead the response object. OR wont work
      const res = await axios.get(url);  // sage generator needs it.
      //resp.then(res=>{   // cannot use here. now resp is response object 
      //                   // if keep using resp. or it will be promise???
      //                   // compared with postDjangoMovie and deleteMovieInDjango
        if (res.data.hasOwnProperty('Error') && !!res.data.Error){
          return res.data;
        }else{
            const newPosts = res.data.Search;
            const totalPages = Math.ceil(res.data.totalResults/10.0);
            const state = {search_text: moviePartialText,
                            search_movies: newPosts,
                            page: pageNumber,
                            totalPages: totalPages,
                            totalResults: res.data.totalResults,
                            error: null}
            
            return state;
        };
      //});          
    } catch(error) {
        console.log({error: error.message});
    };

  }

export const postDjangoMovie =  (data) =>{
  const url = `${process.env.REACT_APP_PROXY_HOST}/api/movies`;
  try {
    // not for saga generator. return promise.
      const res =  axios.post(url,data,
                {
                  headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + cookies.get("token"),
                  }
                });
      return res;
  }catch(error) {
    console.log(error);
  };
  
}

export const fetchOMDBMovieByID = (imdbID) =>{
  const url = `${process.env.REACT_APP_OMDB_URL}&i=` + imdbID;
  try{
    // not for saga generator. return promise.
    const res =  axios.get(url);
    return res;
  }catch(error) {
    console.log(error);
  };
}

export const deleteMovieInDjango = (imdbID) => {
  const url = `${process.env.REACT_APP_PROXY_HOST}/api/movies/`+imdbID;
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


export const deleteQuizInDjango = (id) => {
  const url = `${process.env.REACT_APP_PROXY_HOST}/api/quizs/`+ id;
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

export function fetchUserMovieListInDjango(token){
  const url = `${process.env.REACT_APP_PROXY_HOST}/api/userlist/?format=json`;
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
            }
          );
}

export function fetchQuizByIDInDjango(Id){
  const url = `${process.env.REACT_APP_PROXY_HOST}/api/quizs/` + Id;
  const config = {
    headers: { 
      //Authorization: `Token ${token}` // for normal token
      Authorization: 'Bearer ' + cookies.get("token"),
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



export function fetchNewUser(){

};
export function deleteExistingMovie(){

}