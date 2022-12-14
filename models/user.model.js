const db = require("../db/db");
const userdb = db.db.collection("Users");

module.exports = {
  findAll: async ()=>{
    const data=[]
    await userdb.find().forEach(usr => data.push(usr))
    return data
  },
  createUser: async (newUser) => {
    return await userdb.insertOne(newUser);
  },
  findByUsername: async (username) => {
    var res = await userdb.findOne({ username });
    if (res === null) {
      throw "tuyendeptrai";
    } else {
      return res;
    }
  },
  findByCCCD: async (CCCD) => {
    console.log("CCCD: ",CCCD)
    var res = await userdb.findOne({ CCCD });
    if (res === null) {
      throw "tuyendeptrai";
    } else {
      return res;
    }
  },
  updateUser: async (newUser, oldUser) => {
    var filter = {
      username: oldUser.username,
    };
    var query = {
      $set: newUser,
    };
    var res = await userdb.updateOne(filter, query);
    if (res === null) {
      throw "tuyendeptrai";
    } else {
      return res;
    }
  },
  updateUserToken: async (token, user) => {
    var filter = {
      username: user.username,
    };
    var query = {
      $set: {
        token: token,
      },
    };
    var res = await userdb.updateOne(filter, query);
    if (res === null) {
      throw "tuyendeptrai";
    } else {
      return res;
    }
  },
  checkAdmin: async (user) => {
    var res = await userdb.findOne({ username: user.username });
    if (res === null) {
      throw "tuyendeptrai";
    } else {
      return res.isAdmin;
    }
  },
};

