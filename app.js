const express = require("express");
const app = express();
const { engine } = require("express-handlebars");
const savingRoute = require("./routes/saving.route");
const userRoute = require("./routes/user.route");
const typeRoute = require("./routes/type.route");
const auth = require("./middlewares/authorization");
const session = require("express-session");
const cors = require("cors");
// config view
app.use(cors());
app.engine(
  "hbs",
  engine({
    extname: "hbs",
    partialsDir: "./views",
    helpers: {
      int(string) {
        return parseInt(string);
      },
    },
    layoutsDir: __dirname + "/views/layouts",
  })
);
app.set("view engine", "hbs");
app.set("views", "./views");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(
  session({
    secret: "v3r1-s3cr3t",
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false,
  })
);

// ROUTES
app.use("/user", userRoute)
app.use("/saving", savingRoute)
app.use("/type",typeRoute)
app.listen(4000, () => {
  console.log("App listened to port 4000");
});
