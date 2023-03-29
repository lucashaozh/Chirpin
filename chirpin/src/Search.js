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
    }
    render(){
        return(
            <>
            <div class="input-group">
                <input type="search" class="form-control rounded" placeholder="Please Select what you want to search" aria-label="Search" aria-describedby="search-addon" />
                <Dropdown as={ButtonGroup}>
                <Button variant="primary">Search</Button>
                <Dropdown.Toggle split variant="primary" id="dropdown-split-basic" />
                <Dropdown.Menu>
                <Dropdown.Item class={"btn btn-" + (this.state.viewMode != 'searchuser' ? "outline-" : "") + "primary w-100"} onClick={() => this.setState({viewMode:"searchuser"})}>Search for users</Dropdown.Item>
                <Dropdown.Item class={"btn btn-" + (this.state.viewMode != 'searchtweet' ? "outline-" : "") + "primary w-100"} onClick={() => this.setState({viewMode:"searchtweet"})}>Search for tweets</Dropdown.Item>
                </Dropdown.Menu>
                </Dropdown>
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
    