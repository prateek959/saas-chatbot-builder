import jwt from 'jsonwebtoken';
import 'dotenv/config';

const checkToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ msg: "Unauthrized Access" });
        }

        const token = authHeader.split(' ')[1];
        const decode = jwt.verify(token,process.env.SECRET_KEY);
        req.user = decode;
        next();

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};


export {checkToken};