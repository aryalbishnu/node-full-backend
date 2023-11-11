require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const router = new express.Router();

router.get('/', (req, res) =>{
    res.render('register');
});

router.post('/register', async(req, res) =>{
    try {
        const password = req.body.password;
        const repassword = req.body.repassword;
        if(password == repassword){
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                sex: req.body.sex,
                password: req.body.password,
                repassword: req.body.repassword
            });
            // token generate function call
            await user.generateToken();
            await user.save();
            res.status(201).render("login");
        }else {
            res.status(401).send("password is wrong");
        }
        
    } catch (error) {
        res.status(400).send(error);
    }
    
})

router.get('/login', (req, res) =>{
    res.render('login');
});

router.post('/login', async(req, res) =>{
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({email: email});   
        if(user){
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch){
                // generate token
                await user.generateToken();
                res.status(200).send("congratulation");
            }else {
                res.status(404).send("password is wrong");
            }
        } else {
            res.status(404).send("user is not exits");
        }
        
    } catch (error) {
        res.status(500).send(error);
    }
    
});

module.exports = router;