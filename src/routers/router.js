require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const auth = require('../auths/auth');
const bcrypt = require('bcrypt');

const router = new express.Router();
router.use(cookieParser());

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
            const token = await user.generateToken();
            // cookie set
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 300000),
                httpOnly: true
            });
            
            await user.save();
            res.status(201).render("login");
        }else {
            res.status(401).render("register", {
                errorMessage: "please enter a same password",
                errorMsg: "Something is worng..."
            });
        }
        
    } catch (error) {
        res.status(500).send(error);
    }
    
})

router.get('/login', (req, res) =>{
    res.render('login');
});

router.get('/home', (req, res) =>{
    res.render('home');
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
                const token = await user.generateToken();
                // cookie set
                res.cookie("jwt", token, {
                expires: new Date(Date.now() + 300000),
                httpOnly: true
            });
                res.status(200).render("home");
            }else {
                res.status(404).render("login", {
                    errorMessage: "please enter a same password",
                    errorMsg: "Something is worng..." 
                });
            }
        } else {
            res.status(404).render("login", {
                errorMsg: "user is not exits"
            });
        }
        
    } catch (error) {
        res.status(500).send(error);
    }
    
});

router.get('/private' , auth, (req, res) =>{
    res.render('private');
});

router.get('/logout' , auth, async(req, res) =>{
    try {
        // particular token remove
        /*
        req.user.tokens = req.user.tokens.filter((currentToken) =>{
            return currentToken.token !== req.token;
        });*/
        // all token delete 
        req.user.tokens = [];
        res.clearCookie("jwt");
        await req.user.save();
        res.render('login');
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;