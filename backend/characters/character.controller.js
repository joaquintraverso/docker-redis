// let { req, res } = require('express');
let redisClient = require('../redis/connect')

const addCharacter = async (req, res) => {

  try {

    await redisClient.select(4)
    let { episode, character } = req.body;

    if (!episode || !character) {
      return res.status(400).json({ msg: "Send episode and character please" })
    }

    let data = await redisClient.rPush('characters', JSON.stringify([episode, character]))

    if (data > 0) {
      return res.status(200).json({ msg: 'Added successfully', data: { episode, character } });
    }

  } catch (error) {
    return res.status(400).send({ error: error.message})
  }

}


const deleteCharacter = async (req, res) => {

  try {
    await redisClient.select(4)

    let { episode, character } = req.body;

    if (!episode || !character) {
      return res.status(400).json({ msg: "Send episode and character please" })
    }

    let data = await redisClient.lRem('characters', 1, JSON.stringify([episode, character]));

    if (data === 1) {
      return res.status(200).json({ msg: 'Delete successfully', data: { episode, character } });
    }
    
    if (data === 0) {
      return res.status(200).json({ msg: 'Not results' });

    }

  } catch (error) {
    return res.status(400).send({ error: error.message})
  }

}


const getAllCharacter = async (req, res) => {

  try {
    await redisClient.select(4)

    let { episode } = req.params;

    if (!episode) {
      return res.status(400).json({ msg: "Send episode please" })
    }

    let data = await redisClient.lRange('characters', 0, -1);

    let character = data.map(JSON.parse);
    let response = character.filter(character => character[0] === episode);

    if (response.length > 0){
      return res.status(200).json({ data: response });
    } else {
      return res.status(404).json({ msg: "Not results" })
    }

  } catch (error) {
    return res.status(400).send({ error: error.message})
  }

}

module.exports = { addCharacter, deleteCharacter, getAllCharacter };