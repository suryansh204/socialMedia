import React, { useContext } from 'react';
import { Button, Card, Icon, Label, Image } from 'semantic-ui-react'
import { useQuery } from '@apollo/client';
import moment from 'moment';
import { Link } from 'react-router-dom';

import { AuthContext } from '../context/auth';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
import EditButton from './EditButton';
import MyPopup from '../utils/MyPopup';
import { FETCH_USER_PROFILE } from '../utils/graphql';

function PostCard({ post: { id, username, createdAt, body, likes, likeCount, commentCount } }) {
    const { user } = useContext(AuthContext);

    const { loading, data } = useQuery(FETCH_USER_PROFILE, {
        variables: { username }
    })

    return (
        <Card fluid className='postcard'>
            <Card.Content className='profile-picture-container'>
                {loading ? (
                    <Icon loading name='spinner' size='big' />
                ) : (
                    <>
                        {data.getProfileByUsername.picture ? (
                            <Image
                                floated='left'
                                size='mini'
                                src={`https://tweeter-project-aaronlam.s3.us-west-2.amazonaws.com/${data.getProfileByUsername.picture}`}
                            />
                        ) : (
                            <Image
                                floated='left'
                                size='mini'
                                src={'https://react.semantic-ui.com/images/avatar/large/molly.png'}
                            />
                        )}

                        <Card.Header>
                            <Link to={`/profiles/${username}`}>{username}</Link>
                        </Card.Header>
                        {user && user.username === username && (
                            <EditButton postId={id} postBody={body} header='Editing Post' className='edit-button' />
                        )}
                        <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow(true)}</Card.Meta>
                        <Card.Description className='text-body'>
                            {body}
                        </Card.Description>
                    </>
                )}
            </Card.Content>

            <Card.Content extra>
                {/* Like Button */}
                <LikeButton postId={id} likes={likes} likeCount={likeCount} />

                {/* Comment Button */}
                <MyPopup content='Comment on Post'>
                    <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
                        <Button size='tiny' basic color='blue'>
                            <Icon name='comments' />
                        </Button>
                        <Label basic color='blue' pointing='left'>
                            {commentCount}
                        </Label>
                    </Button>
                </MyPopup>

                {/* Delete Button */}
                {user && user.username === username && (
                    <DeleteButton postId={id} />
                )}

            </Card.Content>

        </Card>
    )
}

export default PostCard;