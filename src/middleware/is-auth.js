const jwt = require("jsonwebtoken");
const { createResponse } = require("../variables/createResponse");

exports.isAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send(
            createResponse(401, "Không tìm thấy Authorization!", {})
        );
    }

    const token = authHeader;

    let decodedToken;

    try {
        decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        return res.status(500).send(
            createResponse(500, "Access token không hợp lệ!", {})
        );
    }

    if (!decodedToken) {
        return res.status(401).send(
            createResponse(401, "Không tìm thấy Authorization!", {})
        );
    }

    req.user = decodedToken;
    next();
}