var expresss = require('express');
var router = expresss.Router();
let eventController = require('../controller/eventIngest')
router.post('/addAsset',eventController.addAsset)
router.post('/claimAsset',eventController.claimAsset)

module.exports = router;