const { query } = require("express")
const { MongoClient, Db } = require("mongodb")
const { ObjectID } = require("bson")
const config = require("../config/properties")

const uri = config.DBDriver
const client = new MongoClient(uri)
client.connect()

SAVING_DATA = client.db("cnpm").collection("saving")
DEPOINVOICE_DATA = client.db("cnpm").collection("depo_invoice")
WDRWINVOICE_DATA = client.db("cnpm").collection("wdraw_invoice")

module.exports = {
    createSaving: async (newSaving) => {
        await SAVING_DATA.insertOne(newSaving)
    },

    createDepoInvoice: async(type, money) =>{
        const newInvoice = {}
        newInvoice.type = type
        newInvoice.money = money
        newInvoice.createAt = new Date().toISOString().split('T')[0]
        await DEPOINVOICE_DATA.insertOne(newInvoice)
    },

    createWdrwInvoice: async(type, money) => {
        if(money){
            const newInvoice = {}
            newInvoice.type = type
            newInvoice.money = money
            newInvoice.createAt = new Date().toISOString().split('T')[0]
            await WDRWINVOICE_DATA.insertOne(newInvoice)
        }
    },

    findSavingByCCCD: async (UserCCCD) => {
        const data = []
        const res = await SAVING_DATA.find({"CCCD": UserCCCD})
         .forEach(saving => data.push(saving))
        if(!data.length) {
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

    withdraw: async(SavingID, withdrawMoney, newStat) => {
        if(!withdrawMoney) throw 1
        return await SAVING_DATA.updateOne(
            {_id: ObjectID(SavingID)},
            {
                $inc: {Balance: -withdrawMoney},
                $set: {
                    status: newStat
                }
            }
        )
    },
    
    Mreport: async(time) => {
        const data = []
        await SAVING_DATA.find()
         .forEach(saving => {
            if(new Date(saving.createAt).getMonth() == time.getMonth() && new Date(saving.createAt).getYear() == time.getYear())
                data.push(saving)
         })
        return data
    },

    Dreport: async(time) => {
        const data = []
        const Type = [1, 3, 6]
        for(var i = 0; i < Type.length; i++){
            const temp = {}
            var sDepo = 0, sWdraw = 0 
            await DEPOINVOICE_DATA.find()
             .forEach(invoice => {
                console.log(invoice)
                if (invoice.type == Type[i] && invoice.createAt == time) sDepo += invoice.money
             })
            await WDRWINVOICE_DATA.find()
             .forEach(invoice => {
                if (invoice.type == Type[i] && invoice.createAt == time) sWdraw += invoice.money
             })
             temp.Type = Type[i]
             temp.deposit = sDepo
             temp.withdraw = sWdraw
             temp.deviant = sDepo - sWdraw
             data.push(temp)
        }
        return data
    }
}