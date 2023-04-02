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
        uid: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true, minlength: 4, maxlength: 20 },
        pwd: { type: String, required: true },
        identity: { type: String, required: true }
    });

    const TweetSchema = mongoose.Schema({
        tid: { type: String, required: true, unique: true },
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
        uid: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true, minlength: 4, maxlength: 20 },
        gender: { type: String, required: true },
        interest: [{ type: String, required: true }],
        follower_counter: { type: Number },
        following_counter: { type: Number },
        tweet: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
        follower: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        tweet_reported: [{ type: String }],
        user_reported: [{ type: String }],
        report_counter: { type: Number, required: true},
        tweet_liked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
        tweet_disliked: [{ type: String }],
        portrait: { type: String, required: true }
    });

    const Account = mongoose.model('Account', AccountSchema);
    const Tweet = mongoose.model('Tweet', TweetSchema);
    const User = mongoose.model('User', UserSchema);

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
            username: "user_01",
            pwd: "123456",
            identity: "user"
        }).catch((err) => {
            console.error(err);
        });

        User.create({
            uid: userID,
            username: "user_01",
            gender: "Female",
            interest: ["Basketball", "Piano"],
            follower_counter: 0,
            following_counter: 0,
            tweet: [],
            folloer: [],
            following: [],
            tweet_reported: [],
            user_reported: [],
            report_counter: 0,
            tweet_liked: [],
            tweet_disliked: [],
            portrait: "test"
        }).then(() => {
            res.sendStatus(200);
        }).catch((err) => {
            console.error(err);
        });
    });
});

const server = app.listen(8000);
