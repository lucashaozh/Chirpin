const express = require('express');
const app = express();

// const cors = require('cors'); app.use(cors());

// const bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({ extended: false }));

// app.use(express.json());

const mongoose = require('mongoose');
// const send = require('express/lib/response');

mongoose.connect('mongodb+srv://csci3100e1:csci3100e1@chirpin.pjvjlns.mongodb.net/Chirpin?authMechanism=DEFAULT');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function () {
    console.log("Connection is open...");

    const AccountSchema = mongoose.Schema({
        uid: { type: Number, required: true, unique: true },
        username: { type: String, required: true, unique: true, minlength: 4, maxlength: 20 },
        pwd: { type: String, required: true },
        identity: { type: String, required: true }
    });

    const TweetSchema = mongoose.Schema({
        tid: { type: Number, required: true, unique: true },
        username: { type: String, required: true },
        tweet_content: { type: String, required: true },
        tag: [{ type: String, required: true }],
        comment: [{
            username: { type: String, required: true },
            content: { type: String, required: true },
            floor: { type: Number, required: true},
            time: { type: Date, required: true }
        }],
        parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' },
        like: [{
            time: { type: Date, required: true },
            username: { type: String, required: true },
        }],
        dislike_counter: { type: Number, required: true },
        report_counter: { type: Number,  required: true },
        retweet: [{
            time: { type: Date, required: true },
            username: { type: String, required: true }
        }],
        post_time: { type: Date }
    });

    const UserSchema = mongoose.Schema({
        uid: { type: Number, required: true, unique: true },
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
        report_counter: { type: Number, required: true},
        tweet_liked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
        tweet_disliked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
        portrait: { type: String, required: true }
    });

    const NotificationSchema = mongoose.Schema({
        uid: { type: String, required: true }, //who is receiving this notifications
        actor_id: { type: int, required: true }, // who is sending this notification
        action: { type: String, required: true }, // follow, like, comment, retweet
        tid: { type: int, required: false }, // which tweet is involved, null for follow action
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
            username: "user_02",
            pwd: "123456",
            identity: "user"
        }).then((user) => {
            User.create({
                uid: user.uid,
                username: user.username,
                gender: "Female",
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
            username: "user_01",
            tweet_content: 'This is just for test. This is just for test. This is just for test. This is just for test. This is just for test.',
            tag: ["#tag1", "#tag2", "#tag3"],
            comment: [],
            like: [],
            dislike_counter: 12,
            report_counter: 4,
            tweet_liked: [],
            tweet_disliked: [],
            portrait: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
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
/* ------------------------Write Your Part------------------------*/
/* ---------------------------------------------------------------*/

});

const server = app.listen(8000);
