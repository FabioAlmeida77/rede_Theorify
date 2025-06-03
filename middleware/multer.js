// config/multer.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Cria a pasta uploads se não existir
const pastaUpload = 'uploads/';
if (!fs.existsSync(pastaUpload)) {
  fs.mkdirSync(pastaUpload);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, pastaUpload);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith('image/') ||
    file.mimetype.startsWith('video/')
  ) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo inválido'), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;