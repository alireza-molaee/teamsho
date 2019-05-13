export const findSchema = {
    title: {
        isString: true,
        trim: true,
    },
    category: {
        isString: true,
        isMongoId: true,
        trim: true,
    },
    location: {
        isArray: true,
    },
    'location.*': {
        exists: {
            option: {
                checkNull: true,
            }
        },
        isString: true,
        isLatLong: true,
        trim: true,
    },
    date: {
        isString: true,
        isISO8601: true,
    }
}

export const createEventSchema = {
    title: {
        exists: {
            option: {
                checkNull: true,
            }
        },
        isString: true,
        trim: true,
    },
    dateTime: {
        exists: {
            option: {
                checkNull: true,
            }
        },
        isString: true,
        isISO8601: true,
    },
    location: {
        isArray: true,
    },
    'location.*': {
        exists: {
            option: {
                checkNull: true,
            }
        },
        isString: true,
        isLatLong: true,
        trim: true,
    },
    image: {
        isString: true,
        trim: true,
    },
    categoryId: {
        exists: {
            option: {
                checkNull: true,
            }
        },
        isString: true,
        isMongoId: true,
        trim: true,
    },
    minMember: {
        isInt: true,
        custom: {
            options: (value, { req }) => {
              if (req.body.maxMember && req.body.maxMember <= value) {
                throw new Error('min member must be lower than max member');
              }
            }
        },
    },
    maxMember: {
        isInt: true,
        custom: {
            options: (value, { req }) => {
              if (req.body.minMember && req.body.minMember >= value) {
                throw new Error('max member must be greater than min member');
              }
            }
        },
    },
    minAge: {
        isInt: true,
        custom: {
            options: (value, { req }) => {
              if (req.body.maxAge && req.body.maxAge <= value) {
                throw new Error('min age must be lower than max age');
              }
            }
        },
    },
    maxAge: {
        isInt: true,
        custom: {
            options: (value, { req }) => {
              if (req.body.minAge && req.body.minAge >= value) {
                throw new Error('max age must be greater than min age');
              }
            }
        },
    },
    minSkill: {
        isInt: true,
        custom: {
            options: (value, { req }) => {
              if (req.body.maxSkill && req.body.maxSkill <= value) {
                throw new Error('min skill must be lower than max skill');
              }
            }
        },
    },
    maxSkill: {
        isInt: true,
        custom: {
            options: (value, { req }) => {
              if (req.body.minSkill && req.body.minSkill >= value) {
                throw new Error('max skill must be greater than min skill');
              }
            }
        },
    }
}

export const updateEventSchema = {
    title: {
        isString: true,
        trim: true,
    },
    dateTime: {
        isString: true,
        isISO8601: true,
    },
    location: {
        isArray: true,
    },
    'location.*': { 
        isString: true,
        isLatLong: true,
        trim: true,
    },
    image: {
        isString: true,
        trim: true,
    },
    categoryId: {
        isString: true,
        isMongoId: true,
        trim: true,
    },
    minMember: {
        isInt: true,
        custom: {
            options: (value, { req }) => {
              if (req.body.maxMember && req.body.maxMember <= value) {
                throw new Error('min member must be lower than max member');
              }
            }
        },
    },
    maxMember: {
        isInt: true,
        custom: {
            options: (value, { req }) => {
              if (req.body.minMember && req.body.minMember >= value) {
                throw new Error('max member must be greater than min member');
              }
            }
        },
    },
    minAge: {
        isInt: true,
        custom: {
            options: (value, { req }) => {
              if (req.body.maxAge && req.body.maxAge <= value) {
                throw new Error('min age must be lower than max age');
              }
            }
        },
    },
    maxAge: {
        isInt: true,
        custom: {
            options: (value, { req }) => {
              if (req.body.minAge && req.body.minAge >= value) {
                throw new Error('max age must be greater than min age');
              }
            }
        },
    },
    minSkill: {
        isInt: true,
        custom: {
            options: (value, { req }) => {
              if (req.body.maxSkill && req.body.maxSkill <= value) {
                throw new Error('min skill must be lower than max skill');
              }
            }
        },
    },
    maxSkill: {
        isInt: true,
        custom: {
            options: (value, { req }) => {
              if (req.body.minSkill && req.body.minSkill >= value) {
                throw new Error('max skill must be greater than min skill');
              }
            }
        },
    }
}