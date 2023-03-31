import React from 'react';
import TweetListView from './Tweet';
import UserListView from './User';
import { userInfoExample, tweetInfoExample } from './Example';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';

function SearchTweet(){
        
    return(
        <>
        <TweetListView tweetInfos={tweetInfoExample}/>
                
         </>
            
    )   
    
}

export default SearchTweet;
    