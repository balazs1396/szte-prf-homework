const express = require('express');
const router = express.Router();
const passport = require('passport');

const Order = require("./models/order");
const User = require("./models/user");
const Product = require("./models/product");

router.route('/login').post((req, res, next) => {
    if(req.body.username, req.body.password) {
        passport.authenticate('local', function(error, user) {
            if(error) return res.status(500).send(error);
            req.login(user, function(error) {
                if(error) return res.status(500).send(error);
                return res.status(200).send('Bejelentkezes sikeres');
            })
        })(req, res);
    } else {
        return res.status(400).send('Hibas keres, username es password kell');
    }
});

router.route('/logout').post((req, res, next) => {
    if(req.isAuthenticated()) {
        req.logout();
        return res.status(200).send('Kijelentkezes sikeres');
    } else {
        return res.status(403).send('Nem is volt bejelentkezve');
    }
})

router.route('/status').get((req, res, next) => {
    if(req.isAuthenticated()) {
        return res.status(200).send(req.session.passport);
    } else {
        return res.status(403).send('Nem is volt bejelentkezve');
    }
    
})

router.route('/user').get((req, res, next) => {
    User.find({}, (err, users) => {
        if(err) return res.status(500).send('DB Connection error');
        res.status(200).send(users);
    })
}).post((req, res, next) => {
    if(req.body.username && req.body.name && req.body.password) {
        User.findOne({username: req.body.username}, (err, user) => {
            if(err) return res.status(500).send('DB Connection error');
            if(user) {
                return res.status(400).send('User already exist');
            }
            const usr = new userModel({username: req.body.username, password: req.body.password, 
                name: req.body.name});
            usr.save((error) => {
                if(error) return res.status(500).send('Error occurred during the saving');
                return res.status(200).send('saved');
            })
        })
    } else {
        return res.status(400).send('Invalid request body');
    }
})

router.route("/product").get((req, res) => {
    Product.find({}, (err, products) => {
        if(err) return res.status(500).send('DB hiba2');
        res.status(200).send(products);
    })
   
}).post((req, res, next) => {
    if(req.body.title && req.body.price && req.body.quantity) {
        Product.findOne({title: req.body.title}, (err, product) => {
            if(err) return res.status(500).send('DB Connection error');
            if(product) {
                return res.status(400).send('Product already exist');
            } else {
                const product = new Product({
                    title: req.body.title,
                    price: req.body.price,
                    quantity: req.body.quantity
                });
                product.save()
                    .then((result) => res.send(result))
                    .catch((error) => {
                        console.log("failed on product saving", error);
                        res.status(500).send("error at pruduct saving");
                    });
            }
        })
    } else {
        return res.status(400).send('Invalid request body');
    }
}).put((req, res, next) => {
    if(req.body.title && req.body.price && req.body.quantity) {
        Product.findOne({title: req.body.title}, (err, product) => {
            if(err) return res.status(500).send('DB Connection error');
            if(!product) {
                return res.status(400).send('Product not exist');
            } 
            product.price = req.body.price;
            product.quantity = req.body.quantity;
            product.save()
                .then((result) => res.send(result))
                .catch((error) => {
                    console.log("failed on product saving", error);
                    res.status(500).send("error at pruduct saving");
                });
        })
    } else {
        return res.status(400).send('Invalid request body');
    }
}).delete((req, res, next) => {
    if(req.body.title) {
        Product.findOne({id: req.body.title}, (err, product) => {
            if(err) return res.status(500).send('DB Connection error');
            if(product) {
                product.delete((error) => {
                    if(error) return res.status(500).send('Error occurred during the deletion');
                    return res.status(200).send('deleted');
                })
            } else {
                return res.status(400).send('Product not exist');
            }
        })
    } else {
        return res.status(400).send('Invalid request body');
    }
});

module.exports = router;