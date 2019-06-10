import express from 'express';
const router = express.Router();
import { User, Category } from '../../models';
import camel2Text from '../../utils/camelToNormalText';

const entities = [
    {
        slug: 'user',
        title: 'User',
        fields: {
            firstName: {
                type: 'text',
                title: 'First Name'
            },
            lastName: {
                type: 'text',
                title: 'Last Name'
            },
            phoneNumber: {
                type: 'text',
                title: 'Phone Number'
            }
        },
        listViewFields: ['firstName', 'lastName', 'phoneNumber'],
        getListItems: (page, filters) => {
          return {
              items: [
                {
                    _id: '1',
                    firstName: 'علیرضا',
                    lastName: 'مولایی',
                    phoneNumber: '09121010101'
                },
                {
                    _id: '2',
                    firstName: 'علیرضا',
                    lastName: 'مولایی',
                    phoneNumber: '09121010101'
                },
                {
                    _id: '3',
                    firstName: 'علیرضا',
                    lastName: 'مولایی',
                    phoneNumber: '09121010101'
                },
                {
                    _id: '4',
                    firstName: 'علیرضا',
                    lastName: 'مولایی',
                    phoneNumber: '09121010101'
                },
                {
                    _id: '5',
                    firstName: 'علیرضا',
                    lastName: 'مولایی',
                    phoneNumber: '09121010101'
                }
              ],
              totalPage: 6, 
          }  
        },

    }
]

router.get('/:entitySlug/:page', (req, res) => {
    const entityData = entities.find(item => item.slug === req.params.entitySlug);
    const headers = entityData.listViewFields.map(item => {
        return entityData.fields[item].title;
    })
    const paginatedData = entityData.getListItems(req.params.page || 0, {});
    const items = paginatedData.items.map(item => {
        const props = [];
        Object.keys(item).forEach(key => {
            if (key !== '_id')
            props.push({type: entityData.fields[key], value: item[key]})
        });
        return {
            id: item._id,
            props,
        };
    });
    const totalPage = paginatedData.totalPage;
    const currentPage = Number(req.params.page);
    // const maxPageItem = 7;
    const pages = [];

    for (let p = 1; p <= totalPage; p++) {
        pages.push({
            link: req.originalUrl.replace(/(\d+)$/gi, p),
            title: p,
            active: p === currentPage,
        })
    }

    if (currentPage !== 1) {
        pages.unshift({
            title: '<span aria-hidden="true">&laquo;</span><span class="sr-only">Previous</span>',
            link: req.originalUrl.replace(/(\d+)$/gi, currentPage - 1),
            active: false
        })
    }

    if (currentPage !== totalPage) {
        pages.push({
            title: '<span aria-hidden="true">&raquo;</span><span class="sr-only">Next</span>',
            link: req.originalUrl.replace(/(\d+)$/gi, currentPage + 1),
            active: false
        })
    }

    res.render('admin/list-view', { 
        page: {
            title: 'salam'
        },
        breadcrumb: [
            {
                title: 'Dashboard',
                link: '/',
                isLastOne: false,
            },
            {
                title: 'Users',
                link: '/user',
                isLastOne: true,
            },
        ],
        user: {
            image: 'data:image/jpeg;base64,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',
            name: 'john lrux',

        },
        navItems: [
            {
                title: "users",
                icon: "users",
                link: "/admin/users"
            },
            {
                title: "categories",
                icon: "list",
                link: "/admin/categories"
            },
            {
                title: "events",
                icon: "calendar",
                link: "/admin/events"
            },
            {
                title: "subscriptions",
                icon: "id-card",
                link: "/admin/subscriptions"
            }
        ],
        addItemLink: '/add',
        headers,
        items,
        pages
    });
})

router.get('/users', (req, res) => {
    const schema = User.schema.obj;
    const itemPerPage = 10;
    const page = req.query.page || 1;
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
        res.render('admin/user-list', { 
            page: {title: 'salam'},
            navItems: [
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
            ],
            rows,
            columns
        });
    })
})

export default router;