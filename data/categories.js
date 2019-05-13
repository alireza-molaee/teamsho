const ObjectID = require('mongodb').ObjectID;

const data = [
    {
        "_id": new ObjectID(1),
        "title": "football",
        "image": "football-cat.png"
    },
    {
        "_id": new ObjectID(2),
        "title": "basketball",
        "image": "basketball-cat.png"
    },
    {
        "_id": new ObjectID(3),
        "title": "running",
        "image": "running-cat.png"
    },
    {
        "_id": new ObjectID(4),
        "title": "swimming",
        "image": "swimming-cat.png"
    },
    {
        "_id": new ObjectID(5),
        "title": "riding bike",
        "image": "riding-bike-cat.png"
    }
]

module.exports = data;