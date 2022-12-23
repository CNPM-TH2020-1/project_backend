const { ObjectID } = require("bson")
const { query } = require("express")
const { MongoClient, Db } = require("mongodb")
const config = require("../config/properties")
const savingData = require("../database/saving.data")

const uri = config.DBDriver
const client = new MongoClient(uri)
client.connect()

module.exports = {
  create: (req, res) => {
    var newSaving = req.body;
    const date = new Date().toISOString().split('T')[0]
    newSaving.createAt = date
    newSaving.status = { "isClosed": false, "closeAt": "" }
    savingData.createSaving(newSaving)
      .then(() => {
        res.send("Tao so tiet kiem thanh cong.")
      })
  },
  
  getSavingByCCCD: (req, res) => {
    savingData.findSavingByCCCD(req.body.CCCD)
      .then((data) => {
        res.json(data)
      })
      .catch((err) => {
        res.json({"message": "Nguoi dung chua co so tiet kiem"})
      })
  },

  getById: (req, res) => {
    savingData.findSavingbyID(req.body._id)
      .then((ans) => {
        res.json(ans)
      })
  },

  getAllSaving: (req, res) =>{
    savingData.getAll()
     .then((data) =>{
      res.json(data)
    })
  },

  UserDeposit: (req, res) =>{
    const money = req.body.money
    if (money < 100000){
      res.json({"message" : "Nap toi thieu 100 000 VND"})
    }
    else{
      savingData.findSavingbyID(req.body._id)
        .then((saving) => {
          if (saving.status){
            savingData.createDepoInvoice(saving.Type, money, saving.CCCD)
            savingData.deposit(req.body._id, money)
              .then((data) => {
                res.json(data)
              })
          }
          else{
            res.json( {"message" : "So dong"} )
          }
        })
    }
  },

  UserWithdraw: (req, res) =>{
    const money = req.body.money
    savingData.findSavingbyID(req.body._id)
      .then((data)=>{
        if (data.Type == 1 && money > data.Balance) {
          res.json({"message" : "So du khong du"})
        }
        else{
          var diffDays = parseInt((new Date() - new Date(data.createAt)) / (1000 * 60 * 60 * 24));
          if (diffDays <= 15 ){
            console.log(diffDays)
            res.json({"message" : "Tai khoan chua tao du 15 ngay"})
          }
          else{
            var newStat = {}
            newStat.isClosed = false
            newStat.closedAt = ""
            if (data.Type != 1) money = data.Balance
            if (money == data.Balance) {
              newStat.isClosed = true
              newStat.closeAt =  new Date().toISOString().split('T')[0]
            }
            savingData.createWdrwInvoice(data.Type, money, data.CCCD)

            savingData.withdraw(req.body._id, money, newStat)
              .then((data) => {
                res.json(data)
              })
              .catch((err) => {
                res.json({"message" : "So tien khong hop le."})
              })
          }
        }
      })
  },

  MonthlyReport: (req, res) => {
    savingData.Mreport(req.body.time)
      .then((data)=>{
        res.json(data)
      })
  },

  DailyReport: (req, res) => {
    savingData.Dreport(req.body.time)
     .then((data) =>{
        res.json(data)
     })
  },
}
