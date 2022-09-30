const { connect } = require("../db/mongodb")
const {isMyanmar} = require("../Utils/myanmar")

const findWord = async (req, res, next) => {
    
    if (req.params.word.trim() == "") {
        res.send({ result: [] , word: req.params.word.trim()}, 200);
    }

    let client = await connect()
    let word = decodeURI(req.params.word.trim())
    
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

    res.send({ result: data })
    res.end()
}

const resultWord = async (req,res,next) => {
    let client = await connect()

    if (req.params.word.trim() == "") {
        res.send({ result: null }, 200);
    }

    const myan = isMyanmar(req.params.word.trim())

    var dict = "dict"
    if(myan) {
        dict = "mydict"
    }

    let wordsCollection = client.db().collection(dict);

    let word = decodeURI(req.params.word.trim())
    
    var result = await wordsCollection.findOne(
        { word:word , type: 0 } ,
        { projection: { _id: 0 } }
    )
    
    res.send({ result: result })
    res.end()
}

module.exports = {
    findWord,
    resultWord
};