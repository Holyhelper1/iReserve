const Hotel = require("../models/Hotel");

async function addHotel(hotel) {
  const newHotel = await Hotel.create(hotel);

  await newHotel.populate({
    path: "rooms",
    populate: {
      path: "hotel",
    },
  });

  return newHotel;
}

async function editHotel(id, hotel) {
  const newHotelData = await Hotel.findByIdAndUpdate(id, hotel, {
    returnDocument: "after",
  });

  await newHotelData.populate({
    path: "rooms",
    populate: {
      path: "hotel",
    },
  });

  return newHotelData;
}

function deleteHotel(id) {
  return Hotel.deleteOne({ _id: id });
}

async function getHotels(search = "", stars = "", limit = "", page = 1) {
  const filters = {};

  if (search) {
    filters.name = { $regex: search, $options: "i" };
  }

  if (stars) {
    filters.stars = stars;
  }

  const [hotels, count] = await Promise.all([
    Hotel.find(filters)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 }),
    Hotel.countDocuments(filters),
  ]);

  return { hotels, lastPage: Math.ceil(count / limit) };
}

function getHotel(id) {
  return Hotel.findById(id).populate({
    path: "rooms",
    populate: {
      path: "hotel",
    },
  });
}

module.exports = {
  addHotel,
  editHotel,
  deleteHotel,
  getHotels,
  getHotel,
};
