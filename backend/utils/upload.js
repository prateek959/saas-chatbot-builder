import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName)
    }
});

const fileFilter = (req, file, cb) => {
    const fileType = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain"
    ];

    if (fileType.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Onlt DOCX, Text, PDF are Allowed"), false);
    }

};


const upload = multer({ storage, fileFilter, limits:{ fileSize:20 * 1024 * 1024 }});

export default upload;