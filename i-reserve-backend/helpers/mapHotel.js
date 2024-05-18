const mongoose = require("mongoose");
const mapRoom = require("./mapRoom");

module.exports = function (hotel) {
  return {
    id: hotel.id,
    name: hotel.name,
    description: hotel.description,
    image: hotel.image,
    stars: hotel.stars,
    rating: hotel.rating,
    rooms: hotel.rooms.map((room) =>
      mongoose.isObjectIdOrHexString(room) ? room : mapRoom(room)
    ),
    createdAt: hotel.createdAt,
  };
};
