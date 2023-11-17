import express, { Request, Response } from 'express';
import getError from '../utils/getError';
import { getSocket } from '../utils/socket';
import * as userRoute from './userRoute';
import * as roomRoute from './roomRoute';

const router = express.Router();
router.use('/user', userRoute.default);
router.use('/room', roomRoute.default);

router.get('/', async (req: Request, res: Response) => {
    try {
        res.send('Hello World!')
    } catch (err) {
        getError(err)
    }
})

// router.get('/room/*', async (req: Request, res: Response) => {
//     try {
//         const io = getSocket() // get socket.io instance
//         // ... setup route
//     } catch (err) {
//         console.log(err);
//     }
// })

export default router