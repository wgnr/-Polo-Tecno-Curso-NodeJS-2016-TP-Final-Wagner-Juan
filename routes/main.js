var app = module.parent.exports.app;
var passport = module.parent.exports.passport;
var Persons = require('../models/persons.js');
var Admins = require('../models/admins.js');

//autorizacion
var adminAuth = function(req, res, next){
    //authorize role
    if(typeof req.user != "undefined"){
        next();
    }else{
        //Not authorized redirect
        res.redirect('/admin');
    }
};

// layoutmolesto para deslogearte!
app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
});

app.get('/panel/employees', adminAuth, function(req, res){
	var msg = req.flash('message')  // Read the flash message
	Persons.find({}, function(err, docs){
// ESTA LINEA ME DEVUELVE EL JSON COMPLETO res.json(docs);
	// res.render('panel-employees', { title: 'Employee List', persons: docs});
	 res.render('panel-employees', { title: 'Employee List', persons: docs, flashmsg: msg}); // Pass Flash Message to the view ???
	});
});

app.get('/panel/employees/new', adminAuth, function(req, res){  
	res.render('panel-employees-new', { title: 'New Employee'});
});

app.post('/panel/employees/new', adminAuth, function(req, res){
    console.log(req.body);
    var p = new Persons({
	firstName: req.body.fname,
	lastName: req.body.lname,
	email: req.body.email,
	password: req.body.password	
	});
    p.save(function(err, doc){
        if(!err){
		req.flash('message',req.body.lname+', ' + req.body.fname +' ADDED !'); // Save the flash message
            res.redirect('/panel/employees');
        } else {
            res.end(err);    
        }    
    });
 });

app.get('/panel/employees/delete/:id', adminAuth, function(req, res){
	Persons.remove({ _id: req.params.id }, function(err, doc){
        if(!err){
		req.flash('message', req.params.id+' DELETED!'); // Save the flash message
            res.redirect('/panel/employees');
        } else {
            res.end(err);    
        }    
    });
});

app.get('/panel/employees/edit/:id', adminAuth, function(req, res){
    Persons.findOne({ _id: req.params.id }, function(err, doc){
        if(!err){
            res.render('panel-employees-edit', { title: 'Edit Employee-s Info', person: doc});
        } else {
            res.end(err);    
        }    
    });
});

app.post('/panel/employees/edit/:id', adminAuth, function(req, res){
    Persons.findOne({ _id: req.params.id }, function(err, doc){
        if(!err){
		doc.firstName=req.body.fname,
		doc.lastName=req.body.lname,
		doc.email=req.body.email
           doc.save(function(err, doc){
                if(!err){
			req.flash('message',req.body.lname+', ' + req.body.fname +' EDITED !'); // Save the flash message                    
			res.redirect('/panel/employees');
                } else {
                    res.end(err);    
                }    
            }); 
        } else {
            res.end(err);    
        }    
    });
});

app.get('/admin', function(req, res){
    res.render('admin', { title: 'Log In'});
});
//app.post('/admin', function(req, res){
//   res.json(req.body);
//});
app.post('/admin', passport.authenticate('AdminLogin', 
    { successRedirect: '/panel/employees',
      failureRedirect: '/admin',
      failureFlash: true }
));


app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/admin');
});



app.get('/employee/search/:keyword', function(req, res){
	var re = new RegExp(".*" + req.params.keyword +".*",'i');
	Persons.find({ $or:[{firstName: re}, {lastName: re}, {email: re} ]},'firstName lastName email' ,function(err, doc){
 //Persons.findOne({ lastName: req.params.keyword}, 'firstName lastName email', function(err, doc){
      if(!err){
            res.render('JSONpeel', {person: doc});
        } else {
            res.end(err);    
        }    
    });
});