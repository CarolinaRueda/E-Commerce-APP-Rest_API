const router = require("express").Router();
const {
  getOutUsers,
  getOutUsersByID,
  updateUser,
  deleteUser,
} = require("../controllers/usersController");

router.get("/", getOutUsers);

router.route("/:id").get(getOutUsersByID).put(updateUser).delete(deleteUser);

module.exports = router;
