const User = require("../models/User");
const Booking = require("../models/Booking");
const Room = require("../models/Room");
const Hotel = require("../models/Hotel");

async function addBookingHistory(userId, bookingData) {
  try {
    const { roomId, checkIn, checkout, hotelId } = bookingData;

    const room = await Room.findById(roomId);
    if (!room) {
      throw new Error("Room not found");
    }

    const bookingsInRange = await Booking.find({
      roomId,
      checkIn: { $lte: checkout },
      checkout: { $gte: checkIn },
    });

    const roomsBooked = bookingsInRange.length;
    const roomsAvailable = room.availableRooms;

    if (roomsBooked >= roomsAvailable) {
      throw new Error("Not enough rooms available for the selected dates");
    }

    const newBooking = await Booking.create({
      roomId,
      hotelId,
      checkIn,
      checkout,
      userId,
    });

    await User.findByIdAndUpdate(userId, {
      $push: { bookingHistory: newBooking._id },
    });

    await Room.findByIdAndUpdate(roomId, { $inc: { availableRooms: -1 } });

    return newBooking;
  } catch (error) {
    throw error;
  }
}

async function getAllBookingHistory(userId, search = "", limit = 10, page = 1) {
  try {
    const filters = { userId };

    if (search) {
      filters.$or = [
        {
          checkIn: {
            $gte: new Date(search),
            $lte: new Date(search + "T00:00:00.000Z"),
          },
        },
        {
          checkout: {
            $gte: new Date(search),
            $lte: new Date(search + "T00:00:00.000Z"),
          },
        },
      ];
    }

    const [bookings, count] = await Promise.all([
      Booking.find(filters)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .lean(),
      Booking.countDocuments(filters),
    ]);

    const lastPage = Math.ceil(count / limit);

    return { bookingHistory: bookings, lastPage };
  } catch (error) {
    throw error;
  }
}

async function getBookingHistory(userId, bookingId) {
  try {
    const bookingHistory = await Booking.findOne({
      _id: bookingId,
      userId,
    }).populate("roomId", "name");
    return bookingHistory;
  } catch (error) {
    throw error;
  }
}

async function updateBooking(bookingId, updatedData) {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      updatedData,
      { new: true }
    );
    if (!updatedBooking) {
      throw new Error("Booking not found");
    }
    return updatedBooking;
  } catch (error) {
    console.error("Error updating booking:", error);
    throw error;
  }
}

async function cancelBooking(userId, bookingId) {
  try {
    const booking = await Booking.findOneAndDelete({
      _id: bookingId,
      userId,
    });

    if (!booking) {
      throw new Error("Booking not found or unauthorized");
    }

    await User.findByIdAndUpdate(userId, {
      $pull: { bookingHistory: bookingId },
    });

    await Room.findByIdAndUpdate(booking.roomId, {
      $inc: { availableRooms: 1 },
    });
  } catch (error) {
    throw error;
  }
}

async function checkAndUpdateAvailableRooms() {
  try {
    const currentDate = new Date();
    const expiredBookings = await Booking.find({
      checkout: { $lte: currentDate },
    });

    for (const booking of expiredBookings) {
      const hotel = await Hotel.findById(booking.hotelId);
      if (hotel) {
        hotel.availableRooms += 1;
        await hotel.save();
      }
    }
  } catch (error) {
    console.error("Error updating available rooms:", error);
  }
}

module.exports = {
  addBookingHistory,
  getAllBookingHistory,
  getBookingHistory,
  updateBooking,
  cancelBooking,
  checkAndUpdateAvailableRooms,
};
