import express from 'express';
import { checkSchema, check } from 'express-validator/check';
import { handleValidationError } from '../../middlewares/error-handling';
import authMW from '../../middlewares/auth';
import {User, redisClient} from '../../models';
import { verifySMS } from '../../utils/sms';
import { HttpError } from '../../utils/error';
import validator from 'validator';
import { createJWToken } from '../../utils/auth';
import path from 'path';

const router = express.Router()

const loginSchema = {
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

function login(req, res, next) {
    const { phoneNumber } = req.body;
    const secretCode = Math.floor(Math.random()*90000) + 10000;
    User.find({ phoneNumber })
    .then(user => {
        if (!user[0]) {
            throw new HttpError(`can not find user with this phone number "${phoneNumber}"`, 404);
        }

        const catchUser = {
            phoneNumber: user[0].phoneNumber,
            secretCode
        };
        redisClient.hmset(`user:${user[0].id}`, catchUser);
        return user[0];
    })
    .then((user) => {
        verifySMS(user.phoneNumber, String(secretCode));
        return user;
    })
    .then((user) => {
        res.status(200).send({
            userId: user.id,
        });
    }).catch(err => {
        console.log(err);
        next(err)
    })
}

const registerSchema = {
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

function register(req, res, next) {
    const {firstName, lastName, phoneNumber} = req.body;
    const userPreId = new Date().valueOf();
    const secretCode = Math.floor(Math.random()*90000) + 10000;
    User.findOne({phoneNumber})
    .then(user => {
        if (user) {
            throw new HttpError('user exist', 409); 
        }
        const catchUser = {
            phoneNumber,
            firstName,
            lastName,
            secretCode
        };
        return redisClient.hmset(`user:${userPreId}`, catchUser);
    })
    .then(() => {
        verifySMS(phoneNumber, String(secretCode));
    })
    .then(() => {
        res.status(200).send({
            userId: userPreId,
        });
    }).catch(err => {
        next(err)
    })

}

const verifyUserSchema = {
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

function verifyUser(req, res, next) {
    const { userId, secretCode } = req.body;
    const isSavedUser = validator.isMongoId(userId);
    redisClient.pipeline()
    .hgetall(`user:${userId}`)
    .exec()
    .then((redisRes) => {
        const catchUser = redisRes[0][1];
        if (!catchUser.secretCode) {
            throw new HttpError('secret code not set', 428); 
        }
        if (Number(catchUser.secretCode) !== Number(secretCode)) {
            redisClient.del(`user:${userId}`);
            throw new HttpError('wrong code', 401); 
        }

        if (isSavedUser) {
            return User.findById(userId);
        } else {
            return User.create({
                phoneNumber: catchUser.phoneNumber,
                firstName: catchUser.firstName,
                lastName: catchUser.lastName
            })
        }

    })
    .then(user => {
        if (!user) {
            throw new HttpError(`can not find user with this id "${userId}"`, 404);
        }
        const token = createJWToken({id: user.id ,picture: user.picture,fullName: `${user.firstName} ${user.lastName}`});
        res.status(200).send({
            "id": user.id,
            "fullName": `${user.firstName} ${user.lastName}`,
            "birthday": user.birthday,
            "height": user.height,
            "weight": user.weight,
            "picture": user.picture,
            "skills": user.skills,
            "token": token
        });
    }).catch(err => {
        if (err.name === "MongoError" && err.code === 11000) {
            next(new HttpError('this user registered before', 409));
        } else {
            next(err)
        }
    })
}

function getProfile(req, res, next) {
    const userId = req.user.id;
    User.findById(userId)
    .then(user => {
        if (!user) {
            throw new HttpError(`can not find user with this id "${user.id}"`, 404);
        }
        const token = createJWToken({id: user.id ,picture: user.picture,fullName: `${user.firstName} ${user.lastName}`});
        res.status(200).send({
            "id": user.id,
            "fullName": `${user.firstName} ${user.lastName}`,
            "birthday": user.birthday,
            "height": user.height,
            "weight": user.weight,
            "picture": user.picture,
            "skills": user.skills,
            "token": token
        });
    })
    .catch(err => {
        if (err.name === "MongoError" && err.code === 11000) {
            next(new HttpError('this user registered before', 409));
        } else {
            next(err)
        }
    });
}

const updateProfileSchema = {
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

function updateProfile(req, res) {
    const userId = req.user.id;
    let updateData = Object.entries(res.body).filter(item => {
        return (item[1] !== null && item[1] !== undefined);
    });
    updateData = updateData.reduce((data, item) => {
        data[item[0]] = item[1];
        return data;
    }, {});
    User.findByIdAndUpdate(userId, updateData)
    .exec()
    .then(user => {
        if (!user) {
            throw new HttpError(`can not find user with this id "${user.id}"`, 404);
        }
        const token = createJWToken({id: user.id ,picture: user.picture,fullName: `${user.firstName} ${user.lastName}`});
        res.status(200).send({
            "id": user.id,
            "fullName": `${user.firstName} ${user.lastName}`,
            "birthday": user.birthday,
            "height": user.height,
            "weight": user.weight,
            "picture": user.picture,
            "skills": user.skills,
            "token": token
        });
    })
    .catch(err => {
        if (err.name === "MongoError" && err.code === 11000) {
            next(new HttpError('this user registered before', 409));
        } else {
            next(err)
        }
    });
}

function uploadPicture(req, res) {
    const picture = req.files.picture;
    if (!picture) {
        throw new HttpError('picture not exist in body', 400);
    }
    if (!/image\/*/i.test(picture.mimetype)) {
        throw new HttpError('incorrect file type', 400);
    }
    const fileName = picture.md5 + path.extname(picture.name);
    picture.mv(path.join('uploads', 'user-picture', fileName));
    res.status(201).send({
        url: path.join(req.headers.host, 'static', 'user-picture', fileName)
    })
}


router.post('/login', [
    checkSchema(loginSchema),
    handleValidationError,
], login);

router.post('/register', [
    checkSchema(registerSchema),
    handleValidationError,
], register);

router.post('/confirm', [
    checkSchema(verifyUserSchema),
    handleValidationError,
], verifyUser);

router.get('/profile', authMW, getProfile);

router.put('/profile', [
    authMW,
    checkSchema(updateProfileSchema),
    handleValidationError,
],updateProfile);

router.post('/upload-picture', [
    authMW,
], uploadPicture)

export default router;

