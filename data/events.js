const ObjectID = require('mongodb').ObjectID;
const categories = require('./categories');
const users = require('./users');

const data = [
    {
        "_id": new ObjectID(1),
        "title": "title 1",
        "description": "asdasdasd asd asd as das da sd asda sdasdasd asd ads",
        "image": "",
        "dateTime": new Date("2019-05-13T11:52:17.834Z"),
        "location": {
            "type" : "Point",
            "coordinates": [35.6892, 51.3890]
        },
        "categoryId": categories[0]['_id'],
        "leader": users[0]['_id'],
        "minMember": 0,
        "maxMember": 10,
        "minAge": 10,
        "maxAge": 25,
        "minSkill": 0,
        "maxSkill": 4
    }
]

module.exports = data;