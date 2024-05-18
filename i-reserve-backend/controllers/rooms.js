const Hotel = require("../models/Hotel");
const Room = require("../models/Room");

async function addRoom(hotelId, room) {
  const newRoom = await Room.create(room);

  await Hotel.findByIdAndUpdate(hotelId, { $push: { rooms: newRoom } });

  await newRoom.populate("hotel");

  return newRoom;
}

async function editRoom(roomId, room) {
  await Room.findByIdAndUpdate(roomId, room);
  const updatedRoom = await Room.findById(roomId).populate("hotel");
  return updatedRoom;
}

async function deleteRoom(hotelId, roomId) {
  await Room.deleteOne({ _id: roomId });
  await Hotel.findByIdAndUpdate(hotelId, { $pull: { rooms: roomId } });
}

module.exports = {
  addRoom,
  deleteRoom,
  editRoom,
};
