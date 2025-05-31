const jwt = require("jsonwebtoken");
const key = "admin#123"

const authJWT = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({ message: "Unauthorized no token" })
    }
    const token = authHeader.split(' ')[1]
    try {
        const decoded = jwt.verify(token, key)
        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" })
    }
}

module.exports=authJWT