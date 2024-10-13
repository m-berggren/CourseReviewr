/**
 * Program for manually resizing and renaming files with unique name. Used in combination with the courses.json file .
 * Upload to AWS S3 bucket after creation, and add the filename as a field in ./data/courses.json
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import crypto from 'crypto';

const fsp = fs.promises;

const inputFolder = './images';
const outputFolder = './images/resized';

async function resizeAndSaveImage(inputPath, outputPath) {
    try {
        await sharp(inputPath)
            .resize(300, 200, { fit: 'cover' })
            .toFile(outputPath);
        console.log(`Resized and saved: ${outputPath}`);
    } catch (error) {
        console.error(`Error processing ${inputPath}:`, error);
    }
};

async function processImages() {
    try {
        // Ensure output folder exists
        await fsp.mkdir(outputFolder, { recursive: true });

        // Read all files in the input folder
        const files = await fsp.readdir(inputFolder);

        for (const file of files) {
            const inputPath = path.join(inputFolder, file);
            
            // Check if it's a file (not a directory) and has a valid image extension
            const stats = await fsp.stat(inputPath);
            if (stats.isFile() && /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(file)) {
                const rawBytes = crypto.randomBytes(16);
                const newFileName = `${rawBytes.toString('hex')}-${file}`;
                const outputPath = path.join(outputFolder, newFileName);

                await resizeAndSaveImage(inputPath, outputPath);
            }
        }

        console.log('All images processed');
    } catch (error) {
        console.error('Error processing images:', error);
    }
};

processImages();