const movieModel = require("../models/movie.model")

module.exports = {
  home: async (req, res) => {
    movieModel.sortedBy("topRank")
      .then(async (data) => {
        res.render("moviesShowCase", {
          movies: data.slice(0, 12),
          allMovies: await movieModel.getAll()
        })
      })
      .catch(err => { console.log(err) })
  },
  addToCollection: async (req, res) => {
    var username = req.session.username
    var movieId = req.body.movieId
    movieModel.checkExists(username, movieId)
      .then(() => {
        res.send("movie is already added")
      })
      .catch(err => {
        movieModel.addToCollection(username, movieId)
          .then(data => {
            console.log(data)
            res.redirect("/home")
          })
          .catch(err => {
            console.log(err.message)
            res.send("movie is already added")
          })
      })
  },
  collection: (req, res) => {
    movieModel.getCollectionByUsername(req.session.username)
      .then(data => {
        console.log(data)
        res.render("collection", {
          movies: data
        })
      })
  },
  remove: (req, res) => {
    movieModel.removeItemFromCollection(req.body.movieId)
      .then(data => {
        console.log("delete ", data)
        res.redirect("/home/collection")
      })
      .catch(err => { res.send(err.message) })
  },
  more: (req, res) => {
    movieModel.getById(req.body.movieId)
      .then((data) => {
        console.log(data.reviews)
        res.render("movieDetail", {
          movie: data
        })
      })
  }
}