const userModel = require("../models/user.model")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const { rmSync } = require("fs")

module.exports = {
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
        console.log(data)
        res.send("username exists")
      })
      .catch(() => {
        userModel.findByCCCD(user.CCCD)
          .then((data) => {
            console.log(data)
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
                res.redirect("/user/login")
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

    var isAdmin = false

    userModel.findByUsername(user.username)
      .then(foundUser => { 
        console.log(foundUser)
        isAdmin = foundUser.isAdmin
        return checkPassword(user.password, foundUser.password_digest) 
      })
      .then(result => {
        if (result) {
          return createToken()
        } else {
          res.end("password incorrect")
        }
      })
      .then((token) => {
        req.session.token = token
        req.session.isAdmin = isAdmin
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
        console.log(data)
        res.json({
          success: true
        })
      })
      .catch(err => {
        console.log(err)
        res.json({
          success: false, 
          reason: "something went wrong"
        })
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

