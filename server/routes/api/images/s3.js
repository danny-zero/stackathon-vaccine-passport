require('dotenv').config()
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

//create a new instance of the S3 object, provide all details from .env
const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
});

//upload file to s3
const uploadFile = (file) => { //pass in the file object that came from multer
    const fileStream = fs.createReadStream(file.path)

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename //name of the file in the S3 bucket
    }

    console.log('uploadParams', uploadParams)

    return s3.upload(uploadParams).promise() //uploads to S3 bucket and by using .promise() it returns a promise instead of having to use callback functions
}

exports.uploadFile = uploadFile;


//download file from s3
const getFileStream = (fileKey) => {
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName
    }
    return s3.getObject(downloadParams).createReadStream()
}


exports.getFileStream = getFileStream;