import express from 'express';
import { User, Room } from '../../../models';
import getError from '../../../utils/getError';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { _id, room_id, room_name } = req.body;
        // _id = user_id
        let roomData;

        if (!room_id) {
            roomData = await Room.findOne({ room_name }).exec();
        } else {
            roomData = await Room.findById({ _id : room_id }).exec();
        }

        if (!roomData) res.status(405).send('Room not found');

        const userData = await User.findById(_id);
        if (!userData) res.status(405).send('User not found');

        userData!.rooms.push(roomData!._id);
        await userData!.save();

        res.status(200).send('Room joined');

    } catch (err) {
        const errMsg = getError(err);
        res.status(500).json({ error: errMsg });
    }
})

export default router;