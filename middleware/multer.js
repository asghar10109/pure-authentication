const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "avators") {
      cb(null, "./public/user");
    } 
    else if (file.fieldname === "coverimage") {
      cb(null, "./public/group");
    } 
    else if (file.fieldname === "post_image") {
      cb(null, "./public/post");
    }
    else if (file.fieldname === "videos") {
      cb(null, "./public/post");
    }
    else if (file.fieldname === "chat_images") {
      cb(null, "./public/chats");
    }
    else if (file.fieldname === "chat_videos") {
      cb(null, "./public/chats");
    }

  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});
function fileFilter(req, file, cb) {
  cb(null, true);
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "video/mp4" ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}
const upload = multer({
  storage: storage,

  fileFilter: fileFilter,
});
module.exports = upload;