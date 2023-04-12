import React from 'react';
import TweetListView from './Tweet';
import UserListView from './User';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import SearchUser from './SearchUser';
import SearchTweet from './SearchTweet';
import { Link } from 'react-router-dom';
import {BACK_END} from './App';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useState } from 'react';

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
        else if(this.state.viewMode == 'searchuserid'){
            window.location = '/searchuserbyid/'+search;
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
                <Dropdown.Item  onClick={() => {this.setState({viewMode:"searchuser"});document.getElementById('searchclick').innerHTML = "Search for Users by Username"; }}>Search for users by username</Dropdown.Item>
                <Dropdown.Item  onClick={() => {this.setState({viewMode:"searchtweet"});document.getElementById('searchclick').innerHTML = "Search for Tweets";}}>Search for tweets</Dropdown.Item>
                <Dropdown.Item  onClick={() => {this.setState({viewMode:"searchuserid"});document.getElementById('searchclick').innerHTML = "Search for Users by Uid";}}>Search for users by uid</Dropdown.Item>
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
    constructor(props) {
        super(props);
        this.state = { trendList: []};
      }

    async getTrend(){
        let res = await fetch(BACK_END + 'search/trend',{
          method:'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        let l = await res.json();
        await this.setState({trendList:l});
        console.log(this.state.trendList)
      }
      componentDidMount(){
        this.getTrend()
      }

    render() {
        return (<>
            <InfiniteScroll dataLength={this.state.trendList.length} next={null} hasMore={false} scrollableTarget="scrollableDiv"
                endMessage={<p style={{ textAlign: 'center' }}>
                    <b>Above are all the hot topics.</b>
                </p>}>
                <TrendListView trendInfos={this.state.trendList}/>
            </InfiniteScroll>
        </>
        );
    }
} 


function TrendListView({ trendInfos }) {

    const [trendInfoList, settrendList] = useState(trendInfos);

    return (
        <>
            {trendInfos.map((trendInfo, index) =>
                <TrendCard tag={trendInfo.tag} key={index} />
            )}
        </>
    );

}

class TrendCard extends React.Component{
    constructor(props) {
        super(props);
    }
    render(){
        return(
        <>
        <div class="list-group w-800">
        <Link to={"/searchtag/"+this.props.tag} class="list-group-item list-group-item-action d-flex" aria-current="true">
        <div class="d-flex gap-20 w-1000" style={{margin:10, padding:10}}>
        <div>
        <h6 class="mb-0">{this.props.tag}</h6>
        </div>
        </div>
        </Link>
        </div>
        </>
        )
    }
}



export default Search;
    