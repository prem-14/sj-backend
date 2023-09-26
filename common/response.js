const jsonResponse = (res, statusCode, status, data) => {
    const finalresultjson = {}
    finalresultjson.status = status
    finalresultjson.data = data
    res.status(statusCode).json(finalresultjson)
    return false
}

const errorResponse = (e, res) => {
    console.error(e)
    jsonResponse(res, 500, 'error', {
        message: 'Internal Server error!',
    })
}

module.exports = { jsonResponse, errorResponse }