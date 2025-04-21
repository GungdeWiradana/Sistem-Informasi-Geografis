const express = require('express');
const router = express.Router();
const markerController = require('../controllers/markerController');

router.get('/', markerController.getAllMarkers);
router.post('/', markerController.createMarker);
router.put('/:id', markerController.updateMarker);
router.delete('/:id', markerController.deleteMarker);

module.exports = router;
