import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import getError from '../getError';

const expiry = '8h'
const secret = process.env.JWT_SECRET || 'secret'

export const signToken = (payload: object, res: Response) => { // creates token
    const token = jwt.sign(payload, secret, { expiresIn: expiry }); 
    res.cookie('Token', token, { httpOnly: true });

    return token;
};

interface CustomRequest extends Request {
    token: string | JwtPayload;
}

export const verifyToken = (token: string) => { // verifies token
    return jwt.verify(token, secret, { maxAge: expiry });
};


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => { // checks token for user, if there is a token, it will add the _id to the req.body
    let token = req.body.token || req.query.token || req.headers.authorization;
    
    if (req.headers.authorization) { // takes token from req
        token = token.split(' ').pop().trim(); // removes 'Bearer' from token
    }
    
    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    try {        
        const payload = jwt.verify(token, secret, { maxAge: expiry}) as {
            payload: JwtPayload;
            _id: string; 
        };

        req.body._id = payload.payload._id;
        
        (req as CustomRequest).token = payload;
        next();
    } catch (err) {
        getError(err as Error);
        return res.status(401).send('Unauthorized');
    }

    return req;
};