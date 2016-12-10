import { Meteor } from 'meteor/meteor';
import { Tasks } from '../api/tasks.js';
import { Params } from '../api/params.js';
import { History } from '../api/history.js';
import _ from 'lodash';
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
Meteor.startup(() => {
  // code to run on server at startup
    JsonRoutes.add("get", "/shuffle", function (req, res, next) {
        const songs = Tasks.find({}).fetch();
        console.log('songs', songs);
        const shuffledSongs = shuffle(songs);
        console.log('shuffled', shuffledSongs);
        Tasks.remove({});
        _.each(shuffledSongs, shuffledSong => Tasks.insert(shuffledSong));
        JsonRoutes.sendResult(res, {
            data: 'shuffled'
        });
    });
    JsonRoutes.add("get", "/next", function (req, res, next) {
        const song = Tasks.find({}, { sort: { requested_at: 1 } }).fetch()[0];
        History.insert({
            song ,
            createdAt: new Date(),
        });
        Tasks.remove(song._id);
        JsonRoutes.sendResult(res, {
            data: 'next'
        });
    });
    JsonRoutes.add("get", "/pause", function (req, res, next) {
        const currentParams = Params.find({}).fetch()[0];
        if( _.isUndefined(currentParams)) {
            Params.insert({
                state: 'pause' ,
                createdAt: new Date(),
            });
        } else {
            Params.update(currentParams._id, {
                $set: { state: 'pause' },
            });
        }
        JsonRoutes.sendResult(res, {
            data: 'ok'
        });
    });
    JsonRoutes.add("get", "/resume", function (req, res, next) {
        const currentParams = Params.find({}).fetch()[0];
        if( _.isUndefined(currentParams)) {
            Params.insert({
                state: 'play' ,
                createdAt: new Date(),
            });
        } else {
            Params.update(currentParams._id, {
                $set: { state: 'play' },
            });
        }
        JsonRoutes.sendResult(res, {
            data: 'ok'
        });
    });
    JsonRoutes.add("get", "/volumeup", function (req, res, next) {
        const currentParams = Params.find({}).fetch()[0];
        if( _.isUndefined(currentParams)) {
            Params.insert({
                volume: 'volumeup' ,
                createdAt: new Date(),
            });
        } else {
            Params.update(currentParams._id, {
                $set: { volume: 'volumeup' },
            });
        }
        JsonRoutes.sendResult(res, {
            data: 'ok'
        });
    });
    JsonRoutes.add("get", "/volumedown", function (req, res, next) {
        const currentParams = Params.find({}).fetch()[0];
        if( _.isUndefined(currentParams)) {
            Params.insert({
                volume: 'volumedown' ,
                createdAt: new Date(),
            });
        } else {
            Params.update(currentParams._id, {
                $set: { volume: 'volumedown' },
            });
        }
        JsonRoutes.sendResult(res, {
            data: 'ok'
        });
    });
});
