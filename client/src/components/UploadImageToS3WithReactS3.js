import React, { useEffect, useState, useRef, useContext } from 'react';
import { uploadFile, deleteFile } from 'react-s3';
import { Icon } from 'semantic-ui-react';
import { gql, useMutation } from '@apollo/client';

import CropEasy from './crop/CropEasy';
import { ThemeContext } from '../App';
import {AuthContext} from '../context/auth';


window.Buffer = window.Buffer || require("buffer").Buffer;

const S3_BUCKET = 'tweeter-project-aaronlam';
const REGION = 'us-west-2';

const config = {
    bucketName: S3_BUCKET,
    region: REGION,
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
}

function UploadImageToS3WithReactS3({ username, profileId }) {
    const {user} = useContext(AuthContext);

    const [photoURL, setPhotoURL] = useState(username?.photoURL);
    const [file, setFile] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const [updatePicture] = useMutation(UPDATE_PROFILE_PICTURE);

    const firstUpdate = useRef(true);
    const { theme } = useContext(ThemeContext);

    async function handleFileInput(e) {
        const file = e.target.files[0];

        if (file) {
            setPhotoURL(URL.createObjectURL(file));
            setModalOpen(true);
        }
    }

    // useEffect(() => {
    //     // Prevent triggering on first render
    //     if (firstUpdate.current) {
    //         firstUpdate.current = false;
    //         return;
    //     }

    //     // Upload File to AWS S3
    //     uploadFile(file, config)
    //         .then(() => {
    //             console.log(file);
    //             updatePicture({ variables: { profileId, photoName: file.name } });
    //         })
    //         .catch(err => console.error(err))


    // }, [file])
    useEffect(() => {
        // Prevent triggering on first render
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }

        // ⚠️ NEW: Check if file exists AND keys are not placeholders before uploading
        if (file && config.accessKeyId !== "placeholder_key") { 
            // Upload File to AWS S3
            uploadFile(file, config)
                .then(() => {
                    console.log(file);
                    updatePicture({ variables: { profileId, photoName: file.name } });
                })
                .catch(err => console.error(err))
        } else {
             // ⚠️ Placeholder logic: Log a warning if you hit this during testing
             console.warn("S3 upload skipped: AWS credentials are not set up or file is null.");
        }


    }, [file])

    return (
        modalOpen ? (
            <CropEasy
                photoURL={photoURL}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                setFile={setFile}
                setPhotoURL={setPhotoURL}
                username={user.username}
            />
        ) : (
            <div className='profile-pic-button'>
                <label htmlFor='file-upload-s3' className='custom-file-upload'>
                    <Icon inverted={theme === 'dark'} name='picture' />
                    <p className='inline-text'>Change Picture</p>
                </label >
                <input type='file' onChange={handleFileInput} id="file-upload-s3" style={{ width: 200 }} />
            </div>
        )

    )
}

const UPDATE_PROFILE_PICTURE = gql`
    mutation updateProfilePicture($profileId: ID!, $photoName: String!) {
        updateProfilePicture(profileId: $profileId, photoName: $photoName) {
            id
            picture
        }
    }
`

export default UploadImageToS3WithReactS3;