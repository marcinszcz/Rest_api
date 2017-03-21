const express = require('express')
const r = require('rethinkdb')
const config = require('./config.js')
const app = express()

// connect to db
r.connect({ db: 'bookshop' }).then((connection) => {
  app.get('/', function (req, res) {
    res.json({ message: 'welcome to our api!' })
  })

  app.get('/books/search', (req, res) => {
    const search = req.query.search
    console.log(req)
    r.db('bookshop').table('books')
    .filter(r.row('title').match(search + '.*'))
    .run(connection).then((cursor) => {
      cursor.toArray()
        .then((books) => res.json(books))
    })
  })

  app.get('/books', (req, res) => {
    r.table('books').run(connection).then((cursor) => {
      // console.log(cursor)
      cursor.toArray().then((books) => res.json(books))
    })
  })

  app.get('/books/:id', (req, res) => {
    const id = req.params.id
    r.db('bookshop').table('books').get(id).run(connection).then((book) => {
      res.json(book)
    })
  })

  app.post('/books', (req, res) => {
    const title = req.query.title
    r.db('bookshop').table('books').insert({ title: title }).run(connection).then((response) => {
      res.json(response)
    })
  })

  app.put('/books/:id', (req, res) => {
    const id = req.params.id
    const title = req.query.title
    // console.log(req)
    r.db('bookshop').table('books').get(id).replace({ id: id, title: title }).run(connection)
      .then((response) => {
        res.send(response)
      })
  })

  app.delete('/books/:id', (req, res) => {
    const id = req.params.id
    r.db('bookshop').table('books').get(id).delete().run(connection)
      .then((response) => {
        res.send(response)
      })
  })

  app.listen(config.express.port)
  console.log('Server running on port ' + config.express.port)
})
