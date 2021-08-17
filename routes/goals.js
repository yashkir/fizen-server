const express = require('express');
const goals = require('../controllers/goals');
const auth = require('../helpers/auth');

const router = express.Router();

router.use(auth.ensureAuthenticated);

router.post('/', goals.create);
router.get('/', goals.index);
router.get('/:goalId', goals.show);
router.put('/:goalId', goals.update);
router.delete('/:goalId', goals.delete);

module.exports = router;
