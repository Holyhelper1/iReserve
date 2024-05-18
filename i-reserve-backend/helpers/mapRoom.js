module.exports = function (room) {
  return {
    id: room._id,
    name: room.name,
    description: room.description,
    availableRooms: room.availableRooms,
    image: room.image,
    price: room.price,
    hotel: room.hotel._id,
  };
};
