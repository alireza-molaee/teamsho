import { Category, Event, Enrollment } from '../../../models';
import moment from 'moment-jalaali';
import mongoose from 'mongoose';
import path from 'path';

export function getMyEvents(req, res, next) {
    const userId = req.user.id;
    Event.find({leader: userId}).select({members: 0})
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
            "location": {
                "lat": item.location.coordinates[0],
                "long": item.location.coordinates[1]
            },
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

    query.skip(itemPerPage * (page - 1)).limit(itemPerPage).select({members: 0}).exec()
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
        members: []
    })
    .then(result => {
        return Event.populate(result, {path: 'categoryId', model: 'Category', select: '-members'})
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
    if (!image) {
        throw new HttpError('picture not exist in body', 400);
    }
    if (!/image\/*/i.test(image.mimetype)) {
        throw new HttpError('incorrect file type', 400);
    }
    const fileName = image.md5 + path.extname(image.name);
    image.mv(path.join('uploads', 'event-images', fileName));
    res.status(201).send({
        url: path.join(req.headers.host, 'uploads', 'event-images', fileName)
    })
}

export function getEvent(req, res, next) {
    const eventId = req.params.id;
    Event.findById(eventId).select({members: 0})
    .then(result => {
        if (!result) {
            res.status(404).send({message: 'not found'})
        } else {
            return result;
        }
    })
    .then(result => {
        return Event.populate(result, {path: 'categoryId', model: 'Category'})
    })
    .then(result => {
        return Event.populate(result, {path: 'leader', model: 'User'})
    })
    .then(result => {
        return Event.populate(result, {path: 'leader.skills.categoryId', model: 'Category'})
    })
    .then(result => {
        const loc = result.location;
        console.log(loc);
        res.status(200).send({
            id: result._id,
            title: result.title,
            image: result.image,
            description: result.description,
            dateTime: result.dateTime,
            location: {
                lat: result.location.coordinates[0],
                long: result.location.coordinates[1]
            },
            category: {
                title: result.categoryId.title,
                image: result.categoryId.image,
            },
            leader: {
                id: result.leader._id,
                fullName: `${result.leader.firstName} ${result.leader.lastName}`,
                picture: result.leader.picture,
                skills: result.leader.skills.map(item => ({
                    title: item.categoryId.title,
                    image: item.categoryId.image,
                    rate: item.rate,
                })),
            },
            minMember: result.minMember,
            maxMember: result.maxMember,
            minAge: result.minAge,
            maxAge: result.maxAge,
            minSkill: result.minSkill,
            maxSkill: result.maxSkill,
        });
    })
    .catch(err => {
        next(err)
    })
}

export function updateEvent(req, res, next) {
    const data = req.body;
    const eventId = req.params.id;
    Event.findByIdAndUpdate(eventId, {
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
        return Event.findById(result._id, '-members');
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

export function deleteEvent(req, res, next) {
    const eventId = req.params.id;
    Event.findByIdAndRemove(eventId).then(() => {
        res.status(200).send({message: 'deleted successfully'});
    })
}

export function getMembers(req, res, next) {
    const eventId = req.params.id;
    Event.findById(eventId).select({members: 1})
    .then(result => {
        return Event.populate(result, {path: 'members.userId', model: 'User', select: {_id: 1, firstName: 1, lastName: 1, picture: 1}})
    })
    .then(result => {
        return result.members.map(item => ({
            id: item.userId._id,
            joinAt: item.joinAt,
            fullName: `${item.userId.firstName} ${item.userId.lastName}`,
            picture: item.userId.picture,
        }));
    })
    .then(result => {
        res.status(200).send(result)
    })
    .catch(err => {
        next(err)
    })
}

export function subscribe(req, res, next) {
    const eventId = req.params.id;
    const userData = req.user;
    Event.findById(eventId)
    .then(result => {
        result.members.push({
            joinAt: new Date(),
            userId: userData.id,
        })
        return result.save();
    })
    .then(() => {
        res.status(200).send({message: 'user successfully subscribe'});
    })
    .catch(err => {
        next(err);
    })
}