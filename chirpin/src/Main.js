import { useState, useRef } from 'react';
import UserListView from './User';
import {TweetListView} from './Tweet';
import { Editor } from '@tinymce/tinymce-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { userInfoExample, tweetInfoExample, tagsExample} from './Example';
import { randomSelect } from './Utils';


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
                    min_height: 250,
                    max_height: 750,
                    menubar: true,
                    plugins: 'advcode table advlist lists image media anchor link autoresize mentions',
                    toolbar: 'blocks bold forecolor backcolor | bullist numlist | link image media | table',
                    image_title: true,
                    automatic_uploads: true,
                    file_picker_types: 'image',
                    mentions: {
                        delimiter: '#',
                        insertHTML: (item) => {
                            return `<a href="#">${item.value}</a>`;
                        },
                        source: (query, renderList) => {
                            const hashtags = [
                                'react',
                                'javascript',
                                'html',
                                'css',
                                'webdev',
                                'coding'
                            ];
                            let matches = [];
                            hashtags.forEach((hashtag) => {
                                if (hashtag.includes(query)) {
                                    matches.push({ value: hashtag });
                                }
                            });
                            renderList(matches);
                        }
                    },
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
            <button type="button" className="btn btn-primary m-3" onClick={log}>New post</button>
        </>
    );
}



function Main() {
    const [viewMode, setViewMode] = useState("following");
    const [dataLength, setDataLength] = useState(Math.max(userInfoExample.length, tweetInfoExample.length));

    return (<div>
        <div className="btn-group d-flex mb-3" role="group" aria-label="...">
            <button type="button" className={"btn btn-" + (viewMode !== "following" ? "outline-" : "") + "primary w-100"} onClick={() => setViewMode("following")}>Following</button>
            <button type="button" className={"btn btn-" + (viewMode !== "recommend" ? "outline-" : "") + "primary w-100"} onClick={() => setViewMode("recommend")}>Recommend</button>
        </div>
        <div className="container-fluid">
            <div id="scrollableDiv" style={{ height: "93vh", overflow: "auto" }}>
                <InfiniteScroll dataLength={dataLength} next={null} hasMore={false}
                    endMessage={<p style={{ textAlign: 'center' }}>
                        <b>Yay! You have seen it all</b>
                    </p>}>
                    <NewPost />
                    {viewMode === "recommend" && <>
                        <UserListView userInfos={randomSelect(userInfoExample, 5)} />
                        <TweetListView tweetInfos={randomSelect(tweetInfoExample, 10)} />
                    </>}
                    {viewMode === "following" && <>
                        <TweetListView tweetInfos={tweetInfoExample} />
                    </>}
                </InfiniteScroll>
            </div>
        </div>
    </div >)
}

export default Main;