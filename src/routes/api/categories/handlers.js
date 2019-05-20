import { Category } from '../../../models';

export function getCategories(req, res, next) {
    Category.find({})
    .then(results => {
        return results.map(item => ({
            id: item._id,
            title: item.title,
            image: item.image,
        }))
    })
    .then(results => {
        res.status(200).send(results);
    })
    .catch(err => {
        next(err);
    })
}