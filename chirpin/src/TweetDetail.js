import {TweetCardDetail, TweetCard} from "./Tweet";
import * as React from 'react';
import { tweetInfoExample } from "./Example";
import {Link} from "react-router-dom";
import {commentExample} from "./Example";
import InfiniteScroll from 'react-infinite-scroll-component';

const tweetInfo = tweetInfoExample[0];


// class Comment extends React.Component{
//     constructor(props){
//         super(props);
//     }
//     render(){
//         return(
//             <div class="card bg-transparent col-12">
//                 <div class="card-body row">
//                     <div className="col-1">
//                         <div>
//                             <div className="d-flex justify-content-center">
//                             <Link to={'/' + this.props.name}>
//                                 <img class="img d-inline-block m-2 rounded-circle" style={{width:"50px", height: "50px"}} src={this.props.potrait} alt="Card image cap"/>
//                             </Link>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="col-10">
//                     <div className="row">
//                         <div className="row">
//                             <span className="d-inline text-bold">{this.props.name}</span>
//                             <span className="d-inline opacity-50">{this.props.time}</span>
//                         </div>
//                     <div className="col-12 mb-2">{this.props.content}</div>
//                     </div>
//                     </div>

//                     {/* <p class="card-text d-inline-block m-2">{this.props.name} {this.props.action} {this.props.content}</p>
//                     <p class="card-text"><small class="text-muted">Last updated {this.props.time} ago</small></p> */}
//                 </div>
//             </div>
//         )
//     }
// }

class Comment extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div class="list-group-item d-flex gap-3 py-3">
                <Link to={'/' + this.props.name}>
                     <img className="img d-inline-block m-2 rounded-circle" style={{width:"50px", height: "50px"}} src={this.props.potrait} alt="Card image cap"/>
                </Link>
                <div className="d-flex gap-2 w-100 justify-content-between">
                    <div>
                        <h6 className="mb-0">{this.props.name}</h6>
                        <p className="mb-0 opacity-75">{this.props.content}</p>
                    </div>
                    <small className="opacity-50 text-nowrap">{this.props.time}</small>
                </div>
            </div>
        )
    }
}

class CommentList extends React.Component{
    render(){
        return(
            <div className="list-group w-auto">
                {commentExample.map((comment,index)=>
                    <Comment key={index} name={comment.name} content={comment.content} potrait={comment.potrait} time={comment.time}/>
                )}
            </div>
        )
    }
}

class CommentForm extends React.Component{

}

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
                <div id="scrollableComment" style={{ height: "90vh", overflow: "auto" }}>
                    <InfiniteScroll dataLength={commentExample.length} next={null} hasMore={false} scrollableTarget="scrollableComment"
                            endMessage={<p style={{ textAlign: 'center' }}><b>No more comments</b></p>}>
                        <TweetCard tweetInfo={tweetInfo}/> {/* TODO: could we customize the height? */}
                        <CommentList/>
                    </InfiniteScroll>
                </div>
                {/* <div>
                    <textarea className="form-control" id='new-comment' rows='1' value="comment here"></textarea>
                </div> */}

                    
                
            </div>
        )
    }
}



export default TweetDetail;