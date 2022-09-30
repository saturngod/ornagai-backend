const {MongoClient} = require('mongodb');

const connect = async () => {

    var url = "mongodb://localhost:27017/watermelon";
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