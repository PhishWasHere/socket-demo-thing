import mongoose from "mongoose";
import getError from "../utils/getError";

const roomSchema = new mongoose.Schema({
    room_name: {type: String, required: true},
    // user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message'}],
    created_at: {type: Date, default: Date.now},
});

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    socket_id: {type: String, required: false},
    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room'} ],
    created_at: {type: Date, default: Date.now},
});

const messageSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    message: {type: String, required: true, maxLength: 500}, // 500 characters max limit
    created_at: {type: Date, default: Date.now},
});

// pre-save hook to check if room has more than 100 messages
messageSchema.pre('save', async function(next) { 
    const message = this;
    try {
        const room = await Room.findById(message.room);

        if (!room) return next(new Error('Room not found'));

        if (room.messages.length >= 100) {
            room.messages.shift();
            room.save();
        }
    } catch (err) {
        const errMsg = getError(err);
        next(new Error (errMsg));
    }
});

// pre-save hook to check if user is in more than 25 rooms
// TODO add password hashing and salting
userSchema.pre('save', async function(next) { 
    const user = this;
    try {
        if (user.rooms.length > 25) {
            next(new Error('User cannot join more than 25 rooms'));
        } else {
            next();
        }
    } catch (err) {
        const errMsg = getError(err); 
        next(new Error (errMsg));
    }
});
export const Room = mongoose.model('Room', roomSchema);
export const User = mongoose.model('User', userSchema);
export const Message = mongoose.model('Message', messageSchema);