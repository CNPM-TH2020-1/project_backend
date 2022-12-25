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
    },
    create: async (req,res)=>{
        const data = req.body
        const newType = {      
            name: data.Name,
            maturing: data.Duration,
            interestRate: data.Interest,
            minTime: data.Min,
            minDeposit:100000
        }
        const response = await SAVING_TYPE.insertOne(newType)
        return response
    },
    update: async(req,res)=>{
        const data = req.body
        const updateType = {
            name: data.Name,
            maturing: data.Duration,
            interestRate: data.Interest,
            minTime: data.Min,
            minDeposit:data.minDeposit
        }
        console.log("New type: ",updateType)
        const one = await SAVING_TYPE.findOne({maturing:data.Duration})
        console.log(one)
        const response = await SAVING_TYPE.update({maturing:data.Duration},{$set:updateType},{upsert:false})
    },
    updateMindps: async(req,res)=>{
        const data = req.body
        let obj = {minDeposit:data.minDeposit}
        console.log("OBJ: ",obj)
        const f1 = await SAVING_TYPE.find({})
        console.log("F1: ",f1)
        const response = await SAVING_TYPE.updateMany({},{$set:obj},{upsert:false})
    }
}