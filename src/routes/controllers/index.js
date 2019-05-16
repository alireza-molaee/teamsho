import express from 'express';
const router = express.Router();
import { User, Category } from '../../models';
import camel2Text from '../../utils/camelToNormalText';

const targetModel = User;
const listViewFields = ['firstName', 'lastName', 'phoneNumber', 'picture']

router.get('/admin', (req, res) => {
    res.render('index', { 
        page: {title: 'salam'},
        sidebar: {
            items: [
                {
                    title: "users",
                    icon: "perm_identity",
                    link: "/admin/users"
                },
                {
                    title: "categories",
                    icon: "perm_identity",
                    link: "/admin/categories"
                },
                {
                    title: "events",
                    icon: "perm_identity",
                    link: "/admin/events"
                },
                {
                    title: "subscriptions",
                    icon: "perm_identity",
                    link: "/admin/subscriptions"
                }
            ]
        }
    });
})

router.get('/admin/users', (req, res) => {
    const schema = User.schema.obj;
    const itemPerPage = 10;
    const page = req.query.page || 1;
    // for (let [key, value] of Object.entries(schema)) {
    //     if (key === "phoneNumber") {
    //         console.log('aaaaaaaaaa', value.type);
    //     }
    // }
    const selectObj = listViewFields.reduce((pre, item) => {
        pre[item] = 1
        return pre;
    }, {});
    const rowsPromise = targetModel.find().select(selectObj).skip(itemPerPage * (page - 1)).limit(itemPerPage);
    const columns = listViewFields.map(item => {
        return {
            key: item,
            name: camel2Text(item)
        }
    });

    rowsPromise.then(rows => {
        res.render('user-list', { 
            page: {title: 'salam'},
            sidebar: {
                items: [
                    {
                        title: "users",
                        icon: "perm_identity",
                        link: "/admin/users"
                    },
                    {
                        title: "categories",
                        icon: "perm_identity",
                        link: "/admin/categories"
                    },
                    {
                        title: "events",
                        icon: "perm_identity",
                        link: "/admin/events"
                    },
                    {
                        title: "subscriptions",
                        icon: "perm_identity",
                        link: "/admin/subscriptions"
                    }
                ]
            },
            rows,
            columns
        });
    })
})

export default router;