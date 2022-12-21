
module.exports = {
  auth: (req, res, next) => {
    console.log(req.session)
    if (req.session && req.session.token)
      next();
    else
      res.status(401).send("Please log in first");
  }, 
  checkAuthorized: (req, res, next) => {
    if (req.session && req.session.token)
      res.redirect("/home")
    else
      next()
  }
}

