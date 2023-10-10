const express = require("express")
const axios = require("axios")
const cors = require("cors")
const { urlencoded } = require("body-parser")
const app = express()
const Redis = require("redis")

const redisClient = Redis.createClient({
    legacyMode: true,
    PORT: 5001
  })
redisClient.connect().catch(console.error)
const DEFAULT_EXPIRATION = 3600

app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.get ("/photos", async(req, res) => {
    const albumId = req.query.albumId
    redisClient.get(`photos?albumId=${albumId}`, async (error, photos) => {
        if (error) {
            console.error(error)
        }
        if (photos != null) {
            console.log("Cache hit")
            return res.json(JSON.parse(photos))
        } else {
            console.log("Cache miss")
            const { data } = await axios.get(
                "https://jsonplaceholder.typicode.com/photos",
                { params: { albumId } }
            )
            redisClient.setEx(`photos?albumId=${albumId}`, DEFAULT_EXPIRATION, JSON.stringify(data))
            res.json(data)
        }
    })
})

app.get ("/photos/:id", async(req, res) => {
    const photo = await getOrSetCache(`photos:${req.params.id}`, async() => {
        const { data } = await axios.get (
            `https://jsonplaceholder.typicode.com/photos/${req.params.id}`
        )
        return data
    })
    res.json (photo)
})

function getOrSetCache(key, cb) {
    return new Promise((resolve, reject) => {
        redisClient.get(key, async (error, data) => {
            if (error) return reject.error
            if (data != null) return resolve(JSON.parse(data))
            const freshData = await cb()
            redisClient.setEx(key, DEFAULT_EXPIRATION, JSON.stringify(freshData))
        })
    })
}

app.listen(3000)