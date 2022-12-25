const { query } = require("express")
const { MongoClient, Db } = require("mongodb")
const { ObjectID } = require("bson")

const config = require("../config/properties")

const uri = config.DBDriver
const client = new MongoClient(uri)
client.connect()

SAVING_TYPE = client.db("cnpm").collection("saving_type")

module.exports = {
    findAll: async (req, res) => {
        const data = []
        await SAVING_TYPE.find().forEach(type=>data.push(type))
        return data
    },
    findType: async (req, res) => {
        const data = []
        await SAVING_TYPE.find().forEach(type=>data.push(type.name))
        return data
    }
}