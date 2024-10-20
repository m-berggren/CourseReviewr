
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

// Configure AWS
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

const generateUploadUrl = async (req, res, next) => {
    const { fileName, fileType } = req.query;

    try {

        // Create 32 hexadecimal character string
        const rawBytes = crypto.randomBytes(16);
        const imageName = `${rawBytes.toString('hex')}-${fileName}`;

        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: imageName,
            Expires: 60, // 60 seconds to upload
            ContentType: fileType
        };

        const url = await new Promise((resolve, reject) => {
            s3.getSignedUrl('putObject', params, (err, url) => { // get signedUrl for putObject
                if (err) reject(err);
                else resolve(url);
            });
        });
        res.status(200).json({ signedUrl: url, imageName });

    } catch (error) {
        next(error);
    }
};

const generateDownloadUrl = async (req, res, next) => {
    try {
        const { fileName } = req.query;

        if (!fileName) {
            return res.status(400).json({ message: 'File name is required' });
        }

        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileName,
            Expires: 3600 * 24 // URL expires in 1 day
        };

        const url = await new Promise((resolve, reject) => {
            s3.getSignedUrl('getObject', params, (err, url) => { // Get signedUrl for getObject
                if (err) reject(err);
                else resolve(url);
            });
        });
        res.status(200).json({ signedUrl: url });
        
    } catch (error) {
        next(error);
    }
};

const deleteOneObject = async (req, res, next) => {
    try {
        const { fileName } = req.query;

        if (!fileName) {
            return res.status(400).json({ error: 'fileName is required'});
        }

        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileName
        };

        await s3.deleteObject(params).promise();
        res.status(200).json({ message: 'File deleted successfully' });

    } catch (error) {
        next(error);
    }
};

const awsController = {
    generateUploadUrl,
    generateDownloadUrl,
    deleteOneObject
};

export default awsController;
