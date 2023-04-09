import { faThumbsUp, faThumbsDown, faComment, faRetweet, faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { timeDifference } from './Utils';
import { Link } from "react-router-dom";
import { getLoginInfo } from './Login';
import { BACK_END } from './App';


const tinyMCEApiKey = "bbhuxhok548nagj70vnpfkk2793rut8hifdudjna10nktqx2"

function DisplayRichText({ content }) {
  return (
    <>
      <div className="w-100">
        <Editor
          // tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
          apiKey={tinyMCEApiKey}
          value={content}
          disabled={true}
          init={{
            menubar: false,
            toolbar: false,
            readonly: true,
            min_height: 150,
            max_height: 400,
            plugins: [
              'autoresize'
            ],
          }}
        />
      </div>
    </>
  );
}



function TweetCard({ tweetInfo, isDetailPage = true }) {
  const [likeInfo, setLikeInfo] = useState(tweetInfo['likeInfo']);
  const [dislikeInfo, setDislikeInfo] = useState(tweetInfo['dislikeInfo']);
  const [timeInterval, setTimeInterval] = useState(timeDifference(tweetInfo['time']));
  const [isReported, setIsReported] = useState(tweetInfo['isReported']);


  // const tweetUserInfo = tweetInfo['user'];
  // console.log(tweetInfo)
  const commentCount = tweetInfo['commentCount'];
  const retweetCount = tweetInfo['retweetCount'];
  const tweetContent = tweetInfo['content'];
  const portraitUrl = tweetInfo['portraitUrl'];
  const tags = tweetInfo['tags'];

  // update time interval every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeInterval(timeDifference(tweetInfo['time']));
    }, 1000);
    return () => clearInterval(interval);
  });

  const clickLikeTweet = () => {
    // let updatedLikeInfo = { ...likeInfo };
    // updatedLikeInfo.bLikeByUser = !updatedLikeInfo.bLikeByUser;
    // if (updatedLikeInfo.bLikeByUser) {
    //   updatedLikeInfo.likeCount += 1;
    //   if (dislikeInfo.bDislikeByUser) {
    //     let updatedDislikeInfo = { ...dislikeInfo };
    //     updatedDislikeInfo.bDislikeByUser = !updatedDislikeInfo.bDislikeByUser;
    //     updatedDislikeInfo.dislikeCount -= 1;
    //     setDislikeInfo(updatedDislikeInfo);
    //   }
    // } else {
    //   updatedLikeInfo.likeCount -= 1;
    // }
    // setLikeInfo(updatedLikeInfo);
    if (likeInfo.bLikeByUser) {
      updateTweetInfo("cancel-like");
    } else {
      updateTweetInfo("like");
    }
  }

  const clickDislikeTweet = () => {
    // let updatedDislikeInfo = { ...dislikeInfo };
    // updatedDislikeInfo.bDislikeByUser = !updatedDislikeInfo.bDislikeByUser;
    // if (updatedDislikeInfo.bDislikeByUser) {
    //   updatedDislikeInfo.dislikeCount += 1;
    //   if (likeInfo.bLikeByUser) {
    //     let updatedLikeInfo = { ...likeInfo };
    //     updatedLikeInfo.bLikeByUser = !updatedLikeInfo.bLikeByUser;
    //     updatedLikeInfo.likeCount -= 1;
    //     setLikeInfo(updatedLikeInfo);
    //   }
    // } else {
    //   updatedDislikeInfo.dislikeCount -= 1;
    // }
    // setDislikeInfo(updatedDislikeInfo);
    if (dislikeInfo.bDislikeByUser) {
      updateTweetInfo("cancel-dislike");
    } else {
      updateTweetInfo("dislike");
    }
  }

  const updateTweetInfo = (operation) => {
    console.log("Updated tweet info to DB");
    fetch(BACK_END + 'tweet/' + tweetInfo['tid'] + "/" + getLoginInfo()['username'] + "/" + operation, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(res => {
      if (res.status === 201) {
        return res.json();
      } else {
        console.log("Like tweet failed");
        throw new Error("Like tweet failed");
      }
    }).then(data => {
      setLikeInfo(data['likeInfo']);
      setDislikeInfo(data['dislikeInfo']);
    }).catch(err => {
      console.log(err);
    });
  }

  const handleTweetReport = () => {
    // TODO: report tweet to DB
    fetch(BACK_END + 'tweet/' + tweetInfo['tid'] + "/" + getLoginInfo()['username'] + "/report", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(res => {
      if (res.status === 201) {
        console.log("Report tweet success");
        setIsReported(true);
      } else {
        console.log("Report tweet failed");
      }
    }).catch(err => {
      console.log(err);
    });
  }

  return (
    <div className="card p-2 m-2 mb-4" style={{ borderRadius: "30px" }}>
      <div className="card-body row">
        <div className="col-2">
          <div>
            <div className="d-flex justify-content-center text-center">
              {/* link to the user profile */}
              <Link to={"/" + tweetInfo.user.username}>
                <img src={portraitUrl} alt="Generic placeholder image" className="img-fluid rounded-circle w-75" />
              </Link>
            </div>
            <h3 className="my-2 text-bold text-center">{tweetInfo.user.username}</h3>
            <hr />
            <p className="opacity-50 text-nowrap text-center">{timeInterval}</p>
          </div>
        </div>
        <div className="col-10">
          <div className="row">
            <div className="col-12 mb-2">
              <div className="d-flex justify-content-start">
                {tags.map((tag, index) => {
                  return (
                    <span className="badge bg-primary m-1" key={index}>{tag}</span>
                  );
                })}
              </div>
            </div>
            <div className="col-12 mb-2">
              <DisplayRichText content={tweetContent} />
            </div>
            <div className="col-12">

              {!isDetailPage && <span className="m-1">
                <Link to={"/tweet/" + tweetInfo["tid"]}>
                  <button type="button" className="btn btn-primary btn-floating">View Full Tweet</button>
                </Link>
              </span>}
              <span className="m-1">
                <button type="button" className={"btn btn-" + (likeInfo.bLikeByUser ? "" : "outline-") + "primary btn-floating"} onClick={clickLikeTweet}>
                  <FontAwesomeIcon icon={faThumbsUp}></FontAwesomeIcon>
                </button>
                <span className="ms-1 opacity-75">{likeInfo.likeCount}</span>
              </span>
              <span className="m-1">
                <button type="button" className={"btn btn-" + (dislikeInfo.bDislikeByUser ? "" : "outline-") + "primary btn-floating"} onClick={clickDislikeTweet}>
                  <FontAwesomeIcon icon={faThumbsDown}></FontAwesomeIcon>
                </button>
                <span className="ms-1 opacity-75">{dislikeInfo.dislikeCount}</span>
              </span>
              <span className="m-1">

                <button type="button" className="btn btn-outline-primary btn-floating" data-bs-toggle="modal" data-bs-target="#tweetCommentForm" data-bs-whatever="@mdo">
                  <FontAwesomeIcon icon={faComment}></FontAwesomeIcon>
                </button>
                <span className="ms-1 opacity-75">{commentCount}</span>
              </span>
              <span className="m-1">
                <button type="button" className="btn btn-outline-primary btn-floating" data-bs-toggle="modal" data-bs-target="#tweetForwardForm" data-bs-whatever="@mdo">
                  <FontAwesomeIcon icon={faRetweet}></FontAwesomeIcon>
                </button>
                <span className="ms-1 opacity-75">{retweetCount}</span>
              </span>
              <span className="m-1">
                <button type="button" className={"btn btn-floating" + (isReported ? "btn-primary disabled" : " btn-outline-primary")} data-bs-toggle="modal" data-bs-target="#report-popup">
                  <FontAwesomeIcon icon={faWarning}></FontAwesomeIcon>
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <div className="modal fade" id="report-popup" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel"><FontAwesomeIcon icon={faWarning}></FontAwesomeIcon>Warning</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              Are you sure to report this tweet?
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleTweetReport}>Yes</button>
            </div>
          </div>
        </div>
      </div>

      {/* comment form for tweet's comment*/}
      <div className="modal fade" id="tweetCommentForm" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5"> Tweet your comment </h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <textarea className="form-control" id='new-comment' rows='5'></textarea>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"> Cancel </button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal"> Send </button>
            </div>
          </div>
        </div>
      </div>

      {/* forward tweet */}
      <ForwardForm />
    </div>
  )
}

function ForwardForm() {
  const editorRef = useRef(null);
  const initialContent = '<p style="opacity: 0.5;">Type your post content here</p>';
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  const handleFocus = () => {
    if (editorRef.current.getContent() === initialContent) {
      editorRef.current.setContent('');
    }
  };

  const handleBlur = () => {
    if (editorRef.current.getContent() === '') {
      editorRef.current.setContent(initialContent);
    }
  };

  return (
    <div className="modal fade" id="tweetForwardForm" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5"> Forward </h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <Editor
              apiKey='bbhuxhok548nagj70vnpfkk2793rut8hifdudjna10nktqx2'
              onInit={(evt, editor) => editorRef.current = editor}
              initialValue={initialContent}
              onFocus={handleFocus}
              onBlur={handleBlur}
              init={{
                min_height: 250,
                max_height: 750,
                menubar: true,
                plugins: 'advcode table advlist lists image media anchor link autoresize',
                toolbar: 'blocks bold forecolor backcolor | bullist numlist | link image media | table',
                image_title: true,
                automatic_uploads: true,
                file_picker_types: 'image',
                /* and here's our custom image picker*/
                file_picker_callback: (cb, value, meta) => {
                  const input = document.createElement('input');
                  input.setAttribute('type', 'file');
                  input.setAttribute('accept', 'image/*');

                  input.addEventListener('change', (e) => {
                    const file = e.target.files[0];

                    const reader = new FileReader();
                    reader.addEventListener('load', () => {
                      /*
                      Note: Now we need to register the blob in TinyMCEs image blob
                      registry. In the next release this part hopefully won't be
                      necessary, as we are looking to handle it internally.
                      */
                      const id = 'blobid' + (new Date()).getTime();
                      console.log(Editor.editorUpload);
                      const blobCache = window.tinymce.activeEditor.editorUpload.blobCache;;

                      const base64 = reader.result.split(',')[1];
                      const blobInfo = blobCache.create(id, file, base64);
                      blobCache.add(blobInfo);

                      /* call the callback and populate the Title field with the file name */
                      cb(blobInfo.blobUri(), { title: file.name });
                    });
                    reader.readAsDataURL(file);
                  });

                  input.click();
                },
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
              }}
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"> Cancel </button>
            <button type="button" className="btn btn-primary" data-bs-dismiss="modal"> Send </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function TweetListView({ tweetInfos }) {
  return (
    <>
      <div className="container-fluid">
        {tweetInfos.map((tweetInfo, index) =>
          <TweetCard tweetInfo={tweetInfo} isDetailPage={false} key={index} />
        )}
      </div >
    </>)
}


// function TweetCardDetail({ tweetInfo }) {
//     const [likeInfo, setLikeInfo] = useState(tweetInfo['likeInfo']);
//     const [dislikeInfo, setDislikeInfo] = useState(tweetInfo['dislikeInfo']);
//     const [commentCount, setCommentCount] = useState(tweetInfo['commentCount']);
//     const [retweetCount, setRetweetCount] = useState(tweetInfo['retweetCount']);
//     const [tweetUserInfo, setTweetUserInfo] = useState(tweetInfo['user']);
//     const [tweetContent, setTweetContent] = useState(tweetInfo['content']);
//     const [timeInterval, setTimeInterval] = useState(timeDifference(tweetInfo['time']));
//     const [portraitUrl, setPortraitUrl] = useState(tweetInfo['portraitUrl']);

//     const clickLikeTweet = () => {
//         let updatedLikeInfo = { ...likeInfo };
//         updatedLikeInfo.bLikeByUser = !updatedLikeInfo.bLikeByUser;
//         if (updatedLikeInfo.bLikeByUser) {
//             updatedLikeInfo.likeCount += 1;
//             if (dislikeInfo.bDislikeByUser) {
//                 let updatedDislikeInfo = { ...dislikeInfo };
//                 updatedDislikeInfo.bDislikeByUser = !updatedDislikeInfo.bDislikeByUser;
//                 updatedDislikeInfo.dislikeCount -= 1;
//                 setDislikeInfo(updatedDislikeInfo);
//             }
//         } else {
//             updatedLikeInfo.likeCount -= 1;
//         }
//         setLikeInfo(updatedLikeInfo);
//         updateTweetInfoToDB();
//     }

//     const clickDislikeTweet = () => {
//         let updatedDislikeInfo = { ...dislikeInfo };
//         updatedDislikeInfo.bDislikeByUser = !updatedDislikeInfo.bDislikeByUser;
//         if (updatedDislikeInfo.bDislikeByUser) {
//             updatedDislikeInfo.dislikeCount += 1;
//             if (likeInfo.bLikeByUser) {
//                 let updatedLikeInfo = { ...likeInfo };
//                 updatedLikeInfo.bLikeByUser = !updatedLikeInfo.bLikeByUser;
//                 updatedLikeInfo.likeCount -= 1;
//                 setLikeInfo(updatedLikeInfo);
//             }
//         } else {
//             updatedDislikeInfo.dislikeCount -= 1;
//         }
//         setDislikeInfo(updatedDislikeInfo);
//         updateTweetInfoToDB();
//     }

//     const updateTweetInfoToDB = () => {
//         console.log("Updated tweet info to DB");
//     }

//     return (
//         <div className="card p-2 m-2 mb-4" style={{ borderRadius: "30px" }}>

//             {/* user name and potrait */}
//             <div class="card col-12 border-0">
//                 <div class="card-body">
//                     <div className="d-inline-block m-2 col-2"> 
//                     {/* <Link to={'/' + this.props.name}> */}
//                         <img class="img d-inline-block m-2 rounded-circle align-middle" style={{width:"100px", height: "100px"}} src={portraitUrl} alt="Card image cap"/>
//                     {/* </Link> */}
//                     </div>
//                     <div className="d-inline-block m-2 col-2"> 
//                     <h3 className="text-bold">{tweetUserInfo.username}</h3>
//                     <p className="opacity-50 text-nowrap">{timeInterval}</p>
//                     </div>
//                 </div>
//             </div>

//             <div className="col-12">
//                 <div className="row">
//                     <div className="col-12 mb-2">
//                         {/* rich text TODO: can we remove border, can we auto height?*/}
//                         <div className="w-100 mceNonEditable">
//                             <Editor
//                                 apiKey= {tinyMCEApiKey}
//                                 value={"lalallalla"}
//                                 init={{
//                                     height: 500,
//                                     menubar: false,
//                                     toolbar: false,
//                                     readonly: true,
//                                     noneditable_class: "mceNonEditable",
//                                     plugins: [
//                                         'advlist autolink lists link image charmap print preview anchor',
//                                         'searchreplace visualblocks code fullscreen',
//                                         'insertdatetime media table paste code help wordcount'
//                                     ],
//                                 }}
//                             />
//                         </div>
//                     </div>
//                     <div className="col-12">
//                         {/* <span className="m-1">
//                             <button type="button" className="btn btn-primary btn-floating">View Full Tweet</button>
//                         </span> */}
//                         <span className="m-1">
//                             <button type="button" className={"btn btn-" + (likeInfo.bLikeByUser ? "" : "outline-") + "primary btn-floating"} onClick={clickLikeTweet}>
//                                 <FontAwesomeIcon icon={faThumbsUp}></FontAwesomeIcon>
//                             </button>
//                             <span className="ms-1 opacity-75">{likeInfo.likeCount}</span>
//                         </span>
//                         <span className="m-1">
//                             <button type="button" className={"btn btn-" + (dislikeInfo.bDislikeByUser ? "" : "outline-") + "primary btn-floating"} onClick={clickDislikeTweet}>
//                                 <FontAwesomeIcon icon={faThumbsDown}></FontAwesomeIcon>
//                             </button>
//                             <span className="ms-1 opacity-75">{dislikeInfo.dislikeCount}</span>
//                         </span>
//                         <span className="m-1">
//                             <button type="button" className="btn btn-outline-primary disabled btn-floating">
//                                 <FontAwesomeIcon icon={faComment}></FontAwesomeIcon>
//                             </button>
//                             <span className="ms-1 opacity-75">{commentCount}</span>
//                         </span>
//                         <span className="m-1">
//                             <button type="button" className="btn btn-outline-primary disabled btn-floating">
//                                 <FontAwesomeIcon icon={faRetweet}></FontAwesomeIcon>
//                             </button>
//                             <span className="ms-1 opacity-75">{retweetCount}</span>
//                         </span>
//                     </div>
//                 </div>
//             </div>


//         </div>
//     )
// }

export { TweetListView, TweetCard };