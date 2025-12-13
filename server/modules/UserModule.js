import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8
        },
        image: {
            type: String,
            required: false,
            default: ''
        },
    role: {
        type: String,
        enum: ['admin' , 'user'] ,
        default: 'user'
    },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', UserSchema);

export default User;