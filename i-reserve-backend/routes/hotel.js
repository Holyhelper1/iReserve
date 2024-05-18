const express = require("express");
const {
  addHotel,
  editHotel,
  deleteHotel,
  getHotels,
  getHotel,
} = require("../controllers/hotels");
const authenticated = require("../middlewares/authenticated");
const hasRole = require("../middlewares/hasRole");
const ROLES = require("../constants/roles");
const mapHotel = require("../helpers/mapHotel");

const router = express.Router({ mergeParams: true });

router.get("/", async (req, res) => {
  const { hotels, lastPage } = await getHotels(
    req.query.search,
    req.query.stars,
    req.query.limit,
    req.query.page
  );

  res.send({ data: { lastPage, hotels: hotels.map(mapHotel) } });
});

router.get("/:id", async (req, res) => {
  const hotel = await getHotel(req.params.id);

  res.send({ data: mapHotel(hotel) });
});

router.post("/", authenticated, hasRole([ROLES.ADMIN]), async (req, res) => {
  const newHotel = await addHotel({
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    stars: req.body.stars,
  });

  res.send({ data: mapHotel(newHotel) });
});

router.patch(
  "/:id",
  authenticated,
  hasRole([ROLES.ADMIN, ROLES.MODERATOR]),
  async (req, res) => {
    const updatedHotel = await editHotel(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
      stars: req.body.stars,
    });

    res.send({ data: mapHotel(updatedHotel) });
  }
);

router.delete(
  "/:id",
  authenticated,
  hasRole([ROLES.ADMIN]),
  async (req, res) => {
    await deleteHotel(req.params.id);

    res.send({ error: null });
  }
);

module.exports = router;
