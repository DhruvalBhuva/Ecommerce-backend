const jwt = require("jsonwebtoken");
const path = require('path')
const multer = require("multer");
const shortid = require("shortid");

/**
 * We manually create folder upload and link that path using 'path' inbuilt directory.
 * we create storage of file and upload it 
 * can do without storage direct giving to multer but direct it store not readable formate
 * const upload = multer({ dist:'uploads/' }); // It will make /upload folder and store file there.
 */
const storage = multer.diskStorage({
  
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname),'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);    //shortid is to generate random id
  },
});
exports.upload = multer({ storage });

exports.requireSignIn = (req, res, next) => {
  if (req.headers.authorization) {
    // Token is atteched in request header and if token exist then can go ahead
    const token = req.headers.authorization.split(" ")[1]; //split bcz of bearer <token>
    const user = jwt.verify(token, process.env.JWT_SECRET); // it returen _id which we atteched during token creation
    req.user = user; // Append that user in request
  } else {
    return res.status(400).json({ message: "Authorization required..!" });
  }
  next(); // Onces reuireSignIn is executed controll goes in authRoutes by next()
};

exports.userMiddlewere = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(400).json({ message: "User Access denied..!" });
  }
  next();
};

exports.adminMiddlewere = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(400).json({ message: "Admin Access denied..!" });
  }
  next();
};
