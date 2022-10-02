const crypto = require('crypto')
var moment = require('moment')
const dotenv = require('dotenv');
dotenv.config()

const invalidRes = (res) => {
    res.status(401).send({ error: "Invalid request" })
    res.end()
    return
}

const guard = async (req, res, next) => {

    var time = moment().unix()


    const timestamp = req.query.timestamp
    const hash = req.query.hash
    const app_id = req.headers.app_id

    if (timestamp == undefined || hash == undefined || app_id == undefined) {
        return invalidRes(res)
    }

    const newtime = moment(timestamp, "X").add(3, "minutes").unix()

    if (newtime < time) {
        return invalidRes(res)
    }

    const key = process.env.APP_KEY
    const original_string = app_id + ":" + timestamp
    const result = crypto.createHmac('sha1', key)
        .update(original_string)
        .digest('hex')

    if (hash != result) {
        return invalidRes(res)
    }
    else {
        next()
    }





}
module.exports = {
    guard
}