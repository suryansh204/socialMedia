import { finished } from 'stream/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import Profile from '../../models/Profile.js';

function generateRandomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

export default {
    Mutation: {
        async uploadFile(parent, { profileId, username, file }) {
            const { createReadStream, filename, mimetype, encoding } = await file;

            // Randomize file name
            const { ext } = path.parse(filename);
            const randomName = generateRandomString(12) + ext;

            // Create user directory if doesn't exist
            const __dirname = path.dirname(fileURLToPath(import.meta.url));
            const userDirectory = path.join(__dirname, `../../public/images/${username}/`);
            await fs.promises.mkdir(userDirectory, { recursive: true }, () => {
                console.log('directory created');
            });

            // Remove previous picture(s) from directory
            fs.readdir(userDirectory, (err, files) => {
                if (err) throw new Error(err);

                for (const file of files) {
                    fs.unlink(path.join(userDirectory, file), err => {
                        if (err) throw new Error(err);
                    });
                }
            });

            // Create upload path for file and pipe it through
            const stream = createReadStream();
            const pathName = path.join(userDirectory, `${randomName}`);

            const out = fs.createWriteStream(pathName);
            stream.pipe(out);
            await finished(out);

            // Update Profile picture field
            try {
                await Profile.updateOne({_id: profileId}, {picture: randomName});
            } catch (err) {
                throw new Error(err);
            }

            return {
                url: `http://localhost:5000/images/${username}/${randomName}/test123`,
                filename: `${randomName}`
            };
        },
    },
}