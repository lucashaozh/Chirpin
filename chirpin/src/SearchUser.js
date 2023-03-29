import React from 'react';
import TweetListView from './Tweet';
import UserListView from './User';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';

function SearchUser(){
        
        return(
            <>
            <div> user </div>
            <div>
            <div className="card col-md-12 mt-3 mb-3" style={{ width: '25rem' }}>
            <div className="card-body">
            <p className="card-text">#Trend1</p>     
            </div>
            </div>
            <div>
            </div>
            <div className="card col-md-12 mt-3 mb-3" style={{ width: '25rem' }}>
            <div className="card-body">
            <p className="card-text">#Trend2</p>     
            </div>
            </div>
            </div>
            <div>
            <div className="card col-md-12 mt-3 mb-3" style={{ width: '25rem' }}>
            <div className="card-body">
            <p className="card-text">#Trend3</p>     
            </div>
            </div>
            </div>
            </>
            
        )   
    
}

export default SearchUser;
    