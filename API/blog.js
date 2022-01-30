const express = require('express')
const router = express.Router()
const Blogs = require('../models/Blogs')
const secret = "3asba";

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

    Blogs.find({_id: req.params.id})
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


router.put('/blog/:id', (req, res) => { 
    const { title, text, description, visibility, image, creator, creatorId, cta, ctaText } = req.body;
    let blogFields = {
        title: title,
        description: description,
        visibility: visibility,
        text: text,
        image: image,
        creator: creator,
        creatorId: creatorId,
        cta: cta,
        ctaText: ctaText
    }
    let tags = [];
    req.body.tags.forEach((tag) => tags.push(tag.text));
    blogFields.tags = tags;
    console.log(blogFields)
    Blogs.findById(req.params.id)
        .then(blog => {
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