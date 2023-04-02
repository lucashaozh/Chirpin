import React from 'react';
import {TweetListView} from './Tweet';
import UserListView from './User';
import { userInfoExample, tweetInfoExample } from './Example';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';

class SearchTweet extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            tag: window.location.pathname.split('/')[2]
        };
    }
    
    render(){
        return(
        <>
        <div>{this.state.tag}</div>
        <TweetListView tweetInfos={tweetInfoExample}/>            
        </>       
        ) 
    }     
}

export default SearchTweet;
    