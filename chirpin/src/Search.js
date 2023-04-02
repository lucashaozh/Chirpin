import React from 'react';
import TweetListView from './Tweet';
import UserListView from './User';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import SearchUser from './SearchUser';
import SearchTweet from './SearchTweet';
import { Link } from 'react-router-dom';

class Search extends React.Component{
    constructor(props){
        super(props);
        this.state = {viewMode:"search"}; // two viewmode, notification or message
        this.clickSearch = this.clickSearch.bind(this)
    }
    async clickSearch(){
        var search=document.getElementById('search_input').value
        if(this.state.viewMode == 'searchuser'){
            window.location = '/searchuser/'+search;
        }
        else if(this.state.viewMode  == 'searchtweet'){
            window.location = '/searchtag/'+search;
        }
        else{
            alert("please select what you want to search")
        }

    }
    render(){
        return(
            <>
            <div class="input-group">
                <input id='search_input' type="search" class="form-control rounded" placeholder={(this.state.viewMode == 'search' ? "Please Select what you want to search" : "Please Search")} aria-label="Search" aria-describedby="search-addon" />
                <Dropdown as={ButtonGroup}>
                <Button variant="primary" onClick={this.clickSearch}>Search</Button>
                <Dropdown.Toggle split variant="primary" id="dropdown-split-basic" />
                <Dropdown.Menu>
                <Dropdown.Item  onClick={() => this.setState({viewMode:"searchuser"})}>Search for users</Dropdown.Item>
                <Dropdown.Item  onClick={() => this.setState({viewMode:"searchtweet"})}>Search for tweets</Dropdown.Item>
                </Dropdown.Menu>
                </Dropdown>
                </div>
                <div className="row">
                <Trend/>
            </div>
            
            </>
        )   
    }
}       
class Trend extends React.Component{
    render(){
        return(
            <>
            <div class="list-group w-800">
            <a href="/searchtag/trend1" class="list-group-item list-group-item-action d-flex" aria-current="true">
            <div class="d-flex gap-20 w-1000" style={{margin:10, padding:10}}>
            <div>
            <h6 class="mb-0">#Trend1</h6>
            </div>
            </div>
            </a>
            </div>
            <div class="list-group w-800">
            <a href="/searchtag/trend2" class="list-group-item list-group-item-action d-flex" aria-current="true">
            <div class="d-flex gap-20 w-1000" style={{margin:10, padding:10}}>
            <div>
            <h6 class="mb-0">#Trend2</h6>
            </div>
            </div>
            </a>
            </div>
            <div class="list-group w-800">
            <a href="/searchtag/trend3" class="list-group-item list-group-item-action d-flex" aria-current="true">
            <div class="d-flex gap-20 w-1000" style={{margin:10, padding:10}}>
            <div>
            <h6 class="mb-0">#Trend3</h6>
            </div>
            </div>
            </a>
            </div>
            </>
        )
    }
}    



export default Search;
    