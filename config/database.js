const { MongoClient } = require('mongodb')
var dbURL = require('./properties').DBDriver;

let dbConnection

module.exports = {
  connectToDB: (cb) =>{
    MongoClient.connect(dbURL)
      .then((client) => {
        console.log("connected")
        dbConnection = client.db()
        return cb()
      })
      .catch(err => {
        console.log(err)
        return cb(err)
      })
  },
  getDB: () => dbConnection
}

