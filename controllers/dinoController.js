const express = require('express')
const router = express.Router()
const fs = require('fs') // built-in module
const methodOverride = require('method-override')

// index ie list all the dinos!
router.get('/', (req, res)=>{
    // read in the array from dinosaurs.json
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    // grabbing the queried name from the url
    let nameFilter = req.query.nameFilter
    // if there IS a query,
    if(nameFilter){
        // filter out all dinos who don't have the queried name
        dinoData = dinoData.filter(dino=>{
            return dino.name.toLowerCase() === nameFilter.toLowerCase()
        })
    }
    res.render('index.ejs', {myDinos: dinoData})
})
// new route (renders the new dino form)
router.get('/new', (req, res)=>{
    res.render('new.ejs')
})
// edit form route (renders edit form)
router.get('/edit/:idx', (req, res)=>{
    // read in the dinos from the db
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    // extract the dino corresponding to the idx param
    let dinoIndex = req.params.idx
    let targetDino = dinoData[dinoIndex]

    res.render('edit.ejs', {dino: targetDino, dinoId: dinoIndex})
})

// PUT ROUTE
router.put('/:idx', (req, res)=>{
    // read in our existing dino data
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    // replace dino fields with field from form
    dinoData[req.params.idx].name = req.body.name
    dinoData[req.params.idx].type = req.body.type
    // write the updated array back to the json file
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData))
    // once the dinosaur has been editted, do a get request to the index route
    res.redirect('/dinosaurs')
})

// show ie show all info about a single dino
// : indicates that the following is a url param(eter)
router.get('/:idx', (req, res)=>{
    // read in the dinos from the db
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    // extract the dino corresponding to the idx param
    let dinoIndex = req.params.idx
    let targetDino = dinoData[dinoIndex]
    res.render('show.ejs', {dino: targetDino})
})

// post a new dino
router.post('/', (req, res)=>{
    // read in our dino data from the json file
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    // add the new dino to the dinoData array
    dinoData.push(req.body)
    // save the dinosaurs to the json file
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData))
    // redirect back to the index route
    // res.redirect takes the url pattern for the get route that you
    // want to run next
    res.redirect('/dinosaurs')
})

router.delete('/:idx', (req, res)=>{
    // read in our dinos from our json file
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    // remove the delete dino from dinoData
    dinoData.splice(req.params.idx, 1)
    // write the updated array back to the json file
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData))
    res.redirect('/dinosaurs')
})

module.exports = router