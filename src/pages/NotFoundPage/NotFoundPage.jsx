import React from 'react';
import './NotFoundPage.css';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = (props) => {

    const navigate = useNavigate();

    return (
        <div className='not-found-page'>
            <h1>404</h1>
            <h2>OOPS! NOTHING WAS FOUND</h2>
            <p>
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                <br/>
                Return to <span onClick={()=>{navigate('/')}}>homepage</span>
            </p>
        </div>
    );
};

export default NotFoundPage;