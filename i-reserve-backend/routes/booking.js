const express = require("express");
const cron = require("node-cron");
const {
  addBookingHistory,
  getAllBookingHistory,
  getBookingHistory,
  updateBooking,
  cancelBooking,
  checkAndUpdateAvailableRooms,
} = require("../controllers/booking-history");
const mapBookingHistory = require("../helpers/mapBookingHistory");
const authenticated = require("../middlewares/authenticated");
const hasRole = require("../middlewares/hasRole");
const ROLES = require("../constants/roles");

const router = express.Router({ mergeParams: true });

router.use("/users", require("./user"));

router.get(
  "/:bookingId",
  authenticated,
  hasRole([ROLES.CLIENT, ROLES.MODERATOR, ROLES.ADMIN]),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const bookingId = req.params.bookingId;
      const bookingHistory = await getBookingHistory(userId, bookingId);

      if (!bookingHistory) {
        return res
          .status(404)
          .send({ error: "Booking not found or unauthorized" });
      }

      res.send({ data: mapBookingHistory(bookingHistory) });
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  }
);

router.get(
  "/:userId/bookings",
  authenticated,
  hasRole([ROLES.CLIENT, ROLES.MODERATOR, ROLES.ADMIN]),
  async (req, res) => {
    try {
      const { bookingHistory, lastPage } = await getAllBookingHistory(
        req.params.userId,
        req.query.search,
        req.query.limit,
        req.query.page
      );
      res.send({
        data: { lastPage, bookings: bookingHistory.map(mapBookingHistory) },
      });
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  }
);

router.post(
  "/:userId/bookings",
  authenticated,
  hasRole([ROLES.CLIENT, ROLES.MODERATOR, ROLES.ADMIN]),
  async (req, res) => {
    try {
      const newBooking = await addBookingHistory(req.params.userId, {
        hotelId: req.body.hotelId,
        roomId: req.body.roomId,
        checkIn: req.body.checkIn,
        checkout: req.body.checkout,
      });
      res.send({ data: mapBookingHistory(newBooking) });
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  }
);

router.patch(
  "/:userId/bookings/:bookingId",
  authenticated,
  hasRole([ROLES.ADMIN, ROLES.MODERATOR, ROLES.CLIENT]),
  async (req, res) => {
    try {
      const updatedBooking = await updateBooking(
        req.params.bookingId,
        req.body
      );
      res.json(updatedBooking);
    } catch (error) {
      console.error("Error updating booking:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

router.delete(
  "/:userId/bookings/:bookingId",
  authenticated,
  hasRole([ROLES.CLIENT, ROLES.MODERATOR, ROLES.ADMIN]),
  async (req, res) => {
    await cancelBooking(req.params.userId, req.params.bookingId);

    res.send({ error: null });
  }
);

cron.schedule("0 0 * * *", () => {
  checkAndUpdateAvailableRooms();
  console.log("Checking and updating available rooms...");
});

module.exports = router;
