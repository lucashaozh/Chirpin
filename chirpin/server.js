const express = require('express');
const app = express();

const cors = require('cors'); app.use(cors());

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
        // uid: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true, minlength: 4, maxlength: 20 },
        pwd: { type: String, required: true },
        identity: { type: String, required: true }
    });

    const TweetSchema = mongoose.Schema({
        // tid: { type: String, required: true, unique: true },
        poster: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        tweet_content: { type: String },
        tags: [{ type: String, required: true }],
        comments: [{
            username: { type: String, minlength: 4, maxlength: 20 },
            portrait: {type: String}, 
            content: { type: String},
            floor: { type: Number},
            time: { type: Date}
        }],
        parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' },
        likes: [{
            time: { type: Date, required: true },
            username: { type: String, required: true },
        }],
        dislike_counter: { type: Number, required: true },
        report_counter: { type: Number, required: true },
        retweets: [{
            time: { type: Date, required: true },
            username: { type: String, required: true }
        }],
        post_time: { type: Date, required: true },
    });

    const UserSchema = mongoose.Schema({
        // uid: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true, minlength: 4, maxlength: 20 },
        gender: { type: String },
        interests: [{ type: String}],
        about: { type: String },
        follower_counter: { type: Number },
        following_counter: { type: Number},
        tweets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
        followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        followings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        tweets_reported: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
        users_reported: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        users_blocked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        report_counter: { type: Number },
        tweets_liked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
        tweets_disliked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
        portrait: { type: String }
    });

    const NotificationSchema = mongoose.Schema({
        username: { type: String, required: true}, //who is receiving this notifications
        actor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}, // who is sending this notification
        action: { type: String, required: true }, // follow, like, comment, retweet
        tid: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet'}, // which tweet is involved, null for follow action
        time: { type: Date, required: true }
    });

    const TagSchema = mongoose.Schema({
        tag: { type: String, required: true,unique:true}, 
        tid: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet'}] // the tweets that contain the tag
    });

    const Account = mongoose.model('Account', AccountSchema);
    const Tweet = mongoose.model('Tweet', TweetSchema);
    const User = mongoose.model('User', UserSchema);
    const Notification = mongoose.model('Notification', NotificationSchema);
    const Tag = mongoose.model('Tag',TagSchema);

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
        // var userID = new mongoose.Types.ObjectId();
        Account.create({
            // uid: userID,
            username: "user_03",
            pwd: "123456",
            identity: "user"
        }).then((user) => {
            User.create({
                // uid: user.uid,
                username: user.username,
                gender: "Male",
                interests: ["Basketball", "Piano"],
                about: "This is for test. This is for test. This is for test. This is for test. This is for test.",
                follower_counter: 0,
                following_counter: 0,
                tweets: [],
                followers: [],
                followings: [],
                tweets_reported: [],
                users_blocked: [],
                users_reported: [],
                report_counter: 0,
                tweets_liked: [],
                tweets_disliked: [],
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
            // tid: tweetID,
            tweet_content: 'This is just for test. This is just for test. This is just for test. This is just for test. This is just for test.',
            poster: '642d71e10a89976d9257c576',
            tags: ['#tag1', "#tag2"],
            comments: [],
            parent: null,
            likes: [],
            dislike_counter: 0,
            report_counter: 0,
            retweets: [],
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
        // var notificationID = new mongoose.Types.ObjectId();
        Notification.create({
            // nid: notificationID,
            username: 'user_01',
            actor_id: "642d71e10a89976d9257c576",
            action: "like",
            tid: '642d734a349ac50b8635ff1e',
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
        User.findOne({ 'username': username }).populate('tweets').exec().then((user) => {
            userObj = {
                'uid': user['_id'],
                'username': user['username'],
                'gender': user['gender'],
                'interests': user['interests'],
                'follower_counter': user['follower_counter'],
                'following_counter': user['following_counter'],
                'about': user['about']
            }
            // console.log(userObj);
            res.send(userObj);
        }).catch((err) => {
            console.log(err);
            res.send(err);
        });
    });

    // update user information
    app.put('/profile/:username', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let username = req.params['username'];
        let updateGender = req.body.gender;
        let temp = req.body.interests.split(",");
        // let updateInterests = req.body.interests.split(",");
        let updateInterests = [];
        temp.forEach(element => {
            element = element.trim();
            updateInterests.push(element);
        });
        let updatePortrait = req.body.portrait;
        let updateAbout = req.body.about;

        User.findOne({ 'username': username }).then((user) => {
            if (updateGender != '')
                user.gender = updateGender;
            if (updateInterests != '')
                user.interests = updateInterests;
            if (updatePortrait != '')
                user.portrait = updatePortrait;
            if (updateAbout != '')
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
        User.findOne({ 'username': username }).populate('followings').exec().then((user) => {
            console.log(user);
            let retUsers = []
            user.followings.forEach(innerUser => {
                let userObj = {
                "username": innerUser['username'],
                "uid": innerUser['_id'],
                "following": innerUser['following_counter'],
                "follower": innerUser['follower_counter'],
                "portraitUrl": "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
                };
                retUsers.push(userObj);
            });
            res.send(retUsers);
        }).catch((err) => {
            console.log(err);
            res.send(err);
        });
    });

    // get followers
    app.get('/profile/:username/followers', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let username = req.params['username'];
        User.findOne({ 'username': username }).populate('followers').exec().then((user) => {
            console.log(user);
            let retUsers = []
            user.followers.forEach(innerUser => {
                let userObj = {
                "username": innerUser['username'],
                "uid": innerUser['_id'],
                "following": innerUser['following_counter'],
                "follower": innerUser['follower_counter'],
                "portraitUrl": "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
                };
                retUsers.push(userObj);
            });
            res.send(retUsers);
        }).catch((err) => {
            console.log(err);
            res.send(err);
        });
    });

    // get action info: followings, users_blocked and users_reported
    app.get('/profile/:username/actioninfo', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let username = req.params['username'];
        User.findOne({ 'username': username }).then((user) => {
            userObj = {
                'uid': user['_id'],
                'username': user['username'],
                'followings': user['followings'],
                'users_blocked': user['users_blocked'],
                'users_reported': user['users_reported']
            }
            // console.log(userObj);
            res.send(userObj);
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
                user.followings.push(target._id);
                target.followers.push(user._id);
                user.following_counter += 1;
                target.follower_counter += 1;
                user.save();
                target.save();
            Notification.create({
                // nid: notificationID,
                username: target.username,
                actor_id: user._id,
                action: "follow",
                time: new Date()
            }).then((noteobj) => {
                console.log(noteobj._id);
                Notification.updateOne({ nid: noteobj.nid }, { $push: { notification: noteobj._id } }).then(c => {
                    console.log(c);});  
            });
              
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
                user.followings.remove(target._id);
                target.followers.remove(user._id);
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
                user.users_blocked.push(target._id);
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
                user.users_blocked.remove(target._id);
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
                user.users_reported.push(target._id);
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
        User.findOne({ 'username': username }).populate('tweets').exec().then((user) => {
            let tweets = user.tweets;
            let retTweets = [];
            tweets.forEach(tweet => {
                let tweetObj = {
                    "tid": tweet['_id'],
                    "likeInfo": { "likeCount": tweet['likes'].length, "bLikeByUser": false },
                    "dislikeInfo": { "dislikeCound": tweet['dislike_counter'] },
                    "user": { "uid": user['_id'], 'username': user['username'] },
                    "content": tweet.tweet_content,
                    "commentCount": tweet['comments'].length,
                    "retweetCount": tweet['retweets'].length,
                    "time": tweet['post_time'],
                    "portraitUrl": "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp",
                    "tags": tweet['tags']
                }
                retTweets.push(tweetObj);
            });
            // console.log(retTweets);
            res.send(retTweets);
        }).catch((err) => {
            console.log(err);
            res.send(err);
        });
    });

    // get tweets liked
    app.get('/profile/:username/likes', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let username = req.params['username'];
        User.findOne({ 'username': username }).populate({ path: 'tweets_liked', populate: { path: 'poster' }}).exec().then((user) => {
            let retLikes = []
            user.tweets_liked.forEach(tweet => {
                let tweetObj = {
                    "tid": tweet['_id'],
                    "likeInfo": { "likeCount": tweet['likes'].length, "bLikeByUser": false },
                    "dislikeInfo": { "dislikeCound": tweet['dislike_counter'] },
                    "user": { "uid": tweet['poster']['_id'], 'username': tweet['poster']['username'] },
                    "content": tweet.tweet_content,
                    "commentCount": tweet['comments'].length,
                    "retweetCount": tweet['retweets'].length,
                    "time": tweet['post_time'],
                    "portraitUrl": "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp",
                    "tags": tweet['tags']
                }
                retLikes.push(tweetObj);
            });
            res.send(retLikes);
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
        User.findOne({ 'username': req.params['username'] }).populate('followings').exec().then((user) => {
            let following = user.followings;
            let tweets = [];
            console.log(following);
            for (let i = 0; i < following.length; i++) {
                tweets.push(following[i].tweets);
            }
            console.log(tweets);
            // populate the tweet field of the tweet
            Tweet.find().where('_id').in(tweets).populate('poster').exec().then((tweets) => {
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
        User.findOne({ 'username': req.body['username'] }).then((user) => {
            if (!user) { return res.send('User does not exist').status(404); }
            let uid = user._id;
            // create a new tweet
            let time = new Date();
            let tweet = {
                // tid: new mongoose.Types.ObjectId(),
                poster: uid,
                tweet_content: req.body.tweet_content,
                tags: req.body.tags,
                dislike_counter: 0,
                report_counter: 0,
                post_time: time,
                likes:[],
                comments: [],
                retweets: []
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
            Tweet.findById(tid).populate('poster').exec().then((tweet) => {
                if (!tweet) { return res.send('Tweet does not exist').status(404); }
                let time = new Date();
                if (user.tweets_liked == null) { user.tweets_liked = []; }
                if (tweet.likes == null) { tweet.likes = []; }
                // check if the user has liked the tweet
                let likedTweets = user.tweets_liked;
                if (likedTweets.includes(tid)) {
                    return res.status(400).send('User have already liked this tweet');
                }
                user.tweets_liked.push(tweet._id);
                tweet.likes.push({ username: username, time: time });
                // remove from the dislike list
                if (user.tweets_disliked && user.tweets_disliked.includes(tweet._id)) {
                    console.log("Remove tweet {" + tweet._id + "} from " + username + " dislike list");
                    user.tweets_disliked.remove(tweet._id);
                    tweet.dislike_counter--;
                }
                user.save();
                tweet.save();
                console.log("Like successfully");
                Notification.create({
                    // nid: notificationID,
                    username: tweet.poster.username,
                    actor_id: user._id,
                    action: "like",
                    tid:tweet._id,
                    time: new Date()
                }).then((noteobj) => {
                    console.log(noteobj._id);
                    Notification.updateOne({ nid: noteobj.nid }, { $push: { notification: noteobj._id } }).then(c => {
                        console.log(c);});  
                });
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
                if (user.tweets_liked == null || !user.tweets_liked.includes(tid) || tweet.likes == null || tweet.likes.includes(username)) {
                    return res.status(400).send('User have not liked this tweet');
                }
                user.tweets_liked.remove(tweet._id);
                tweet.likes = tweet.likes.filter(item => item.username !== username);
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
                if (user.tweets_disliked == null) { user.tweets_disliked = []; }
                // check if the user has disliked the tweet
                let dislikedTweets = user.tweets_disliked;
                if (dislikedTweets.includes(tid)) {
                    return res.status(400).send('User have already disliked this tweet');
                }
                // if the user has liked the tweet, remove it from the liked list
                if (user.tweets_liked && user.tweets_liked.includes(tweet._id)) {
                    console.log("Remove tweet {" + tweet._id + "} from " + username + " like list");
                    user.tweets_liked.remove(tweet._id);
                    tweet.likes = tweet.likes.filter(item => item.username !== username);
                }
                user.tweets_disliked.push(tweet._id);
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
                if (user.tweets_disliked == null || !user.tweets_disliked.includes(tid)) {
                    return res.status(400).send('User have not disliked this tweet');
                }
                user.tweets_disliked.remove(tweet._id);
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
                if (user.tweets_reported == null) { user.tweets_reported = []; }
                // check if the user has reported the tweet
                let reportedTweets = user.tweets_reported;
                if (reportedTweets.includes(tid)) {
                    return res.status(400).send('User have already reported this tweet');
                }
                user.tweets_reported.push(tweet._id);
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
    app.post('/tweet/comment', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let tid = req.body.tid;
        let username = req.body.username;
        // find the user
        User.findOne({ 'username': username }).then((user) => {
            if (!user) { return res.send('User does not exist').status(404); }
            else {console.log('User found')}
            Tweet.findById(tid).populate('poster').exec().then((tweet) => {
                if (!tweet) { return res.send('Tweet does not exist').status(404); }
                console.log(tweet);
                let time = new Date();
                let floor_num;
                if (tweet.comments == null) { tweet.comments = []; floor_num =1;}
                else {floor_num = tweet.comments.length + 1;}
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
                tweet.comments.push(new_comment);                
                tweet.save();
                Notification.create({
                    // nid: notificationID,
                    username: tweet.poster.username,
                    actor_id: user._id,
                    action: "comment",
                    tid:tweet._id,
                    time: new Date()
                }).then((noteobj) => {
                    console.log(noteobj._id);
                    Notification.updateOne({ nid: noteobj.nid }, { $push: { notification: noteobj._id } }).then(c => {
                        console.log(c);});  
                });
                console.log("comment successfully");
                return res.status(201).send(JSON.stringify(new_comment));
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
                likeInfo: tweet.likes.length,
                dislikeInfo: tweet.dislike_counter,
                user: {uid: tweet.poster, username: tweet.poster.username},
                content: tweet.tweet_content,
                commentCount:tweet.comments.length,
                retweetCount: tweet.retweets.length,
                time: tweet.post_time,  
                portraitUrl: tweet.portrait,
                tags: tweet.tags,
            }
            console.log('get tweet successfully');
            return res.status(201).send(JSON.stringify(tweet_info));
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
            let comment_list = tweet.comments;
            console.log('get comment successfully');
            res.send(comment_list);
        }).catch((err) => {
        console.log("-----Get Comment Error--------");
        console.log(err);
        return res.status(500).send(err);
        });
    });

    // reply to a comment
    app.post('/tweet/reply', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let tid = req.body.tid;
        let username = req.body.username;
        let floor_reply = req.body.floor;
        Tweet.findById(tid).populate('poster').exec().then((tweet) => {
            if(!tweet){return res.send('Tweet does not exist').status(404);}
            let floor_num = tweet.comments.length + 1;
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
                tweet.comments.push(new_reply);
                tweet.save();
                Notification.create({
                    // nid: notificationID,
                    username: tweet.poster.username,
                    actor_id: user._id,
                    action: "comment",
                    tid:tweet._id,
                    time: new Date()
                }).then((noteobj) => {
                    console.log(noteobj._id);
                    Notification.updateOne({ nid: noteobj.nid }, { $push: { notification: noteobj._id } }).then(c => {
                        console.log(c);});  
                });
                Notification.create({
                    // nid: notificationID,
                    username: tweet.comments[floor_reply-1].username,
                    actor_id: user._id,
                    action: "reply",
                    tid:tweet._id,
                    time: new Date()
                }).then((noteobj) => {
                    console.log(noteobj._id);
                    Notification.updateOne({ nid: noteobj.nid }, { $push: { notification: noteobj._id } }).then(c => {
                        console.log(c);});  
                });
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

    // retweet
    app.post('/retweet', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let parent_tid = req.body.tid;
        // find the user
        User.findOne({ 'username': req.body['username'] }).then((user) => {
            if (!user) { return res.send('User does not exist').status(404); }
            Tweet.findById(parent_tid).populate('poster').exec().then((tweet) => {
                // create a new tweet
                let time = new Date();
                let new_tweet = {
                    // tid: new mongoose.Types.ObjectId(),
                    poster: user._id,
                    tweet_content: req.body.tweet_content + " RT @" + tweet.poster.username + ": " + tweet.tweet_content,
                    tags: req.body.tags,
                    parent: parent_tid,
                    dislike_counter: 0,
                    report_counter: 0,
                    post_time: time,
                    likes:[],
                    comments: [],
                    retweets: []
                }
                
                Tweet.create(new_tweet).then((new_tweet_) => {
                    console.log(new_tweet_);
                    Notification.create({
                        // nid: notificationID,
                        username: tweet.poster.username,
                        actor_id: user._id,
                        action: "retweet",
                        tid: parent_tid,
                        time: new Date()
                    }).then((noteobj) => {
                        console.log(noteobj._id);
                        Notification.updateOne({ nid: noteobj.nid }, { $push: { notification: noteobj._id } }).then(c => {
                            console.log(c);});  
                    });
                    res.sendStatus(201);
                })
            })
        }).catch((err) => {
                    res.send(err);
            });
    
    });
    /* -------------------------------------------------------------- */
    /* ------------------------Notification LZQ-----------------------*/
    /* ---------------------------------------------------------------*/

    app.get('/notification/:username', (req, res) => {
        Notification.find({ 'username': req.params['username'] }).sort({'time':-1}).then((notes) => {
            res.set('Content-Type', 'text/plain');
            console.log(notes);
            res.status(201).send(notes);
        }).catch((err) => {
            console.log("-----Get Notification Error--------");
            console.log(err);
            return res.status(500).send(err);
        })
    });



    /* -------------------------------------------------------------- */
    /* ------------------------User/admin Operation JIANG Hongxu------------------------*/
    /* ---------------------------------------------------------------*/
    
    //create a user by signing up or admin adding
    app.post('/createuser', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let _username = req.body['username'];
        Account.findOne({ username: _username }).then((acc)=>{
            if(acc){return res.send("The username has already been used. Please change a username.").status(404);}
            Account.create({
                // uid:new mongoose.Types.ObjectId(),
                username: req.body['newusername'],
                pwd: req.body['newpwd'],
                identity:'user'
            }).then((acc) => {
                if(!acc){return res.send("Sign up unsuccessfully").status(404);}
                //console.log(acc);
                let user = {
                    username: req.body['newusername'],
                    // uid: new mongoose.Types.ObjectId(),
                    gender: '',
                    interest:[],
                    about:'',
                    follow_counter:0,
                    following_counter:0,
                    tweets:[],
                    follows:[],
                    followings:[],
                    tweets_reported:[],
                    users_reported:[],
                    uesrs_blocked:[],
                    report_counter:0,
                    tweets_liked:[],
                    tweets_disliked:[],
                    portrait:''
                }
                User.create(user).then((user)=>{
                    console.log(user);
                    res.status(201).send("User created successfully");
                }).catch((err) => {
                    res.send(err);
                });
            })
        });
    });

    //user/admin authentication
    app.post('/login/user', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let _username = req.body['username'];
        let _pwd = req.body['pwd'];
        Account.findOne({ username: _username }).then((val) => {
            if (!val) {
                res.status(404).send("Username does not exist.");
            }
            else{
                if(val.identity=='user'){
                    if (val != null && _pwd == val.pwd) {
                        res.status(201).send('Login As User Successfully!\n');
                    } 
                    else {
                        console.log("incorrect");
                        res.status(404).send("Incorrect Username or Password.\n");
                    }
                }
                if(val.identity=='admin'){
                    if (val != null && _pwd == val.pwd) {
                        res.status(200).send('Login As Amin Successfully!\n');
                    } 
                    else {
                        res.status(404).send("Incorrect Username or Password.\n");
                    }
                } 
            }
            }).catch((err)=>{
                res.send(err);
            });
        });
    

    //change pwd by user/admin
    app.put('/changepwd', (req, res) => {
        res.set('Content-Type', 'text-plain');
        let username = req.body.username;
        let newpwd = req.body.newpwd;

        Account.findOne({ username: username }).then ((acc) => {
            if (!acc) {
                res.sendStatus(404);
            } else if (newpwd != '') {
                acc.pwd = newpwd;
                acc.save();
                res.send("Update Successfully!").status(200);
            }
            else{
                return res.send('User does not exist').status(404);
            }
        }).catch((err)=>{
            res.send(err);
        });
    });

    //delete a user
    app.delete('/user/:username', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let username = req.params['username'];
        Account.deleteOne({username:username}).then((acc)=>{
            if(!acc){return res.send('User does not exist').status(404);}
            else {
                console.log("Successfully delete user " + username+"in Account db");
            }
            User.deleteOne({ username: username }).then((user) => {
                if(!user){return res.send('User does not exist').status(404);}
                else {
                    console.log("Successfully delete user " + username+" in User db");
                    //res.send("Successfully delete user " + username).status(204);
                }
                Tweet.delete({poster:user._id}).then((tweet)=>{
                    if(!tweet){return res.send("Successfully delete user " + username).status(204);}
                    else {
                        console.log("Successfully delete user " + username+"'s tweets");
                        res.send("Successfully delete user " + username).status(204);
                }
                })
            }).
            catch((err)=>{
            res.send(err);
            });
        });
    });
    

    //update user information by admin
    // app.put('/update', (req, res) => {
    //     res.set('Content-Type', 'text-plain');
    //     let oldusername = req.body.username
    //     let newusername = req.body.newusername;
    //     let newpwd = req.body.newpwd;

    //     Account.findOne({ username: oldusername }).then((acc) => {
    //         if (!acc) {
    //             res.sendStatus(404);
    //         } else {
    //             if (newpwd != ''&& newusername !=''){
    //                 acc.pwd = newpwd;
    //                 acc.username=newusername;
    //                 console.log("change the pwd and username in Account db");
    //                 acc.save();
    //             }
    //             else if(newpwd != ''){
    //                 acc.pwd = newpwd;
    //                 console.log("change the pwd in Account db");
    //                 acc.save();
    //             }
    //             else if(newusername != ''){
    //                 acc.username = newusername;
    //                 console.log("change the username in Account db");
    //                 acc.save();
    //             }
    //         }
    //         User.findOne({ username: oldusername }).then((user) => {
    //         if (!user) {
    //             res.sendStatus(404);
    //         } else if(newusername !=''){
    //             user.username=newusername;
    //             console.log("change the username in User db");
    //             user.save();
    //             res.sendStatus(200);
    //         }
    //         else{
    //             res.sendStatus(200);
    //         }
    //     }).catch((err)=>{
    //        res.send(err); 
    //         });
    //     });
    // });

    //get all the accounts for testing
    app.get('/acc', (req, res) => {
        res.set('Content-Type', 'text/plain');
        Account.find().then((users) => {
            console.log(users);
            res.send(users);
        }).catch((err) => {
            res.send(err);
        });
    });

    //delete an account for testing
    app.delete('/acc/:username', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let username = req.params['username'];
        Account.deleteOne({username:username}).then((acc)=>{
            console.log("Successfully delete user " + username);
            res.status(204).send("Successfully delete user " + username);
        }).catch((err)=>{
            res.send(err);
        });
    });
    

    /* -------------------------------------------------------------- */
    /* ------------------------Search JIANG Hongxu------------------------*/
    /* ---------------------------------------------------------------*/
    //search for users (whose username contains the keywords)
    app.get('/searchuser/:username', (req, res) => {
        res.set('Content-Type', 'text/plain');
        User.find({ 'username': {$regex:req.params['username']} }).then((user) => {
            if(!user){
                res.sendStatus(404);
            }
            else{
                console.log(user);
                res.send(user);
            }
            }).catch((err) => {
                res.send(err);
            });
        })
    //search for tweets whose tags contain the tag.    
    app.get('/searchtag/:tag', (req, res) => {
        res.set('Content-Type', 'text/plain');
        Tweet.find({ 'tags': {$all:['#'+req.params['tag']]} }).populate('poster').exec().then((tweet) => {
            if(!tweet){
                console.log("no such tweet");
                res.sendStatus(404);
            }
            else{
                console.log(tweet);
                res.send(tweet);
            }
            }).catch((err) => {
                res.send(err);
            });
        })

    // get the first 10 tags which are contained most in the tweets
    app.get('/search/trend', (req, res) => {
         res.set('Content-Type', 'text/plain');
            Tag.aggregate([
                {$project:{"tag":"$tag",cnt:{$size:'$tid'}}},
                {$sort:{cnt:-1}},
                {$limit:10}]).then((tweets)=>{
                    if(!tweets){
                        console.log("no tags");
                        res,send(404);
                    }
                    else{
                        console.log(tweets);
                        res.send(tweets)
                    }
                }).catch((err)=>{
                    res.send(err);
                })
        }) 
    //create a tag for testing
    app.get('/test/createtag', (req, res) => {
        var t1 = new mongoose.Types.ObjectId();
        var t2 = new mongoose.Types.ObjectId();
        Tag.create({
            tag: "tag3",
            tid:[t1]
            }).then(() => {
                res.sendStatus(200);
            }).catch((err) => {
                console.error(err);
            });
        });  
        //get all the tags in tag db for testing
        app.get('/tag', (req, res) => {
            res.set('Content-Type', 'text/plain');
            Tag.find().then((users) => {
                console.log(users);
                res.send(users);
            }).catch((err) => {
                res.send(err);
            });
        });
        
    
        
});
const server = app.listen(8000);
