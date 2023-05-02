let redisClient = require('../redis/connect')


const addEpisode = async (req, res) => {

  try {

    let status = 'Disponible'

    await redisClient.select(1)
    await redisClient.set('Chapter 1', JSON.stringify(['Chapter 1', 'The Mandalorian', status]))
    await redisClient.set('Chapter 2', JSON.stringify(['Chapter 2', 'The Child', status]))
    await redisClient.set('Chapter 3', JSON.stringify(['Chapter 3', 'The Sin', status]))
    await redisClient.set('Chapter 4', JSON.stringify(['Chapter 4', 'Sanctuary', status]))
    await redisClient.set('Chapter 5', JSON.stringify(['Chapter 5', 'The Gunslinger', status]))
    await redisClient.set('Chapter 6', JSON.stringify(['Chapter 6', 'The Prisoner', status]))
    await redisClient.set('Chapter 7', JSON.stringify(['Chapter 7', 'The Reckoning', status]))
    await redisClient.set('Chapter 8', JSON.stringify(['Chapter 8', 'Redemption', status]))

    return res.status(200).json({ msg: 'Added successfully' });

  } catch (error) {
    return res.status(400).send({ error: error.message })
  }

}


const getAllEpisodes = async (req, res) => {

  try {

    await redisClient.select(1);
    let keys_1 = await redisClient.keys('*');

    let episodes_1 = []

    await redisClient.select(2);
    let keys_2 = await redisClient.keys('*');

    let episodes_2 = []

    await redisClient.select(3);
    let keys_3 = await redisClient.keys('*');

    let episodes_3 = []

    await redisClient.select(1);
    for (let i = 0; i < keys_1.length; i++) {
      let ep = await redisClient.get(keys_1[i], 0, -1)
      episodes_1.push(JSON.parse(ep))
    }


    await redisClient.select(2);
    for (let i = 0; i < keys_2.length; i++) {
      let ep = await redisClient.get(keys_2[i], 0, -1)
      episodes_2.push(JSON.parse(ep))
    }

    await redisClient.select(3);
    for (let i = 0; i < keys_3.length; i++) {
      let ep = await redisClient.get(keys_3[i], 0, -1)
      episodes_3.push(JSON.parse(ep))
    }

    let ep_ = episodes_1.map(item => {
      const found = episodes_2.find(x => x[0] === item[0] && x[1] === item[1]);
      return found ? found : item;
    });

    let ep = ep_.map(item => {
      const found = episodes_3.find(x => x[0] === item[0] && x[1] === item[1]);
      return found ? found : item;
    });



    if (ep.length > 0) {
      return res.status(200).json({ data: ep });
    } else {
      return res.status(404).json({ msg: "Not results" })
    }

  } catch (error) {
    return res.status(400).send({ error: error.message })
  }

}

const statusEpisode = async (req, res) => {

  try {

    let { episode } = req.body;
    let { id } = req.params;

    if (!episode) {
      return res.status(400).json({ msg: "Send episode please" })
    }

    let status = ['Reservado', 'Alquilado']

    let seconds = id == 2 ? 240 : 86400;

    await redisClient.select(1)

    let ep_ = await redisClient.get(episode, 0, -1)

    let ep = JSON.parse(ep_)

    await redisClient.select(id)

    await redisClient.setEx(episode, seconds, JSON.stringify([ep[0], ep[1], status[id - 2]]))

    return res.status(200).json({ msg: `${episode} reserved or rented for 4 minutes` })

  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

module.exports = { addEpisode, getAllEpisodes, statusEpisode };