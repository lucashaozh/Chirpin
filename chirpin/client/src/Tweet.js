import { faThumbsUp, faThumbsDown, faComment, faRetweet, faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { timeDifference } from './Utils';
import { Link } from "react-router-dom";
import { getLoginInfo } from './Login';
import { BACK_END } from './App';
import { randomSelect } from './Utils';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

export const tinyMCEApiKey = "sectfzujjivlo90kpiqptvlao0lrn8b79rf326hs1v6b9oyu"


function DisplayRichText({ content }) {
  return (
    <>
      <div className="w-100">
        <Editor
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



function TweetCard({ tweetInfo, addComment, isDetailPage = true }) {
  const [likeInfo, setLikeInfo] = useState(tweetInfo['likeInfo']);
  const [dislikeInfo, setDislikeInfo] = useState(tweetInfo['dislikeInfo']);
  const [timeInterval, setTimeInterval] = useState(timeDifference(tweetInfo['time']));
  const [isReported, setIsReported] = useState(tweetInfo['isReported']);

  const [commentCount, setCommentCount] = useState(tweetInfo['commentCount']);
  const [retweetCount, setRetweetCount] = useState(tweetInfo['retweetCount']);
  const tweetContent = tweetInfo['content'];
  const portraitUrl = tweetInfo['portraitUrl'];
  const tags = tweetInfo['tags'];
  const username = tweetInfo['user']['username'];


  // update time interval every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeInterval(timeDifference(tweetInfo['time']));
    }, 1000);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    setLikeInfo(tweetInfo['likeInfo']);
    setDislikeInfo(tweetInfo['dislikeInfo']);
    setCommentCount(tweetInfo['commentCount']);
    setRetweetCount(tweetInfo['retweetCount']);
    setIsReported(tweetInfo['isReported']);
  }, [tweetInfo]);

  const clickLikeTweet = () => {
    if (likeInfo.bLikeByUser) {
      updateTweetInfo("cancel-like");
    } else {
      updateTweetInfo("like");
    }
  }

  const clickDislikeTweet = () => {
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

  const addCommentMain = () => {
    let newCom = {
      content: document.getElementById('new-comment' + tweetInfo.tid).value,
      username: getLoginInfo().username,
      tid: tweetInfo.tid,
    };
    console.log(newCom);
    fetch(BACK_END + 'tweet/comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCom),
    }).then(com => com.json()).then(com_res =>
      console.log(com_res));
    document.getElementById('new-comment' + tweetInfo.tid).value = '';
    setCommentCount(commentCount + 1);
  }


  return (
    <div className="card p-2 m-2 mb-4" style={{ borderRadius: "30px" }}>
      <div className="card-body row">
        <div className="col-2">
          <div>
            <div className="d-flex justify-content-center text-center">
              {/* link to the user profile */}
              <Link to={"/" + username}>
                <img src={portraitUrl} alt="Generic placeholder image" className="img-fluid rounded-circle w-75" />
              </Link>
            </div>
            <h3 className="my-2 text-bold text-center">{username}</h3>
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
              {getLoginInfo() && getLoginInfo()['mode'] == 'user' &&
                <>
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

                    <button type="button" className="btn btn-outline-primary btn-floating" data-bs-toggle="modal" data-bs-target={"#tweetCommentForm" + tweetInfo.tid} data-bs-whatever="@mdo">
                      <FontAwesomeIcon icon={faComment}></FontAwesomeIcon>
                    </button>
                    <span className="ms-1 opacity-75">{commentCount}</span>
                  </span>
                  <span className="m-1">
                    <a className="btn btn-outline-primary btn-floating" href={"#tweetForwardForm" + tweetInfo.tid} data-bs-toggle="modal" role='button'>
                      <FontAwesomeIcon icon={faRetweet}></FontAwesomeIcon>
                    </a>
                    <span className="ms-1 opacity-75" id='retweetCount'>{retweetCount}</span>
                  </span>
                  <span className="m-1">
                    <button type="button" className={"btn btn-floating" + (isReported ? "btn-primary disabled" : " btn-outline-primary")} data-bs-toggle="modal" data-bs-target={"#report-popup" + tweetInfo['tid']}>
                      <FontAwesomeIcon icon={faWarning}></FontAwesomeIcon>
                    </button>
                  </span>
                </>
              }
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <div className="modal fade" id={"report-popup" + tweetInfo['tid']} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
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
      <div className="modal fade" id={"tweetCommentForm" + tweetInfo.tid} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5"> Tweet your comment </h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <textarea className="form-control" id={'new-comment' + tweetInfo.tid} rows='5'></textarea>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"> Cancel </button>
              <button type="button" onClick={isDetailPage ? addComment : addCommentMain} className="btn btn-primary" data-bs-dismiss="modal"> Send </button>
            </div>
          </div>
        </div>
      </div>

      {/* forward tweet */}
      <ForwardForm tid={tweetInfo.tid} retweetCount={retweetCount} setRetweetCount={setRetweetCount} />
    </div>
  )
}

function ForwardForm(props) {
  const editorRef = useRef(null);
  const initialContent = '<p style="opacity: 0.5;">Type your post content here</p>';
  const [availableTags, setAvailableTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [privacy, setPrivacy] = useState('false');

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

  const fetchAvailableTags = () => {
    fetch('http://localhost:8000/tags', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json()).then(data => {
      const fetchedTags = data.map((item) => item['tag']);
      setAvailableTags(fetchedTags);
    }).catch(err => {
      console.log(err);
    });
  };

  useEffect(() => {
    fetchAvailableTags();
  }, []);


  const postRetweet = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());

      let postBody = {
        username: getLoginInfo()['username'],
        tweet_content: editorRef.current.getContent(),
        tags: tags,
        tid: props.tid,
        private: privacy
      }
      console.log(postBody)

      fetch('http://localhost:8000/retweet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postBody)
      }).then(res => {
        console.log(res)
        if (res.status === 201) {
          editorRef.current.setContent(initialContent);
          props.setRetweetCount(props.retweetCount + 1);
          setTags([]);
          alert("Retweet success");
        } else {
          alert("Retweet failed");
        }
      });
    } else {
      console.log("Error: editorRef.current is null");
    }
  };


  const addNewTags = () => {
    let newTagsDom = document.getElementById("new-tag-retweet" + props.tid);
    if (newTagsDom == null) {
      console.log("Error: newTagsDom is null");
      return;
    }
    console.log(newTagsDom);
    let newTags = newTagsDom.value;
    // check if the tag is already in the list
    if (!availableTags.includes(newTags)) {
      // insert the new tag into the database
      fetch('http://localhost:8000/new-tag', {
        method: 'POST',
        body: JSON.stringify({ tag: newTags }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        if (res.status === 201) {
          console.log("New tag inserted");
        } else if (res.status === 400 && res.body === "Tag already exists") {
          alert("Tag already exists");
        } else {
          console.log("Failed to insert new tag");
        }
        setTags([...tags, newTags]);
        // close the modal
        document.getElementById("close-modal").click();
      });
    } else {
      alert("Tag already exists");
    }
    // clear the input field
    newTagsDom.value = '';
  }
  return (
    <div>
      <div className="modal fade" id={"tweetForwardForm" + props.tid} aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5"> Forward </h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <Editor
                apiKey={tinyMCEApiKey}
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
              <div className="modal-body">
                <h5>Choose a tag</h5>
                <hr></hr>
                {randomSelect(availableTags, 5).map((tag, index) => {
                  return (
                    <button type="button" className="btn btn-outline-primary mx-2 my-1" key={index} onClick={() => setTags([...tags, tag])}>{tag}</button>
                  );
                })}
                <div>
                  <div className="input-group m-2">
                    <input type="text" id={"new-tag-retweet" + props.tid} className="form-control" placeholder="Input new tags" aria-label="Input new tags" aria-describedby="button-add" />
                    <button className="btn btn-outline-primary" type="button" data-bs-target="#tweetForwardForm" onClick={addNewTags}>Add</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <div>
                {tags != undefined && tags.map((tag, index) => {
                  return (
                    <span className="badge bg-primary my-1 mx-2" key={index}>{tag}</span>
                  );
                })}
              </div>
              <div>
                <Dropdown as={ButtonGroup}>
                  <Button type="button" varient='primary' id='retweet-privacy' className="btn btn-primary mx-2" onClick={postRetweet}>Send</Button>
                  <Dropdown.Toggle split variant="primary" id="retweet-dropdown-split-privacy" />
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => { setPrivacy('false'); document.getElementById('retweet-privacy').innerHTML = "Send Public" }}>Public</Dropdown.Item>
                    <Dropdown.Item onClick={() => { setPrivacy('true'); document.getElementById('retweet-privacy').innerHTML = "Send Private"; console.log(privacy) }}>Private</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
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

export { TweetListView, TweetCard };