const {MongoClient} = require('mongodb');
const dotenv = require('dotenv');


const connect = async () => {
    dotenv.config()
    var url = process.env.MONGODB;
    const client = new MongoClient(url);
    try {
        await client.connect()
    }
    catch(e) {
        console.error(e)
    }
    return client
}

module.exports =  {
    connect
};