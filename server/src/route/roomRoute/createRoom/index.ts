import express from 'express';
import getError from '../../../utils/getError';
import { Room, User } from '../../../models';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { room_name } = req.body;
        
        const roomData = await Room.create({ room_name });
        
        await User.findOneAndUpdate({ _id: req.body._id }, { $push: { rooms: roomData._id} });

        res.status(200).json(roomData);

    } catch (err) {
        const errMsg = getError(err);
        res.status(500).json({ error: errMsg });
    }
})

export default router;