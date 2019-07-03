export const entities = [
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
            },
            car: {
                type: 'query-multiple',
                title: 'Car',
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
        getItem: (id) => {
            return {
                firstName: 'علیرضا',
                lastName: 'مولایی مولایی مولایی مولایی مولایی مولایی مولایی مولاییمولایی',
                phoneNumber: '09121010101',
                isActive: true,
                joinAt: new Date(),
                role: 'admin',
                permissions: ['admin', 'manager'],
                picture: 'http://lorempixel.com/200/200/people/',
                car: ['2', '1'],
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
]