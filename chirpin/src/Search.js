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
        this.onkeydown = this.onkeydown.bind(this)
    }
    async clickSearch(){
        var search=document.getElementById('search_input').value;
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
    async onkeydown(e){
		if (e.keyCode === 13) {
			this.clickSearch()
		}
	}

    render(){
        return(
            <>
            <div class="input-group">
                <input id='search_input' type="search" class="form-control rounded" onKeyDown={(e)=>this.onkeydown(e)} placeholder={(this.state.viewMode == 'search' ? "Please select what you want to search" : "Please input the keyword")} aria-label="Search" aria-describedby="search-addon" />
                <Dropdown as={ButtonGroup}>
                <Button variant="primary" id="searchclick" onClick={this.clickSearch} >Search</Button>
                <Dropdown.Toggle split variant="primary" id="dropdown-split-basic" />
                <Dropdown.Menu>
                <Dropdown.Item  onClick={() => {this.setState({viewMode:"searchuser"});document.getElementById('searchclick').innerHTML = "Search for Users"; }}>Search for users</Dropdown.Item>
                <Dropdown.Item  onClick={() => {this.setState({viewMode:"searchtweet"});document.getElementById('searchclick').innerHTML = "Search for Tweets";}}>Search for tweets</Dropdown.Item>
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
            <Link to={"/searchtag/trend1"} class="list-group-item list-group-item-action d-flex" aria-current="true">
            <div class="d-flex gap-20 w-1000" style={{margin:10, padding:10}}>
            <div>
            <h6 class="mb-0">#Trend1</h6>
            </div>
            </div>
            </Link>
            </div>
            <div class="list-group w-800">
            <Link to={"/searchtag/trend2"} class="list-group-item list-group-item-action d-flex" aria-current="true">
            <div class="d-flex gap-20 w-1000" style={{margin:10, padding:10}}>
            <div>
            <h6 class="mb-0">#Trend2</h6>
            </div>
            </div>
            </Link>
            </div>
            <div class="list-group w-800">
            </div>
            </>
        )
    }
}    



export default Search;
    