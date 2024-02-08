import express from 'express';
import cors from 'cors';
import simpleGit from 'simple-git';
import path from 'path';
import { generate } from './utils/generate';
import { getAllFiles } from './file';
import { uplodadFile } from './aws';
import { createClient } from 'redis';
const publisher = createClient();
publisher.connect();

const subscriber = createClient();
subscriber.connect();

const app = express();
app.use(cors());
app.use(express.json());

// postman
app.post('/deploy', async (req, res) => {
    const repoURL = req.body.repoURL;
    const id = generate();
    await simpleGit().clone(repoURL, path.join(__dirname, `output/${id}`));

    const flies = getAllFiles(path.join(__dirname, `output/${id}`));

    flies.forEach(async flie => {
        await uplodadFile(flie.slice(__dirname.length + 1), flie);
    })

    await new Promise((resolve) => setTimeout(resolve, 5000));
    publisher.lPush("build-queue", id);
    publisher.hSet('status', id, "uploaded");

    console.log(flies);
    res.json({
        id: id
    });
});

app.listen(3000);

