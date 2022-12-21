const db = require("../db/db")
const { findByUsername } = require("./user.model")

module.exports = {
  sortedBy: async (field) => {
    return await db.db.any("SELECT * FROM Movies group by id order by $1:raw", [field])
  },
  getAll: async () => {
    return await db.db.any("SELECT * FROM Movies")
  },
  addToCollection: async (username, movieId) => {
    return await db.db.one("insert into Collection (username, movieId) values($1, $2) returning *", [username, movieId])
  },
  getById: async (movieId) => {
    return await db.db.one("select * from Movies where id=$1", [movieId])
  },
  getCollectionByUsername: async (username) => {
    return await db.db.any("select * from movies where id in (select movieid from collection where username=$1)", [username])
  },
  removeItemFromCollection: async (movieId) => {
    return await db.db.one("delete from Collection where movieId = $1 returning *", [movieId])
  },
  checkExists: async (username, movieId) => {
    return await db.db.one("select * from Collection where username=$1 and movieId=$2", [username, movieId])
  }
}