const express = require('express');
const users = require('../controllers/users');
const auth = require('../helpers/auth');

const router = express.Router();

router.post('/', users.create);
router.post('/guest', users.createGuest);
router.post('/login', users.login);

router.use(auth.ensureAuthenticated);

router.get('/verify', users.verify);
router.delete('/:userId', users.delete);

module.exports = router;
