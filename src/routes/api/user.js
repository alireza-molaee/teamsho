import express from 'express';
import { checkSchema, check } from 'express-validator/check';
import { handleValidationError } from '../../middlewares/error-handling';
import UserModel from '../../models/user';
import { verifySMS } from '../../utils/sms';

const router = express.Router()

function login() {

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

function register(req, res) {
    const {firstName, lastName, phoneNumber} = req.body;
    UserModel.findOne({phoneNumber})
    .then(user => {
        if (user) {
            return user.renewSecretCode();
        } else {
            return UserModel.create({
                phoneNumber,
                firstName,
                lastName,
            })
        }
    })
    .then((user) => {
        verifySMS(phoneNumber, String(user.secretCode))
        return user;
    })
    .then((user) => {
        res.status(200).send({
            userId: user.id,
        });
    }).catch(err => {
        console.error(err);
    })

}

function getProfile() {

}

function updateProfile() {

}

function forgetPassword() {

}

function uploadPicture() {

}


router.post('/register', [
    checkSchema(registerSchema),
    handleValidationError,
], register)

export default router;

