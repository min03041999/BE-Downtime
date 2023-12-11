exports.createResponse = (errCode, errMessage, data) => {
    return {
        error_code: errCode,
        error_message: errMessage,
        data: data
    }
}