const express = require('express');
const app = express();

// const cors = require('cors'); app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());

const mongoose = require('mongoose');
// const send = require('express/lib/response');
console.log("Connecting to MongoDB...");
mongoose.connect('mongodb+srv://csci3100e1:csci3100e1@chirpin.pjvjlns.mongodb.net/Chirpin?authMechanism=DEFAULT');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function () {
    console.log("Connection is open...");

    const AccountSchema = mongoose.Schema({
        uid: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true, minlength: 4, maxlength: 20 },
        pwd: { type: String, required: true },
        identity: { type: String, required: true }
    });

    const TweetSchema = mongoose.Schema({
        tid: { type: String, required: true, unique: true },
        poster: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        tweet_content: { type: String, required: true },
        tag: [{ type: String, required: true }],
        comment: [{
            username: { type: String, required: true, unique: true, minlength: 4, maxlength: 20 },
            portrait: {type: String}, 
            content: { type: String, required: true },
            floor: { type: Number, required: true },
            time: { type: Date, required: true }
        }],
        parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' },
        like: [{
            time: { type: Date, required: true },
            username: { type: String, required: true },
        }],
        dislike_counter: { type: Number, required: true },
        report_counter: { type: Number, required: true },
        retweet: [{
            time: { type: Date, required: true },
            username: { type: String, required: true }
        }],
        post_time: { type: Date, required: true },
    });

    const UserSchema = mongoose.Schema({
        uid: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true, minlength: 4, maxlength: 20 },
        gender: { type: String, required: true },
        interest: [{ type: String, required: true }],
        about: { type: String },
        follower_counter: { type: Number },
        following_counter: { type: Number },
        tweet: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
        follower: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        tweet_reported: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
        user_reported: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        user_blocked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        report_counter: { type: Number, required: true },
        tweet_liked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
        tweet_disliked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
        portrait: { type: String, required: true }
    });

    const NotificationSchema = mongoose.Schema({
        uid: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}, //who is receiving this notifications
        actor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}, // who is sending this notification
        action: { type: String, required: true }, // follow, like, comment, retweet
        tid: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet'}, // which tweet is involved, null for follow action
        time: { type: Date, required: true }
    });

    const Account = mongoose.model('Account', AccountSchema);
    const Tweet = mongoose.model('Tweet', TweetSchema);
    const User = mongoose.model('User', UserSchema);
    const Notification = mongoose.model('Notification', NotificationSchema);

    // create admin for testing
    app.get('/test/createAdmin', (req, res) => {
        var adminID = new mongoose.Types.ObjectId();
        Account.create({
            uid: adminID,
            username: "admin_01",
            pwd: "123456",
            identity: "admin"
        }).then(() => {
            res.sendStatus(200);
        }).catch((err) => {
            console.error(err);
        });
    });

    // create user for testing
    app.get('/test/createUser', (req, res) => {
        var userID = new mongoose.Types.ObjectId();
        Account.create({
            uid: userID,
            username: "user_03",
            pwd: "123456",
            identity: "user"
        }).then((user) => {
            User.create({
                uid: user.uid,
                username: user.username,
                gender: "Male",
                interest: ["Basketball", "Piano"],
                about: "This is for test. This is for test. This is for test. This is for test. This is for test.",
                follower_counter: 0,
                following_counter: 0,
                tweet: [],
                follower: [],
                following: [],
                tweet_reported: [],
                user_blocked: [],
                user_reported: [],
                report_counter: 0,
                tweet_liked: [],
                tweet_disliked: [],
                portrait: "test"
            }).then(c => {
                console.log(c);
            })
        }).then(() => {
            res.sendStatus(200);
        }).catch((err) => {
            console.error(err);
        });
    });

    // create tweet for testing
    app.get('/test/createTweet', (req, res) => {
        var tweetID = new mongoose.Types.ObjectId();
        Tweet.create({
            tid: tweetID,
            tweet_content: 'This is just for test. This is just for test. This is just for test. This is just for test. This is just for test.',
            poster: '642d3b6df94b01dddd7f2d99',
            tag: ['#tag1', "#tag2"],
            comment: [],
            parent: null,
            like: [],
            dislike_counter: 0,
            report_counter: 0,
            retweet: [],
            post_time: new Date(),
        }).then((tweetobj) => {
            console.log(tweetobj._id);
            User.updateOne({ username: tweetobj.username }, { $push: { tweet: tweetobj._id } }).then(c => {
                console.log(c);
            });
        }).then(() => {
            res.sendStatus(200);
        }).catch((err) => {
            console.error(err);
        });
    });

    // create notification for testing
    app.get('/test/createNotification', (req, res) => {
        var notificationID = new mongoose.Types.ObjectId();
        Notification.create({
            nid: notificationID,
            uid: 1,
            actor_id: 2,
            action: "like",
            tid: 1,
            time: new Date()
        }).then((noteobj) => {
            console.log(noteobj._id);
            Notification.updateOne({ nid: noteobj.nid }, { $push: { notification: noteobj._id } }).then(c => {
                console.log(c);
            });
        }).then(() => {
            res.sendStatus(200);
        }).catch((err) => {
            console.error(err);
        });
    });

/* -------------------------------------------------------------- */
/* ------------------------Profile (JI Yi)------------------------*/
/* ---------------------------------------------------------------*/

    // get basic user information
    app.get('/profile/:username', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let username = req.params['username'];
        User.findOne({ 'username': username }).populate('tweet').exec().then((user) => {
            console.log(user);
            res.send(user);
        }).catch((err) => {
            console.log(err);
            res.send(err);
        });
    });

    // update user information
    app.put('/profile/:username', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let username = req.params['username'];
        let updateName = req.body.name;
        let updateGender = req.body.gender;
        let updateInterest = req.body.interest;
        let updatePortrait = req.body.portrait;
        let updateAbout = req.body.about;

        User.findOne({ 'username': username }).then((user) => {
            user.username = updateName;
            user.gender = updateGender;
            user.interest = updateInterest;
            user.portrait = updatePortrait;
            user.about = updateAbout;
            user.save();
            res.status(200).send(JSON.stringify(user));
        }).catch((err) => {
            console.log(err);
            res.send(err);
        });
    });

    // get followings
    app.get('/profile/:username/followings', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let username = req.params['username'];
        User.findOne({ 'username': username }).populate('following').exec().then((user) => {
            console.log(user.following);
            res.send(user.following);
        }).catch((err) => {
            console.log(err);
            res.send(err);
        });
    });

    // get followers
    app.get('/profile/:username/followers', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let username = req.params['username'];
        User.findOne({ 'username': username }).populate('follower').exec().then((user) => {
            console.log(user.follower);
            res.send(user.follower);
        }).catch((err) => {
            console.log(err);
            res.send(err);
        });
    });

    // update the followings and followers after clicking the "Follow" button
    app.put('/profile/:username/:target/follow', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let username = req.params['username'];
        let target = req.params['target'];
        User.findOne({ 'username': username }).then((user) => {
            User.findOne({ 'username': target }).then((target) => {
                user.following.push(target._id);
                target.follower.push(user._id);
                user.following_counter += 1;
                target.follower_counter += 1;
                user.save();
                target.save();
            });
        }).then(() => {
            res.sendStatus(200);
        }).catch((err) => {
            res.send(err);
        })
    });

    // update the followings and followers after clicking the "Unfollow" button
    app.put('/profile/:username/:target/unfollow', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let username = req.params['username'];
        let target = req.params['target'];
        User.findOne({ 'username': username }).then((user) => {
            User.findOne({ 'username': target }).then((target) => {
                user.following.remove(target._id);
                target.follower.remove(user._id);
                user.following_counter -= 1;
                target.follower_counter -= 1;
                user.save();
                target.save();
            });
        }).then(() => {
            res.sendStatus(200);
        }).catch((err) => {
            res.send(err);
        })
    });

    // update the user blocked after clicking the "Block" button
    app.put('/profile/:username/:target/block', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let username = req.params['username'];
        let target = req.params['target'];
        User.findOne({ 'username': username }).then((user) => {
            User.findOne({ 'username': target }).then((target) => {
                user.user_blocked.push(target._id);
                user.save();
            });
        }).then(() => {
            res.sendStatus(200);
        }).catch((err) => {
            res.send(err);
        })
    });

    // update the user blocked after clicking the "Unblock" button
    app.put('/profile/:username/:target/unblock', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let username = req.params['username'];
        let target = req.params['target'];
        User.findOne({ 'username': username }).then((user) => {
            User.findOne({ 'username': target }).then((target) => {
                user.user_blocked.remove(target._id);
                user.save();
            });
        }).then(() => {
            res.sendStatus(200);
        }).catch((err) => {
            res.send(err);
        })
    });

    // update report after clicking the "report" button
    app.put('/profile/:username/:target/report', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let username = req.params['username'];
        let target = req.params['target'];
        User.findOne({ 'username': username }).then((user) => {
            User.findOne({ 'username': target }).then((target) => {
                user.user_reported.push(target._id);
                target.report_counter += 1;
                user.save();
                target.save();
            });
        }).then(() => {
            res.sendStatus(200);
        }).catch((err) => {
            res.send(err);
        })
    });

    // get tweets posted
    app.get('/profile/:username/tweets', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let username = req.params['username'];
        User.findOne({ 'username': username }).populate('tweet').exec().then((user) => {
            console.log(user.tweet);
            res.send(user.tweet);
        }).catch((err) => {
            console.log(err);
            res.send(err);
        });
    });

    // get tweets liked
    app.get('/profile/:username/likes', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let username = req.params['username'];
        User.findOne({ 'username': username }).populate('tweet_liked').exec().then((user) => {
            console.log(user.tweet_liked);
            res.send(user.tweet_liked);
        }).catch((err) => {
            console.log(err);
            res.send(err);
        });
    });

    /* -------------------------------------------------------------- */
    /* ---------------------------Main ZSH----------------------------*/
    /* ---------------------------------------------------------------*/

    // get all tweets
    app.get('/tweets', (req, res) => {
        res.set('Content-Type', 'text/plain');
        Tweet.find().then((tweets) => {
            console.log(tweets);
            res.send(tweets);
        }).catch((err) => {
            res.send(err);
        });
    });


    // get all users
    app.get('/users', (req, res) => {
        res.set('Content-Type', 'text/plain');
        User.find().then((users) => {
            console.log(users);
            res.send(users);
        }).catch((err) => {
            res.send(err);
        });
    });

    // get all the followings' tweets of the user
    app.get('/followings/:username', (req, res) => {
        res.set('Content-Type', 'text/plain');
        // consecutive populate: first find the user, then populate the following field, then populate the tweet field
        User.findOne({ 'username': req.params['username'] }).populate('following').exec().then((user) => {
            let following = user.following;
            let tweets = [];
            console.log(following);
            for (let i = 0; i < following.length; i++) {
                tweets.push(following[i].tweet);
            }
            console.log(tweets);
            // populate the tweet field of the tweet
            Tweet.find().where('_id').in(tweets).populate('owner').exec().then((tweets) => {
                console.log(tweets);
                res.send(tweets);
            }).catch((err) => {
                res.send(err);
            });
        }).catch((err) => {
            res.send(err);
        });
    });


    // tweet body example
    /*
    {
        "username": "user1",
        "tweet_content": "hello world",
        "tag": ["tag1", "tag2", "tag3"],
    }
    */


    // create a new tweet from body
    app.post('/new-tweet', (req, res) => {
        res.set('Content-Type', 'text/plain');
        // find the user
        User.find({ 'username': req.body['username'] }).then((user) => {
            if (!user) { return res.send('User does not exist').status(404); }
            // create a new tweet
            let time = new Date();
            let tweet = {
                tid: new mongoose.Types.ObjectId(),
                owner: user._id,
                tweet_content: req.body.tweet_content,
                tag: req.body.tag,
                dislike_counter: 0,
                report_counter: 0,
                post_time: time
            }
            Tweet.create(tweet).then((tweet) => {
                console.log(tweet);
                res.sendStatus(201);
            }).catch((err) => {
                res.send(err);
            });
        });
    });

    /* 
    POST /tweet/:tid/:username/like (increase the like count +1, add the tid to the user’s liked-list)
    POST /tweet/:tid/:username/cancel-like (like count -1, remove the tid from the user’s liked-list)
    POST /tweet/:tid/:username/dislike (increase the dislike count +1, add the tid to the user’s disliked-list)
    POST /tweet/:tid/:username/cancel-dislike (dislikelike count -1, remove the tid from the user’s disliked-list)
    POST /tweet/:tid/:username/report (increase the tweet’s report count +1, add the tid to the user’s report-list)
    */

    // like a tweet
    app.put('/tweet/:tid/:username/like', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let tid = req.params['tid'];
        let username = req.params['username'];
        // find the user
        User.findOne({ 'username': username }).then((user) => {
            if (!user) { return res.send('User does not exist').status(404); }
            Tweet.findById(tid).then((tweet) => {
                if (!tweet) { return res.send('Tweet does not exist').status(404); }
                let time = new Date();
                if (user.tweet_liked == null) { user.tweet_liked = []; }
                if (tweet.like == null) { tweet.like = []; }
                // check if the user has liked the tweet
                let likedTweets = user.tweet_liked;
                if (likedTweets.includes(tid)) {
                    return res.status(400).send('User have already liked this tweet');
                }
                user.tweet_liked.push(tweet._id);
                tweet.like.push({ username: username, time: time });
                // remove from the dislike list
                if (user.tweet_disliked && user.tweet_disliked.includes(tweet._id)) {
                    console.log("Remove tweet {" + tweet._id + "} from " + username + " dislike list");
                    user.tweet_disliked.remove(tweet._id);
                    tweet.dislike_counter--;
                }
                user.save();
                tweet.save();
                console.log("Like successfully");
                return res.status(201).send('Like successfully');
            });
        }).catch((err) => {
            console.log("-----Like Error--------");
            console.log(err);
            return res.status(500).send(err);
        });
    });

    // cancel like a tweet
    app.put('/tweet/:tid/:username/cancel-like', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let tid = req.params['tid'];
        let username = req.params['username'];
        User.findOne({ 'username': username }).then((user) => {
            if (!user) { return res.send('User does not exist').status(404); }
            Tweet.findById(tid).then((tweet) => {
                if (!tweet) { return res.send('Tweet does not exist').status(404); }
                if (user.tweet_liked == null || !user.tweet_liked.includes(tid) || tweet.like == null || tweet.like.includes(username)) {
                    return res.status(400).send('User have not liked this tweet');
                }
                user.tweet_liked.remove(tweet._id);
                tweet.like = tweet.like.filter(item => item.username !== username);
                user.save();
                tweet.save();
                console.log("Cancel like successfully");
                return res.status(201).send('Cancel like successfully');
            });
        }).catch((err) => {
            console.log("-----Cancel Like Error--------");
            console.log(err);
            return res.status(500).send(err);
        });
    });


    // dislike a tweet
    app.put('/tweet/:tid/:username/dislike', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let tid = req.params['tid'];
        let username = req.params['username'];
        User.findOne({ 'username': username }).then((user) => {
            if (!user) { return res.send('User does not exist').status(404); }
            Tweet.findById(tid).then((tweet) => {
                if (!tweet) { return res.send('Tweet does not exist').status(404); }
                if (user.tweet_disliked == null) { user.tweet_disliked = []; }
                // check if the user has disliked the tweet
                let dislikedTweets = user.tweet_disliked;
                if (dislikedTweets.includes(tid)) {
                    return res.status(400).send('User have already disliked this tweet');
                }
                // if the user has liked the tweet, remove it from the liked list
                if (user.tweet_liked && user.tweet_liked.includes(tweet._id)) {
                    console.log("Remove tweet {" + tweet._id + "} from " + username + " like list");
                    user.tweet_liked.remove(tweet._id);
                    tweet.like = tweet.like.filter(item => item.username !== username);
                }
                user.tweet_disliked.push(tweet._id);
                tweet.dislike_counter++;
                user.save();
                tweet.save();
                console.log("Dislike successfully");
                return res.status(201).send('Dislike successfully');
            });
        }).catch((err) => {
            console.log("-----Dislike Error--------");
            console.log(err);
            return res.status(500).send(err);
        });
    });
    

    // cancel dislike a tweet
    app.put('/tweet/:tid/:username/cancel-dislike', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let tid = req.params['tid'];
        let username = req.params['username'];
        User.findOne({ 'username': username }).then((user) => {
            if (!user) { return res.send('User does not exist').status(404); }
            Tweet.findById(tid).then((tweet) => {
                if (!tweet) { return res.send('Tweet does not exist').status(404); }
                if (user.tweet_disliked == null || !user.tweet_disliked.includes(tid)) {
                    return res.status(400).send('User have not disliked this tweet');
                }
                user.tweet_disliked.remove(tweet._id);
                tweet.dislike_counter--;
                user.save();
                tweet.save();
                console.log("Cancel dislike successfully");
                return res.status(201).send('Cancel dislike successfully');
            });
        }).catch((err) => {
            console.log("-----Cancel dislike Error--------");
            console.log(err);
            return res.status(500).send(err);
        });
    });

    // report a tweet
    app.put('/tweet/:tid/:username/report', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let tid = req.params['tid'];
        let username = req.params['username'];
        User.findOne({ 'username': username }).then((user) => {
            if (!user) { return res.send('User does not exist').status(404); }
            Tweet.findById(tid).then((tweet) => {
                if (!tweet) { return res.send('Tweet does not exist').status(404); }
                if (user.tweet_reported == null) { user.tweet_reported = []; }
                // check if the user has reported the tweet
                let reportedTweets = user.tweet_reported;
                if (reportedTweets.includes(tid)) {
                    return res.status(400).send('User have already reported this tweet');
                }
                user.tweet_reported.push(tweet._id);
                tweet.report_counter++;
                user.save();
                tweet.save();
                console.log("Report successfully");
                return res.status(201).send('Report successfully');
            });
        }).catch((err) => {
            console.log("-----Report Error--------");
            console.log(err);
            return res.status(500).send(err);
        });
    });


    /* -------------------------------------------------------------- */
    /* ----------------------Comment/Tweet Detail LZQ-----------------*/
    /* ---------------------------------------------------------------*/


    //add a new comment
    app.post('/tweet/:tid/:username/comment', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let tid = req.params['tid'];
        let username = req.params['username'];
        // find the user
        User.findOne({ 'username': username }).then((user) => {
            if (!user) { return res.send('User does not exist').status(404); }
            else {console.log('User found')}
            Tweet.findById(tid).then((tweet) => {
                if (!tweet) { return res.send('Tweet does not exist').status(404); }
                console.log(tweet);
                let time = new Date();
                let floor_num;
                if (tweet.comment == null) { tweet.comment = []; floor_num =1;}
                else {floor_num = tweet.comment.length + 1;}
                // get user info
                let user_potrait = user.portrait;
                let new_comment = {
                    username: username,
                    portrait: user_potrait,
                    content: req.body.content,
                    time: time,
                    floor: floor_num
                };
                console.log(new_comment)
                tweet.comment.push(new_comment);                
                tweet.save();
                console.log("comment successfully");
                return res.status(201).send('comment successfully');
            });
        }).catch((err) => {
            console.log("-----Comment Error--------");
            console.log(err);
            return res.status(500).send(err);
        });
    });

    //get detail tweet
    app.get('/tweet/:tid', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let tid = req.params['tid'];
        Tweet.findById(tid).populate('poster').exec().then((tweet) => {
            if(!tweet){return res.send('Tweet does not exist').status(404);}
            let tweet_info ={
                tid: tweet._id,
                likeInfo: tweet.like.length,
                dislikeInfo: tweet.dislike_counter,
                user: {uid: tweet.poster, username: tweet.poster.username},
                content: tweet.tweet_content,
                commentCount:tweet.comment.length,
                retweetCount: tweet.retweet_counter,
                time: tweet.post_time,  
                portraitUrl: tweet.portrait,
                tags: tweet.tag,
            }
            console.log('get tweet successfully');
            return res.status(201).send(tweet_info);
        }).catch((err) => {
        console.log("-----Get Tweet Error--------");
        console.log(err);
        return res.status(500).send(err);
        });
    });

    // get comment list
    app.get('/tweet/:tid/comment', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let tid = req.params['tid'];
        Tweet.findById(tid).then((tweet) => {
            if(!tweet){return res.send('Tweet does not exist').status(404);}
            let comment_list = tweet.comment;
            console.log('get comment successfully');
            res.send(comment_list);
        }).catch((err) => {
        console.log("-----Get Comment Error--------");
        console.log(err);
        return res.status(500).send(err);
        });
    });

    app.post('/tweet/:tid/:username/:floor', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let tid = req.params['tid'];
        let username = req.params['username'];
        let floor_reply = req.params['floor'];
        Tweet.findById(tid).then((tweet) => {
            if(!tweet){return res.send('Tweet does not exist').status(404);}
            let floor_num = tweet.comment.length + 1;
            let time = new Date();
            User.findOne({ 'username': username }).then((user) => {
                if (!user) { return res.send('User does not exist').status(404); }
                let content = "Re "+floor_reply+": "+req.body.content;
                let new_reply = {
                    username: username,
                    portrait: user.portrait,
                    content: content,
                    time: time,
                    floor: floor_num
                }
                tweet.comment.push(new_reply);
                tweet.save();
                console.log(new_reply)
                console.log("reply successfully");
                return res.status(201).send('reply successfully');
            });
        }).catch((err) => {
        console.log("-----Reply Error--------");
        console.log(err);
        return res.status(500).send(err);
        });
    });




    /* -------------------------------------------------------------- */
    /* ------------------------Write Your Part------------------------*/
    /* ---------------------------------------------------------------*/
});

const server = app.listen(8000);
