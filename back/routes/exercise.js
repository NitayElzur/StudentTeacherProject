const router = require('express').Router();
const { create, fetch } = require('../controllers/exercise');

router.post('/create', create);
router.post('/fetch', fetch);

module.exports = router;