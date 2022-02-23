const express = require('express')
const router = express.Router()
const Blogs = require('../models/Blogs')

const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

const fs = require('fs');

router.get('/blogs', (req, res) => {
    Blogs.find()
        .then(blogs => {
            if (!blogs) {
                return res.status(400).json({ msg: 'No Blogs found' })
            } else {
                res.send(blogs)
            }
        })
        .catch(err => res.json({ msg: 'Server error' }))
});

router.get('/blogs/:id', (req, res) => {

    Blogs.find({ _id: req.params.id })
        .then(blog => {
            if (!blog) {
                return res.status(400).json({ msg: 'No Blogs found' })
            } else {
                res.send(blog)
            }
        })
        .catch(err => res.json({ msg: 'Server error' }))
});

router.post('/blog', (req, res) => {
    const { title, text, description, image, visibility, creator, creatorId, cta, ctaText } = req.body;
    let creationDate = new Date();
    let tags = [];
    req.body.tags.forEach((tag) => tags.push(tag.text));
    console.log(tags)
    const obj = new Blogs({ title, text, description, image, visibility, creator, creatorId, tags, cta, ctaText, creationDate });

    obj.save(function (err) {
        if (err) {
            res.status(500)
            res.json(err)
            return;
        }
        res.status(200)
        res.json(obj)
    });
});

router.delete('/blog/:id', (req, res) => {
    Blogs.findById(req.params.id)
        .then(zone => {
            var imageLink = zone.image.replace("http://localhost:5010/","uploads/")
            try {
                fs.unlinkSync(imageLink)
              } catch(err) {
                console.error(err)
              }
            console.log(zone)
            if (!zone) {
                return res.json({ msg: 'Blog not found' })
            } else {
                Blogs.findByIdAndDelete(req.params.id, (err, data) => {
                    res.json({ msg: "Blog has been Deleted" })
                })
            }
        })
        .catch(err => console.log(err.message))
})

//Upload Umage
const DIR = './uploads/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});

var upload = multer({
    storage: storage,
    limits: { fieldSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});


// Blog model
router.post('/blog-image', upload.single('image'), (req, res) => {
    let creationDate = new Date();
    const url = req.protocol + '://' + req.get('host')
    let tagsList = JSON.parse(req.body.tags)
    let tags = [];
    tagsList.forEach((tag) => tags.push(tag.text));
    const blog = new Blogs({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
        cta: req.body.cta,
        ctaText: req.body.ctaText,
        visibility: req.body.visibility,
        text: req.body.text,
        image: url + '/' + req.file.filename,
        creationDate: creationDate,
        creator: req.body.creator,
        creatorId: req.body.creatorId,
        tags: tags,
    });
    blog.save().then(result => {
        res.status(201).json({
            message: "Blog registered successfully!",
            blogCreated: {
                _id: result._id,
                image: result.image
            }
        })
    }).catch(err => {
        console.log(err),
            res.status(500).json({
                error: err
            });
    })
})

//Update
router.put('/blog/:id',upload.single('image'), (req, res) => { 
    let tagsList = JSON.parse(req.body.tags)
    let tags = [];
    tagsList.forEach((tag) => tags.push(tag.text));
    const url = req.protocol + '://' + req.get('host')
    let blogFields = {
        title: req.body.title,
        description: req.body.description,
        cta: req.body.cta,
        ctaText: req.body.ctaText,
        visibility: req.body.visibility,
        text: req.body.text,
        //image: url + '/' + req.file.filename,
        tags: tags,
    }

    if (req.file && req.file.filename){
        blogFields.image = url + '/' + req.file.filename
    }image: url + '/' + req.file.filename,
    Blogs.findById(req.params.id)
        .then(blog => {
            var imageLink = blog.image.replace("http://localhost:5010/","uploads/")
            try {
                fs.unlinkSync(imageLink)
                //file removed
              } catch(err) {
                console.error(err)
              }
            if (!blog) {
                return res.json({ msg: 'Blog not found' })
            } else if (blog.id !== req.params.id) {
                res.json({ msg: "not authorized" })
            } else {
                Blogs.findByIdAndUpdate(req.params.id, { $set: blogFields }, (err, data) => {
                    res.json({ msg: "Blog has been updated" })
                })
            }
        })
        .catch(err => console.log(err.message))
        
})
module.exports = router