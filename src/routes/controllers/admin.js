import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import * as sqlite from 'sqlite3';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { User, Category } from '../../models';
import camel2Text from '../../utils/camelToNormalText';

const sqlite3 = sqlite.verbose();
const db = new sqlite3.Database('admin-db');
const router = express.Router();

const checkUserLogin = (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/admin/login');        
    } else {
        next();
    }
}

router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser());
router.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));
router.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});

const entities = [
    {
        slug: 'user',
        title: 'User',
        icon: 'users',
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

router.get('/:entitySlug/:page', checkUserLogin, (req, res) => {
    const user = req.session.user;
    const entityData = entities.find(item => item.slug === req.params.entitySlug);
    const headers = entityData.listViewFields.map(item => {
        return entityData.fields[item].title;
    })
    const paginatedData = entityData.getListItems(req.params.page || 0, {});
    const items = paginatedData.items.map(item => {
        const props = [];
        Object.keys(item).forEach(key => {
            if (key !== '_id') {
                const thisFieldType = entityData.fields[key];
                props.push({
                    value: item[key],
                    isText: thisFieldType === 'text',
                    isBoolean: thisFieldType === 'bool',
                    isLink: thisFieldType === 'link',
                });
            }
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
            image: `https://www.gravatar.com/avatar/${crypto.createHash('md5').update(user.email).digest('hex')}`,
            name: user.name,

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
});

router.get('/', function (req, res) {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/admin/user/1');
    } else {
        res.redirect('/admin/login');
    }   
})

router.get('/login', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/admin/user/1');
    } else {
        res.render('admin/login', {});
    }
})

router.post('/login', function(req, res) {
    const {email, password, remember} = req.body;

    
    db.get(`SELECT rowid AS id, email, name, password FROM user WHERE email="${email}"`, function(err, row) {
        if (err) {
            res.status(500);
        } else {
            if (!row) {
                res.redirect('/admin/login');
            } else {
                bcrypt.compare(password, row.password, function(err, ok) {
                    if (err) {
                        res.status(500);
                    } else {
                        if (ok) {
                            req.session.user = row;
                            res.redirect('/admin');
                        } else {
                            res.redirect('/admin/login');                                
                        }
                    }
                    db.close();
                })
            }
        }
    });
})

export default router;