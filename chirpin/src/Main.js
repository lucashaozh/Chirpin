import { useState, useRef, useEffect } from 'react';
import UserListView from './User';
import { TweetListView } from './Tweet';
import { Editor } from '@tinymce/tinymce-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { userInfoExample, tweetInfoExample, tagsExample } from './Example';
import { randomSelect } from './Utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';


function NewPost() {
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
    <div className='container-fluid'>
      <div className='card p-2 m-2 mb-4'/*  style={{ borderRadius: "30px" }} */>
        <div className='card-body p-1 mx-1 mb-2 row'>
          <Editor
            // tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
            apiKey='bbhuxhok548nagj70vnpfkk2793rut8hifdudjna10nktqx2'
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
        <div className='d-flex justify-content-end'>
          <button type="button" className="btn btn-primary mx-2" onClick={log}>New post</button>
        </div>
      </div>
    </div>
  );
}



function Main() {
  const fetchFollowingsTweet = () => {
    return tweetInfoExample;
  }

  const fetchRecommendUsers = () => {
    return randomSelect(userInfoExample, 6);
  }

  const fetchRecommendTweets = () => {
    return randomSelect(tweetInfoExample, 15);
  }

  const [viewMode, setViewMode] = useState("following");
  const [recommendUsers, setRecommendUsers] = useState(randomSelect(userInfoExample, 6));
  const [recommendTweets, setRecommendTweets] = useState(randomSelect(tweetInfoExample, 13));
  const [followingsTweets, setFollowingsTweets] = useState(fetchFollowingsTweet());

  const [dataLength, setDataLength] = useState(Math.min(5, tweetInfoExample.length));



  // const fetchMore = () => {
  //     console.log("Fetch more data");
  //     if (viewMode === "following") {
  //         const { tweets, hasMore } = fetchFollowingsTweet();
  //         if (tweets) {
  //             setFollowingsTweets(followingsTweets.concat(tweets));
  //             setDataLength(dataLength + tweets.length);
  //         }
  //         setHasMore(hasMore);
  //     } else if (viewMode === "recommend") {
  //         // fetch more recommended users and tweets (7 users, 13 tweets)
  //         const { users, userHasMore } = fetchRecommendUsers();
  //         const { tweets, tweetHasMore } = fetchRecommendTweets();
  //         setHasMore(userHasMore || tweetHasMore);
  //         if (tweets) { setRecommendTweets(recommendTweets.concat(tweets)); }
  //         if (users) { setRecommendUsers(recommendUsers.concat(users)); }
  //         let usersLength = (users) ? Math.ceil(users.length / 3) : 0;
  //         let tweetsLength = (tweets) ? tweets.length : 0;
  //         setDataLength(dataLength + tweetsLength + usersLength);
  //     }
  // }

  const changeFollowingMode = () => {
    setViewMode("following");
    setFollowingsTweets(fetchFollowingsTweet());
    setDataLength(followingsTweets ? followingsTweets.length : 0);
  }

  const changeRecommendMode = () => {
    setViewMode("recommend");
    setRecommendUsers(fetchRecommendUsers());
    setRecommendTweets(randomSelect(tweetInfoExample, 15));
    setRecommendUsers(randomSelect(userInfoExample, 6));
    const usersLength = recommendUsers ? Math.ceil(recommendUsers.length / 3) : 0;
    const tweetsLength = recommendTweets ? recommendTweets.length : 0;
    setDataLength(usersLength + tweetsLength);
  }

  const refreshRecommend = () => {
    changeRecommendMode();
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
            // <div className="d-flex justify-content-center align-items-center">
            //     <span className="mr-2">
            //         <b>Yay! You have seen it all</b>
            //     </span>
            //     {viewMode === "recommend" &&
            //         <button className="btn btn-primary">
            //             <FontAwesomeIcon icon={faRefresh} className="mr-2" />
            //         </button>
            //     }
            // </div>
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


            // <p className="d-flex">
            //     <span>
            //         <b>Yay! You have seen it all</b>
            //     </span>
            //     <span>
            //         {viewMode === "recommend" && <button className='btn btn-primary d-flex justify-content-end'>
            //             <FontAwesomeIcon icon={faRefresh} className='mr-2' />
            //         </button>}
            //     </span>
            // </p>
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