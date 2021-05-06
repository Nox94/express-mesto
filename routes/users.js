const router = require('express').Router();
const express = require('express');
const {
  getAllUsers,
  getOneUser,
  getOneUserById,
  updateUsersAvatarById,
  updateUsersProfileById,
} = require('../controllers/users');

router.get('/me', getOneUser);
router.get('/', getAllUsers);
router.get('/:userId', getOneUserById);
router.patch('/me', express.json(), updateUsersProfileById);
router.patch('/me/avatar', express.json(), updateUsersAvatarById);

module.exports = router;

// _id: ObjectId("608a668b730817901c9829dc")
