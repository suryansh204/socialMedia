import React from 'react';
import { Card } from 'semantic-ui-react';

import EditButton from './EditButton';

function ProfileCard({ user, username, header, description, profileId, section }) {
    return (
        <Card fluid className="card profile">
            <Card.Content>
                <Card.Header>
                    {header}
                    {user && (
                        user.username === username && (
                            <EditButton
                                header={header}
                                postBody={description}
                                className='edit-button'
                                profileId={profileId}
                                section={section}
                            />
                        ))
                    }
                </Card.Header>
                <Card.Description className='text-body'>{description}</Card.Description>
            </Card.Content>
        </Card>
    );
}

export default ProfileCard;