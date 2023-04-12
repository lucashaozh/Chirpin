import * as React from 'react';
import {Link} from "react-router-dom";
import {commentExample} from "./Example";
import {faStairs, FaStairs} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {BACK_END} from './App';
import {getLoginInfo} from './Login';
import {timeDifference} from './Utils';

class Comment extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            // <div data-bs-toggle="modal" data-bs-target="#commentForm" data-bs-whatever="@mdo"data-target="#GSCCModal">
            <div class="list-group-item d-flex"> 
                <div data-bs-toggle="modal" data-bs-target={"#commentForm"+this.props.floor} data-bs-whatever="@mdo"data-target="#GSCCModal" onClick={()=>console.log(this.props.floor)}>
                    <FontAwesomeIcon icon={faStairs}></FontAwesomeIcon>
                    <div>{this.props.floor}</div>
                </div>
                <Link to={'/' + this.props.name}>
                     <img className="img d-inline-block m-2 rounded-circle" style={{width:"50px", height: "50px"}} src={this.props.portrait} alt="Card image cap"/>
                </Link>
                <div className="d-flex w-100 px-2 justify-content-between">
                    <div>
                        <h6 className="mb-0 py-1">{this.props.name}</h6>
                        <p className="mb-0 py-1 opacity-75">{this.props.content}</p>
                    </div>
                    <small className="opacity-50 text-nowrap">{timeDifference(this.props.time)}</small>
                </div>
                <CommentForm floor={this.props.floor} tid={this.props.tid} addReply = {this.props.addReply}/>
                
            </div>
        )
    }
}

// class CommentList extends React.Component{
//     constructor(props){
//         super(props);
//         this.state ={
//             comments:commentExample
//         }
//         this.addReply = this.addReply.bind(this);
//     }

//     async addReply(clicked_floor){
//         let newCom = {
//             content: "Re floor "+clicked_floor+": "+document.getElementById('new-comment').value,
//             username: getLoginInfo().username,
//             tid:this.props.tid,
//             floor_reply: clicked_floor
//         };
//         console.log(newCom);
//         let com = await fetch(BACK_END + 'tweet/reply', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(newCom),
//         });
//         let com_res = await com.json();
//         console.log(com_res);
//         let new_comments = this.state.comments;
//         new_comments.push({floor: com_res.floor, username: com_res.username, content:com_res.content, potrait: com_res.potrait, time: "Just now"});
//         this.setState({comments: new_comments});
//         console.log(this.state.comments);
//         document.getElementById('new-comment').value='';
//     }

//     render(){
//         return(
//             <div className="list-group w-auto">
//                 {this.state.comments.map((comment,index)=>
//                     <Comment addComment = {this.addComment.bind(this)} key={index} name={comment.username} content={comment.content} potrait={comment.potrait} time={comment.time} floor={comment.floor} tid={this.props.tid}/>
//                 )}
//             </div>
//         )
//     }
// }

{/** this is used to comment comment */}
class CommentForm extends React.Component{
    constructor(props){
        super(props);
        console.log(this.props.floor)
    }

    render(){
        return(
            <div class="modal fade" id={"commentForm"+this.props.floor} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5"> Re floor {this.props.floor}</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <textarea className="form-control" id={'new-comment'+this.props.floor} rows='5'></textarea>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"> Cancel </button>
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={()=>this.props.addReply(this.props.floor)}> Send </button>
                        </div>
                    </div>
                </div>
            </div>  
        )
    }
}


export default Comment;