import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import Blob from 'fetch-blob';
import path from 'path';
import fetch from 'node-fetch';
import mongoose from 'mongoose';
import { ObjectId } from "mongodb";

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));
app.use(express.json());

console.log("Connecting to MongoDB...");
mongoose.connect('mongodb+srv://csci3100e1:csci3100e1@chirpin.pjvjlns.mongodb.net/Chirpin?authMechanism=DEFAULT');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function () {
    console.log("Connection is open...");

    const AccountSchema = mongoose.Schema({
        username: { type: String, required: true, unique: true, minlength: 4, maxlength: 20 },
        pwd: { type: String, required: true },
        identity: { type: String, required: true }
    });

    const TweetSchema = mongoose.Schema({
        poster: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        tweet_content: { type: String },
        tags: [{ type: String, required: true }],
        comments: [{
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            portrait: { type: String },
            content: { type: String },
            floor: { type: Number },
            time: { type: Date }
        }],
        parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' },
        likes: [{
            time: { type: Date, required: true },
            username: { type: String, required: true },
        }],
        dislike_counter: { type: Number, required: true },
        report_counter: { type: Number, required: true },
        retweets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
        post_time: { type: Date, required: true },
        private: { type: Boolean, required: true },
    });

    const UserSchema = mongoose.Schema({
        username: { type: String, required: true, unique: true, minlength: 4, maxlength: 20 },
        gender: { type: String },
        interests: [{ type: String }],
        about: { type: String },
        follower_counter: { type: Number },
        following_counter: { type: Number },
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
        username: { type: String, required: true }, //who is receiving this notifications
        actor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // who is sending this notification
        action: { type: String, required: true }, // follow, like, comment, retweet
        tid: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }, // which tweet is involved, null for follow action
        time: { type: Date, required: true }
    });

    const TagSchema = mongoose.Schema({
        tag: { type: String, required: true, unique: true },
        tid: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }] // the tweets that contain the tag
    });

    const messageSchema = new mongoose.Schema({
        from: { type: String, required: true },
        to: { type: String, required: true },
        content: { type: String, required: true },
        time: { type: Date, default: Date.now }
    });

    const Account = mongoose.model('Account', AccountSchema);
    const Tweet = mongoose.model('Tweet', TweetSchema);
    const User = mongoose.model('User', UserSchema);
    const Notification = mongoose.model('Notification', NotificationSchema);
    const Tag = mongoose.model('Tag', TagSchema);
    const Message = mongoose.model('Message', messageSchema);

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
        Account.create({
            username: "Hongxu",
            pwd: "123456",
            identity: "user"
        }).then((user) => {
            User.create({
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
        Notification.create({
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
            let userObj = null;
            if (user != null && user != '') {
                userObj = {
                    'uid': user['_id'],
                    'username': user['username'],
                    'gender': user['gender'],
                    'interests': user['interests'],
                    'follower_counter': user['followers'].length,
                    'following_counter': user['followings'].length,
                    'about': user['about'],
                    'portrait': user['portrait']
                }
            }
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

    // get followings (user mode)
    app.get('/profile/:self/:target/followings', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let self = req.params['self'];
        let target = req.params['target'];
        User.findOne({ 'username': self }).then((self) => {
            User.findOne({ 'username': target }).populate('followings').exec().then((user) => {
                let retUsers = []
                user.followings.forEach(innerUser => {
                    let isFollowing = false;
                    if (innerUser.followers.includes(self._id)) {
                        isFollowing = true;
                    }
                    let userObj = {
                        "username": innerUser['username'],
                        "uid": innerUser['_id'],
                        "following": innerUser['followings'].length,
                        "follower": innerUser['followers'].length,
                        "isFollowing": isFollowing,
                        "portraitUrl": innerUser['portrait']
                    };
                    retUsers.push(userObj);
                });
                res.send(retUsers);
            }).catch((err) => {
                console.log(err);
                res.send(err);
            });
        });
    });

    // get followings (admin mode)
    app.get('/profile/:target/followings', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let target = req.params['target'];
        User.findOne({ 'username': target }).populate('followings').exec().then((user) => {
            let retUsers = []
            user.followings.forEach(innerUser => {
                let userObj = {
                    "username": innerUser['username'],
                    "uid": innerUser['_id'],
                    "following": innerUser['followings'].length,
                    "follower": innerUser['followers'].length,
                    "isFollowing": false,
                    "portraitUrl": innerUser['portrait']
                };
                retUsers.push(userObj);
            });
            res.send(retUsers);
        }).catch((err) => {
            console.log(err);
            res.send(err);
        });
    });

    // get followers (user mode)
    app.get('/profile/:self/:target/followers', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let self = req.params['self'];
        let target = req.params['target'];
        User.findOne({ 'username': self }).then((self) => {
            User.findOne({ 'username': target }).populate('followers').exec().then((user) => {
                let retUsers = []
                user.followers.forEach(innerUser => {
                    let isFollowing = false;
                    if (innerUser.followers.includes(self._id)) {
                        isFollowing = true;
                    }
                    let userObj = {
                        "username": innerUser['username'],
                        "uid": innerUser['_id'],
                        "following": innerUser['followings'].length,
                        "follower": innerUser['followers'].length,
                        "isFollowing": isFollowing,
                        "portraitUrl": innerUser['portrait']
                    };
                    retUsers.push(userObj);
                });
                res.send(retUsers);
            }).catch((err) => {
                console.log(err);
                res.send(err);
            });
        });
    });

    // get followers (admin mode)
    app.get('/profile/:target/followers', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let target = req.params['target'];
        User.findOne({ 'username': target }).populate('followers').exec().then((user) => {
            let retUsers = []
            user.followers.forEach(innerUser => {
                let userObj = {
                    "username": innerUser['username'],
                    "uid": innerUser['_id'],
                    "following": innerUser['followings'].length,
                    "follower": innerUser['followers'].length,
                    "isFollowing": false,
                    "portraitUrl": innerUser['portrait']
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
            let userObj = {
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
                    // console.log(noteobj._id);
                    Notification.updateOne({ nid: noteobj.nid }, { $push: { notification: noteobj._id } }).then(c => {
                        console.log(c);
                    });
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

    // get tweets posted (user mode)
    app.get('/profile/:self/:target/tweets', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let self_ = req.params['self'];
        let target = req.params['target'];
        let retTweets = [];
        if (self_ != null && self_ != '' && self_ == target) {
            User.findOne({ 'username': self_ }).populate({ path: 'tweets' }).exec().then((self) => {
                console.log('self found');
                self.tweets.forEach(tweet => {
                    let isReported = false;
                    let isLiked = false;
                    let isDisliked = false;
                    if (self.tweets_liked.includes(tweet._id)) {
                        isLiked = true;
                    }
                    if (self.tweets_disliked.includes(tweet._id)) {
                        isDisliked = true;
                    }
                    if (self.tweets_reported.includes(tweet._id)) {
                        isReported = true;
                    }
                    let tweetObj = {
                        "tid": tweet['_id'],
                        "likeInfo": { "likeCount": tweet['likes'].length, "bLikeByUser": isLiked },
                        "dislikeInfo": { "dislikeCount": tweet['dislike_counter'], "bDislikeByUser": isDisliked },
                        "user": { "uid": self['_id'], 'username': self['username'] },
                        "content": tweet.tweet_content,
                        "commentCount": tweet['comments'].length,
                        "retweetCount": tweet['retweets'].length,
                        "isReported": isReported,
                        "time": tweet['post_time'],
                        "portraitUrl": self['portrait'],
                        "tags": tweet['tags'],
                        'private': tweet['private']
                    }
                    retTweets.push(tweetObj);
                    console.log(tweetObj)
                });

                console.log('get self tweets success')
                return res.status(200).send(retTweets);
            }).catch((err) => {
                return res.send(err);
            })
        }
        else if (self_ != null && self_ != '' && self_ != target) {
            User.findOne({ 'username': target }).populate({ path: 'tweets', match: { 'private': 'false' } }).exec().then((user) => {
                user.tweets.forEach(tweet => {
                    let isReported = false;
                    let isLiked = false;
                    let isDisliked = false;
                    if (user.tweets_liked.includes(tweet._id)) {
                        isLiked = true;
                    }
                    if (user.tweets_disliked.includes(tweet._id)) {
                        isDisliked = true;
                    }
                    if (user.tweets_reported.includes(tweet._id)) {
                        isReported = true;
                    }
                    let tweetObj = {
                        "tid": tweet['_id'],
                        "likeInfo": { "likeCount": tweet['likes'].length, "bLikeByUser": isLiked },
                        "dislikeInfo": { "dislikeCount": tweet['dislike_counter'], "bDislikeByUser": isDisliked },
                        "user": { "uid": user['_id'], 'username': user['username'] },
                        "content": tweet.tweet_content,
                        "commentCount": tweet['comments'].length,
                        "retweetCount": tweet['retweets'].length,
                        "isReported": isReported,
                        "time": tweet['post_time'],
                        "portraitUrl": user['portrait'],
                        "tags": tweet['tags'],
                        'private': tweet['private']
                    }
                    retTweets.push(tweetObj);
                });
                console.log('get other tweets success')
                return res.status(200).send(retTweets);
            }).catch((err) => {
                return res.send(err);
            })
        }
    });

    // get tweets posted (admin mode)
    app.get('/profile/:target/tweets', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let target = req.params['target'];
        User.findOne({ 'username': target }).populate('tweets').exec().then((user) => {
            let retTweets = [];
            if (user != null && user != '') {
                user.tweets.forEach(tweet => {
                    let tweetObj = {
                        "tid": tweet['_id'],
                        "likeInfo": { "likeCount": tweet['likes'].length, "bLikeByUser": false },
                        "dislikeInfo": { "dislikeCount": tweet['dislike_counter'], "bDislikeByUser": false },
                        "user": { "uid": user['_id'], 'username': user['username'] },
                        "content": tweet.tweet_content,
                        "commentCount": tweet['comments'].length,
                        "retweetCount": tweet['retweets'].length,
                        "isReported": false,
                        "time": tweet['post_time'],
                        "portraitUrl": user['portrait'],
                        "tags": tweet['tags']
                    }
                    retTweets.push(tweetObj);
                });
                res.send(retTweets);
            }
        }).catch((err) => {
            console.log(err);
            res.send(err);
        });
    });

    // get tweets liked
    app.get('/profile/:username/likes', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let username = req.params['username'];
        User.findOne({ 'username': username }).populate({ path: 'tweets_liked', populate: { path: 'poster' } }).exec().then((user) => {
            let retLikes = []
            user.tweets_liked.forEach(tweet => {
                if (tweet['poster'] == null) {
                    console.log("Warning: tweet with id " + tweet['_id'] + " has no poster");
                    return;
                }
                let isReported = false;
                if (user.tweets_reported.includes(tweet._id)) {
                    isReported = true;
                }
                let tweetObj = {
                    "tid": tweet['_id'],
                    "likeInfo": { "likeCount": tweet['likes'].length, "bLikeByUser": true },
                    "dislikeInfo": { "dislikeCount": tweet['dislike_counter'], "bDislikeByUser": false },
                    "user": { "uid": tweet['poster']['_id'], 'username': tweet['poster']['username'] },
                    "content": tweet.tweet_content,
                    "commentCount": tweet['comments'].length,
                    "retweetCount": tweet['retweets'].length,
                    "isReported": isReported,
                    "time": tweet['post_time'],
                    "portraitUrl": tweet['poster']['portrait'],
                    "tags": tweet['tags']
                }
                // console.log(tweetObj);
                retLikes.push(tweetObj);
            });
            // sort according to the post time
            retLikes.sort((a, b) => {
                let time1 = new Date(a.time);
                let time2 = new Date(b.time);
                return time2 - time1;
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
            res.send(tweets);
        }).catch((err) => {
            res.send(err);
        });
    });


    // get all users
    app.get('/users', (req, res) => {
        res.set('Content-Type', 'text/plain');
        User.find().then((users) => {
            res.send(users);
        }).catch((err) => {
            res.send(err);
        });
    });

    // get all users except for current user
    app.get('/users/:username', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let username = req.params['username'];
        User.find({ 'username': { $ne: username } }).then((users) => {
            User.findOne({ 'username': username }).then((currUser) => {
                let retUsers = users.map(user => {
                    return {
                        "username": user['username'],
                        "uid": user['_id'],
                        "following": user['followings'].length,
                        "follower": user['followers'].length,
                        "isFollowing": currUser['followings'].includes(user['_id']),
                        "portraitUrl": user['portrait']
                    }
                });
                retUsers = retUsers.filter(user => {
                    return user.isFollowing === false;
                });
                console.log("Get recommended users");
                res.status(200).send(retUsers);
            });
        }).catch((err) => {
            res.status(404).send(err);
        });
    });

    // get recommended tweets for the user
    app.get('/tweets/:username', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let username = req.params['username'];
        // find all the tweets except for the user's tweets
        // sort tweets by post time (newest first)
        Tweet.find({ 'private': 'false' }).sort({ post_time: 'desc' }).populate(
            { path: "poster", model: "User", select: "username portrait" }).then((tweets) => {
                tweets = tweets.filter((tweet) => {
                    return tweet.poster != null && tweet.poster.username !== username;
                });
                User.findOne({ "username": username }).then((user) => {
                    let retTweets = tweets.map(tweet => {
                        return {
                            "tid": tweet['_id'],
                            "likeInfo": { "likeCount": tweet['likes'].length, "bLikeByUser": user['tweets_liked'].includes(tweet['_id']) },
                            "dislikeInfo": { "dislikeCount": tweet['dislike_counter'], "bDislikeByUser": user['tweets_disliked'].includes(tweet['_id']) },
                            "isReported": user['tweets_reported'].includes(tweet['_id']),
                            "user": { "uid": tweet['poster']['_id'], 'username': tweet['poster']['username'] },
                            "content": tweet.tweet_content,
                            "commentCount": tweet['comments'].length,
                            "retweetCount": tweet['retweets'].length,
                            "time": tweet['post_time'],
                            "portraitUrl": tweet['poster']['portrait'],
                            "tags": tweet['tags'],
                            "private": tweet['private']
                        }
                    });
                    console.log("---Get recommended tweets---");
                    res.status(200).send(retTweets);
                });
            }).catch((err) => {
                console.log("---Recommended tweets error---");
                console.log(err);
                return res.status(404).send(err);
            });
    });

    // get all the followings' tweets of the user
    app.get('/followings/:username', (req, res) => {
        res.set('Content-Type', 'text/plain');
        // consecutive populate: first find the user, then populate the following field, then populate the tweet field
        User.findOne({ 'username': req.params['username'] })
            .populate({
                path: 'followings',
                populate: {
                    path: 'tweets',
                    model: 'Tweet',
                    match: { 'private': 'false' },
                    populate: {
                        path: 'poster',
                        model: 'User',
                        select: 'username portrait'
                    }
                }
            }).exec().then((user) => {
                let following = user.followings;
                let tweets = [];
                for (let i = 0; i < following.length; i++) {
                    if (following[i].tweets) {
                        tweets = [...tweets, ...following[i].tweets];
                    }
                }
                let tweetsInfo = tweets.map((tweet) => {
                    return {
                        "tid": tweet['_id'],
                        "likeInfo": { "likeCount": tweet['likes'].length, "bLikeByUser": user.tweets_liked.includes(tweet['_id']) },
                        "dislikeInfo": { "dislikeCount": tweet['dislike_counter'], "bDislikeByUser": user.tweets_disliked.includes(tweet['_id']) },
                        "isReported": user.tweets_reported.includes(tweet['_id']),
                        "user": { "uid": tweet['poster']['_id'], 'username': tweet['poster']['username'] },
                        "content": tweet['tweet_content'],
                        "commentCount": tweet['comments'].length,
                        "retweetCount": tweet['retweets'].length,
                        "time": tweet['post_time'],
                        "portraitUrl": tweet['poster']['portrait'],
                        "tags": tweet['tags'],
                        "private": tweet['private']
                    }
                });
                // sort tweets by post time (newest first)
                tweetsInfo.sort((a, b) => {
                    // convert time to date
                    let time1 = new Date(a.time);
                    let time2 = new Date(b.time);
                    return time2 - time1;
                });
                console.log("----Get Followings Tweets------");
                return res.status(200).send(tweetsInfo);
            }).catch((err) => {
                console.log("---Followings Tweets Error---");
                console.log(err);
                res.status(404).send(err);
            });
    });


    app.post('/new-tweet', (req, res) => {
        res.set('Content-Type', 'text/plain');
        // find the user
        User.findOne({ 'username': req.body['username'] }).then((user) => {
            if (!user) { return res.send('User does not exist').status(404); }
            console.log(req.body);
            let uid = user._id;
            // create a new tweet
            let time = new Date();
            let tweet = {
                poster: uid,
                tweet_content: req.body.tweet_content,
                tags: req.body.tags,
                dislike_counter: 0,
                report_counter: 0,
                post_time: time,
                likes: [],
                comments: [],
                retweets: [],
                private: req.body.private
            }

            // find all the tags in the tweet
            let tags = req.body.tags;
            Tag.find({ 'tag': { $in: tags } }).then((tagList) => {
                Tweet.create(tweet).then((tweet) => {
                    // add the tweet to the user's tweets
                    // for each tag, add the tweet to the tag's tweets
                    user.tweets.push(tweet._id);
                    tagList.forEach((tag) => {
                        tag.tid.push(tweet._id);
                        tag.save();
                    });
                    console.log("Save tweet to tags");
                    user.save();
                    return res.sendStatus(201);
                }).catch((err) => {
                    return res.status().send(err);
                });
            }).catch((err) => {
                console.log(err);
                return res.status(400).send(err);
            });


        });
    });

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
                let ret = {
                    "likeInfo": { "likeCount": tweet.likes.length, "bLikeByUser": user.tweets_liked.includes(tweet._id) },
                    "dislikeInfo": { "dislikeCount": tweet.dislike_counter, "bDislikeByUser": user.tweets_disliked.includes(tweet._id) }
                }
                user.save();
                tweet.save();
                Notification.create({
                    username: tweet.poster.username,
                    actor_id: user._id,
                    action: "like",
                    tid: tweet._id,
                    time: new Date()
                }).then((noteobj) => {
                    Notification.updateOne({ nid: noteobj.nid }, { $push: { notification: noteobj._id } }).then(c => {
                        console.log(c);
                    });
                });
                console.log("Like successfully");
                return res.status(201).send(ret);
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
                let ret = {
                    "likeInfo": { "likeCount": tweet.likes.length, "bLikeByUser": user.tweets_liked.includes(tweet._id) },
                    "dislikeInfo": { "dislikeCount": tweet.dislike_counter, "bDislikeByUser": user.tweets_disliked.includes(tweet._id) }
                }
                user.save();
                tweet.save();
                console.log("Cancel like successfully");
                return res.status(201).send(ret);
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
                let ret = {
                    "likeInfo": { "likeCount": tweet.likes.length, "bLikeByUser": user.tweets_liked.includes(tweet._id) },
                    "dislikeInfo": { "dislikeCount": tweet.dislike_counter, "bDislikeByUser": user.tweets_disliked.includes(tweet._id) }
                }
                user.save();
                tweet.save();
                console.log("Dislike successfully");
                return res.status(201).send(ret);
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
                let ret = {
                    "likeInfo": { "likeCount": tweet.likes.length, "bLikeByUser": user.tweets_liked.includes(tweet._id) },
                    "dislikeInfo": { "dislikeCount": tweet.dislike_counter, "bDislikeByUser": user.tweets_disliked.includes(tweet._id) }
                }
                console.log("Cancel dislike successfully");
                return res.status(201).send(ret);
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
                console.log(username + " report " + tid + " successfully");
                return res.status(201).send('Report successfully');
            });
        }).catch((err) => {
            console.log("-----Report Error--------");
            console.log(err);
            return res.status(500).send(err);
        });
    });

    // get all the tags
    app.get('/tags', (req, res) => {
        res.set('Content-Type', 'text/plain');
        Tag.find().then((tags) => {
            return res.status(200).send(tags);
        }).catch((err) => {
            console.log(err);
            return res.status(404).send(err);
        });
    });

    // check if the tag exists
    app.get('/tag/:tagname', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let tagname = req.params['tagname'];
        Tag.find({ 'tag': tagname }).then((tag) => {
            if (tag.length == 0) {
                return res.status(404).send('Tag does not exist');

            }
            return res.status(200).send('Tag exists');
        }).catch((err) => {
            console.log(err);
        });
    });


    // create new tag
    app.post('/new-tag', (req, res) => {
        res.set('Content-Type', 'text/plain');
        Tag.create(req.body).then((tag) => {
            return res.status(201).send(tag);
        }).catch((err) => {
            // check if it is the duplicate key error
            if (err.code == 11000) {
                return res.status(400).send('Tag already exists');
            } else {
                console.log(err);
                return res.status(400).send(err);
            }
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
            else { console.log('User found') }
            Tweet.findById(tid).populate('poster').exec().then((tweet) => {
                if (!tweet) { return res.send('Tweet does not exist').status(404); }
                console.log(tweet);
                let time = new Date();
                let floor_num;
                if (tweet.comments == null) { tweet.comments = []; floor_num = 1; }
                else { floor_num = tweet.comments.length + 1; }
                // get user info
                let new_comment = {
                    user: user._id,
                    portrait: user.portrait,
                    content: req.body.content,
                    time: time,
                    floor: floor_num
                };
                let new_comment_res = {
                    username: user.username,
                    portrait: user.portrait,
                    content: req.body.content,
                    time: time,
                    floor: floor_num
                };
                console.log(new_comment)
                tweet.comments.push(new_comment);
                tweet.save();
                Notification.create({
                    username: tweet.poster.username,
                    actor_id: user._id,
                    action: "comment",
                    tid: tweet._id,
                    time: new Date()
                }).then((noteobj) => {
                    console.log(noteobj._id);
                    Notification.updateOne({ nid: noteobj.nid }, { $push: { notification: noteobj._id } }).then(c => {
                        console.log(c);
                    });
                });
                console.log("comment successfully");
                return res.status(201).send(JSON.stringify(new_comment_res));
            });
        }).catch((err) => {
            console.log("-----Comment Error--------");
            console.log(err);
            return res.status(500).send(err);
        });
    });

    //get detail tweet
    app.get('/fetchtweet/:tid/:username', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let tid = req.params['tid'];
        console.log(tid);
        Tweet.findById(tid).populate('poster').exec().then((tweet) => {
            if (!tweet) { return res.send('Tweet does not exist').status(404); }
            console.log('tweet found');
            User.findOne({ 'username': req.params['username'] }).then((user) => {
                if (!user) { return res.send('User does not exist').status(404); }
                else { console.log('User found') }
                let tweet_info = {
                    tid: tweet._id,
                    likeInfo: { likeCount: tweet.likes.length, bLikeByUser: user.tweets_liked.includes(tweet._id) },
                    dislikeInfo: { dislikeCount: tweet.dislike_counter, bDislikeByUser: user.tweets_disliked.includes(tweet._id) },
                    user: { uid: tweet.poster._id, username: tweet.poster.username },
                    content: tweet.tweet_content,
                    commentCount: tweet.comments.length,
                    retweetCount: tweet.retweets.length,
                    time: tweet.post_time,
                    portraitUrl: tweet.poster.portrait,
                    tags: tweet.tags,
                }
                console.log('get tweet successfully');
                console.log(tweet_info)
                return res.status(201).send(JSON.stringify(tweet_info));
            });
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
        Tweet.findById(tid).populate({ path: 'comments', populate: { path: "user" } }).exec().then((tweet) => {
            if (!tweet) { return res.send('Tweet does not exist').status(404); }
            let comment_list = tweet.comments;
            let comments_res = [];
            comment_list.forEach((comment) => {
                let comment_tmp = {
                    username: comment.user.username,
                    portrait: comment.user.portrait,
                    content: comment.content,
                    time: comment.time,
                    floor: comment.floor
                };
                comments_res.push(comment_tmp);
            });
            console.log(comments_res);
            console.log('get comment successfully');
            res.send(comments_res);
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
        let floor_reply = req.body.floor_reply;
        Tweet.findById(tid).populate('poster').populate({ path: 'comments', populate: { path: 'user' } }).exec().then((tweet) => {
            if (!tweet) { return res.send('Tweet does not exist').status(404); }
            let floor_num = tweet.comments.length + 1;
            let time = new Date();
            User.findOne({ 'username': username }).then((user) => {
                if (!user) { return res.send('User does not exist').status(404); }
                let content = "Re Floor " + floor_reply + ": " + req.body.content;
                let new_reply = {
                    user: user._id,
                    portrait: user.portrait,
                    content: content,
                    time: time,
                    floor: floor_num
                }
                tweet.comments.push(new_reply);
                let new_reply_res ={
                    username: user.username,
                    portrait: user.portrait,
                    content: content,
                    time: time,
                    floor: floor_num
                }
                tweet.save();
                Notification.create({
                    username: tweet.poster.username,
                    actor_id: user._id,
                    action: "comment",
                    tid: tweet._id,
                    time: new Date()
                }).then((noteobj) => {
                    console.log(noteobj._id);
                    Notification.updateOne({ nid: noteobj.nid }, { $push: { notification: noteobj._id } }).then(c => {
                        console.log(c);
                    });
                });
                Notification.create({
                    username: tweet.comments[floor_reply - 1].user._id,
                    actor_id: user._id,
                    action: "reply",
                    tid: tweet._id,
                    time: new Date()
                }).then((noteobj) => {
                    console.log(noteobj._id);
                    Notification.updateOne({ nid: noteobj.nid }, { $push: { notification: noteobj._id } }).then(c => {
                        console.log(c);
                    });
                });
                console.log(new_reply)
                console.log("reply successfully");
                return res.status(201).send(JSON.stringify(new_reply_res));
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
            console.log('user found')
            Tweet.findById(parent_tid).populate('poster').exec().then((tweet) => {
                // create a new tweet
                let time = new Date();
                let new_tweet = {
                    poster: user._id,
                    tweet_content: req.body.tweet_content + " RT @" + tweet.poster.username + ": " + tweet.tweet_content,
                    tags: req.body.tags,
                    dislike_counter: 0,
                    report_counter: 0,
                    post_time: time,
                    likes: [],
                    comments: [],
                    retweets: [],
                    private: req.body.private,
                }

                Tweet.create(new_tweet).then((new_tweet_) => {
                    console.log(new_tweet_);
                    // update the user
                    user.tweets.push(new_tweet_._id);
                    user.save();
                    // update the parent tweet
                    tweet.retweets.push(new_tweet_._id);
                    tweet.save();
                    // create a notification
                    Notification.create({
                        username: tweet.poster.username,
                        actor_id: user._id,
                        action: "retweet",
                        tid: parent_tid,
                        time: new Date()
                    }).then((noteobj) => {
                        console.log(noteobj._id);
                        Notification.updateOne({ nid: noteobj.nid }, { $push: { notification: noteobj._id } }).then(c => {
                            console.log(c);
                        });
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
        res.set('Content-Type', 'text/plain');
        Notification.find({ 'username': req.params['username'] }).sort({ 'time': -1 }).populate('actor_id').populate('tid').exec().then((notes) => {
            console.log('notifications found');
            let notification_list = [];
            notes.forEach(note => {
                if (note.action != 'follow') {
                    let content_len = note.tid.tweet_content.length > 30 ? 30 : note.tid.tweet_content.length;
                    let notification = {
                        "icon": note.action,
                        "tid": note.tid._id,
                        "action": note.action,
                        "name": note.actor_id.username,
                        "portrait": note.actor_id.portrait,
                        "time": note.time,
                        "content": note.tid.tweet_content.slice(0, content_len),
                    }
                    notification_list.push(notification);
                }
                else {
                    let notification = {
                        "icon": note.action,
                        "tid": null,
                        "action": note.action,
                        "name": note.actor_id.username,
                        "portrait": note.actor_id.portrait,
                        "time": note.time,
                        "content": null
                    }
                    notification_list.push(notification);
                }
                console.log(notification_list);
            });
            console.log(notification_list);
            res.status(201).send(JSON.stringify(notification_list));
        }).catch((err) => {
            console.log("-----Get Notification Error--------");
            console.log(err);
            return res.status(500).send(err);
        })
    });



    /* -------------------------------------------------------------- */
    /* ----------User/admin Operation JIANG Hongxu--------------------*/
    /* ---------------------------------------------------------------*/

    //create a user by signing up or admin adding
    app.post('/createuser', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let _username = req.body['username'];
        Account.findOne({ username: _username }).then((acc) => {
            if (acc) { console.log(acc); return res.status(201).send("The username has already been used. Please change a username."); }
            else {
                Account.create({
                    username: req.body['newusername'],
                    pwd: req.body['newpwd'],
                    identity: 'user'
                }).then((acc) => {
                    // read default image from file "/img/maleAvatar.png"
                    let default_portrait = fs.readFileSync("./img/maleAvatar.png");
                    // convert binary data to blob data
                    let base64String = Buffer.from(default_portrait).toString('base64');
                    base64String = "data:image/png;base64," + base64String;
                    console.log(base64String);
                    let user = {
                        username: req.body['newusername'],
                        gender: '',
                        interest: [],
                        about: '',
                        follower_counter: 0,
                        following_counter: 0,
                        tweets: [],
                        follows: [],
                        followings: [],
                        tweets_reported: [],
                        users_reported: [],
                        users_blocked: [],
                        report_counter: 0,
                        tweets_liked: [],
                        tweets_disliked: [],
                        portrait: base64String
                    }
                    User.create(user).then((user) => {
                        console.log(user);
                        res.status(201).send("User created successfully");
                    })
                }).catch((err) => {
                    if (err.code == 11000) {
                        return res.status(201).send("The username has already existed. Please change a username.");
                    }
                    console.log(err);
                    return res.status(400).send(err);
                });
            }
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
            else {
                if (val.identity == 'user') {
                    if (val != null && _pwd == val.pwd) {
                        res.status(201).send('Login As User Successfully!\n');
                    }
                    else {
                        console.log("incorrect");
                        res.status(404).send("Incorrect Username or Password.\n");
                    }
                }
                if (val.identity == 'admin') {
                    if (val != null && _pwd == val.pwd) {
                        res.status(200).send('Login As Admin Successfully!\n');
                    }
                    else {
                        res.status(404).send("Incorrect Username or Password.\n");
                    }
                }
            }
        }).catch((err) => {
            res.send(err);
        });
    });


    //change pwd by user
    app.put('/changepwd', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let username = req.body.username;
        let newpwd = req.body.newpwd;
        let oldpwd = req.body.oldpwd;
        console.log("newpwd:" + newpwd);
        Account.findOne({ username: username }).then((acc) => {
            if (!acc) {
                console.log(username);
                res.sendStatus(404);
            }
            else if (newpwd != '') {
                if (oldpwd != acc.pwd) {
                    console.log("o:" + oldpwd);
                    console.log("acc:" + acc.pwd);
                    res.send("The old password is incorrect!").status(404);
                }
                else {
                    console.log(3);
                    acc.pwd = newpwd;
                    acc.save();
                    res.send("Update Successfully!").status(200);
                }

            }
            else {
                return res.send('Please input a valid new password.').status(404);
            }
        }).catch((err) => {
            res.send(err);
        });
    });

    //change pwd by admin
    app.put('/adminchangepwd', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let username = req.body.username;
        let newpwd = req.body.newpwd;
        console.log(username);
        Account.findOne({ username: username }).then((acc) => {
            if (!acc) {
                console.log(1);
                return res.send("No such user.").status(404);
            }
            else if (newpwd != '') {
                console.log(newpwd);
                acc.pwd = newpwd;
                acc.save();
                return res.send("Update Successfully!").status(200);
            }
            else {
                return res.send('Please input a valid new password.').status(404);
            }
        }).catch((err) => {
            res.send(err);
        });
    });

    //delete a user
    app.delete('/user/:username', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let username = req.params['username'];
        Account.deleteOne({ username: username }).then((acc) => {
            if (!acc) { return res.send('User does not exist').status(404); }
            else {
                console.log("Successfully delete user " + username + "in Account db");
            }
            User.deleteOne({ username: username }).then((user) => {
                if (!user) { return res.send('User does not exist').status(404); }
                else {
                    console.log("Successfully delete user " + username + " in User db");
                }
                Tweet.deleteMany({ poster: user._id }).then((tweet) => {
                    console.log("delete tweet:" + tweet);
                    if (tweet) {
                        console.log("Successfully delete user " + username + "'s tweets");
                        return res.send("Successfully delete user " + username).status(204);
                    }
                    console.log(2);
                    return res.send("Successfully delete user " + username).status(204);
                })
            }).
                catch((err) => {
                    res.send(err);
                });
        });
    });

    //get all users and sort by report_counter
    app.get('/reportusers', (req, res) => {
        res.set('Content-Type', 'text/plain');
        User.find().sort({ "report_counter": -1 }).then((users) => {
            res.send(users);
        }).catch((err) => {
            res.send(err);
        });
    });

    /* -------------------------------------------------------------- */
    /* --------------------Search JIANG Hongxu------------------------*/
    /* ---------------------------------------------------------------*/

    //search for users (whose username contains the keywords)
    app.get('/searchuser/:selfname/:targetname', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let self = req.params['selfname'];
        let target = req.params['targetname'];
        User.findOne({ 'username': self }).then((self) => {
            User.find({ 'username': { $regex: target } }).then((user) => {
                let retUsers = [];
                user.forEach(innerUser => {
                    let isFollowing = false;
                    if (innerUser.followers.includes(self._id)) {
                        isFollowing = true;
                    }
                    let userObj = {
                        "username": innerUser['username'],
                        "uid": innerUser['_id'],
                        "following": innerUser['followings'].length,
                        "follower": innerUser['followers'].length,
                        "isFollowing": isFollowing,
                        "portraitUrl": innerUser['portrait']
                    };
                    retUsers.push(userObj);
                });
                res.send(retUsers);
            }).catch((err) => {
                console.log(err);
                res.send(err);
            });
        });
    });

    //search for users by uid
    app.get('/searchuserbyid/:selfname/:targetname', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let self = req.params['selfname'];
        let target = req.params['targetname'];
        var o_id = new ObjectId(target);
        console.log(target)
        User.findOne({ 'username': self }).then((self) => {
            User.find({ '_id': o_id }).then((user) => {
                console.log(user);
                let retUsers = [];
                user.forEach(innerUser => {
                    let isFollowing = false;
                    if (innerUser.followers.includes(self._id)) {
                        isFollowing = true;
                    }
                    let userObj = {
                        "username": innerUser['username'],
                        "uid": innerUser['_id'],
                        "following": innerUser['followings'].length,
                        "follower": innerUser['followers'].length,
                        "isFollowing": isFollowing,
                        "portraitUrl": innerUser['portrait']
                    };
                    retUsers.push(userObj);
                });
                res.send(retUsers);
            }).catch((err) => {
                console.log(err);
                res.send(err);
            });
        });
    });

    //search for tweets whose tags contain the tag.    
    app.get('/searchtag/:tag', (req, res) => {
        res.set('Content-Type', 'text/plain');
        Tweet.find({ 'tags': { $all: [req.params['tag']] }, private: 'false' }).populate('poster').exec().then((tweet) => {
            tweet = tweet.filter((tweet) => {
                return tweet.poster != null;
            });
            let obj = [];
            if (!tweet) {
                console.log("no such tweet");
                res.sendStatus(404);
            }
            else {
                tweet.forEach(tweet => {
                    let tweetObj = {
                        "tid": tweet['_id'],
                        "likeInfo": { "likeCount": tweet['likes'].length, "bLikeByUser": false },
                        "dislikeInfo": { "dislikeCount": tweet['dislike_counter'] },
                        "user": { "uid": tweet.poster['_id'], 'username': tweet.poster['username'] },
                        "content": tweet.tweet_content,
                        "commentCount": tweet['comments'].length,
                        "retweetCount": tweet['retweets'].length,
                        "time": tweet['post_time'],
                        "portraitUrl": tweet.poster['portrait'],
                        "tags": tweet['tags'],
                        'private': tweet['private']
                    }
                    obj.push(tweetObj);
                });
                console.log(obj);
                res.send(obj);
            }
        }).catch((err) => {
            res.send(err);
        });
    })

    // get the first 10 tags which are contained most in the tweets
    app.get('/search/trend', (req, res) => {
        res.set('Content-Type', 'text/plain');
        Tag.aggregate([
            { $project: { "tag": "$tag", cnt: { $size: '$tid' } } },
            { $sort: { cnt: -1 } },
            { $limit: 8 }]).then((tweets) => {
                if (!tweets) {
                    console.log("no tags");
                    res, send(404);
                }
                else {
                    console.log(tweets);
                    res.send(tweets)
                }
            }).catch((err) => {
                res.send(err);
            })
    })
    

    /* -------------------------------------------------------------- */
    /* ------------------------Chat DU Yunhao------------------------*/
    /* ---------------------------------------------------------------*/


    // define route for sending a private message
    app.post('/message', (req, res) => {
        // retrieve message data from request body
        const { from, to, content } = req.body;
        // create new message object
        const message = new Message({ from, to, content });
        // save message to database
        message.save((err) => {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            } else {
                res.sendStatus(200);
            }
        });
    });

    // define route for retrieving all messages between two users
    app.get('/messages', (req, res) => {
        // retrieve sender and recipient usernames from query parameters
        const { sender, recipient } = req.query;
        // find all messages between the two users
        Message.find({ $or: [{ from: sender, to: recipient }, { from: recipient, to: sender }] }, (err, messages) => {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            } else {
                res.send(messages);
            }
        });
    });

});
const server = app.listen(8000);
