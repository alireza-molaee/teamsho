import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import * as sqlite from 'sqlite3';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import moment from 'moment';
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
                type: 'long-text',
                title: 'Last Name'
            },
            phoneNumber: {
                type: 'number',
                title: 'Phone Number'
            },
            isActive: {
                type: 'bool',
                title: 'Is Active',
            },
            joinAt: {
                type: 'date',
                title: 'Join At',
                options: {
                    format: 'YYYY/MM/DD HH:mm',
                }
            },
            role: {
                type: 'enum',
                title: 'Role',
                options: {
                    map: {
                        'admin': 'Admin',
                        'manager': 'Manager',
                        'manager-assistant': 'Manager Assistant',
                    },
                    inputType: 'radio-inline',
                }
            },
            permissions: {
                type: 'multi-enum',
                title: 'Permissions',
                options: {
                    map: {
                        'admin': 'Admin',
                        'manager': 'Manager',
                        'manager-assistant': 'Manager Assistant',
                    },
                    inputType: 'check-box-inline',
                }
            },
            picture: {
                type: 'file',
                title: 'Picture',
                options: {

                }
            }
        },
        listViewFields: ['firstName', 'lastName', 'phoneNumber', 'isActive', 'joinAt', 'role', 'permissions', 'picture'],
        listViewActions: [
            {
                id: 'delete-all',
                title: 'delete all',
            },
            {
                id: 'confirm-all',
                title: 'confirm all',
            },
            {
                id: 'suspend-all',
                title: 'suspend all',
            }
        ],
        onTriggerAction: (actionId, selectedItems) => {

        },
        getListItems: (page, filters) => {
          return {
              items: [
                {
                    _id: '1',
                    firstName: 'علیرضا',
                    lastName: 'مولایی مولایی مولایی مولایی مولایی مولایی مولایی مولاییمولایی',
                    phoneNumber: '09121010101',
                    isActive: true,
                    joinAt: new Date(),
                    role: 'admin',
                    permissions: ['admin', 'manager'],
                    picture: 'http://lorempixel.com/200/200/people/'
                },
                {
                    _id: '2',
                    firstName: 'علیرضا',
                    lastName: 'مولایی',
                    phoneNumber: '09121010101',
                    isActive: true,
                    joinAt: new Date(),
                    role: 'admin',
                    permissions: ['admin', 'manager'],
                    picture: 'http://lorempixel.com/200/200/people/'
                },
                {
                    _id: '3',
                    firstName: 'علیرضا',
                    lastName: 'مولایی',
                    phoneNumber: '09121010101',
                    isActive: false,
                    joinAt: new Date(),
                    role: 'admin',
                    permissions: ['admin', 'manager'],
                    picture: 'http://lorempixel.com/200/200/people/'
                },
                {
                    _id: '4',
                    firstName: 'علیرضا',
                    lastName: 'مولایی',
                    phoneNumber: '09121010101',
                    isActive: false,
                    joinAt: new Date(),
                    role: 'admin',
                    permissions: ['admin', 'manager'],
                    picture: 'http://lorempixel.com/200/200/people/'
                },
                {
                    _id: '5',
                    firstName: 'علیرضا',
                    lastName: 'مولایی',
                    phoneNumber: '09121010101',
                    isActive: true,
                    joinAt: new Date(),
                    role: 'admin',
                    permissions: ['admin', 'manager'],
                    picture: 'http://lorempixel.com/200/200/people/'
                }
              ],
              totalPage: 6, 
          }  
        },

    }
]


router.get('/:entitySlug/add', checkUserLogin, (req, res) => {
    const entityData = entities.find(item => item.slug === req.params.entitySlug);
    const user = req.session.user;
    res.render('admin/form', {
        baseUrl: req.baseUrl,
        page: {
            title: `Admin - ${entityData.title}`,
        },
        entitySlug: req.params.entitySlug,
        title: entityData.title,
        icon: entityData.icon,
        breadcrumb: [
            {
                title: 'Dashboard',
                link: '/',
                isLastOne: false,
            },
            {
                title: entityData.title,
                link: `${req.baseUrl}/${req.params.entitySlug}/1`,
                isLastOne: false,
            },
            {
                title: 'Add',
                link: `${req.baseUrl}/${req.params.entitySlug}/add`,
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
        fields: Object.entries(entityData.fields).map(([key, val]) => {
            return {
                name: key,
                type: val.type,
                label: val.title,
                options: val.options,
            }
        }),
        getInputByType: function() {
            switch (this.type) {
                case 'text':
                    return `<input type="text" id="${this.name}-input" name="${this.name}" placeholder="${this.label}" class="form-control">`;
                case 'number':
                    return `<input type="number" id="${this.name}-input" name="${this.name}" placeholder="${this.label}" class="form-control">`;
                case 'long-text':
                    return `<textarea id="${this.name}-input" name="${this.name}" placeholder="${this.label}" class="form-control"></textarea>`;
                case 'bool':
                    return `<label class="switch switch-3d switch-primary mr-3"><input type="checkbox" id="${this.name}-input" name="${this.name}" class="switch-input" checked="true"><span class="switch-label"></span><span class="switch-handle"></span></label>`
                case 'date':
                    return `<div class="input-group date datetimepicker" id="${this.name}-datepicker" data-target-input="nearest"><input type="text" id="${this.name}-input" name=""${this.name}" class="form-control datetimepicker-input" data-target="#${this.name}-datepicker"/><div class="input-group-append" data-target="#${this.name}-datepicker" data-toggle="datetimepicker"><div class="input-group-text"><i class="fa fa-calendar"></i></div></div></div>`
                case 'enum':
                    if (!this.options || !this.options.inputType || this.options.inputType === 'select') {
                        const options = this.options && this.options.map && Object.entries(this.options.map).map(([key, val]) => (`<option value="${key}">${val}</option>`));
                        return `<select id="${this.name}-input" name="${this.name}" class="form-control"><option value="0">Please select</option>${options && options.join('')}</select>`;
                    } else if (this.options && this.options.inputType && this.options.inputType === 'radio') {
                        const radios = this.options.map && Object.entries(this.options.map).map(([key, val]) => (`<div class="radio"><label for="${this.name}-${key}-radio" class="form-check-label "><input type="radio" id="${this.name}-${key}-radio" name="${this.name}" value="${key}" class="form-check-input">${val}</label></div>`));
                        return `<div class="form-check">${radios.join('')}</div>`;
                    } else if (this.options && this.options.inputType && this.options.inputType === 'radio-inline') {
                        const radios = this.options.map && Object.entries(this.options.map).map(([key, val]) => (`<label for="${this.name}-${key}-radio" class="form-check-label "><input type="radio" id="${this.name}-${key}-radio" name="${this.name}" value="${key}" class="form-check-input">${val} &nbsp;&nbsp;</label>`));
                        return `<div class="form-check-inline form-check">${radios.join('')}</div>`;
                    } else {
                        return ''
                    }
                case 'multi-enum':
                    if (!this.options || !this.options.inputType || this.options.inputType === 'select') {
                        const options = this.options && this.options.map && Object.entries(this.options.map).map(([key, val]) => (`<option value="${key}">${val}</option>`));
                        return `<select id="${this.name}-input" name="${this.name}" class="form-control" multiple=""><option value="0">Please select</option>${options && options.join('')}</select>`;
                    } else if (this.options && this.options.inputType && this.options.inputType === 'check-box') {
                        const checkboxs = this.options.map && Object.entries(this.options.map).map(([key, val]) => (`<div class="checkbox"><label for="${this.name}-${key}-checkbox" class="form-check-label "><input type="checkbox" id="${this.name}-${key}-checkbox" name="${this.name}" value="${key}" class="form-check-input">${val}</label></div>`));
                        return `<div class="form-check">${checkboxs.join('')}</div>`;
                    } else if (this.options && this.options.inputType && this.options.inputType === 'check-box-inline') {
                        const checkboxs = this.options.map && Object.entries(this.options.map).map(([key, val]) => (`<label for="${this.name}-${key}-checkbox" class="form-check-label "><input type="checkbox" id="${this.name}-${key}-checkbox" name="${this.name}" value="${key}" class="form-check-input">${val} &nbsp;&nbsp;</label>`));
                        return `<div class="form-check-inline form-check">${checkboxs.join('')}</div>`;
                    } else {
                        return ''
                    }
                case 'file':
                    return `<input type="file" id="${this.name}-input" name="${this.name}" class="form-control-file">`
                default:
                    return ''
            }
        }
    });
});

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
                const thisField = entityData.fields[key];
                props.push({
                    value: item[key],
                    type: thisField.type,
                    options: thisField.options,
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
        baseUrl: req.baseUrl,
        page: {
            title: `Admin - ${entityData.title}`,
        },
        entitySlug: req.params.entitySlug,
        title: entityData.title,
        icon: entityData.icon,
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
        actions: entityData.listViewActions,
        headers,
        items,
        pages,
        currentPage,
        getValue: function () {
            switch (this.type) {
                case 'text':
                    return `<span>${String(this.value)}</span>`;
                case 'enum':
                    return `<span>${String((this.options && this.options.map && this.options.map[this.value]) || this.value)}</span>`;
                case 'number':
                    return `<span>${String(this.value)}</span>`;
                case 'long-text':
                    const words = String(this.value).trim().split(' ');
                    if (words.length > (this.option && this.option.trunc) || 7) {
                        return `<span>${words.slice(0, (this.option && this.option.trunc) || 7).join(' ') + ('...')}</span>`;
                    } else {
                        return `<span>${String(this.value).trim()}</span>`;
                    }
                case 'date':
                    if (!this.value) return ''
                    return `<span>${moment(this.value).format((this.option && this.option.format) || 'YYYY/MM/DD HH:mm:ss')}</span>`
                case 'bool':
                    if (this.value === null || this.value === undefined ) return 'null'
                    if (this.value === true) {
                        return `<span><i class="fa fa-check-circle"></i></span>`
                    } else {
                        return `<span><i class="fa fa-times-circle"></i></span>`
                    }
                case 'file':
                    return `<a href="${this.value}" target="_blank">${this.value}</a>`
                case 'multi-enum':
                    const items = this.value
                    .map(item => (String((this.options && this.options.map && this.options.map[item]) || item)))
                    .map(item => (`<span class="badge badge-secondary">${item}</span>`));
                    return `${items.join('&nbsp;')}`;
                default:
                    return this.value;
            }
        }
    });
});

router.post('/:entitySlug/actions', (req, res) => {
    const entityData = entities.find(item => item.slug === req.params.entitySlug);
    const { action, selectedItems } = req.body;
    const result = entityData.onTriggerAction(action, selectedItems);
    if (result instanceof Promise) {
        result
        .then(() => {
            res.redirect(`/admin/${req.params.entitySlug}/1`);       
        })
        .catch((err) => {
            res.status(500);
            res.send(err.message)
        })
    } else {
        res.redirect(`/admin/${req.params.entitySlug}/1`);
    }
})

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