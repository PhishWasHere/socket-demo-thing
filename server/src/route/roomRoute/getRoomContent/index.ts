import express from 'express';
// import { getSocket } from '../../../utils/socket';
import { Room, User, Message } from '../../../models';
import getError from '../../../utils/getError';

const router = express.Router();

router.post('/*', async (req, res) => {
    try {
        const { _id, room_id } = req.body;
        const userData = await User.findOne({ _id });

        if (!userData) throw new Error('User not found');
        
        // const socket = await getSocket(userData.socket_id!);

        const messageData = await Message.find({ room: room_id }).populate({
            path: 'user',
            select: 'username' // only return username field from user, removing will return password
        });
        // socket!.to(room_id).emit('getRoomContent', roomData); // user needs to tringger "login" event from front-end before socket can be used
        // console.log(messageData);
        
        res.status(200).json({ messageData });
 
    } catch (err) {
        const errMsg = getError(err);
        res.status(500).json({ error: errMsg });
    }
});

export default router;