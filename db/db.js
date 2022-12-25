const {MongoClient} = require("mongodb")
const {join: joinPath} = require('path');
const fs = require("fs")

var config = {
  PORT : 4000,
  DBDriver: 'mongodb+srv://nvkhoa14:UITHKT@cluster0.irat42q.mongodb.net/?retryWrites=true&w=majority',
  DB : 'mongodb://localhost:27017/CommentsDB',
  CORS : ['http://localhost:3000']
}

const client = new MongoClient(config.DBDriver)
client.connect()

module.exports = {
  db: client.db("cnpm")
}
