import React from 'react';
import TweetListView from './Tweet';
import UserListView from './User';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';

function SearchUser(){
        
        return(
            <>
            <div class="input-group">
            <input type="search" class="form-control rounded" placeholder="Search for users" aria-label="Search" aria-describedby="search-addon" />
            <Dropdown as={ButtonGroup}>
            <Button variant="success">Select</Button>
            <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />
            <Dropdown.Menu>
            <Dropdown.Item href='/searchUser'>Search for users</Dropdown.Item>
            <Dropdown.Item href='/searchTweet'>Search for tweets</Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown>
            </div>
            <div className="card col-md-12">
            <div className="card-body">
                <p className="card-text">#Trend1</p>     
            </div>
            </div>
            <div className="card col-md-12">
            <div className="card-body">
                <p className="card-text">#Trend2</p>     
            </div>
            </div>
            <div className="card col-md-12">
            <div className="card-body">
                <p className="card-text">#Trend3</p>     
            </div>
            </div>
            </>
        )   
    
}

export default SearchUser;
    