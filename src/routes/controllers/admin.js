import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import * as sqlite from 'sqlite3';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import moment from 'moment';
import { entities } from './admin-data';

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

const makeNavItems = (req, res, next) => {
    const navItems = entities.map(item => ({
        link: `/admin/${item.slug}/1`,
        title: item.title,
        icon: item.icon,
    }));
    req.navItems = navItems;
    next();
}

router.get('/', function (req, res) {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/admin/dashboard');
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

router.get('/dashboard', checkUserLogin, makeNavItems, function (req, res) {
    const user = req.session.user;
    const entitiesList = entities.map(item => ({
        slug: item.slug,
        title: item.title,
        icon: item.icon,
    }));

    res.render('admin/dashboard', {
        baseUrl: req.baseUrl,
        page: {
            title: `Admin - dashboard`,
        },
        entities: entitiesList,
        breadcrumb: [
            {
                title: 'Dashboard',
                link: '/dashboard',
                isLastOne: true,
            },
        ],
        user: {
            image: `https://www.gravatar.com/avatar/${crypto.createHash('md5').update(user.email).digest('hex')}`,
            name: user.name,
        },
        navItems: req.navItems,
        addItemLink: null,
    });
})

router.get('/:entitySlug/:page', checkUserLogin, makeNavItems, (req, res) => {
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
        navItems: req.navItems,
        addItemLink: `${req.baseUrl}/${req.params.entitySlug}/add`,
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

router.get('/:entitySlug/add', checkUserLogin, makeNavItems, (req, res) => {
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
        navItems: req.navItems,
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
                    return `<label class="switch switch-3d switch-primary mr-3"><input type="checkbox" id="${this.name}-input" name="${this.name}" class="switch-input" ><span class="switch-label"></span><span class="switch-handle"></span></label>`
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
                case 'query':
                    return `
                        <select class="form-control" id="${this.name}-input" name="${this.name}"><option value="">Please select</option></select>
                        <script>
                        window.onload = function() {
                            $('#${this.name}-input').select2({ajax: {
                                url: '/admin/get-query/${req.params.entitySlug}/${this.name}',
                                data: function (params) {
                                    return {
                                        q: params.term,
                                        page:  params.page || 1
                                    }
                                }
                            }});
                        };
                        </script>
                    `
                case 'query-multiple':
                    return `
                        <select class="form-control" id="${this.name}-input" name="${this.name}"></select>
                        <script>
                        window.onload = function() {
                            $('#${this.name}-input').select2({ajax: {
                                url: '/admin/get-query/${req.params.entitySlug}/${this.name}',
                                data: function (params) {
                                    return {
                                        q: params.term,
                                        page:  params.page || 1
                                    }
                                }
                            }, multiple: true});
                        };
                        </script>
                    `
                default:
                    return ''
            }
        }
    });
});

router.post('/:entitySlug/add', checkUserLogin, (req, res) => {
    const entityData = entities.find(item => item.slug === req.params.entitySlug);    
    entityData.addItem(req.body);
    res.redirect(`/admin/${req.params.entitySlug}/1`);
})

router.get('/:entitySlug/:id/edit', checkUserLogin, makeNavItems, (req, res) => {
    const entityData = entities.find(item => item.slug === req.params.entitySlug);
    const targetItem = entityData.getItem(req.params.id);
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
                title: 'Edit',
                link: `${req.baseUrl}/${req.params.entitySlug}/${req.params.id}/edit`,
                isLastOne: true,
            },
        ],
        user: {
            image: `https://www.gravatar.com/avatar/${crypto.createHash('md5').update(user.email).digest('hex')}`,
            name: user.name,

        },
        navItems: req.navItems,
        fields: Object.entries(entityData.fields).map(([key, val]) => {
            return {
                name: key,
                type: val.type,
                label: val.title,
                options: val.options,
                value: targetItem[key],
            }
        }),
        getInputByType: function() {
            switch (this.type) {
                case 'text':
                    return `<input type="text" id="${this.name}-input" value="${this.value}" name="${this.name}" placeholder="${this.label}" class="form-control">`;
                case 'number':
                    return `<input type="number" id="${this.name}-input" value="${this.value}" name="${this.name}" placeholder="${this.label}" class="form-control">`;
                case 'long-text':
                    return `<textarea id="${this.name}-input" value="${this.value}" name="${this.name}" placeholder="${this.label}" class="form-control"></textarea>`;
                case 'bool':
                    return `<label class="switch switch-3d switch-primary mr-3"><input type="checkbox" id="${this.name}-input" name="${this.name}" class="switch-input" ${this.value ? 'checked="true"' : ''}"><span class="switch-label"></span><span class="switch-handle"></span></label>`
                case 'date':
                    return `<div class="input-group date datetimepicker" id="${this.name}-datepicker" data-target-input="nearest"><input type="text" id="${this.name}-input" value="${this.value}" name="${this.name}" class="form-control datetimepicker-input" data-target="#${this.name}-datepicker"/><div class="input-group-append" data-target="#${this.name}-datepicker" data-toggle="datetimepicker"><div class="input-group-text"><i class="fa fa-calendar"></i></div></div></div>`
                case 'enum':
                    if (!this.options || !this.options.inputType || this.options.inputType === 'select') {
                        const options = this.options && this.options.map && Object.entries(this.options.map).map(([key, val]) => (`<option value="${key}">${val}</option>`));
                        return `<select value="${this.value}" id="${this.name}-input" name="${this.name}" class="form-control"><option value="0">Please select</option>${options && options.join('')}</select>`;
                    } else if (this.options && this.options.inputType && this.options.inputType === 'radio') {
                        const radios = this.options.map && Object.entries(this.options.map).map(([key, val]) => (`<div class="radio"><label for="${this.name}-${key}-radio" class="form-check-label "><input type="radio" id="${this.name}-${key}-radio" name="${this.name}" value="${key}" ${this.value === key ? 'checked="true"' : ''} class="form-check-input">${val}</label></div>`));
                        return `<div class="form-check">${radios.join('')}</div>`;
                    } else if (this.options && this.options.inputType && this.options.inputType === 'radio-inline') {
                        const radios = this.options.map && Object.entries(this.options.map).map(([key, val]) => (`<label for="${this.name}-${key}-radio" class="form-check-label "><input type="radio" id="${this.name}-${key}-radio" name="${this.name}" value="${key}" ${this.value === key ? 'checked="true"' : ''} class="form-check-input">${val} &nbsp;&nbsp;</label>`));
                        return `<div class="form-check-inline form-check">${radios.join('')}</div>`;
                    } else {
                        return ''
                    }
                case 'multi-enum':
                    if (!this.options || !this.options.inputType || this.options.inputType === 'select') {
                        const options = this.options && this.options.map && Object.entries(this.options.map).map(([key, val]) => (`<option value="${key}" ${this.value.includes(key) ? 'selected' : ''}>${val}</option>`));
                        return `<select id="${this.name}-input" name="${this.name}" class="form-control" multiple="">${options && options.join('')}</select>`;
                    } else if (this.options && this.options.inputType && this.options.inputType === 'check-box') {
                        const checkboxs = this.options.map && Object.entries(this.options.map).map(([key, val]) => (`<div class="checkbox"><label for="${this.name}-${key}-checkbox" class="form-check-label "><input type="checkbox" id="${this.name}-${key}-checkbox" name="${this.name}" value="${key}" ${this.value.includes(key) ? 'checked' : ''} class="form-check-input">${val}</label></div>`));
                        return `<div class="form-check">${checkboxs.join('')}</div>`;
                    } else if (this.options && this.options.inputType && this.options.inputType === 'check-box-inline') {
                        const checkboxs = this.options.map && Object.entries(this.options.map).map(([key, val]) => (`<label for="${this.name}-${key}-checkbox" class="form-check-label "><input type="checkbox" id="${this.name}-${key}-checkbox" name="${this.name}" value="${key}" ${this.value.includes(key) ? 'checked' : ''} class="form-check-input">${val} &nbsp;&nbsp;</label>`));
                        return `<div class="form-check-inline form-check">${checkboxs.join('')}</div>`;
                    } else {
                        return ''
                    }
                case 'file':
                    return `<input type="file" id="${this.name}-input" name="${this.name}" value="${this.value}" class="form-control-file">`
                case 'query':
                    const label = this.options.getLabel(this.value).text;
                    return `
                        <select class="form-control" id="${this.name}-input" name="${this.name}"><option value="${this.value}">${label}</option></select>
                        <script>
                        window.onload = function() {
                            $('#${this.name}-input').select2({ajax: {
                                url: '/admin/get-query/${req.params.entitySlug}/${this.name}',
                                data: function (params) {
                                    return {
                                        q: params.term,
                                        page:  params.page || 1
                                    }
                                }
                            }});
                        };
                        </script>
                    `
                case 'query-multiple':
                    const preSelectedOptions = this.value.map(key => (`<option value="${key}" selected="selected">${this.options.getLabel(key).text}</option>`)).join(' ');
                    return `
                        <select class="form-control" id="${this.name}-input" name="${this.name}" multiple="">
                            ${preSelectedOptions}
                        </select>
                        <script>
                        window.onload = function() {
                            $('#${this.name}-input').select2({ajax: {
                                url: '/admin/get-query/${req.params.entitySlug}/${this.name}',
                                data: function (params) {
                                    return {
                                        q: params.term,
                                        page:  params.page || 1
                                    }
                                }
                            }});
                        };
                        </script>
                    `
                default:
                    return ''
            }
        }
    });
})

router.post('/:entitySlug//:id/edit', checkUserLogin, (req, res) => {
    const entityData = entities.find(item => item.slug === req.params.entitySlug);    
    entityData.editItem(req.params.id, req.body);
    res.redirect(`/admin/${req.params.entitySlug}/1`);
})

router.get('/:entitySlug/:id/delete', (req, res) => {
    const entityData = entities.find(item => item.slug === req.params.entitySlug);    
    entityData.deleteItem(req.params.id,);
    res.redirect(`/admin/${req.params.entitySlug}/1`);
})

router.get('/get-query/:entitySlug/:field', checkUserLogin, (req, res) => {
    const entityData = entities.find(item => item.slug === req.params.entitySlug);
    const result = entityData.fields[req.params.field].options.onQuery(req.query.q, req.query.page);
    res.status(200).send(result);
})

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


export default router;