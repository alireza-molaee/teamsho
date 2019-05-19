import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: String,
    dateTime: Date,
    location: {
        type: { 
            type: String,
            enum: ['Point'],
            required: true
         },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    categoryId: mongoose.Schema.Types.ObjectId,
    leader: mongoose.Schema.Types.ObjectId,
    minMember: {
        type: Number,
        min: 0,
    },
    maxMember: Number,
    image: String,
    description: String,
    minAge: Number,
    maxAge: Number,
    minSkill: {
        type: Number,
        min: 0,
        max: 4
    },
    maxSkill: {
        type: Number,
        min: 0,
        max: 4
    },
});

eventSchema.index({ "location": "2dsphere" });

const Event = mongoose.model('Event', eventSchema);

export default Event;