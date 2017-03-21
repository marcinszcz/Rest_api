const r = require('rethinkdb')

r.connect({ db: 'bookshop' }).then((connection) => {
  r.dbCreate('bookshop')
  r.db('bookshop').tableCreate('books')
  r.db('bookshop').tableCreate('authors')
  console.log('database was created')
})
