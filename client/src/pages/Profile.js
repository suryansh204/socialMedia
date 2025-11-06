
import React, { useContext } from "react";
import { useQuery } from '@apollo/client';
import { useParams } from "react-router-dom";
import { Card, Grid, Image, Icon, Statistic } from 'semantic-ui-react';
import 'rc-slider/assets/index.css';

import { AuthContext } from '../context/auth';
import { ThemeContext } from "../App";
import EditButtonMultiple from "../components/EditButtonMultiple";
import { FETCH_USER_PROFILE, FETCH_STATS_QUERY } from '../utils/graphql';
import ProfileCard from '../components/ProfileCard';
import UploadImageToS3WithReactS3 from "../components/UploadImageToS3WithReactS3";


function Profile() {
    const { username } = useParams();
    const { user } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);

    const { data: { getProfileByUsername } = {} } = useQuery(FETCH_USER_PROFILE, {
        variables: { username }
    });

    const { loading, data: { getStats } = {} } = useQuery(FETCH_STATS_QUERY, {
        variables: { username }
    })

    let profileMarkup;
    if (!getProfileByUsername) {
        profileMarkup = <Icon loading name='spinner' size='big' />
    } else {
        const { id, username, email, bio, phone, school, location, birthDate, relationship, picture } = getProfileByUsername;

        let statsRow1 = [];
        if (loading) {
            <Icon name='spinner' />
        } else {
            statsRow1 = [
                { key: 'posts', label: 'Posts', value: `${getStats.postCount}` },
                { key: 'likes', label: 'Likes', value: `${getStats.likeCount}` },
                { key: 'comments', label: 'Comments', value: `${getStats.commentCount}` },
            ]
        }

        profileMarkup = (
            <Grid stackable className='page-container'>
                {/* Profile Picture */}
                <Grid.Column width={5}>
                    <Grid.Row className='profile-picture-container'>
                        <h1 style={{ textAlign: 'center' }}>{username}</h1>

                        {picture ? (
                            <Image src={`https://tweeter-project-aaronlam.s3.us-west-2.amazonaws.com/${picture}`} alt='image' />
                        ) : (
                            <Image src='https://react.semantic-ui.com/images/avatar/large/molly.png' />
                        )}

                        {user && (
                            username === user.username && (
                                <UploadImageToS3WithReactS3 username={username} profileId={id} />
                            ))
                        }

                    </Grid.Row>
                    <Grid.Row>
                        <Statistic.Group
                            className='profile-stats'
                            inverted={theme === 'dark'}
                            size='small'
                            items={statsRow1}
                            widths={3}
                        />
                    </Grid.Row>
                </Grid.Column>

                {/* Profile Descriptions */}
                <Grid.Column width={11}>
                    <Card fluid className="card profile" >
                        <Card.Content>
                            <Card.Header>
                                Details
                                {user && (
                                    user.username === username && (
                                        <EditButtonMultiple
                                            header='Details'
                                            body={{ phone, email, birthDate }}
                                            profileId={id}
                                            className='edit-button'
                                        />
                                    ))
                                }
                            </Card.Header>
                            <Card.Meta></Card.Meta>
                            <Card.Description><h4 style={{ display: 'inline-block' }}>Phone:</h4> {phone}</Card.Description>
                            <Card.Description><h4 style={{ display: 'inline-block' }}>Email:</h4> {email}</Card.Description>
                            <Card.Description><h4 style={{ display: 'inline-block' }}>Date of Birth:</h4> {birthDate}</Card.Description>
                        </Card.Content>
                    </Card>

                    <ProfileCard
                        user={user}
                        username={username}
                        header='About Me'
                        description={bio}
                        section='bio'
                        profileId={id}
                    />

                    <ProfileCard
                        user={user}
                        username={username}
                        header='Education'
                        description={school}
                        section='school'
                        profileId={id}
                    />

                    <Grid>
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <ProfileCard
                                    user={user}
                                    username={username}
                                    header='Relationship Status'
                                    description={relationship}
                                    section='relationship'
                                    profileId={id}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <ProfileCard
                                    user={user}
                                    username={username}
                                    header='Where I live'
                                    description={location}
                                    section='location'
                                    profileId={id}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Grid.Column>
            </Grid>
        )
    }

    return profileMarkup;
}

export default Profile;
