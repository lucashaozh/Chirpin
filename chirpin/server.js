const fetch = require('node-fetch')
const express = require('express');
// const sha256 = require('crypto-js/sha256');
const app = express();

const cors = require('cors'); app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());

const mongoose = require('mongoose');
const send = require('express/lib/response');

mongoose.connect('mongodb+srv://csci3100e1:csci3100e1@chirpin.pjvjlns.mongodb.net/test?authMechanism=DEFAULT');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function () {
    console.log("Connection is open...");

    const LocationSchema = mongoose.Schema({
        name: { type: String, required: true, unique: true },
        lat: { type: mongoose.Types.Decimal128, required: true },
        lon: { type: mongoose.Types.Decimal128, required: true },
        comment: [{
            uid: { type: String, required: true },
            content: { type: String, required: true }
        }]
    });

    const WeatherSchema = mongoose.Schema({
        loc: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
        temp_c: { type: mongoose.Types.Decimal128, required: true },
        wind_kph: { type: mongoose.Types.Decimal128, required: true },
        wind_dir: { type: String, required: true },
        humidity: { type: Number, required: true },
        precip_mm: { type: mongoose.Types.Decimal128, required: true },
        vis_km: { type: Number, required: true },
        last_updated: { type: String, required: true }
    });

    const UserSchema = mongoose.Schema({
        id: { type: String, required: true, unique: true, minlength: 4, maxlength: 20 },
        pwd: { type: String, required: true },
        fav_loc: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }]
    });

    const AdminSchema = mongoose.Schema({
        id: { type: String, required: true, unique: true, minlength: 4, maxlength: 20 },
        pwd: { type: String, required: true }
    });

    const Location = mongoose.model('Location', LocationSchema);

    const Weather = mongoose.model('Weather', WeatherSchema);

    const User = mongoose.model('User', UserSchema);

    const Admin = mongoose.model('Admin', AdminSchema);

    // Create Admin
    // app.get('/createAdmin', (req, res) => {
    //     Admin.create({
    //         id: 'test1',
    //         pwd: sha256('abcdef').toString()
    //     }, (err, user) => {
    //         if (err)
    //             res.send(err);
    //         else
    //             res.send('Admin created successfully!\n' + user);
    //     });
    // });

    // Create User
    app.post('/createUser', (req, res) => {
        res.set('Content-Type', 'text/plain');
        User.create({
            id: req.body['name'],
            pwd: req.body['pwd'],
            fav_loc: []
        }, (err, user) => {
            if (err){
                console.log(err.message);
                res.status(404).send(err.message);
            }
            else {
                console.log('User created successfully!\n' + user);
                res.status(201).send('success');
            } 
        });
    });

    // Delete User
    app.delete('/user/:userId', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let userid = req.params['userId'];
        User.deleteOne({ id: userid }, (err, user) => {
            if (err) {
                console.log("Failed to delete user " + userid);
                res.status(404).send("Failed to delete user " + userid);
            }
            else {
                console.log("Successfully delete user " + userid);
                res.status(204).send("Successfully delete user " + userid);
            }
        });
    });

    // Update User
    app.put('/user', (req, res) => {
        res.set('Content-Type', 'text-plain');
        let userid = req.body.id;
        let newid = req.body.newid;
        let newpwd = req.body.newpwd;

        User.findOne({ id: userid }, (err, user) => {
            if (err) {
                res.send(err);
            } else if (!user) {
                res.sendStatus(404);
            } else if (newid != '' && newpwd != '') {
                user.id = newid;
                user.pwd = sha256(newpwd).toString();
                user.save();
                res.sendStatus(200);
            } else if (newid != '') {
                user.id = newid;
                user.save();
                res.sendStatus(200);
            } else if (newpwd != '') {
                user.pwd = sha256(newpwd).toString();
                user.save();
                res.sendStatus(200);
            }
        });
    });

    // get all user data
    app.get('/user', (req, res) => {
        res.set('Content-Type', 'text/plain');
        User.find((err, users) => {
            if (err) {
                res.status(404).send(err);
            } else if (!users || users.length == 0) {
                res.status(404).send("No user found");
            } else {
                let userlist = [];
                for (let i = 0; i < users.length; i++) {
                    let userobj = {
                        "id": users[i].id,
                        "pwd": users[i].pwd
                    }
                    userlist.push(userobj);
                }
                console.log(userlist);
                res.set('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify(userlist));
            }
        })
    });

    // User Authentication
    app.post('/login/user', (req, res) => {
        let _uid = req.body['uid'];
        let _pwd = req.body['pwd'];
        User.findOne({ id: _uid }, (err, val) => {
            if (err)
                res.send(err);
            else {
                if (val != null && _pwd == val.pwd) {
                    res.status(200).send('Login As User Successfully!\n');
                } else {
                    res.status(404).send("Incorrect Username or Password.\n");
                }
            }
        });
    });

    // Admin Authentication
    app.post('/login/admin', (req, res) => {
        let _uid = req.body['uid'];
        let _pwd = req.body['pwd'];

        Admin.findOne({ id: _uid }, (err, val) => {
            if (err)
                res.send(err);
            else {
                if (val != null && _pwd == val.pwd) {
                    res.status(200).send('Login As Admin Successfully!\n');
                } else {
                    res.status(404).send("Incorrect Username or Password.\n");
                }
            }
        });
    });

    // response : JSON string of weather info in a location
    app.get('/weather/:loc', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let location = req.params['loc'];
        Location.findOne({ name: location }, (err, loc) => {
            if (err)
                res.status(404).send(err);
            else if (!loc) {
                console.log("No location of name " + location + " found");
                res.status(404).send("No location of name " + location + " found");
            } else {
                Weather.findOne({ loc: loc._id }, (err, weather) => {
                    if (err) {
                        console.log(err.message);
                        res.status(404).send(err.message);
                    } else if (!weather) {
                        console.log("No weather info found");
                        res.status(404).send("No weather info found");
                    } else {
                        let weatherobj = {
                            // "loc": {
                            //     "name": loc.name,
                            //     "lat": loc.lat.toString(),
                            //     "lon": loc.lon.toString()
                            // },
                            "temp_c": weather.temp_c.toString(),
                            "wind_kph": weather.wind_kph.toString(),
                            "wind_dir": weather.wind_dir,
                            "humidity": weather.humidity,
                            "precip_mm": weather.precip_mm.toString(),
                            "vis_km": weather.vis_km,
                            "last_updated": weather.last_updated
                        };
                        res.set('Content-Type', 'application/json');
                        res.status(200).send(JSON.stringify(weatherobj));
                    }
                });

            }
        });
    });

    // response: JSON array containing all the query location weather infos
    app.get('/weather', (req, res) => {
        res.set('Content-Type', 'text/plain');
        Location.find((err, locs) => {
            if (err) {
                res.status(404).send(err);
            } else if (!locs || locs.length == 0) {
                console.log("No location found");
                res.status(404).send("No location found");
            } else {
                let idlist = [];
                for (let i = 0; i < locs.length; i++) {
                    idlist.push(locs[i]._id);
                }
                Weather.find({ loc: idlist }).populate('loc').exec((err, weather) => {
                    if (err) {
                        console.log(err.message);
                        res.status(404).send(err.message);
                        return;
                    } else if (!weather) {
                        console.log("No weather info found");
                        res.status(404).send("No weather info found");
                        return;
                    } else {
                        let weatherlist = []
                        for (let i = 0; i < weather.length; i++) {
                            let weatherobj = {
                                // "loc": {
                                //     "name": weather[i].loc.name,
                                //     "lat": weather[i].loc.lat.toString(),
                                //     "lon": weather[i].loc.lon.toString()
                                // },
                                "temp_c": weather[i].temp_c.toString(),
                                "wind_kph": weather[i].wind_kph.toString(),
                                "wind_dir": weather.wind_dir,
                                "humidity": weather[i].humidity,
                                "precip_mm": weather[i].precip_mm.toString(),
                                "vis_km": weather[i].vis_km,
                                "last_updated": weather[i].last_updated
                            };
                            weatherlist.push(weatherobj);
                        }
                        res.set('Content-Type', 'application/json');
                        res.status(200).send(JSON.stringify(weatherlist));
                    }
                });
            }
        });
    });

    // Update single location weather
    // Success status: 201
    app.put('/weather/:loc', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let location = req.params['loc'];
        Location.findOne({ name: location }, (err, loc) => {
            if (err)
                res.status(404).send(err.message);
            else if (!loc) {
                console.log("No location found");
                res.status(404).send("No location found");
            } else {
                const weather_url = "http://api.weatherapi.com/v1/current.json?key="
                    + weather_key + "&q=" + loc.name + "&aqi=no";
                fetch(weather_url).then(res => res.json())
                    .then(data => {
                        let conditions = { 'loc': loc._id },
                            update = {
                                $set: {
                                    temp_c: data['current']['temp_c'],
                                    wind_kph: data['current']['wind_kph'],
                                    wind_dir: data['current']['wind_dir'],
                                    humidity: data['current']['humidity'],
                                    precip_mm: data['current']['precip_mm'],
                                    vis_km: data['current']['vis_km'],
                                    last_updated: data['current']['last_updated']
                                }
                            };
                        Weather.updateOne(conditions, update, { upsert: true }, (err, weather) => {
                            if (err) {
                                console.log('Failed in updating');
                                res.status(404).send(err);
                            } else {
                                console.log('Successfully update');
                                res.status(201).send("Successfully update");
                            }
                        });
                    }).catch(err => {
                        console.log(err);
                    });
            }
        });
    });

    // Refreshing all weather informaiton
    app.put('/weather', (req, res) => {
        res.set('Content-Type', 'text/plain');
        Location.find((err, locs) => {
            if (err)
                res.status(404).send(err.message);
            else if (locs == undefined || locs.length == 0) {
                console.log("No location found");
                res.status(404).send("No location found");
            } else {
                let feteches = []
                for (let i = 0; i < locs.length; i++) {
                    const weather_url = "http://api.weatherapi.com/v1/current.json?key="
                        + weather_key + "&q=" + locs[i].name + "&aqi=no";
                    feteches.push(
                        fetch(weather_url).then(res => res.json())
                            .then(data => {
                                let conditions = { 'loc': locs[i]._id },
                                    update = {
                                        $set: {
                                            temp_c: data['current']['temp_c'],
                                            wind_kph: data['current']['wind_kph'],
                                            wind_dir: data['current']['wind_dir'],
                                            humidity: data['current']['humidity'],
                                            precip_mm: data['current']['precip_mm'],
                                            vis_km: data['current']['vis_km'],
                                            last_updated: data['current']['last_updated']
                                        }
                                    };
                                Weather.updateOne(conditions, update, { upsert: true }, (err, weather) => {
                                    if (err) {
                                        console.log('Failed to update location ' + locs[i].name);
                                    } else {
                                        console.log('Successfully update location ' + locs[i].name);
                                    }
                                });
                            }).catch(err => {
                                console.log(err);
                            })
                    );
                }
                Promise.all(feteches).then(() => {
                    res.status(201).send("Successfully Refresh");
                });
            }
        });
    });

    // deleting one location weather info
    // send status 204 if success
    app.delete('/weather/:loc', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let location = req.params['loc'];
        LLocation.findOne(filter, (err, loc) => {
            if (err)
                res.status(404).send(err);
            else if (!loc) {
                console.log("No location of name " + location + "found");
                res.status(404).send("No location of name " + location + "found");
            } else {
                Weather.deleteOne({ loc: loc._id }, (err, weather) => {
                    if (err) {
                        console.log('Failed in deleting location ' + location);
                        res.status(404).send(err);
                    } else {
                        console.log('Successfully delete ' + location);
                        res.status(204).send("Successfully delete " + location);
                    }
                });
            }
        });
    });

    // response : JSON string of a location
    app.get('/loc/:loc', (req, res) => {
        res.set('Content-Type', 'text/plain');
        Location.findOne({ name: req.params['loc'] }, (err, loc) => {
            if (err) {
                console.log(err.message);
                res.status(404).send(err.message);
            } else if (!loc) {
                console.log("No location of name " + req.params['loc'] + " found");
                res.status(404).send("No location of name " + req.params['loc'] + " found");
            } else {
                res.set('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify({
                    name: loc.name,
                    lat: loc.lat.toString()/*.replace('.', '°') + 'N'*/, // uncomment for format transformation
                    lon: loc.lon.toString()/*.replace('.', '°') + 'E'*/
                }))
            }
        });
    });

    // response : JSON string of all location data in the form of number
    app.get('/loc', (req, res) => {
        res.set('Content-Type', 'text/plain');
        Location.find((err, locs) => {
            if (err) {
                console.log(err.message);
                res.status(404).send(err.message);
            } else if (!locs) {
                console.log("No location of found");
                res.status(404).send("No location of found");
            } else {
                let loclist = [];
                for (let i = 0; i < locs.length; i++) {
                    loclist.push({
                        name: locs[i].name,
                        lat: locs[i].lat.toString(),
                        lon: locs[i].lon.toString()
                    });
                }
                res.set('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify(loclist))
            }
        });
    });

    // response : JSON string of all location data in the form of direction
    app.get('/loc1', (req, res) => {
        res.set('Content-Type', 'text/plain');
        Location.find((err, locs) => {
            if (err) {
                console.log(err.message);
                res.status(404).send(err.message);
            } else if (!locs) {
                console.log("No location of found");
                res.status(404).send("No location of found");
            } else {
                let loclist = [];
                for (let i = 0; i < locs.length; i++) {
                    loclist.push({
                        name: locs[i].name,
                        lat: locs[i].lat.toString().replace('.', '°') + 'N',
                        lon: locs[i].lon.toString().replace('.', '°') + 'E'
                    });
                }
                res.set('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify(loclist))
            }
        });
    });

    // put location data JSON in the body to create one or many locations at a time
    app.post('/loc', (req, res) => {
        res.set('Content-Type', 'text/plain');
        Location.insertMany(req.body, (err, loc) => {
            if (err) {
                console.log(err.message);
                res.status(404).send(err.message);
            } else {
                console.log("Successfully created locations");
                res.status(201).send('success');
            }
        });
    });

    // update a single location
    app.put('/loc/:loc', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let originalName = req.body.originalName;
        let updateName = req.body.name;
        let updateLat = req.body.lat;
        let updateLon = req.body.lon;

        Location.findOne({ name: originalName }, (err, loc) => {
            if (err) {
                res.status(404).send(err.message);
            } else if (!loc) {
                res.status(404).send("No location is found.");
            } else {
                loc.name = updateName;
                loc.lat = updateLat;
                loc.lon = updateLon;
                loc.save();
                res.status(200).send(JSON.stringify(loc));
            }
        });
    });

    // delete a single location
    app.delete('/loc/:loc', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let location = req.params['loc'];
        Location.deleteOne({ name: location }, (err, loc) => {
            if (err) {
                console.log(err.message);
                res.status(404).send("Failed to delete location" + location);
            } else {
                console.log("Successfully deleted location " + location);
                res.status(204).send("Successfully deleted location " + location);
            }
        });
    });

    // get the user's favorite locations list
    app.post('/favlist/:uid', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let uid = req.params['uid'];
        User.findOne({ id: uid }).populate("fav_loc").exec((err, user) => {
            if (err || !user) {
                console.log(err ? err.message : "Error in finding user");
                res.status(404).send("Fail to find the user");
            } else {
                let favlists = user['fav_loc'];
                let favlocations = [];
                for (let favlocobj of favlists) {
                    favlocations.push({
                        name: favlocobj.name,
                        lat: favlocobj.lat.toString(),
                        lon: favlocobj.lon.toString()
                    })
                }
                res.set('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify(favlocations));
            }
        });
    });

    // add a location to favorite list
    app.put('/favlist', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let { uid, location } = req.body;
        Location.findOne({ name: location }, (err, loc) => {
            if (err || !loc) {
                console.log(err);
                res.status(404).send("No location found");
            } else {
                console.log(loc);
                User.updateOne({ id: uid },
                    { $addToSet: { fav_loc: loc } },
                    (err, user) => {
                        if (err) {
                            console.log(err.message);
                            // Fail to add loc to the fav lists
                            res.status(404).send("Fail to add loc to the fav lists");
                        } else {
                            // Successfully add the fav location
                            res.status(201).send("Successfully add the fav location");
                        }
                    });
            }
        });
    });

    // delete a location from favorite list
    app.delete('/favlist', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let { uid, location } = req.body;
        console.log(req.body);
        Location.findOne({ name: location }, (err, loc) => {
            if (err || !loc) {
                console.log(err);
                res.status(404).send("No location found");
            } else {
                User.updateOne({ id: uid },
                    { $pull: { fav_loc: loc._id } },
                    (err, user) => {
                        if (err) {
                            console.log(err.message);
                            // Fail to remove loc to the fav lists
                            res.status(404).send("Fail to remove loc to the fav lists");
                        } else {
                            // Successfully remove the fav location
                            res.status(204).send("Successfully remove the fav location");
                        }
                    });
            }
        });
    });

    // add comment to a location
    app.put('/comment', (req, res) => {
        res.set('Content-Type', 'text/plain');
        let { uid, location, comment } = req.body;
        Location.updateOne({ name: location },
            {
                $push: {
                    comment: {
                        uid: uid,
                        content: comment
                    }
                }
            }, (err, loc) => {
                if (err) {
                    console.log(err.message);
                    res.status(404).send("Fail to add comment in location " + location);
                } else {
                    res.status(201).send("Successfully add the comment");
                }
            });
    });

    // get comments of a location
    app.get('/comment/:loc', (req, res) => {
        res.set('Content-Type', 'text/plain');
        Location.findOne({ name: req.params.loc }, (err, loc) => {
            if (err || !loc) {
                console.log("Error in finding location " + req.params.loc);
                res.status(404).send("No location of name " + req.params.loc + " found");
            } else {
                let comments = [];
                for (let comment of loc.comment) {
                    comments.push({ user: comment.uid, comment: comment.content });
                }
                res.status(200).send(JSON.stringify(comments));
            }
        });
    });

    app.all('/*', (req, res) => {
        res.send("Welcome!");
    });
});

const server = app.listen(8000);
