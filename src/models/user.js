import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
    categoryId: mongoose.Schema.Types.ObjectId,
    rate: {
        type: String,
        enum: ["very-weak", "weak", "medium", "strong", "very-strong"]
    }
})

const userSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        unique: true,
        required: true,
    },
    secretCode: {
        type: String,
        required: true,
        default: () => {
            return Math.floor(Math.random()*90000) + 10000;
        }
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    birthday: {
        type: Date,
    },
    height: {
        type: Number,
    },
    weight: {
        type: Number,
    },
    picture: {
        type: String,
    },
    skills: [skillSchema]
});

userSchema.methods.renewSecretCode = function() {
    this.secretCode = Math.floor(Math.random()*90000) + 10000;
    return this.save();
}

const User = mongoose.model('User', userSchema);

export default User;