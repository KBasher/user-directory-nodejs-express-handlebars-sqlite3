var express = require('express');
var fs = require('fs');
var path = require("path");
var router = express.Router();

router.get('/', function(req, res) {
  res.redirect("userdirectories");
});
router.get('/userdirectories', function(req, res) {
    var db = req.db;
    
    db.all("SELECT * FROM User", function(err, row){
		res.render('userdirectories', {
            "userlist" : row
        });
	});
});
router.get('/updateuserdirectory/:id', function(req, res) {
    var db = req.db;

    db.each("SELECT * FROM User where Id = $userId", {$userId : req.params.id} , function(err, row){
    	res.render('updateuserdirectory', { user: row });
	  });
});
router.post('/updateuserdirectory/:id', function(req, res) {
    var db = req.db;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    
    console.log(firstName);

    fs.readFile(req.files.uploadImage.path, function (err, data) {
        var imageName = req.files.uploadImage.name;
        if(!imageName)
        {
            console.log("There was an error");
            res.redirect("/");
            res.end();
        } 
        else
        {
            var pathCreate= path.join(__dirname, '../public', 'images');
            var newPath = pathCreate + "/" + imageName;

            fs.writeFile(newPath, data, function (err) {
                
                db.run("UPDATE User SET FirstName = $firstName, LastName = $lastName, ImageUrl = $imageUrl WHERE Id = $userId", {
                    $userId: req.params.id,
                    $firstName: firstName,
                    $lastName: lastName,
                    $imageUrl: "/images/" +  req.files.uploadImage.name
                }, function(err, row){
                  res.redirect("/userdirectories");
                });
            });
        }
    });
});
router.get('/adduserdirectory', function(req, res) {
    res.render('adduserdirectory', { title: 'Add New User' });
});
router.post('/adduserdirectory', function(req, res) {
    var db = req.db;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;

    fs.readFile(req.files.uploadImage.path, function (err, data) {
        var imageName = req.files.uploadImage.name;
        if(!imageName){
            console.log("There was an error");
            res.redirect("/");
            res.end();
        } 
        else {
            var pathCreate= path.join(__dirname, '../public', 'images');
            var newPath = pathCreate + "/" + imageName;
            fs.writeFile(newPath, data, function (err) {
                console.log(firstName);
                db.run("INSERT INTO User(FirstName, LastName, ImageUrl) VALUES (?, ?, ?)", 
                  [firstName, lastName, "/images/" +  req.files.uploadImage.name], function(err, row){
                  res.redirect("/userdirectories");
                });
            });
        }
    });
});
router.delete('/deleteuserdirectory/:id', function(req, res) {
    var db = req.db;
    db.run("Delete from User WHERE Id = $userId", {$userId: req.params.id});
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end("Hello");
});


module.exports = router;
