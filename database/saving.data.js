const { query } = require("express")
const { MongoClient, Db } = require("mongodb")
const { ObjectID } = require("bson")
const config = require("../config/properties")

const uri = config.DBDriver
const client = new MongoClient(uri)
client.connect()

SAVING_DATA = client.db("cnpm").collection("saving")

module.exports = {
    createSaving: async (newSaving) => {
        await SAVING_DATA.insertOne(newSaving)
    },
    findSavingByCCCD: async (UserCCCD) => {
        const data = []
        const res = await SAVING_DATA.find({"CCCD": UserCCCD})
         .forEach(saving => data.push(saving))
        if(!data.length) {
            console.log("rong")
            throw 1;
        }
        return data
    },
    findSavingbyID: async (SavingID) => {
        return await SAVING_DATA.findOne( { _id: ObjectID(SavingID) } )
    },
    deposit: async(SavingID, depoMoney) => {
        return await SAVING_DATA.update(
            {_id: ObjectID(SavingID)},
            {
                $inc: {Balance: depoMoney}
            }
        )
    },

    withdraw: async(SavingID, withdrawMoney) => {
        return await SAVING_DATA.updateOne(
            {_id: ObjectID(SavingID)},
            {
                $inc: {Balance: -withdrawMoney}
            }
        )
    }
}