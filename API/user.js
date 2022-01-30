const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const Users = require('../models/Users')

router.get('/checkStatus/:id',  (req, res) => {
    let {id} = req.params;
    Users.findOne({ _id: id })
    .then(user => {
        if (!user) {
            return res.status(400).json({ redirect: true });
        } else {
            if(Number(user.clearance) == 2){
                    res.json({status: true})
            } else { 
                res.json({status: false})
            }
        }
    })
});


router.get('/user/info/:id', (req, res) => {
    let {id} = req.params;
    Users.findOne({ _id: id })
    .then(user => {
        if (!user) {
            return res.status(400).json({ redirect: true });
        } else {
            let payload = {
                _id: user._id,
                email: user.email,
                name: user.name
            }
            res.json(payload)
        }
    })
})

router.put('/upload/:id', (req, res) => {
    const {file} = req.body;
    let {id} = req.params;
    Users.findById(id)
    .then(user => {
        if (!user) {
            return res.json({ msg: 'User not found' })
        } else if (user.id !== id) {
            res.json({ msg: "not authorized" })
        } else {
            Users.findByIdAndUpdate(id, { $push: { uploads: file } }, (err, data) => {
                if(err) console.log(err)
                console.log(data)
                res.json({ msg: "User has been updated" })
            })
        }
    })
    .catch(err => console.log(err.message));
});

router.post('/auth', (req, res) => {
    const { email, password } = req.body;
    Users.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(400).json({ msg: 'Please register before!' })
            } else {
                if(password == user.password) {
                    const payload = {
                        user: { 
                            _id: user._id,
                            email: user.email,
                            name: user.name
                        }
                    }
                    res.json(payload)
                } else {
                    return res.status(400).json({ msg: 'Wrong password!' });
                }
            }
        })
        .catch(err => {
            console.log(err)
            res.json({ msg: 'Server error' })
        })
});

const generateHash = async function(value){
    bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(value, salt, (err, hashedValue) => {
            console.log(hashedValue)
            console.log('Hash of ', value);
            return hashedValue;
        })
    })
}

const checkHash = function(hash, value){
    bcrypt.compare(hash, value, (err, isMatch) => {
        if (err) {
            console.log(err.message);
            return false;
        } else if (isMatch) {
            return true
        }
        return false;
    })
}

router.post('/', (req, res) => {
    const { email, password, Phone, BusinessName } = req.body
    Users.findOne({ email })
        .then(user => {
            if (user) {
                res.status(400).json({ msg: 'User already exists!!' })
            } else {
                user = new User({
                    BusinessName,
                    password,
                    email,
                    Phone
                })
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(user.password, salt, (err, hashedpassword) => {
                        user.password = hashedpassword
                        user.save()
                        const payload = { user: {id: user.id} }
                        jwt.sign(payload, jwtsecret, { expiresIn: 3600000 }, (err, token) => {
                            if (err) throw err;
                            res.send({ token })
                        })
                    })
                })
            }
        })
        .catch(err => res.status(400).json({ msg: 'register failed' }))
})


router.put('/:id', (req, res) => {
    const { BusinessName, Phone, email, password } = req.body
    console.log(req.body)
    let userFields = {}
    if (BusinessName) userFields.BusinessName = BusinessName
    if (Phone) userFields.Phone = Phone
    if (email) userFields.email = email
    if (password && password.length > 0) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hashedpassword) => {
                password = hashedpassword
            })
        })
        userFields.password = password
    }
    Users.findById(req.params.id)
        .then(user => {
            if (!user) {
                return res.json({ msg: 'User not found' })
            } else if (user.id !== req.user.id) {
                res.json({ msg: "not authorized" })
            } else {
                User.findByIdAndUpdate(req.params.id, { $set: userFields }, (err, data) => {
                    res.json({ msg: "User has been updated" })
                })
            }
        })
        .catch(err => console.log(err.message))
})

router.get('/:id', (req, res) => {
    Users.findById(req.params.id)
        .then(user => res.json({
            BusinessName: user.BusinessName,
            _id: user._id
        }))
        .catch(err => res.json({ msg: 'Server error ' }))
})

module.exports = router