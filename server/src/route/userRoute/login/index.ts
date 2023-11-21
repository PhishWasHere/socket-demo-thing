import express from 'express';
import getError from '../../../utils/getError';
import { User } from '../../../models';
import { signToken } from '../../../utils/auth';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;

        try {
            const userData = await User.findOne({ username });

            if (!userData) res.status(400).json({ error: 'Username does not exist' });

            // add password comparison once db hashing setup

            const token = signToken({ _id: userData!._id, username }, res);
            
            // Socket_ID set when frontend 'login' event is emitted (/utils/socket)
            res.status(201).json({ username, id: userData!._id, token });

        } catch {
            res.status(400).json({ error: 'Username not found' });
        }

    } catch (err) {
        const errMsg = getError(err);
        res.status(500).json({ error: errMsg });
    }
});

export default router;