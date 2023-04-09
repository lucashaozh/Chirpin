import * as React from 'react';
import { tweetInfoExample } from "./Example";
import {commentExample} from "./Example";
import InfiniteScroll from 'react-infinite-scroll-component';
import Comment from './Comment';
import { TweetCard } from './Tweet';
import { BACK_END } from './App';
import { getLoginInfo } from './Login';
// const tweetInfo = tweetInfoExample[0];


class TweetDetail extends React.Component{
    constructor(props){
        super(props);
        this.state={
            // tid: window.location.pathname.split('/')[2],
            // commentCount: 0,
            retweetCount:0,
            tweetInfo: {
                "tid": 0,
                "likeInfo": 0,
                "dislikeInfo": 0,
                "user": { uid: 0, username: 'Loading'},
                "content": 'Loading',
                "commentCount": 0,
                "retweetCount": 0,
                "time": "Loading",
                "portraitUrl": "Loading",
                "tags": []
            },
            commentInfo: []
        }
        this.addReply = this.addReply.bind(this);
        this.addComment = this.addComment.bind(this);
    }

    async fetchTweetDetail(){
        // fetch tweet info
        let tweetInfo = await fetch(BACK_END+'tweet/'+window.location.pathname.split('/')[2], {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json', 
            }
        });
        let tweetInfoRes = await tweetInfo.json();
        console.log(tweetInfoRes);


        // fetch comment info
        let commentInfo = await fetch(BACK_END+'tweet/'+window.location.pathname.split('/')[2]+'/comment', {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        let commentInfoRes = await commentInfo.json();
        console.log(commentInfoRes);
        
        // just not right
        this.setState({tweetInfo: tweetInfoRes},()=>console.log(this.state.commentInfo));
        this.setState({commentInfo: commentInfoRes},()=>console.log(this.state.commentInfo));
        
        
    }

    componentWillMount(){
        this.fetchTweetDetail()
    }

    async addReply(clicked_floor){
        let newcommentId = "new-comment"+clicked_floor;
        let newCom = {
            content: "Re floor "+clicked_floor+": "+document.getElementById(newcommentId).value,
            username: getLoginInfo().username,
            tid: window.location.pathname.split('/')[2],
            floor_reply: clicked_floor
        };
        console.log(newCom);
        let com = await fetch(BACK_END + 'tweet/reply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCom),
        });
        let com_res = await com.json();
        console.log(com_res);
        let new_comments = this.state.commentInfo;
        new_comments.push({floor: com_res.floor, username: com_res.username, content:com_res.content, potrait: com_res.potrait, time: "Just now"});
        this.setState({commentInfo: new_comments});
        // this.setState({tweetInfo.commentCount: this.state.tweetInfo.commentCount+1})
        console.log(this.state.commentInfo);
        document.getElementById(newcommentId).value='';
    }

    async addComment(){
        let newCom = {
            content: document.getElementById('new-comment').value,
            username: getLoginInfo().username,
            tid: window.location.pathname.split('/')[2],
        };
        console.log(newCom);
        let com = await fetch(BACK_END + 'tweet/comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCom),
        });
        let com_res = await com.json();
        console.log(com_res);
        let new_comments = this.state.commentInfo;
        new_comments.push({floor: com_res.floor, username: com_res.username, content:com_res.content, potrait: com_res.potrait, time: "Just now"});
        this.setState({commentInfo: new_comments});
        console.log(this.state.commentInfo);
        document.getElementById('new-comment').value='';
    }

    render(){
        return(
            <div> 
                {/* <TweetCardDetail tweetInfo={tweetInfo}/> */}
                <div id="scrollableComment" style={{ height: "95vh", overflow: "auto" }}>
                    <InfiniteScroll dataLength={this.state.commentInfo.length} next={null} hasMore={false} scrollableTarget="scrollableComment"
                            endMessage={<p style={{ textAlign: 'center' }}><b>No more comments</b></p>}>
                        <TweetCard tweetInfo={this.state.tweetInfo} addComment={this.addComment.bind(this)}/> 
                        {/* <CommentList tid={window.location.pathname.split('/')[2]} commentInfo={this.state.commentInfo}/> */}
                        <div className="list-group w-auto">
                            {this.state.commentInfo.map((comment,index)=>
                                <Comment addReply = {this.addReply.bind(this)} key={index} name={comment.username} content={comment.content} potrait={comment.potrait} time={comment.time} floor={comment.floor} tid={this.props.tid}/>
                            )}
                        </div>
                    </InfiniteScroll>
                </div>            
            </div>
        )
    }
}



export default TweetDetail;