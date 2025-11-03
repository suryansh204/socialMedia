import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
    bio: String,
    username: String,
    email: String,
    phone: String,
    school: String,
    location: String,
    createdAt: String,
    birthDate: String,
    relationship: String,
    picture: String
})

export default mongoose.model('Profile', profileSchema);