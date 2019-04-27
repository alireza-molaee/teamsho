import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
    joinAt: {
        type: Date,
        required: true,
    },
    userId: mongoose.Schema.Types.ObjectId,
    eventId: mongoose.Schema.Types.ObjectId,
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;