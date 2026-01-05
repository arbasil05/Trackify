import jwt from "jsonwebtoken";
const SECRET_JWT_KEY = process.env.SECRET_JWT_KEY;

function authMiddleWare(req, res, next) {
    try {
        const token = req.cookies.jwt;
        jwt.verify(token, SECRET_JWT_KEY, async (error, decoded) => {
            if (error) {
                res.status(401).json({ message: "Unauthorized user" });
                return
            }
            const id = decoded.id;
            req.id = id;
            next()
        });

    }
    catch (error) {
        console.log(`Error in protected ${error}`);

    }

}

export default authMiddleWare;