const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const {awsConfig} = require("../config/multerConfig")
const CustomError = require("../errors/custom-error");
const {StatusCodes} = require("http-status-codes");
const s3 = new AWS.S3({
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey,
    region: awsConfig.region
})

const uploadPost = multer({
    storage: multerS3({
        s3: s3,
        bucket: awsConfig.bucketName+"/generatedImages",
        acl: 'public-read-write',
        key: function(req, file, cb) {
            cb(null, Math.floor(Math.random() * 1000).toString() + Date.now() + '.' + file.originalname.split('.').pop());
        }
    }),
    fileFilter: function(req, file, cb) {
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb(new CustomError("올바른 파일형식이 아닙니다.",StatusCodes.CONFLICT))
        }
    },
    limits: {
        fileSize: 1000 * 1000 * 10
    }
}).single("image");






module.exports = {uploadPost};
