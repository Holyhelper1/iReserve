const { generate } = require("../helpers/token");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const ROLES = require("../constants/roles");

async function register(name, login, password) {
  if (!password) {
    throw new Error("Password is required");
  }
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({ name, login, password: passwordHash });
  const token = generate({ id: user.id });
  return { user, token };
}

async function login(login, password) {
  const user = await User.findOne({ login });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new Error("Password is incorrect");
  }
  const token = generate({ id: user.id });
  return { token, user };
}

function getUsers() {
  return User.find();
}

function getRoles() {
  return [
    { id: ROLES.ADMIN, name: "Admin" },
    { id: ROLES.MODERATOR, name: "Moderator" },
    { id: ROLES.CLIENT, name: "Client" },
    { id: ROLES.GUEST, name: "Guest" },
  ];
}

function updateUser(id, userData) {
  return User.findByIdAndUpdate(id, userData, { returnDocument: "after" });
}

async function getUser(userId) {
  const user = await User.findById(userId).populate("bookingHistory");
  return user;
}

function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

module.exports = {
  register,
  login,
  getUsers,
  getRoles,
  updateUser,
  deleteUser,
  getUser,
};
