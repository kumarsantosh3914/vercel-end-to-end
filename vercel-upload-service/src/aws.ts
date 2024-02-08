import {S3} from 'aws-sdk';
import fs from 'fs';

const s3 = new S3({
    accessKeyId: "",
    secretAccessKey: "",
    endpoint: "",
})

export const uplodadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "vercel",
        Key: fileName,
    }).promise();
    console.log(response);
}