import express from 'express';
import getError from '../../../utils/getError';
import { Room } from '../../../models';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { room_name } = req.body;

        const roomData = Room.create({ room_name });

        res.status(200).json(roomData);

    } catch (err) {
        const errMsg = getError(err);
        res.status(500).json({ error: errMsg });
    }
})

export default router;