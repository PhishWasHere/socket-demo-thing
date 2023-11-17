import express from 'express';
import { getSocket } from '../../../utils/socket';
import { Room } from '../../../models';
import getError from '../../../utils/getError';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { _id, room_id } = req.body;
        
        const socket = getSocket(_id);

        const roomData = await Room.findById(room_id).exec();

        socket!.to(room_id).emit('getRoomContent', roomData); // user needs to tringger "login" event from front-end before socket can be used

        res.status(200).json({});
 
    } catch (err) {
        const errMsg = getError(err);
        res.status(500).json({ error: errMsg });
    }
});

export default router;