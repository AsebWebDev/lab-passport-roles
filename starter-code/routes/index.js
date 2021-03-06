const express = require('express');
const router  = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const { isConnected, checkAdmin, checkTA, checkRole } = require('../middlewares')
const ensureLogin = require("connect-ensure-login");

// User model
const User = require("../models/User");
const Course = require("../models/Course");

/* GET home page */
router.get('/', (req, res, next) => {
  // let username = "Unknown User";
  // if (req.user) username = req.user.username;
  // res.render('index', {username: username});
  if (isConnected) res.render('index', {user: req.user});
  else res.render('index');
});

// Login
router.get('/login', (req, res, next) => {
  res.render("login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

// Signup

router.get('/signup', (req, res, next) => {
  res.render("signup", { "message": req.flash("error") });
});

router.post("/signup", (req, res, next) => {

  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ "username": username })
  .then(user => {
    if (user !== null) {
      res.render("signup", {
        errorMessage: "The username already exists!"
      });
      return;
    }

    if (username === "" || password === "") {
      res.render("signup", {
        errorMessage: "Indicate a username and a password to sign up"
      });
      return;
    }
    const bcryptRounds = 10;
    const salt     = bcrypt.genSaltSync(bcryptRounds);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      username,
      password: hashPass
    });

    newUser.save()
    .then(user => {
      res.redirect("/");
    })
    .catch(error => {
      next(error);
    });
  })
  .catch(error => {
    next(error);
  });
});

// View Profile

router.get('/profile/:id', isConnected, (req, res, next) => {
  User.findById(req.params.id)
  .then((user) => {
    let isOwner = req.user._id.equals(req.params.id)
    res.render("profile", {user: user, isOwner: isOwner});
  })
  .catch(error => {
    console.log(error);
    next();
  });
});

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

// TA Page
router.get('/addcourse', checkTA, (req, res, next) => {
  res.render('addcourse');
});

// TA Add Course
router.post("/addcourse", checkTA, (req, res, next) => {
  const courseName = req.body.courseName;
  const sport = req.body.sport;
  const courseLng = req.body.courseLng;
  const courseLat = req.body.courseLat;

  if (courseName === "") {
    res.render("addCourse", { message: "Indicate Course Name" });
    return;
  }

  Course.findOne({ courseName })
  .then(course => {
    if (course !== null) {
      res.render("addcourse", { message: "The Course ealready exists" });
      return;
    }

    const newCourse = new Course({
      courseName: courseName,
      sport: sport,
      location: {type: "Point", coordinates: [courseLng, courseLat]}
    });

    newCourse.save((err) => {
      if (err) {
        res.render("addcourse", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  })
  .catch(error => {
    next(error);
  });
});


// Admin Page
router.get('/adduser', checkAdmin, (req, res, next) => {
  res.render('adduser');
});

// Add User Admin
router.post("/adduser", checkAdmin, (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || password === "") {
    res.render("adduser", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("adduser", { message: "The username already exists" });
      return;
    }

    const bcryptRounds = 10;
    const salt = bcrypt.genSaltSync(bcryptRounds);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      role
    });

    newUser.save((err) => {
      if (err) {
        res.render("adduser", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  })
  .catch(error => {
    next(error);
  });
});

// Show Users

router.get('/employees', isConnected, (req,res,next) => {
  User.find()
    .then(users => {
      res.render('employees', {users: users, role: req.user.role});
    });
});

// Show Courses

router.get('/courses', isConnected, (req,res,next) => {
  Course.find()
    .then(courses => {
      res.render('courses', {courses: courses, role: req.user.role});
    });
});

// Delete Users

router.post('/delete/:id', checkAdmin, (req, res, next) => {
  User.findByIdAndRemove(req.params.id)
  .then(() => {
    res.redirect("/employees");
  })
  .catch(error => {
    console.log(error);
    next();
  });
});

// API 
router.get('/api/courses', (req,res,next) => {
  Course.find()
    .then(courses => {
      res.json(courses);
    })
    .catch(err => console.log(err));
});

module.exports = router;
