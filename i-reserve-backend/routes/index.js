const express = require("express");

const router = express.Router({ mergeParams: true });

router.use("/", require("./auth"));
router.use("/hotels", require("./hotel"));
router.use("/hotels", require("./room"));
router.use("/bookings", require("./booking"));
router.use("/users", require("./user"));
router.use("/users", require("./booking"));

module.exports = router;
