import express from 'express';
// import { getSocket } from '../../../utils/socket';
import { Room, User } from '../../../models';
import getError from '../../../utils/getError';

const router = express.Router();

router.post('/*', async (req, res) => {
    try {
        const { _id, room_id } = req.body;
        const userData = await User.findOne({ _id });

        if (!userData) throw new Error('User not found');
        
        // const socket = await getSocket(userData.socket_id!);

        const roomData = await Room.findById(room_id).exec();

        // socket!.to(room_id).emit('getRoomContent', roomData); // user needs to tringger "login" event from front-end before socket can be used

        res.status(200).json({apple:'asdasd'});
 
    } catch (err) {
        const errMsg = getError(err);
        res.status(500).json({ error: errMsg });
    }
});

export default router;