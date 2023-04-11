import * as React from 'react';
import Container from 'react-bootstrap/Container';
import UserListView from './User';
import InfiniteScroll from 'react-infinite-scroll-component';
import {BACK_END} from './App';
import { getLoginInfo } from './Login';

class Followings extends React.Component {

    constructor(props){
        super(props);
        this.state = { 
            followings: []
        };
    }

    async fetchInfo() {
        // fetch followings infomation
        let self = getLoginInfo()['username'];
        let target = window.location.pathname.split('/')[1];
        let followingsrec = await fetch(BACK_END + "profile/" + self + "/" + target + "/followings", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        let followings = await followingsrec.json();
        this.state.followings = await followings;
        this.setState((prevState) => ({ followings: followings }));
        console.log(this.state.followings);
    }
    
    componentWillMount(){
        this.fetchInfo();
    }

    render() {
        return (<>
            <Container fluid>
                <div id="scrollableDiv" className='border' style={{ height: "100vh", overflowX: "hidden", overflowY: "scroll" }}>
                    <InfiniteScroll dataLength={this.state.followings.length} next={null} hasMore={false} scrollableTarget="scrollableDiv"
                        endMessage={<p style={{ textAlign: 'center' }}>
                            <b>Yay! You have seen it all</b>
                        </p>}>
                        <UserListView userInfos={this.state.followings}/>
                    </InfiniteScroll>
                </div>
            </Container></>
        );
    }

}

export { Followings };
