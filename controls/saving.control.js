const { ObjectID } = require("bson");
const { query } = require("express");
const { MongoClient, Db } = require("mongodb");
const config = require("../config/properties");
const savingData = require("../database/saving.data");

const uri = config.DBDriver;
const client = new MongoClient(uri);
client.connect();

module.exports = {
  create: (req, res) => {
    const newSaving = req.body;
    savingData.findTypeName(req.body.Type).then((type) => {
      newSaving.Type = type;
      savingData.createSaving(newSaving).then(() => {
        res.send("Tao so tiet kiem thanh cong.");
      });
    });
  },

  getSavingByCCCD: (req, res) => {
    savingData
      .findSavingByCCCD(req.body.CCCD)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({ message: "Nguoi dung chua co so tiet kiem" });
      });
  },

  getById: (req, res) => {
    savingData.findSavingbyID(req.body._id).then((ans) => {
      res.json(ans);
    });
  },

  getAllSaving: (req, res) => {
    savingData.SavingList().then((data) => {
      res.json(data);
    });
  },

  createNewType: (req, res) => {
    savingData.createNewType(req.body).then(() => {
      res.json({ message: "Tao loai tiet kiem moi thanh cong" });
    });
  },

  getAllType: (req, res) => {
    savingData.TypeList().then((data) => {
      res.json(data);
    });
  },

  UserDeposit: (req, res) => {
    const money = req.body.money;
    savingData.findSavingbyID(req.body._id).then((saving) => {
      if (!saving.status.isClosed && money >= saving.Type.minDeposit) {
        savingData.createDepoInvoice(saving.Type, money, saving.CCCD);
        savingData.deposit(req.body._id, money).then((data) => {
          res.json(data);
        });
      } else {
        if (saving.status.isClosed) res.json({ message: "So dong" });
        if (money < saving.Type.minDeposit)
          res.json({
            message:
              "Goi toi thieu " + saving.Type.mindeposit.toString() + " VND",
          });
      }
    });
  },

  UserWithdraw: (req, res) => {
    var money = req.body.money;
    savingData.findSavingbyID(req.body._id).then((saving) => {
      if (money > saving.Balance) {
        res.json({ message: "So du khong du" });
      } else {
        var diffDays = parseInt(
          (new Date() - new Date(saving.createAt)) / (1000 * 60 * 60 * 24)
        );
        if (diffDays <= saving.Type.mintime) {
          res.json({
            message:
              "So tiet kiem chua tao du " +
              saving.Type.mintime.toString() +
              " ngay",
          });
        } else {
          var newStat = {};
          newStat.isClosed = false;
          newStat.closedAt = "";
          if (saving.Type.maturing) money = data.Balance;
          if (money == saving.Balance) {
            newStat.isClosed = true;
            newStat.closeAt = new Date().toISOString().split("T")[0];
          }

          savingData
            .withdraw(req.body._id, money, newStat)
            .then((data) => {
              res.json(data);
              savingData.createWdrwInvoice(saving.Type, money, data.CCCD);
            })
            .catch((err) => {
              res.json({ message: "So tien khong hop le." });
            });
        }
      }
    });
  },

  MonthlyReport: (req, res) => {
    savingData.Mreport(req.query.time).then((data) => {
      res.json(data);
    });
  },

  DailyReport: (req, res) => {
    console.log(req.query);
    savingData.TypeList().then((data) => {
      savingData.Dreport(req.query.time, data).then((data) => {
        res.json(data);
      });
    });
  },
};
