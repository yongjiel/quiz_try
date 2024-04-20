import React from 'react';
import {useLocation} from 'react-router-dom';


const NoPage = (props) => {
    const location = useLocation();
    return (
    <>
    <div><h1> No this URL {location.pathname}</h1></div>
    </>
 );
};

export default NoPage;