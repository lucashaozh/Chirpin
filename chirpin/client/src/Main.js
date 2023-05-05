import { useState, useRef, useEffect } from 'react';
import UserListView from './User';
import { TweetListView } from './Tweet';
import { Editor } from '@tinymce/tinymce-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { randomSelect } from './Utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import { getLoginInfo } from './Login';
import { BACK_END } from './App';
import { Dropdown } from 'react-bootstrap';
import { ButtonGroup } from '@material-ui/core';
import Button from 'react-bootstrap/Button';
import { tinyMCEApiKey } from './Tweet';


function NewPost() {
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


  const editorRef = useRef(null);
  const initialContent = '<p style="opacity: 0.5;">Type your post content here</p>';
  const [availableTags, setAvailableTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [privacy, setPrivacy] = useState('false');

  const postNewTweet = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
      let postBody = {
        username: getLoginInfo()['username'],
        tweet_content: editorRef.current.getContent(),
        tags: tags,
        private: privacy
      }

      fetch('http://localhost:8000/new-tweet', {
        method: 'POST',
        body: JSON.stringify(postBody),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        if (res.status === 201) {
          editorRef.current.setContent(initialContent);
          setTags([]);
          alert("Post success");
        } else {
          alert("Post failed");
        }
      });
    } else {
      console.log("Error: editorRef.current is null");
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

  const addNewTags = () => {
    let newTags = document.getElementById("new-tag").value;
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
    document.getElementById("new-tag").value = '';
  }


  return (
    <div className='container-fluid'>
      <div className='card p-2 m-2 mb-4'>
        <div className='card-body p-1 mx-1 mb-2 row'>
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
              plugins: 'table advlist lists image media anchor link autoresize',
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
        <div className='d-flex justify-content-between'>
          <div>
            {tags != undefined && tags.map((tag, index) => {
              return (
                <span className="badge bg-primary my-1 mx-2" key={index}>{tag}</span>
              );
            })}
            <button type='button' className='btn btn-outline-primary mx-2' data-bs-toggle="modal" data-bs-target="#add-tag" data-bs-whatever="@mdo" onClick={() => { fetchAvailableTags(); }}>Add Tag</button>
          </div>

          <Dropdown as={ButtonGroup}>
            {/* <Button varient='primary' id='privacy' className="btn btn-primary mx-2" onClick={()=>{console.log(privacy)}}>New post</Button> */}
            <Button type="button" varient='primary' id='privacy' className="btn btn-primary mx-2" onClick={postNewTweet}>New post</Button>
            <Dropdown.Toggle split variant="primary" id="dropdown-split-privacy" />
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => { setPrivacy('false'); document.getElementById('privacy').innerHTML = "New Public Post" }}>Public</Dropdown.Item>
              <Dropdown.Item onClick={() => { setPrivacy('true'); document.getElementById('privacy').innerHTML = "New Private Post"; }}>Private</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

        </div>
      </div>
      {/* Modal */}
      <div className="modal fade" id="add-tag" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">Please choose a tag or input new tags</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {randomSelect(availableTags, 5).map((tag, index) => {
                return (
                  <button type="button" className="btn btn-outline-primary mx-2 my-1" data-bs-dismiss="modal" key={index} onClick={() => setTags([...tags, tag])}>{tag}</button>
                );
              })}
              <div>
                <div className="input-group m-2">
                  <input type="text" id="new-tag" className="form-control" placeholder="Input new tags" aria-label="Input new tags" aria-describedby="button-add" />
                  <button className="btn btn-outline-primary" type="button" onClick={addNewTags}>Add</button>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" id="close-modal" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



function Main() {
  const fetchFollowingsTweet = () => {
    fetch(BACK_END + "followings/" + getLoginInfo()['username'], { "method": "GET" },
    ).then((res) => {
      if (res.status === 200) {
        return res.json();
      }
    }).then((data) => {
      console.log(data);
      setFollowingsTweets(data);
    }).catch((err) => {
      console.log(err);
    });
  }

  const fetchRecommendUsers = () => {
    fetch(BACK_END + "users/" + getLoginInfo()['username'], { "method": "GET" })
      .then((res) => res.json()).then((data) => {
        console.log("Recommend users");
        console.log(data);
        setRecommendUsers(randomSelect(data, 6));
      }).catch((err) => {
        console.log(err);
      });
  }

  const fetchRecommendTweets = () => {
    fetch(BACK_END + "tweets/" + getLoginInfo()['username'], { "method": "GET" })
      .then((res) => res.json()).then((data) => {
        console.log("Recommend tweets");
        console.log(data);
        setRecommendTweets(randomSelect(data, 12));
      }).catch((err) => {
        console.log(err);
      });
  }


  const [viewMode, setViewMode] = useState("following");
  const [recommendUsers, setRecommendUsers] = useState([]);
  const [recommendTweets, setRecommendTweets] = useState([]);
  const [followingsTweets, setFollowingsTweets] = useState([]);
  const [dataLength, setDataLength] = useState(0);

  useEffect(() => {
    if (viewMode === "following") {
      fetchFollowingsTweet();
      setDataLength(followingsTweets ? followingsTweets.length : 0);
    } else if (viewMode === "recommend") {
      refreshRecommend();
    }
  }, [viewMode]);


  const changeFollowingMode = () => {
    setViewMode("following");
  }

  const changeRecommendMode = () => {
    setViewMode("recommend");
  }

  const refreshRecommend = () => {
    fetchRecommendUsers();
    fetchRecommendTweets();
    const usersLength = recommendUsers ? Math.ceil(recommendUsers.length / 3) : 0;
    const tweetsLength = recommendTweets ? recommendTweets.length : 0;
    setDataLength(usersLength + tweetsLength);
  }


  return (<div>
    <div className="btn-group d-flex mb-3" role="group" aria-label="...">
      <button type="button" className={"btn btn-" + (viewMode !== "following" ? "outline-" : "") + "primary w-100"} onClick={changeFollowingMode}>Following</button>
      <button type="button" className={"btn btn-" + (viewMode !== "recommend" ? "outline-" : "") + "primary w-100"} onClick={changeRecommendMode}>Recommend</button>
    </div>
    <div className="container-fluid" style={{ height: "90vh" }}>
      <div id="scrollableDiv" style={{ height: "90vh", overflow: "auto" }}>
        <NewPost />
        <InfiniteScroll dataLength={dataLength} next={null} hasMore={false} loader={<h4>Loading...</h4>}
          endMessage={
            <div className="d-flex justify-content-end h-100">
              <p className="text-center mb-0 mx-auto">
                <b>Yay! You have seen it all</b>
              </p>
              {viewMode === "recommend" && (
                <button className="btn btn-primary me-3" onClick={refreshRecommend}>
                  <FontAwesomeIcon icon={faRefresh} />
                </button>
              )}
            </div>
          }>
          {viewMode === "recommend" && <>
            <UserListView userInfos={recommendUsers} />
            <TweetListView tweetInfos={recommendTweets} />
          </>}
          {viewMode === "following" && <>
            <TweetListView tweetInfos={followingsTweets} />
          </>}
        </InfiniteScroll>
      </div>
    </div>
  </div >)
}

export default Main;