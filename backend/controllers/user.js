const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  let userData;
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      userData = new User({
        name: req.body.name,
        photo: url + "/images/" + req.file.filename,
        email: req.body.email,
        password: hash,
        created_at: Date.now(),
      });
      userData.save().then((result) => {
        res.status(201).json({
          message: "User created Successfully!",
        });
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't create User!!!",
      });
    });
};

exports.addPoem = (req, res, next) => {
  let poemData;
  User.findById(req.params.id)
    .then((user) => {
      if (!user.poems) {
        poemData = [];
        poemData.push(req.body.poemId);
      } else {
        poemData = user.poems;
        poemData.push(req.body.poemId);
      }
    })
    .then(() => {
      User.updateOne(
        { _id: req.params.id },
        {
          poems: poemData,
        }
      )
        .then((result) => {
          if (result.n > 0) {
            res.status(201).json({
              message: "Poem added Successfully!",
            });
          } else {
            res.status(401).json({
              message: "Not Authorized",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          return res.status(500).json({
            message: "Couldn't add Poem!!!",
          });
        });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't add Poem!!!",
      });
    });
};

exports.clearPoem = (req, res, next) => {
  let poemData;
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(400).json({
          message: "Bad Request/Bad Data",
        });
      }
      poemData = user.poems;
    })
    .then(() => {
      const index = poemData.findIndex((data) => {
        return JSON.stringify(data) === JSON.stringify(checkData);
      }, (checkData = req.body.poemId));
      if (index > -1) {
        poemData.splice(index, 1);
        User.updateOne(
          { _id: req.params.id },
          {
            poems: poemData,
          }
        )
          .then((result) => {
            if (result.n > 0) {
              res.status(200).json({
                message: "Poem cleared Successfully!",
              });
            } else {
              res.status(401).json({
                message: "Not Authorized",
              });
            }
          })
          .catch((error) => {
            console.log(error);
            return res.status(500).json({
              message: "Couldn't clear Poem!!!",
            });
          });
      } else {
        return res.status(400).json({
          message: "Bad Request/Bad Data",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't clear Poem!!!",
      });
    });
};

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Invalid Authentication Credentials",
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Invalid Authentication Credentials",
        });
      }
      const token = jwt.sign(
        {
          email: fetchedUser.email,
          userId: fetchedUser._id,
        },
        process.env.JWT_KEY,
        {
          expiresIn: "24h",
        }
      );
      res.status(200).json({
        token: token,
        expiresIn: 86400,
        userId: fetchedUser._id,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.staus(500).json({
        message: "Couldn't handle request",
      });
    });
};

exports.getUser = (req, res, next) => {
  User.findById(req.userDataA.userId)
    .then((user) => {
      res.status(200).json({
        message: "User fetched Successfully!",
        userData: {
          name: user.name,
          photo: user.photo,
          email: user.email,
          poems: user.poems,
        },
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't fetch User!!!",
      });
    });
};

exports.userEmails = (req, res, next) => {
  let emailData;
  User.find()
    .then((users) => {
      emailData = users.map((data) => {
        return data.email;
      });
    })
    .then(() => {
      if (emailData.includes(req.params.email)) {
        return res.status(200).json({
          ok: false,
        });
      } else {
        return res.status(200).json({
          ok: true,
        });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't fetch Emails!!!",
      });
    });
};
