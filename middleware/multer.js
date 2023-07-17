
// const multer = require('multer')

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './public/user')
//     },
//     filename: function (req, file, cb) {
//       const filename = file.originalname.split(' ').join('-')
//       cb(null,`${filename}`)
//     }
//   })

// const upload = multer({
//     storage: storage,
// }).fields( [{ name : 'avators' , maxCount : 6} , { name : 'videos' , maxCount : 8}])

// module.exports ={ upload }



const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "avators") {
      cb(null, "./public/user");
    } else if (file.fieldname === "coverimage") {
      cb(null, "./public/group");
    } else if (file.fieldname === "post_image") {
      cb(null, "./public/post");
    }
  },
  filename: function (req, file, cb) {
    if (file.fieldname === "avators") {
      const filename = file.originalname.split(" ").join("-");
      cb(null, `${filename}`);
    } else if (file.fieldname === "coverimage") {
      const filename = file.originalname.split(" ").join("-");
      cb(null, `${filename}`);
    } else if (file.fieldname === "post_image") {
      const filename = file.originalname.split(" ").join("-");
      cb(null, `${filename}`);
    }
  },
});

const upload = multer({
  storage: storage,
}).fields([
  { name: "avators", maxCount: 8 },
  { name: "coverimage", maxCount: 8 },
  { name: "post_image", maxCount: 8 },
]);

module.exports = { upload };