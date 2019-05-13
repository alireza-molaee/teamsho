export const loginSchema = {
    phoneNumber: {
        exists: {
            option: {
                checkNull: true,
            }
        },
        isLength: {
            options: { min: 11, max:11 }
        },
        isNumeric: true
    }
}



export const registerSchema = {
    firstName: {
        exists: {
            option: {
                checkNull: true,
            }
        },
        isString: true,
        trim: true,
    },
    lastName: {
        exists: {
            option: {
                checkNull: true,
            }
        },
        isString: true,
        trim: true,
    },
    phoneNumber: {
        exists: {
            option: {
                checkNull: true,
            }
        },
        isLength: {
            options: { min: 11, max:11 }
        },
        isNumeric: true
    }

}

export const verifyUserSchema = {
    userId: {
        exists: {
            option: {
                checkNull: true,
            }
        },
        isString: true,
        trim: true,
    },
    secretCode: {
        exists: {
            option: {
                checkNull: true,
            }
        },
        isString: true,
        trim: true,
    }
}


export const updateProfileSchema = {
    firstName: {
        isString: true,
        trim: true,
    },
    lastName: {
        isString: true,
        trim: true,
    },
    birthday: {
        isString: true,
        isISO8601: true,
        trim: true,
        toDate: true,
    },
    height: {
        isNumeric: true,
    },
    weight: {
        isNumeric: true,
    },
    skills: {
        isArray: true,
    }
}
