let express = require('express');
let { addEpisode, getAllEpisodes, statusEpisode } = require('./episodes.controller');

let router = express.Router()

router.post('/episodes/add', addEpisode);
router.post('/episodes/status/:id', statusEpisode);
router.get('/episodes', getAllEpisodes);

module.exports = router;