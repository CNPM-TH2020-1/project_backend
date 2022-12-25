const userModel = require("../models/user.model")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const { rmSync } = require("fs")

module.exports = {
  getAllUsers: async (req, res) => {
    const data = await userModel.findAll()
    res.json({
      users: data
    })
  },
  signup: (req, res) => {
    res.render("signup")
  },
  login: (req, res) => {
    res.render("login", {
      user: req.session.user,
      isChecked: req.session.isChecked
    })
  },
  create: async (req, res) => {
    var user = req.body

    console.log(user)

    if (!user.CCCD || !user.username || !user.password || !user.address || !user.hasOwnProperty("isAdmin")) {
      res.json({ "message": "please provide all fields" })
      return
    }

    userModel.findByUsername(user.username)
      .then((data) => {
        res.send("username exists")
      })
      .catch(() => {
        userModel.findByCCCD(user.CCCD)
          .then((data) => {
            res.send("CCCD exists")
          })
          .catch(() => {
            hashPassword(user.password)
              .then(hashed => { user.password_digest = hashed })
              .then(() => { return createToken() })
              .then(token => { user.token = token })
              .then(() => {
                user.createAt = new Date()
                return userModel.createUser(user)
              })
              .then(data => {
                console.log("return", data)
                res.json({
                  message:"Success"
                })
                // res.redirect("/user/login")
              })
              .catch(err => console.log(err.message))
          })
      })
  },
  authenticate: (req, res) => {
    console.log(req.body)
    var user = req.body

    if (!user.username || !user.password) {
      res.json({ "message": "please provide all fields" })
      return
    }

    userModel.findByUsername(user.username)
      .then(foundUser => { return checkPassword(user.password, foundUser.password_digest) })
      .then(result => {
        if (result) {
          return createToken()
        } else {
          res.end("password incorrect")
        }
      })
      .then((token) => {
        req.session.token = token
        req.session.foundUser?.isAdmin
        if (user.rememberme) {
          req.session.user = {
            username: user.username,
            password: user.password
          }
          req.session.isChecked = true
        } else {
          delete req.session.user
          delete req.session.isChecked
        }
        req.session.username = user.username
        return userModel.updateUserToken(token, user)
      })
      .then((data) => {
        res.send({
          success:true,
          username: user.username,
        })
        console.log(data)
        // res.redirect("/home")
      })
      .catch(err => {
        console.log(err)
        res.send("account does not exist")
      })
  },
  logout: (req, res) => {
    delete req.session.token
    res.redirect("/user/login")
  }
}

const hashPassword = async (password) => {
  var saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

const createToken = async () => {
  var token = await crypto.randomBytes(16)
  return token.toString("base64")
}

const checkPassword = async (reqPassword, password_digest) => {
  return await bcrypt.compare(reqPassword, password_digest)
}

