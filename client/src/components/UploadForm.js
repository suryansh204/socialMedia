import React, {useContext} from 'react';
import { useMutation, gql } from '@apollo/client';
import { Icon } from 'semantic-ui-react';

import { FETCH_USER_PROFILE } from '../utils/graphql';
import {ThemeContext} from '../App';

function UploadForm({ profileId, username }) {
    const {theme} = useContext(ThemeContext);

    const [uploadFile] = useMutation(UPLOAD_FILE, {

        // Update client-side cache to display uploaded file
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_USER_PROFILE,
                variables: { username }
            })
            proxy.writeQuery({
                query: FETCH_USER_PROFILE,
                data: { getProfileByUsername: { ...data.getProfileByUsername, picture: result.data.uploadFile.filename } }
            })
        },
        onCompleted(data) {
            console.log(data);
        }
    })

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        uploadFile({ variables: { file, username, profileId } });
    }

    return (
        <div className='profile-pic-button'>
            <label htmlFor='file-upload' className='custom-file-upload'>
                    <Icon inverted={theme === 'dark'} name='picture' /> 
                    <p className='inline-text'>Change Picture</p>
            </label>
            <input type='file' onChange={handleFileChange} id="file-upload" style={{ width: 200 }} />
        </div>
    );
}

const UPLOAD_FILE = gql`
    mutation uploadFile($file: Upload!, $username: String!, $profileId: ID!) {
        uploadFile(file: $file, username: $username, profileId: $profileId) {
            url
            filename
        }
    }
`

export default UploadForm;