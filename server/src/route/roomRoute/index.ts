import express from 'express';
import { authMiddleware } from '../../utils/auth';
import getError from '../../utils/getError';
import { User, Room } from '../../models';

import * as joinRoom from './joinRoom';
import * as createRoom from './createRoom';
import * as getRoomContent from './getRoomContent';

const router = express.Router();

router.use('/join', authMiddleware, joinRoom.default); // needs valid token to access
router.use('/create', authMiddleware, createRoom.default); // needs valid token to access
router.use('/*',  getRoomContent.default); // needs valid token to access

router.get('/', async (req, res) => {
    try {
        const { _id } = req.body;

        const userData = await User.findById(_id).exec();

        if (!userData) res.status(405).send('User not found');

        const roomData = await Room.find({ _id: { $in: userData!.rooms } }).exec();
        
        res.status(200).json(roomData);

    } catch (err) {
        const errMsg = getError(err);
        res.status(500).json({ error: errMsg });
    }
})

export default router;