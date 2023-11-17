import express, { Request, Response } from 'express';
import getError from '../utils/getError';
import { getSocket } from '../utils/socket';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const io = getSocket() // get socket.io instance

    } catch (err) {
        console.log(err);
    }
})

export default router