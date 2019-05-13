const ObjectID = require('mongodb').ObjectID;
const categories = require('./categories');

const data = [
    {
        "_id": new ObjectID(1),
        "phoneNumber": "09128044654",
        "secretCode": null,
        "firstName": "علیرضا",
        "lastName": "مولایی",
        "birthday": new Date(),
        "height": 175,
        "weight": 60,
        "picture": "user1.png",
        "skills": [
            {
                categoryId: categories[0]['_id'],
                rate: "medium"
            },
            {
                categoryId: categories[4]['_id'],
                rate: "strong"
            }
        ]
    },
    {
        "_id": new ObjectID(2),
        "phoneNumber": "09128044658",
        "secretCode": null,
        "firstName": "علی",
        "lastName": "اصغری",
        "birthday": new Date(),
        "height": 175,
        "weight": 60,
        "picture": "user2.png",
        "skills": [
            {
                categoryId: categories[4]['_id'],
                rate: "weak"
            }
        ]
    },
    {
        "_id": new ObjectID(3),
        "phoneNumber": "09128044652",
        "secretCode": null,
        "firstName": "محمد",
        "lastName": "اکبری",
        "birthday": new Date(),
        "height": 175,
        "weight": 60,
        "picture": "user3.png",
        "skills": []
    }
];

module.exports = data;