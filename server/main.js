import { Meteor } from 'meteor/meteor';
import { Tasks } from '../api/tasks.js';
Meteor.startup(() => {
  // code to run on server at startup
    JsonRoutes.add("get", "/next", function (req, res, next) {
        const song = Tasks.find({}, { sort: { requested_at: 1 } }).fetch()[0];
        Tasks.remove(song._id);
        JsonRoutes.sendResult(res, {
            data: 'next'
        });
    });
});
