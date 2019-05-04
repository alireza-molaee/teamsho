import Kavenegar from 'kavenegar';

const api = Kavenegar.KavenegarApi({
    apikey: process.env.KAVENEGAR_API_KEY
});

export function sendSMS(phoneNumber, message) {
    return new Promise((resolve, reject) => {
        api.Send({
            message: message,
            receptor: phoneNumber
        }, (response, status) => {
            if (status === 200) {
                resolve(response);
            } else {
                reject(response);
            }
        });
    })
}

export function verifySMS(phoneNumber, token) {
    return new Promise((resolve, reject) => {
        api.VerifyLookup({
            template: "verify",
            token: token,
            receptor: phoneNumber
        }, (response, status) => {
            if (status === 200) {
                resolve(response);
            } else {
                reject(response);
            }
        });
    })
}