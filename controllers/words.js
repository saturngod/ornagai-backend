const { connect } = require("../db/mongodb")
const {isMyanmar} = require("../Utils/myanmar")
const {createClient} = require("redis")

const findWord = async (req, res, next) => {
    
    if (req.params.word.trim() == "") {
        res.send({ result: [] , word: req.params.word.trim()}, 200);
    }

    let client = await connect()
    let word = decodeURI(req.params.word.trim())
    
    const redis = createClient();
    await redis.connect();
    const cache = await redis.get("find_" + word)
    if(cache != null) {
        console.log("CACHE RES")
        res.send(JSON.parse(cache))
        res.end()
        return
    }

    const found = isMyanmar(word)

    var db = "english"

    if(found) {
        db = "myanmar"
    }

    let wordsCollection = client.db().collection(db)

    var result = await wordsCollection.find(
        { word: { '$regex': '^' + word } },
        { projection: { _id: 0 } }
    )
        .limit(30)
        .toArray()

    var data = result.map((value) => value.word)

    await client.close()
    
    await redis.set("find_" + word,JSON.stringify({ result: data }))
    await redis.quit()
    res.send({ result: data })
    res.end()
}

const resultWord = async (req,res,next) => {
    let client = await connect()

    if (req.params.word.trim() == "") {
        res.send({ result: null }, 200);
    }

    let word = decodeURI(req.params.word.trim())
    const redis = createClient();
    await redis.connect();
    const cache = await redis.get("def_" + word)
    if(cache != null) {
        console.log("CACHE RES")
        res.send(JSON.parse(cache))
        res.end()
        return
    }

    const myan = isMyanmar(word)

    var dict = "dict"
    if(myan) {
        dict = "mydict"
    }

    let wordsCollection = client.db().collection(dict);

    
    
    var result = await wordsCollection.findOne(
        { word:word } ,
        { projection: { _id: 0 } }
    )
    
    await redis.set("def_" + word,JSON.stringify({ result: result }))
    await redis.quit()

    res.send({ result: result })
    res.end()
}

module.exports = {
    findWord,
    resultWord
};