import React from 'react';
import { useQuery } from '@apollo/client'
import { Comment, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import DeleteButton from './DeleteButton';
import LikeButtonSubtle from '../components/LikeButtonSubtle';
import { FETCH_USER_PROFILE } from '../utils/graphql';


function CommentCustom({ postId, comment: c, user, ...props }) {
    const { loading, data: { getProfileByUsername } = {} } = useQuery(FETCH_USER_PROFILE, {
        variables: { username: c.username }
    })

    return (
        <Comment {...props}>
            {loading ? (
                <Icon loading name='spinner' size='big' />
            ) : (
                getProfileByUsername.picture ? (
                    <Comment.Avatar className='profile-picture-container' src={`https://tweeter-project-aaronlam.s3.us-west-2.amazonaws.com/${getProfileByUsername.picture}`} />
                ) : (
                    <Comment.Avatar className='profile-picture-container' src='https://react.semantic-ui.com/images/avatar/large/molly.png' />
                )
            )}

            <Comment.Content>
                <Comment.Author as={Link} to={`/profiles/${c.username}`}>{c.username}</Comment.Author>
                <Comment.Metadata>
                    <div>{moment(c.createdAt).fromNow()}</div>
                    <div>
                        <Icon name='heart' color='teal' /> {c.likeCount}
                    </div>
                </Comment.Metadata>
                <Comment.Text className='text-body'>{c.body}</Comment.Text>
                <Comment.Actions>
                    <Comment.Action>
                        <LikeButtonSubtle
                            postId={postId}
                            likes={c.likes}
                            likeCount={c.likeCount}
                            commentId={c.id}
                            subtle={true}
                        />
                    </Comment.Action>
                    {user && (
                        user.username === c.username && (
                            <Comment.Action>
                                <DeleteButton
                                    postId={postId}
                                    commentId={c.id}
                                    subtle={true}
                                />
                            </Comment.Action>
                        ))}
                </Comment.Actions>
            </Comment.Content>
        </Comment>
    );
}

export default CommentCustom;