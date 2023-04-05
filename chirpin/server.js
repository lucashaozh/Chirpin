const express = require('express');
const app = express();

const cors = require('cors'); app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());

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
        poster: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        tweet_content: { type: String, required: true },
        tag: [{ type: String, required: true }],
        comment: [{
            username: { type: String, required: true },
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
        uid: { type: Number, required: true, unique: true },
        username: { type: String, required: true, unique: true, minlength: 4, maxlength: 20 },
        gender: { type: String },
        interest: [{ type: String}],
        about: { type: String },
        follower_counter: { type: Number },
        following_counter: { type: Number },
        tweet: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
        follower: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        tweet_reported: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
        user_reported: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        user_blocked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        report_counter: { type: Number },
        tweet_liked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
        tweet_disliked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
        portrait: { type: String }
    });

    const NotificationSchema = mongoose.Schema({
        uid: { type: String, required: true }, //who is receiving this notifications
        actor_id: { type: Number, required: true }, // who is sending this notification
        action: { type: String, required: true }, // follow, like, comment, retweet
        tid: { type: Number, required: false }, // which tweet is involved, null for follow action
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
    /* ------------------------User/admin Operation JIANG Hongxu------------------------*/
    /* ---------------------------------------------------------------*/
    
    //create a user by signing up or admin adding
    app.post('/createuser', (req, res) => {
        res.set('Content-Type', 'text/plain');
        Account.create({
            uid:1,
            username: req.body['newusername'],
            pwd: req.body['newpwd'],
            identity:'user'
        }).then((acc) => {
            if(!acc){return res.send("Sign up unsuccessfully").status(404);}
            //console.log(acc);
            let user = {
                username: req.body['newusername'],
                uid: 1,
                gender: '',
                interest:[],
                about:'',
                follow_counter:0,
                following_counter:0,
                tweet:[],
                follow:[],
                following:[],
                tweet_reported:[],
                user_reported:[],
                uesr_blocked:[],
                report_counter:0,
                tweet_liked:[],
                tweet_disliked:[],
                portrait:''
            }
            User.create(user).then((user)=>{
                console.log(user);
                res.sendStatus(201);
            }).catch((err) => {
                res.send(err);
            });

        });
    });

    //user/admin authentication
    app.post('/login/user', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let _username = req.body['username'];
        let _pwd = req.body['pwd'];
        Account.findOne({ username: _username }).then((val) => {
            if(val.identity=='user'){
                if (val != null && _pwd == val.pwd) {
                    res.status(200).send('Login As User Successfully!\n');
                } 
                else {
                    console.log("incorrect");
                    res.status(404).send("Incorrect Username or Password.\n");
                }
            }
            else if(val.identity=='admin'){
                console.log(3)
                if (val != null && _pwd == val.pwd) {
                    res.status(200).send('Login As Amin Successfully!\n');
                } 
                else {
                    res.status(404).send("Incorrect Username or Password.\n");
                }
            }  
            }).catch((err)=>{
                res.send(err);
            });
        });
    

    //change pwd by user
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
                res.sendStatus(200);
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
                    console.log("Successfully delete user " + username+"in User db");
                    res.send("Successfully delete user " + username+"in User db").status(204);
                }
            }).catch((err)=>{
            res.send(err);
            });
        });
    });
    

    //update user information by admin
    app.put('/update', (req, res) => {
        res.set('Content-Type', 'text-plain');
        let oldusername = req.body.username
        let newusername = req.body.newusername;
        let newpwd = req.body.newpwd;

        Account.findOne({ username: oldusername }).then((acc) => {
            if (!acc) {
                res.sendStatus(404);
            } else {
                if (newpwd != ''&& newusername !=''){
                    acc.pwd = newpwd;
                    acc.username=newusername;
                    console.log("change the pwd and username in Account db");
                    acc.save();
                }
                else if(newpwd != ''){
                    acc.pwd = newpwd;
                    console.log("change the pwd in Account db");
                    acc.save();
                }
                else if(newusername != ''){
                    acc.username = newusername;
                    console.log("change the username in Account db");
                    acc.save();
                }
            }
            User.findOne({ username: oldusername }).then((user) => {
            if (!user) {
                res.sendStatus(404);
            } else if(newusername !=''){
                user.username=newusername;
                console.log("change the username in User db");
                user.save();
                res.sendStatus(200);
            }
        }).catch((err)=>{
           res.send(err); 
            });
        });
    });

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

});

const server = app.listen(8000);
