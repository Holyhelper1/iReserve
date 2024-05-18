const express = require("express");
const { addRoom, editRoom, deleteRoom } = require("../controllers/rooms");

const mapRoom = require("../helpers/mapRoom");
const hasRole = require("../middlewares/hasRole");
const ROLES = require("../constants/roles");

const authenticated = require("../middlewares/authenticated");

const router = express.Router({ mergeParams: true });

router.use("/hotels", require("./hotel"));

router.post(
  "/:id/rooms",
  authenticated,
  hasRole([ROLES.ADMIN]),
  async (req, res) => {
    const newRoom = await addRoom(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      availableRooms: req.body.availableRooms,
      image: req.body.image,
      price: req.body.price,
      hotel: req.params.id,
    });

    res.send({ data: mapRoom(newRoom) });
  }
);

router.patch(
  "/:hotelId/rooms/:roomId",
  authenticated,
  hasRole([ROLES.ADMIN]),
  async (req, res) => {
    const updatedRoom = await editRoom(req.params.roomId, {
      name: req.body.name,
      description: req.body.description,
      availableRooms: req.body.availableRooms,
      image: req.body.image,
      price: req.body.price,
    });

    res.send({ data: mapRoom(updatedRoom) });
  }
);

router.delete(
  "/:hotelId/rooms/:roomId",
  authenticated,
  hasRole([ROLES.ADMIN, ROLES.MODERATOR]),
  async (req, res) => {
    await deleteRoom(req.params.hotelId, req.params.roomId);

    res.send({ error: null });
  }
);

module.exports = router;
