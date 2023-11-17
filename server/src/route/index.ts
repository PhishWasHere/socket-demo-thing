import express, { Request, Response } from 'express';
import ioServer from '../utils/socket';
import { server } from '../server';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        ioServer(server)
    } catch (err) {
        
    }
})

export default router