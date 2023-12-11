const productModel = require("../models/product");
const { createResponse } = require("../variables/createResponse");

exports.getProcessStatusProduct = async (req, res) => {
    try {
        const infoUser = {
            username: req.body.username,
            factory: req.body.factory
        }

        const process_status = await productModel.getProcessStatusProduct(infoUser);

        return res.status(200).send(
            createResponse(200, "Dữ liệu thành công!", process_status)
        )
    } catch (error) {
        return error;
    }
}

exports.getHistoryStatusProduct = async (req, res) => {
    try {
        const infoUser = {
            username: req.body.username,
            factory: req.body.factory
        }

        const history_status = await productModel.getHistoryStatusProduct(infoUser);

        return res.status(200).send(
            createResponse(200, "Dữ liệu thành công!", history_status)
        )
    } catch (error) {
        return error;
    }
}

exports.sendRequestFixMachine = async (req, res) => {
    try {
        const id_machine = req.body.id_machine;
        const id_user_request = req.body.username;
        const factory = req.body.factory;
        const remark = req.body.remark;
        const fixer = req.body.fixer;

        const infoTask = {
            id_machine,
            id_user_request,
            factory
        }

        const check_exists = await productModel.getInfoTask(infoTask);

        if (check_exists >= 1) {
            return res.status(401).send(
                createResponse(401, "Phiếu này đã tồn tại!", infoTask)
            );
        }

        let position;

        switch (factory) {
            case "LYV":
                position = 2;
                break;
            default:
                break;
        }

        const getMechanic = {
            factory,
            fixer,
            position
        }

        const get_mechanic = await productModel.getMechanic(getMechanic);

        if (get_mechanic.rowsAffected == 0) {
            return res.status(401).send(
                createResponse(401, "Không tìm được thợ!", getMechanic)
            );
        }

        const createRequest = {
            id_machine,
            id_user_request,
            factory,
            remark,
            fixer,
            position,
            id_owner_mechanic: get_mechanic.recordset[0].user_name
        };

        const send_request_fix_mechanic = await productModel.sendRequestFixMachine(createRequest);

        if (send_request_fix_mechanic != 1) {
            return res.status(401).send(
                createResponse(401, "Lỗi dữ liệu!", createRequest)
            );
        }

        return res.status(200).send(
            createResponse(200, "Tạo phiếu thành công!", createRequest)
        );

    } catch (error) {
        return error;
    }
}

exports.cancelSendRequestFixMachine = async (req, res) => {
    try {
        const username = req.body.user_name;
        const id_machine = req.body.id_machine;
        const factory = req.body.factory;

        if (!username && !id_machine && !factory) {
            return res.status(401).send(
                createResponse(401, "Lỗi dữ liệu!", {
                    username,
                    id_machine,
                    factory
                })
            );
        }

        const cancelSend = {
            username,
            id_machine,
            factory
        }

        const cancel_send = await productModel.cancelSendRequestFixMachine(cancelSend);

        if (cancel_send != 1) {
            return res.status(401).send(
                createResponse(401, "Không tìm thấy phiếu", cancelSend)
            );
        }

        return res.status(200).send(
            createResponse(200, "Hủy phiếu thành công!", cancelSend)
        );
    } catch (error) {
        return error;
    }
}
