import User from '../models/user';
import Category from '../models/category';

export default {
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
        birthday: {
            title: 'Birthday',
            type: 'date',
            options: {
                format: 'YYYY/MM/DD',
            }
        },
        height: {
            type: 'number',
            title: 'Height'
        },
        weight: {
            type: 'number',
            title: 'Weight'
        },
        picture: {
            type: 'file',
            title: 'Picture',
        },
        skills: {
            type: 'query-multiple',
            title: 'Skills',
            options: {
                onQuery: (q, page) => {
                    return {
                        "results": [
                            {
                                "id": '1',
                                "text": "Option 1"
                            },
                            {
                                "id": '2',
                                "text": "Option 2"
                            },
                            {
                                "id": '3',
                                "text": "Option 3"
                            }
                        ],
                        "pagination": {
                            "more": false
                        }
                    }
                },
                getLabel: (id) => {
                    return {
                        id,
                        text: 'Option ' + id
                    }
                }
            }
        },
    },
    listViewFields: ['firstName', 'lastName', 'phoneNumber', 'birthday'],
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
        const ItemPerPage = 10;
        const count = User.count();
        const result = User.find(
            {},
            ['firstName', 'lastName', 'phoneNumber', 'birthday'],
            { skip: ItemPerPage * (page - 1), limit: ItemPerPage }
        )
        return Promise.all([count, result])
            .then(([totalCount, resultItems]) => {
                return {
                    items: resultItems,
                    totalPage: Math.ceil(totalCount / ItemPerPage),
                }
            })
    },
    getItem: (id) => {
        return {

        }
    },
    addItem: (data) => {
        console.log(data);
        return 1;
    },
    editItem: (id, data) => {
        console.log(id, data);
        return 1
    },
    deleteItem: (id) => {
        return 1
    }
}