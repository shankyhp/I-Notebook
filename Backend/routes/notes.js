const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note')
const { body, validationResult } = require('express-validator');


//Route 1: Get all the notes: GET "/api/notes/createuser".  Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {

    try {



        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured");

    }
})

//Route 2: Add a new note using : POST "/api/notes/addnote".  Login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'description must be at least 5 characters').isLength({ min: 5 })
], async (req, res) => {

    try {



        const { title, description, tag } = req.body
        //if there are error return bad request and errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savednote = await note.save()

        res.json(savednote)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured");

    }


})

//Route 3: update a existing note using : PUT "/api/notes/updatenote".  Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body


    try {


        //Create a New Note Obj
        const newNote = {};
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        //find the note to be updated and update it

        let note = await Note.findById(req.params.id)
        if (!note) { return res.status(404).send("Not found") } //if the note doesn't exist

        if (note.user.toString() !== req.user.id) {  //if notes id is not equal to user id
            return res.status(401).send("Not Allowed")

        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json(note)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured");

    }


})

//Route 4: Delete a existing note using : DELETE "/api/notes/deletenote".  Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {


    try {




        //find the note to be deleted and delete it

        let note = await Note.findById(req.params.id)
        if (!note) { return res.status(404).send("Not found") } //if the note doesn't exist

        //allow deletion only if user owns this note
        if (note.user.toString() !== req.user.id) {  //if notes id is not equal to user id
            return res.status(401).send("Not Allowed")

        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured");

    }

})

module.exports = router