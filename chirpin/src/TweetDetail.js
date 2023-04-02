import * as React from 'react';
import { tweetInfoExample } from "./Example";
import {commentExample} from "./Example";
import InfiniteScroll from 'react-infinite-scroll-component';
import { CommentList, CommentForm } from './Comment';
import { TweetCard } from './Tweet';

const tweetInfo = tweetInfoExample[0];


class TweetDetail extends React.Component{
    // constructor(props){
    //     super(props);
    //     this.State={
    //         tid: tweetInfo['tid'],
    //         likeCount: tweetInfo['likeInfo']['likeCount'],
    //         dislikeCount: tweetInfo['dislikeInfo']['dislikeCount'],
    //         commentCount: tweetInfo['commentCount'],
    //         retweetCount:  tweetInfo['retweetCount']
    //     }
    // }
    render(){
        return(
            <div> 
                {/* <TweetCardDetail tweetInfo={tweetInfo}/> */}
                <div id="scrollableComment" style={{ height: "95vh", overflow: "auto" }}>
                    <InfiniteScroll dataLength={commentExample.length} next={null} hasMore={false} scrollableTarget="scrollableComment"
                            endMessage={<p style={{ textAlign: 'center' }}><b>No more comments</b></p>}>
                        <TweetCard tweetInfo={tweetInfo}/> {/* TODO: could we customize the height? */}
                        <CommentList/>
                    </InfiniteScroll>
                </div>            
            </div>
        )
    }
}



export default TweetDetail;