let express = require('express');
let { addCharacter, deleteCharacter, getAllCharacter } = require('./character.controller');

let router = express.Router()

router.get('/character/:episode', getAllCharacter);
router.post('/character/add', addCharacter);
router.delete('/character/delete', deleteCharacter);

module.exports = router;