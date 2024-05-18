const express = require("express");

const {
  getUsers,
  getUser,
  getRoles,
  updateUser,
  deleteUser,
} = require("../controllers/user");

const authenticated = require("../middlewares/authenticated");
const hasRole = require("../middlewares/hasRole");
const ROLES = require("../constants/roles");
const mapUser = require("../helpers/mapUser");

const router = express.Router({ mergeParams: true });

router.get("/", authenticated, hasRole([ROLES.ADMIN]), async (req, res) => {
  const users = await getUsers();

  res.send({ data: users.map(mapUser) });
});

router.get(
  "/:id",
  authenticated,
  hasRole([ROLES.ADMIN, ROLES.MODERATOR, ROLES.CLIENT]),
  async (req, res) => {
    const user = await getUser(req.params.id);

    res.send({ data: mapUser(user) });
  }
);

router.get(
  "/roles",
  authenticated,
  hasRole([ROLES.ADMIN]),
  async (req, res) => {
    const roles = await getRoles();

    res.send({ data: roles });
  }
);

router.patch(
  "/:id",
  authenticated,
  hasRole([ROLES.ADMIN, ROLES.MODERATOR, ROLES.CLIENT]),
  async (req, res) => {
    const newUser = await updateUser(req.params.id, {
      name: req.body.name,
      login: req.body.login,
      avatar: req.body.avatar,
      role: req.body.role,
    });

    res.send({ data: mapUser(newUser) });
  }
);

router.delete(
  "/:id",
  authenticated,
  hasRole([ROLES.ADMIN]),
  async (req, res) => {
    await deleteUser(req.params.id);

    res.send({ error: null });
  }
);

module.exports = router;
