const db = require("../../connection");

exports.getInfoTask = async ({ id_machine, id_user_request, factory }) => {
    try {
        if (id_machine && id_user_request && factory) {
            const rs = await db.Execute(`
                SELECT *
                FROM DT_task_detail
                WHERE id_user_request = '${id_user_request}' AND factory = '${factory}' AND id_machine = '${id_machine}' AND status < '4'
            `);
            return rs.rowsAffected;
        }
    } catch (error) {
        return error;
    }
}

exports.getProcessStatusProduct = async ({ username, factory }) => {
    try {
        if (username && factory) {
            const rs = await db.Execute(`
                SELECT *
                FROM DT_task_detail
                WHERE id_user_request = '${username}' AND factory = '${factory}' AND status < '4'
            `);
            return rs.recordset || null;
        }
    } catch (error) {
        return error;
    }
}

exports.getHistoryStatusProduct = async ({ username, factory }) => {
    try {
        if (username && factory) {
            const rs = await db.Execute(`
                SELECT *
                FROM DT_task_detail
                WHERE id_user_request = '${username}' AND factory = '${factory}' AND status >= '4'
            `);
            return rs.recordset || null;
        }
    } catch (error) {
        return error;
    }
}

exports.getMechanic = async ({ factory, fixer, position }) => {
    try {
        if (fixer && position) {
            const rs = await db.Execute(`
                SELECT *
                FROM DT_user_manager
                WHERE factory = '${factory}' AND lean = '${fixer}' AND position = '${position}'
            `);
            return rs || null;
        }
    } catch (error) {
        return error;
    }
}

exports.sendRequestFixMachine = async ({ id_machine, id_user_request, factory, remark, fixer, position, id_owner_mechanic }) => {
    try {
        if (id_machine && id_user_request && factory && remark && fixer && position && id_owner_mechanic) {
            const rs = await db.Execute(`
            INSERT INTO DT_task_detail
                    (
                        id_machine,
                        id_user_request,
                        date_user_request,
                        [status],
                        remark,
                        id_owner_mechanic,
                        date_asign_task,
                        factory,
                        fixer
                    )
                    VALUES
                    (
                        '${id_machine}',
                        '${id_user_request}',
                        getdate(),
                        1,
                        '${remark}',
                        '${id_owner_mechanic}',
                        getdate(),
                        '${factory}',
                        '${fixer}'
                    )
            `);

            return rs.rowsAffected;
        }
    } catch (error) {
        return error;
    }
}

exports.cancelSendRequestFixMachine = async ({ username, id_machine, factory }) => {
    try {
        const rs = await db.Execute(`
            DELETE FROM DT_task_detail 
            WHERE id_machine = '${id_machine}' AND id_user_request = '${username}' AND factory = '${factory}' AND status = 1
        `);

        return rs.rowsAffected;

    } catch (error) {
        return error;
    }
}