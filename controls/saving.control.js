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
    newSaving.status = true
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

  UserDeposit: (req, res) =>{
    const money = req.body.money
    if (money < 100000){
      res.json({"message" : "Nap toi thieu 100 000 VND"})
    }
    else{
      savingData.findSavingbyID(req.body._id)
        .then((saving) => {
          console.log(saving)
          if (saving.status){
            savingData.createDepoInvoice(saving.Type, money, "deposit")
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
          var newStat = true
          if (data.Type != 1) money = data.Balance
          if (money == data.Balance) newStat = false
          
          savingData.createWdrwInvoice(data.Type, money, "withdraw")

          savingData.withdraw(req.body._id, money, newStat)
            .then((data) => {
              res.json(data)
            })
            .catch((err) => {
              res.json({"message" : "So tien khong hop le."})
            })
        }
      })
  },

  MonthlyReport: (req, res) => {
    const reportDate =new Date(req.body.time + "-01")
    savingData.Mreport(reportDate)
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
