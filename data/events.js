const ObjectID = require('mongodb').ObjectID;
const categories = require('./categories');
const users = require('./users');

const data = [
    {
        "_id": new ObjectID(1),
        "title": "title 1",
        "dateTime": new Date("2019-05-13T11:52:17.834Z"),
        "location": [35.6892, 51.3890],
        "categoryId": categories[0]['_id'],
        "leader": users[0]['_id'],
        "minMember": 0,
        "maxMember": 10,
        "image": "",
        "description": "asdasdasd asd asd as das da sd asda sdasdasd asd ads",
        "minAge": 10,
        "maxAge": 25
    }
]

module.exports = data;