import React from 'react';
import TweetListView from './Tweet';
import UserListView from './User';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import SearchUser from './SearchUser';
import SearchTweet from './SearchTweet';

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
                <Dropdown as={ButtonGroup}>
                <Button variant="primary" onClick={this.clickSearch}>Search</Button>
                <Dropdown.Toggle split variant="primary" id="dropdown-split-basic" />
                <Dropdown.Menu>
                <Dropdown.Item class={"btn btn-" + (this.state.viewMode != 'searchuser' ? "outline-" : "") + "primary w-100"} onClick={() => this.setState({viewMode:"searchuser"})}>Search for users</Dropdown.Item>
                <Dropdown.Item class={"btn btn-" + (this.state.viewMode != 'searchtweet' ? "outline-" : "") + "primary w-100"} onClick={() => this.setState({viewMode:"searchtweet"})}>Search for tweets</Dropdown.Item>
                </Dropdown.Menu>
                </Dropdown>
                <input id='search_input' type="search" class="form-control rounded" placeholder={(this.state.viewMode == 'search' ? "Please Select what you want to search" : "Please Search")} aria-label="Search" aria-describedby="search-addon" />
                </div>
                <div className="row">
                {this.state.viewMode == "search" && <Trend/>}
                {this.state.viewMode == "searchuser" && <SearchUser />}
                {this.state.viewMode == "searchtweet" && <SearchTweet />}
            </div>
            
            </>
        )   
    }
}       
class Trend extends React.Component{
    render(){
        return(
            <>
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
}    



export default Search;
    