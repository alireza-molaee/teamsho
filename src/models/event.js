import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: String,
    dateTime: Date,
    location: {
        type: { type: String },
        coordinates: []
    },
    categoryId: mongoose.Schema.Types.ObjectId,
    leader: mongoose.Schema.Types.ObjectId,
    minMember: {
        type: Number,
        min: 1,
    },
    maxMember: Number,
    image: String,
    description: String,
    minAge: Number,
    maxAge: Number,
});

console.log(eventSchema);

eventSchema.index({ "location": "2dsphere" });

const Event = mongoose.model('Event', eventSchema);

export default Event;