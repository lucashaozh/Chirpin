import { useState } from 'react';
import UserListView from './User';
import TweetListView from './Tweet';


function Main() {
    const [viewMode, setViewMode] = useState('user');
    return (<div>
        <div class="btn-group d-flex mb-3" role="group" aria-label="...">
            <button type="button" class={"btn btn-" + (viewMode != 'user' ? "outline-" : "") + "primary w-100"} onClick={() => setViewMode('user')}>User</button>
            <button type="button" class={"btn btn-" + (viewMode != 'tweet' ? "outline-" : "") + "primary w-100"} onClick={() => setViewMode('tweet')}>Tweet</button>
        </div>
        <div className="row">
            {viewMode == "user" && <UserListView />}
            {viewMode == "tweet" && <TweetListView />}
        </div>
    </div>)
}

export default Main;