const router = require('express').Router();
const { create, fetch, update } = require('../controllers/exercise');

router.post('/create', create);
router.post('/fetch', fetch);
router.patch('/update', update);

module.exports = router;