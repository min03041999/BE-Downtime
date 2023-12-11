const db = require("../../connection");

exports.getInfoUser = async ({ username, factory }) => {
    try {
        if (username && factory) {
            const rs = await db.Execute(`
                    SELECT * FROM DT_user_manager WHERE user_name = '${username}' and factory = '${factory}'
            `);
            return rs.recordset[0] || null;
        }
    } catch (error) {
        return error;
    }
}

exports.registerUser = async ({ factory, name, lean, permission, floor, floors, position, username, password }) => {
    try {
        // console.log(factory, name, lean, permission, floor, floors, position, username, password);
        const register = await db.Execute(`
            INSERT INTO DT_user_manager
                (
                    [user_name],
                    [password],
                    create_at,
                    name,
                    factory,
                    lean,
                    permission,
                    [floor],
                    floors,
                    position
                )
                VALUES
                (
                    '${username}',
                    '${password}',
                    getdate(),
                    N'${name}',
                    '${factory}',
                    '${lean}',
                    '${permission}',
                    '${floor}',
                    '${floors}',
                    '${position}'
                )
        `);

        return register && { username, factory };
    } catch (error) {
        return error;
    }
}

exports.updateTokenDevicesUser = async ({ username, factory, token_devices }) => {
    try {
        const rs = await db.Execute(`
                UPDATE DT_user_manager SET 
                    token_devices = '${token_devices}'
                WHERE user_name = '${username}' AND factory = '${factory}'
        `);

        return rs.rowsAffected;
    } catch {
        return error;
    }
}