import React, { useState, useCallback } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import Slider from 'rc-slider';
import Cropper from 'react-easy-crop';

import getCroppedImg from './utils/cropImage';


function CropEasy({ photoURL, modalOpen, setModalOpen, setPhotoURL, setFile, username }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    async function cropImage() {
        try {
            let { file, url } = await getCroppedImg(
                photoURL,
                croppedAreaPixels
            );
            // Place profile pic in User's own Folder in AWS S3
            file.name = `${username}/`+ file.name

            setPhotoURL(url);
            setFile(file);
            setModalOpen(false);
        } catch (err) {
            throw new Error(err);
        }
    }

    return (
        <Modal
            size='small'
            onClose={() => setModalOpen(false)}
            open={modalOpen}
        >
            <Modal.Header>
                Crop your profile picture
            </Modal.Header>
            <Modal.Content style={{ position: 'relative', height: '400px' }}>
                <Cropper
                    image={photoURL}
                    crop={crop}
                    cropShape='round'
                    zoom={zoom}
                    zoomSpeed={0.25}
                    aspect={1}
                    onZoomChange={setZoom}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                />
            </Modal.Content>
            <Modal.Actions>
                <h3 className='zoom-text'>Zoom: </h3>
                <Slider
                    className='zoom-slider'
                    min={1}
                    max={3}
                    value={zoom}
                    step={0.01}
                    onChange={(e) => setZoom(e)}
                />
                <Button color="grey" icon="times" content="Cancel" onClick={() => setModalOpen(false)} />
                <Button color="blue" icon="save" content="Crop" onClick={cropImage}/>

            </Modal.Actions>
        </Modal>
    );
}

export default CropEasy;