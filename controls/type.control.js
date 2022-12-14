const { ObjectID } = require("bson");
const { query } = require("express");
const { MongoClient, Db } = require("mongodb");
const config = require("../config/properties");
const typeData = require("../database/type.data");


const uri = config.DBDriver;
const client = new MongoClient(uri);
client.connect();



module.exports = {
    getAllType: async (req,res)=>{
        const data = await typeData.findAll()
        res.json({
            data
        })
    },
    createType:async (req,res)=>{
        const data = await typeData.create(req,res)
        res.json({
            data
        })
    },
    updateType: async(req,res)=>{
        console.log("TEST ASBCZR: ",req.body)
        const data = await typeData.update(req,res)
        res.json({
            data
        })
    },
    updateMinDeposit: async(req,res) =>{
        const data = await typeData.updateMindps(req,res)
        res.json({
            data
        })
    }
}