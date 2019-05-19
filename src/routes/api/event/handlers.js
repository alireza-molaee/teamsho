import { Category, Event, Enrollment } from '../../../models';
import moment from 'moment-jalaali';
import mongoose from 'mongoose';

export function getMyEvents(req, res, next) {
    const userId = req.user.id;
    Event.find({leader: userId})
    .then(res => {
        return res;
    })
    .then(events => {
        return Event.populate(events, { path: 'categoryId', model: 'Category' })
    })
    .then(events => {
        return events.map(item => ({
            "id": item._id,
            "title": item.title,
            "description": item.description,
            "image": item.image,
            "dateTime": item.dateTime,
            "category": {
                "title": item.categoryId.title,
                "image": item.categoryId.image
            },
            "minMember": item.minMember,
            "maxMember": item.maxMember,
            "minAge": item.minAge,
            "maxAge": item.maxAge,
            "minSkill": item.minSkill,
            "maxSkill": item.maxSkill,
        }))
    })
    .then(events => {
        res.status(200).send(events);
    })
    .catch(err => {
        next(err)
    })
}

export function find(req, res, next) {
    const itemPerPage = 10;
    let page = req.params.page;
    const filter = req.body;
    if (!page) {
        page = 1;
    }
    let query = Event.find();
    if (filter.title) {
        query = query.where('title').regex(new RegExp(filter.title, "i"));
    }

    if (filter.category) {
        query = query.where('categoryId').equals(filter.category);
    }

    if (filter.location && filter.location.length === 2) {
        query = query.where('location').within().circle({ center: filter.location, radius: 1000 })
    }

    if (filter.date) {
        const start = moment(filter.date).hour(0).minute(0).second(0).millisecond(0);
        const end = moment(filter.date).hour(23).minute(59).second(59).millisecond(999);
        query = query.where('dateTime').gte(start).lte(end);
    }

    const totalCount = query.count();
    const totalPage = Math.ceil(totalCount / itemPerPage);

    if (totalCount === 0) {
        return res.status(404).send({
            message: 'target not found'
        });
    }

    if (page > totalPage) {
        return res.status(404).send({
            message: 'this page not found'
        });
    }

    query.skip(itemPerPage * (page - 1)).limit(itemPerPage).exec()
    .then(items => {
        res.status(200).send({
            items,
            totalPage
        })
    }).catch(err => {
        next(err);
    })
}

export function createEvent(req, res, next) {
    const data = req.body;
    Event.create({
        title: data['title'],
        description: data['description'],
        dateTime: moment(data['dateTime']).toDate(),
        location: {
            type: 'Point',
            coordinates: [data['location']['lat'], data['location']['long']]
        },
        leader: req.user.id,
        categoryId: data['categoryId'],
        image: data['image'],
        minMember: data['minMember'],
        maxMember: data['maxMember'],
        minAge: data['minAge'],
        maxAge: data['maxAge'],
        minSkill: data['minSkill'],
        maxSkill: data['maxSkill'],
    })
    .then(result => {
        return Event.populate(result, {path: 'categoryId', model: 'Category'})
    })
    .then(result => {
        res.status(200).send({
            "id": result._id,
            "title": result.title,
            "description": result.description,
            "dateTime": result.dateTime,
            "location": {
                "lat": result.location.coordinates[0],
                "long": result.location.coordinates[1]
            },
            "category": {
                "title": result.categoryId.title,
                "image": result.categoryId.image
            },
            "image": result.image,
            "minMember": result.minMember,
            "maxMember": result.maxMember,
            "minAge": result.minAge,
            "maxAge": result.maxAge,
            "minSkill": result.minSkill,
            "maxSkill": result.maxSkill
        })
    }).catch(err => {
        next(err)
    })
}

export function uploadImage(req, res, next) {
    const image = req.files.image;
    if (!picture) {
        throw new HttpError('picture not exist in body', 400);
    }
    if (!/image\/*/i.test(image.mimetype)) {
        throw new HttpError('incorrect file type', 400);
    }
    const fileName = image.md5 + path.extname(image.name);
    picture.mv(path.join('uploads', 'event-images', fileName));
    res.status(201).send({
        url: path.join(req.headers.host, 'uploads', 'event-images', fileName)
    })
}

export function getEvent(req, res, next) {
    const eventId = req.params.id;
    Event.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(eventId)
            }
        },
        {
            $lookup: {
                from: "categories",
                localField: "categoryId",
                foreignField: "_id",
                as: "fromCategory"
            }
        },
        {
            $replaceRoot: { newRoot: { $mergeObjects: [ {category: { $arrayElemAt: [ "$fromCategory", 0 ] }}, "$$ROOT" ] } }
        },
        {
            $project: { fromCategory: 0, categoryId: 0, "category._id": 0 }
        }
    ])
    .then(result => {
        res.status(200).send(result);
    })
    .catch(err => {
        next(err)
    })
}

export function updateEvent(req, res, next) {
    
}

export function deleteEvent(req, res, next) {
    res.status(501).send('not implemented yet')
}

export function getMembers(req, res, next) {
    res.status(501).send('not implemented yet')
}

export function subscribe(req, res, next) {
    res.status(501).send('not implemented yet')
}