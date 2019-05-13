const ObjectID = require('mongodb').ObjectID;
const users = require('./users');
const events = require('./events');

const data = [
    {
        "_id": new ObjectID(1),
        "joinAt": new Date(),
        "userId": users[1]['_id'],
        "eventId": events[0]['_id']
    }
]

module.exports = data;