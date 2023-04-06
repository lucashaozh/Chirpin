import * as React from 'react';
import {Link} from "react-router-dom";
import {commentExample} from "./Example";
import {faStairs, FaStairs} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



class Comment extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            // <div data-bs-toggle="modal" data-bs-target="#commentForm" data-bs-whatever="@mdo"data-target="#GSCCModal">
            <div class="list-group-item d-flex"> 

                {/* <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#commentForm" data-bs-whatever="@mdo" style={{width: '130px', fontSize: '18px', margin: '10px', bottom: '-20px', borderRadius: '30px'}}> 
                                            {this.props.floor}
                </button> */}
                <div data-bs-toggle="modal" data-bs-target={"#commentForm"+this.props.floor} data-bs-whatever="@mdo"data-target="#GSCCModal" onClick={()=>console.log(this.props.floor)}>
                    <FontAwesomeIcon icon={faStairs}></FontAwesomeIcon>
                    <div>{this.props.floor}</div>
                </div>
                <Link to={'/' + this.props.name}>
                     <img className="img d-inline-block m-2 rounded-circle" style={{width:"50px", height: "50px"}} src={this.props.potrait} alt="Card image cap"/>
                </Link>
                <div className="d-flex w-100 px-2 justify-content-between">
                    <div>
                        <h6 className="mb-0 py-1">{this.props.name}</h6>
                        <p className="mb-0 py-1 opacity-75">{this.props.content}</p>
                    </div>
                    <small className="opacity-50 text-nowrap">{this.props.time}</small>
                </div>
                {/* <CommentForm floor={this.props.floor}/> */}
                <div class="modal fade" id={"commentForm"+this.props.floor} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5"> Re floor {this.props.floor}</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <textarea className="form-control" id='new-comment' rows='5'></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"> Cancel </button>
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal"> Send </button>
                    </div>
                    </div>
                </div>
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
                    <Comment key={index} name={comment.name} content={comment.content} potrait={comment.potrait} time={comment.time} floor={comment.floor}/>
                )}
            </div>
        )
    }
}

{/** this is used to comment comment */}
// class CommentForm extends React.Component{
//     constructor(props){
//         super(props);
//         console.log(this.props.floor)
//     }
//     render(){
//         return(
//             // <div>
//             //     <textarea className="form-control" id='new-comment' rows='1' value="comment here"></textarea>
//             // </div>
//             <>
//             <div class="modal fade" id="commentForm" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
//                 <div class="modal-dialog">
//                     <div class="modal-content">
//                     <div class="modal-header">
//                         <h1 class="modal-title fs-5"> Re floor {this.props.floor}</h1>
//                         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                     </div>
//                     <div class="modal-body">
//                         <textarea className="form-control" id='new-comment' rows='5'></textarea>
//                     </div>
//                     <div class="modal-footer">
//                         <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"> Cancel </button>
//                         <button type="button" class="btn btn-primary" data-bs-dismiss="modal"> Send </button>
//                     </div>
//                     </div>
//                 </div>
//             </div>
//             </>
//         )
//     }
// }


export {Comment, CommentList, CommentForm};