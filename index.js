// import packages
const { escapeRegExpChars } = require('ejs/lib/utils')
const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const fs = require('fs') // built-in module
const methodOverride = require('method-override')

// create an instance of express
const app = express()

// middleware
// tell express to use ejs as the view engine
app.set('view engine', 'ejs')
// tell express that we're using ejs layouts
app.use(ejsLayouts)
// method override configuration
app.use(methodOverride('_method'))
// body-parser middleware
// this allows us to access form data via req.body
app.use(express.urlencoded({extended: false}))

// CONTROLLERS
app.use('/dinosaurs', require('./controllers/dinoController.js'))
app.use('/prehistoric_creatures', require('./controllers/prehistoricController.js'))

// ROUTES
// home
app.get('/', (req, res) => {
    res.send('Hello Dinos')
})

app.listen(8000, () => {
    console.log('DINO CRUD TIME')
})