import express from 'express';
import * as signUp from './signup';
import * as login from './login';

const router = express.Router();

router.use('/signup', signUp.default);
router.use('/login', login.default);

router.get('/', async (req, res) => {
    try {
        res.send('/user');
    } catch (err) {
        console.log(err);
    }
})

export default router;