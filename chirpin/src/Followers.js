import * as React from 'react';
import Container from 'react-bootstrap/Container';
import UserListView from './User';
import InfiniteScroll from 'react-infinite-scroll-component';
import {BACK_END} from './App';

class Followers extends React.Component {

    constructor(props){
        super(props);
        this.state = { 
            followers: []
        };
    }

    async fetchInfo() {
        // fetch followers infomation
        let username = window.location.pathname.split('/')[1];
        let followersrec = await fetch(BACK_END + "profile/" + username + "/followers", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        let followers = await followersrec.json();
        this.state.followers = await followers;
        this.setState((prevState) => ({ followers: followers }));
        console.log(this.state.followers);
    }
    
    componentWillMount(){
        this.fetchInfo();
    }

    render() {
        return (<>
            <Container fluid>
                <div id="scrollableDiv" className='border' style={{ height: "100vh", overflowX: "hidden", overflowY: "scroll" }}>
                    <InfiniteScroll dataLength={this.state.followers.length} next={null} hasMore={false} scrollableTarget="scrollableDiv"
                        endMessage={<p style={{ textAlign: 'center' }}>
                            <b>Yay! You have seen it all</b>
                        </p>}>
                        <UserListView userInfos={this.state.followers}/>
                    </InfiniteScroll>
                </div>
            </Container></>
        );
    }

}

export { Followers };
