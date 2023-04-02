import { faThumbsUp, faThumbsDown, faComment, faRetweet, faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { timeDifference } from './Utils';


const tinyMCEApiKey = "bbhuxhok548nagj70vnpfkk2793rut8hifdudjna10nktqx2"

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



function TweetCard({ tweetInfo }) {
    const [likeInfo, setLikeInfo] = useState(tweetInfo['likeInfo']);
    const [dislikeInfo, setDislikeInfo] = useState(tweetInfo['dislikeInfo']);
    const [timeInterval, setTimeInterval] = useState(timeDifference(tweetInfo['time']));
    const tweetUserInfo = tweetInfo['user'];
    const commentCount = tweetInfo['commentCount'];
    const retweetCount = tweetInfo['retweetCount'];
    const tweetContent = tweetInfo['content'];
    const portraitUrl = tweetInfo['portraitUrl'];
    const tags = tweetInfo['tags'];

    // update time interval every second (Copilot写的我也不知道干嘛的)
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeInterval(timeDifference(tweetInfo['time']));
        }, 1000);
        return () => clearInterval(interval);
    });

    const clickLikeTweet = () => {
        let updatedLikeInfo = { ...likeInfo };
        updatedLikeInfo.bLikeByUser = !updatedLikeInfo.bLikeByUser;
        if (updatedLikeInfo.bLikeByUser) {
            updatedLikeInfo.likeCount += 1;
            if (dislikeInfo.bDislikeByUser) {
                let updatedDislikeInfo = { ...dislikeInfo };
                updatedDislikeInfo.bDislikeByUser = !updatedDislikeInfo.bDislikeByUser;
                updatedDislikeInfo.dislikeCount -= 1;
                setDislikeInfo(updatedDislikeInfo);
            }
        } else {
            updatedLikeInfo.likeCount -= 1;
        }
        setLikeInfo(updatedLikeInfo);
        updateTweetInfoToDB();
    }

    const clickDislikeTweet = () => {
        let updatedDislikeInfo = { ...dislikeInfo };
        updatedDislikeInfo.bDislikeByUser = !updatedDislikeInfo.bDislikeByUser;
        if (updatedDislikeInfo.bDislikeByUser) {
            updatedDislikeInfo.dislikeCount += 1;
            if (likeInfo.bLikeByUser) {
                let updatedLikeInfo = { ...likeInfo };
                updatedLikeInfo.bLikeByUser = !updatedLikeInfo.bLikeByUser;
                updatedLikeInfo.likeCount -= 1;
                setLikeInfo(updatedLikeInfo);
            }
        } else {
            updatedDislikeInfo.dislikeCount -= 1;
        }
        setDislikeInfo(updatedDislikeInfo);
        updateTweetInfoToDB();
    }

    const updateTweetInfoToDB = () => {
        console.log("Updated tweet info to DB");
    }

    const handleTweetReport = () => {
        // TODO: report tweet to DB
    }

    return (
        <>
            <div className="card p-2 m-2 mb-4" style={{ borderRadius: "30px" }}>
                <div className="card-body row">
                    <div className="col-2">
                        <div>
                            <div className="d-flex justify-content-center">
                                {/* link to the user profile */}
                                <a href={"/" + tweetUserInfo.username}>
                                    <img src={portraitUrl} alt="Generic placeholder image" className="img-fluid" style={{ width: "100px", height: "100px", borderRadius: "50px" }} />
                                </a>
                            </div>
                            <h3 className="my-2 text-bold text-center">{tweetUserInfo.username}</h3>
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
                                <span className="m-1">
                                    <button type="button" className="btn btn-primary btn-floating">View Full Tweet</button>
                                </span>
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
                                    <button type="button" className="btn btn-outline-primary disabled btn-floating">
                                        <FontAwesomeIcon icon={faComment}></FontAwesomeIcon>
                                    </button>
                                    <span className="ms-1 opacity-75">{commentCount}</span>
                                </span>
                                <span className="m-1">
                                    <button type="button" className="btn btn-outline-primary disabled btn-floating">
                                        <FontAwesomeIcon icon={faRetweet}></FontAwesomeIcon>
                                    </button>
                                    <span className="ms-1 opacity-75">{retweetCount}</span>
                                </span>
                                <span className="m-1">
                                    <button type="button" className="btn btn-primary btn-floating" data-bs-toggle="modal" data-bs-target="#report-popup">
                                        <FontAwesomeIcon icon={faWarning}></FontAwesomeIcon>
                                    </button>
                                </span>
                            </div>
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
                            <button type="button" className="btn btn-primary" onClick={handleTweetReport}>Yes</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

function TweetListView({ tweetInfos }) {
    return (
        <>
            <div className="container-fluid">
                {tweetInfos.map((tweetInfo, index) =>
                    <TweetCard tweetInfo={tweetInfo} key={index} />
                )}
            </div >
        </>)
}

export default TweetListView;