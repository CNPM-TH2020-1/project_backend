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
STYPE_DATA = client.db("cnpm").collection("saving_type")


module.exports = {
    createSaving: async (newSaving) => {
        newSaving.interest = 0
        const date = new Date().toISOString().split('T')[0]
        newSaving.createAt = date
        newSaving.status = { "isClosed": false, "closeAt": "" }
        newSaving.startMoney = newSaving.Balance
        newSaving.count = 0
        await SAVING_DATA.insertOne(newSaving)
    },

    createDepoInvoice: async(type, money, ownBy) => {
        const newInvoice = {}
        newInvoice.type = type
        newInvoice.money = money
        newInvoice.ownBy = ownBy
        newInvoice.createAt = new Date().toISOString().split('T')[0]
        await DEPOINVOICE_DATA.insertOne(newInvoice)
    },

    createWdrwInvoice: async(type, money) => {
        const newInvoice = {}
        newInvoice.type = type
        newInvoice.money = money
        newInvoice.createAt = new Date().toISOString().split('T')[0]
        await WDRWINVOICE_DATA.insertOne(newInvoice)
    },

    createNewType: async(newType) =>{

        await STYPE_DATA.insertOne(newType)
    },

    findTypeName: async(TypeName) =>{
        return await STYPE_DATA.findOne( {"name" : TypeName} )
    },

    findSavingByCCCD: async (UserCCCD) => {
        const data = []
        const res = await SAVING_DATA.find({"CCCD": UserCCCD})
         .forEach(saving => {
            if(!saving.status.isClosed) {
                var diffDays = parseInt((new Date() - new Date(saving.createAt)) / (1000 * 60 * 60 * 24))
                if(!saving.Type.maturing){
                    if(saving.count < parseInt(diffDays/30)) {
                        saving.interest = saving.Balance * Math.pow(saving.Type.interestRate/100,parseInt(diffDays/30) - saving.count)
                        saving.count = parseInt(diffDays/30)
                        saving.Balance = saving.Balance + saving.interest
                        SAVING_DATA.updateOne({_id : ObjectID(saving._id)},
                            {
                                $inc: {Balance : saving.interest},
                                $set: {interest: saving.interest, count : saving.count}
                            })
                    }
                }
                else{
                    const cnt = parseInt(diffDays/(30*saving.Type.maturing))
                    const tmp = Math.round( cnt * saving.Type.maturing * saving.Type.interestRate * saving.startMoney / 100)
                    if(tmp != saving.interest){
                        saving.interest = tmp
                        saving.Balance = saving.interest + saving.startMoney
                        saving.count = cnt
                        SAVING_DATA.updateOne({_id : ObjectID(saving._id)},
                            {
                                $set: {interest: saving.interest,
                                        Balance: saving.Balance,
                                        count : cnt}
                            })
                    }
                }
            }
            data.push(saving)
         })
        if(!data.length) {
            throw 1;
        }
        return data
    },

    findSavingbyID: async (SavingID) => {
        return await SAVING_DATA.findOne( { _id: ObjectID(SavingID) } )
    },

    SavingList: async() => {
        const data = []
        const res = await SAVING_DATA.find().forEach(saving => data.push(saving))
        return data
    },

    TypeList: async() => {
        const data = []
        await STYPE_DATA.find().forEach(saving => data.push(saving))
        return data
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
        for(var i = 1; i < 32; i++) {
            var create = 0, closed = 0
            const temp = {}
            const reportDay = time + "-" + i.toString()
            await SAVING_DATA.find()
            .forEach(saving => {
                if(saving.createAt == reportDay) 
                    create++
                if(saving.status.closeAt == reportDay)
                    closed++
            })
            temp.day = i
            temp.create = create
            temp.closed = closed
            temp.deviant = create - closed
            if(create || closed)
                data.push(temp)
        }
        return data
    },

    Dreport: async(time, Type) => {
        const data = []
        for(var i = 0; i < Type.length; i++){
            const temp = {}
            var sDepo = 0, sWdraw = 0 
            await DEPOINVOICE_DATA.find()
             .forEach(invoice => {
                if (invoice.type.name == Type[i].name && invoice.createAt == time) sDepo += invoice.money
             })
            await WDRWINVOICE_DATA.find()
             .forEach(invoice => {
                if (invoice.type.name == Type[i].name && invoice.createAt == time) sWdraw += invoice.money
             })
             temp.Type = Type[i].name
             temp.deposit = sDepo
             temp.withdraw = sWdraw
             temp.deviant = sDepo - sWdraw
             data.push(temp)
        }
        return data
    }
}