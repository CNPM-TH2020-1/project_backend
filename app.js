const express = require("express")
const app = express()
const db = require("./db/db")
const { engine } = require("express-handlebars")
const userRoute = require("./routes/user.route")
const auth = require("./middlewares/authorization")
const session = require("express-session")

const userModel = require("./models/user.model")

// config view
app.engine("hbs", engine({
  extname: "hbs",
  partialsDir: "./views",
  helpers: {
    int(string) {
      return parseInt(string)
    }
  },
  layoutsDir: __dirname + '/views/layouts'
}))
app.set("view engine", "hbs")
app.set("views", "./views")

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + "/public"))
app.use(session({
  secret: 'v3r1-s3cr3t',
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
  resave: false
}))

// ROUTES
app.use("/user", userRoute)

app.listen(20621, () => {
  console.log("App listened to port 20621")
  // userModel.createUser({
  //   username: "tuyendeptrai",
  //   password: "123"
  // })
  //   .then(data => {console.log(data)})
})

