const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const { createResponse } = require("../variables/createResponse");
require("dotenv").config();

// LOGIN
exports.login = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const token_devices = req.body.token_devices;
    const factory = req.body.factory;

    const userInfo = {
        username,
        factory,
    };

    // console.log(userInfo);

    const user = await userModel.getInfoUser(userInfo);

    if (user === null || user.user_name !== username || user.password !== password) {
        return res.status(401).send(
            createResponse(401, "Tài khoản và mật khẩu không chính xác!", { username, password })
        );
    }

    const updateTokendevices = {
        username,
        factory,
        token_devices
    }

    const update_token_devices = userModel.updateTokenDevicesUser(updateTokendevices);

    if (update_token_devices === 0) {
        return res.status(401).send(
            createResponse(401, "Vui lòng kiểm tra quyền truy cập thông báo thiết bị!", { username, password })
        )
    }

    const infoUser = {
        username: user.user_name,
        factory: user.factory
    }

    let accessToken = jwt.sign(
        infoUser,
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_LIFE
        }
    )

    let refreshToken = jwt.sign(
        infoUser,
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_LIFE
        }
    )

    return res.status(200).send(
        createResponse(200, "Đăng nhập thành công!", {
            token: accessToken,
            refreshToken: refreshToken
        })
    )
}

// REGISTER

exports.register = async (req, res) => {
    const factory = req.body.factory;
    const name = req.body.name;
    const lean = req.body.lean;
    const permission = req.body.permission;
    const floor = req.body.floor;
    const floors = req.body.floors;
    const position = req.body.position;
    const username = req.body.user_name;
    const password = req.body.password;

    const checkExistUser = {
        factory,
        username
    }

    const check_exist_user = await userModel.getInfoUser(checkExistUser);

    if (check_exist_user !== null) {
        return res.status(401).send(
            createResponse(401, "Tài khoản đã tồn tại!", checkExistUser)
        )
    }

    const create_account = {
        factory,
        name,
        lean,
        permission,
        floor,
        floors,
        position,
        username,
        password
    };

    const createAccount = await userModel.registerUser(create_account);

    return res.status(200).send(
        createResponse(200, "Đăng ký tài khoản thành công!", createAccount)
    )
}

// REFRESH TOKEN
exports.refreshToken = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send(
            createResponse(401, "Không tìm thấy Authorization!", {})
        );
    }

    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
        return res.status(401).send(
            createResponse(401, "Không có refresh token", {})
        );
    }

    const decoded = jwt.verify(
        authHeader,
        process.env.ACCESS_TOKEN_SECRET
    )

    if (!decoded) {
        return res.status(500).send(
            createResponse(500, "Access token không hợp lệ!", {})
        );
    }

    const infoUser = {
        username: decoded.username,
        factory: decoded.factory
    }

    const access_token = jwt.sign(
        infoUser,
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_LIFE
        }
    )

    return res.status(200).send(
        createResponse(200, "Access token thành công!", {
            token: access_token
        })
    )
}