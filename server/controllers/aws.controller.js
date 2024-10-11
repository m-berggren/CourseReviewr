
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

const generateUploadUrl = async (req, res) => {
    const { fileName, fileType } = req.query;

    console.log('Received request to generate upload URL:', { fileName, fileType });

    try {

        // Create 32 hexadecimal character string
        const rawBytes = await crypto.randomBytes(16);
        const imageName = `${rawBytes.toString('hex')}-${fileName}`;

        console.log('Generated image name:', imageName);

        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: imageName,
            Expires: 60, // 60 seconds to upload
            ContentType: fileType
        };

        console.log('Creating PutObjectCommand with params:', params);

        s3.getSignedUrl('putObject', params, (err, url) => {
            if (err) {
                res.status(500).json({ error: 'Failed to generate upload URL' });
            } else {
                res.status(200).json({ 
                    signedUrl: url,
                    imageName
                });
            }
        });

        console.log('Signed URL generated successfully');
        
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate signed URL', error: error.message, stack: error.stack });
    }
};

const generateDownloadUrl = async (req, res) => {
    const { fileName } = req.query;

    if (!fileName) {
        return res.status(400).json({ message: 'File name is required' });
    }

    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileName,
        Expires: 3600 // URL expires in 1 hour
    };
    console.log(params);

    s3.getSignedUrl('getObject', params, (err, url) => {
        if (err) {
            res.status(500).json({ error: 'Failed to generate download URL' });
        } else {
            res.status(200).json({ signedUrl: url });
        }
    });
};

const awsController = {
    generateUploadUrl,
    generateDownloadUrl
};

export default awsController;





