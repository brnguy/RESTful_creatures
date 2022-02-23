const express = require('express')
const router = express.Router()
const fs = require('fs') // built-in module
const methodOverride = require('method-override')

// index ie list all the creatures!
router.get('/', (req, res) => {
    let prehistoric = fs.readFileSync('../prehistoric-creatures.json')
    let prehistoricData = JSON.parse(prehistoric)
    // grabbing the queried name from the URL
    let nameFilter = req.query.nameFilter
    // if there IS a query
    if(nameFilter) {
        // filter out all dinos who don't have the queried name
        prehistoricData = prehistoricData.filter(creature => {
            return creature.type.toLowerCase() === nameFilter.toLowerCase()
        })
        res.render('indexCreatures.ejs', {myPrehistoric: prehistoricData})
    }
    res.render('indexCreatures.ejs', {myPrehistoric: prehistoricData})
})

// new route (renders the form)
router.get('/new', (req, res) => {
    res.render('newCreatures.ejs')
})

// edit form route (renders edit form)
router.get('/edit/:idx', (req, res) => {
    // read in the prehistoric creature from the database(db)
    let prehistoric = fs.readFileSync('./prehistoric-creatures.json')
    let prehistoricData = JSON.parse(prehistoric)
    // extract the prehistoric creature corresponding to the id
    let prehistoricIndex = req.params.idx
    let targetPrehistoric = prehistoricData[prehistoricIndex]
    res.render('editCreatures.ejs', {prehistoric: targetPrehistoric, prehistoricId: prehistoricIndex})
}) 

// PUT ROUTE
router.put('/:idx', (req, res) => {
    // read in our existing prehistoric creatures data
    let prehistoric = fs.readFileSync('../prehistoric-creatures.json')
    let prehistoricData = JSON.parse(prehistoric)
    // replace prehistoric creature filed with field from form
    prehistoricData[req.params.idx].type = req.body.type
    prehistoricData[req.params.idx].img_url = req.body.img_url
    // write the updated array back to the json file
    fs.writeFileSync('../prehistoric-creatures.json', JSON.stringify(prehistoricData))
    // once the prehistoric creature has been editted, do a get request to the index route
    res.redirect('/')
})

// show ie show all info about a single prehistoric creature
// :idx is a URL parameter
router.get('/:idx' , (req, res) => {
    // read in the prehistoric creatures from the database(db)
    let prehistoric = fs.readFileSync('../prehistoric-creatures.json')
    let prehistoricData = JSON.parse(prehistoric)
    // extract the prehistoric creatures corresponding to the id
    let prehistoricIndex = req.params.idx
    let targetPrehistoric = prehistoricData[prehistoricIndex]
    res.render('showCreatures.ejs', {creature: targetPrehistoric})
})

// post a new prehistoric creature
router.post('/', (req, res) => {
    // read in the prehistoric creatures from the database(db)
    let prehistoric = fs.readFileSync('../prehistoric-creatures.json')
    let prehistoricData = JSON.parse(prehistoric)
    // add new prehistoric creatures to dinoData array
    prehistoricData.push(req.body)
    // save the prehistoric creatures to the json file
    fs.writeFileSync('../prehistoric-creatures.json', JSON.stringify(prehistoricData))
    // redirect back to index route
    // res.dredirect takes the url pattern for the get route that you
    // want to run next
    res.redirect('/')
})

router.delete('/:idx', (req, res) => {
    // read in our existing prehistoric creatures data
    let prehistoric = fs.readFileSync('./prehistoric-creatures.json')
    let prehistoricData = JSON.parse(prehistoric)
    // remove the deleted prehistoric creatures from dinoData
    prehistoricData.splice(req.params.idx, 1)
    // save the dinosaurs to the json file
    fs.writeFileSync('../prehistoric-creatures.json', JSON.stringify(prehistoricData))
    // redirect back to index route
    // res.dredirect takes the url pattern for the get route that you
    // want to run next
    res.redirect('/')
})

module.exports = router