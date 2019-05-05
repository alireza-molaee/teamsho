import express from 'express';
import { checkSchema, check } from 'express-validator/check';
import { handleValidationError } from '../../middlewares/error-handling';
import {User, redisClient} from '../../models';
import { verifySMS } from '../../utils/sms';
import { HttpError } from '../../utils/error';
import validator from 'validator';
import { createJWToken } from '../../utils/auth';

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
        if (!user) {
            throw new HttpError(`can not find user with this phone number "${phoneNumber}"`, 404);
        }

        const catchUser = {
            phoneNumber: user.phoneNumber,
            secretCode
        };
        redisClient.hmset(`user:${user.id}`, catchUser);
        return user;
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

function getProfile() {
    
}

function updateProfile() {

}

function uploadPicture() {

}


router.post('/login', [
    checkSchema(loginSchema),
    handleValidationError,
], login)

router.post('/register', [
    checkSchema(registerSchema),
    handleValidationError,
], register)

router.post('/confirm', [
    checkSchema(verifyUserSchema),
    handleValidationError,
], verifyUser)

export default router;

