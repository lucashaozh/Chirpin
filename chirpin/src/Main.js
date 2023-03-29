import { useState, useRef } from 'react';
import UserListView from './User';
import TweetListView from './Tweet';
import { Editor } from '@tinymce/tinymce-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { userInfoExample, tweetInfoExample } from './Example';


function NewPost() {
    const editorRef = useRef(null);
    const log = () => {
        if (editorRef.current) {
            console.log(editorRef.current.getContent());
        }
    };
    return (
        <>
            <Editor
                apiKey='bbhuxhok548nagj70vnpfkk2793rut8hifdudjna10nktqx2'
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue="<p>This is the initial content of the editor.</p>"
                init={{
                    height: "300px",
                    menubar: true,
                    plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar: 'undo redo | formatselect | ' +
                        'bold italic backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
            />
            <button type="button" className="btn btn-primary m-3" onClick={log}>New post</button>
        </>
    );
}



function Main() {
    const [viewMode, setViewMode] = useState("following");
    const [dataLength, setDataLength] = useState(Math.max(userInfoExample.length, tweetInfoExample.length));
    return (<div className>
        <div className="btn-group d-flex mb-3" role="group" aria-label="...">
            <button type="button" className={"btn btn-" + (viewMode != "following" ? "outline-" : "") + "primary w-100"} onClick={() => setViewMode("following")}>Following</button>
            <button type="button" className={"btn btn-" + (viewMode != "recommend" ? "outline-" : "") + "primary w-100"} onClick={() => setViewMode("recommend")}>Recommend</button>
        </div>
        <div className="container-fluid">
        <div id="scrollableDiv" style={{ height: "95vh", overflow: "auto" }}>
            <InfiniteScroll dataLength={dataLength} next={null} hasMore={false} scrollableTarget="scrollableDiv"
                endMessage={<p style={{ textAlign: 'center' }}>
                    <b>Yay! You have seen it all</b>
                </p>}>
                <NewPost />
                {viewMode == "recommend" && <UserListView userInfos={userInfoExample}/>}
                {viewMode == "following" && <TweetListView tweetInfos={tweetInfoExample}/>}

            </InfiniteScroll>
            </div>
        </div>
    </div >)
}

export default Main;