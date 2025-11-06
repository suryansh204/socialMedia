import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: { //HASHED password
        type: String,
        required: true
    },
    createdAt: String,
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profiles'
    },
    posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Posts'}]
})

export default mongoose.model('User', userSchema);