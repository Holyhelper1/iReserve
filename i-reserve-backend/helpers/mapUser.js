const mongoose  = require("mongoose")
const mapBookingHistory = require("./mapBookingHistory")

module.exports = function(user) {
    return {
        id: user._id,
        name: user.name,
        login: user.login,
        role: user.role,
        avatar: user.avatar,
        bookingHistory: user.bookingHistory.map(booking => mongoose.isObjectIdOrHexString(booking) ? booking : mapBookingHistory(booking))
    }
}