module.exports = function (booking) {
  return {
    id: booking._id,
    hotelId: booking.hotelId,
    roomId: booking.roomId._id,
    checkIn: booking.checkIn,
    checkout: booking.checkout,
    userId: booking.userId,
  };
};
