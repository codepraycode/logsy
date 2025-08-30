const multer = require('multer');
// Handle image uploads

const storage = multer.diskStorage({
    destination: './server/uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '.png');
    },
});
const upload = multer({ storage });

module.exports = upload;
