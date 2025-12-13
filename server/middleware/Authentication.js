import jwt from "jsonwebtoken";
import User from "../modules/UserModule.js";
const authenticat = async (req,res,next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) throw new Error("Not authorized");

        const decode = jwt.verify(token, process.env.secret_key);
         req.user = await User.findById(decode.id).select("-password");
    next();
    } catch (error) {
         res.status(401).json({ message: error.message });
    }
}

export default authenticat;