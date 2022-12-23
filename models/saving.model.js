const mongoose = require('mongoose')
const Schema = mongoose.Schema

const savingSchema = new Schema({
    "title" : "saving",
    "properties": {
        "_id": { "bsontype": "objectId"},
        "name": { "bsontype": "string"}
    }
})