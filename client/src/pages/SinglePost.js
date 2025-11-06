
import React, { useContext, useState, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';
import { Button, Card, Comment, Header, Icon, Label, Grid, Image, Form, Transition } from 'semantic-ui-react';
import moment from 'moment';

import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import CommentCustom from '../components/CommentCustom';
import { FETCH_POST_PROFILE_QUERY } from '../utils/graphql';

function SinglePost() {
    const { user } = useContext(AuthContext);
    const { postId } = useParams();

    const [comment, setComment] = useState('');
    const commentInputRef = useRef(null);
    const navigate = useNavigate();

    const { data: { getPost } = {} } = useQuery(FETCH_POST_QUERY, {
        variables: { postId }
    })

    const { loading, data: { getPostProfile } = {} } = useQuery(FETCH_POST_PROFILE_QUERY, {
        variables: { postId }
    })

    const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {
        update() {
            setComment('');
            commentInputRef.current.blur();
        },
        variables: { postId, body: comment }
    })


    let postMarkup;
    if (!getPost) {
        postMarkup = <Icon loading name='spinner' size='big' />
    } else {
        const { id, username, body, createdAt, likes, likeCount, comments, commentCount } = getPost;

        postMarkup = (
            <Grid stackable className='page-container'>

                <Grid.Column width={4} className='profile-picture-container'>
                    {loading ? (
                        <Icon loading name='spinner' size='big' />
                    ) : (
                        getPostProfile.picture ? (
                            <Image className='post' src={`https://tweeter-project-aaronlam.s3.us-west-2.amazonaws.com/${getPostProfile.picture}`} alt='image' />
                        ) : (
                            <Image className='post' src='https://react.semantic-ui.com/images/avatar/large/molly.png' />
                        )
                    )}
                </Grid.Column>

                {/* Post Section */}
                <Grid.Column width={12}>
                    <Card fluid>
                        <Card.Content>
                            <Card.Header>
                                <Link as={Link} to={`/profiles/${username}`}>{username}</Link>
                            </Card.Header>
                            <Card.Meta>{moment(createdAt).fromNow(true)}
                            </Card.Meta>
                            <Card.Description>{body}</Card.Description>
                        </Card.Content>
                        <Card.Content>
                            <LikeButton postId={id} likes={likes} likeCount={likeCount} />

                            <Button as='div' labelPosition='right'>
                                <Button size='tiny' basic color='blue'>
                                    <Icon name='comments' />
                                </Button>
                                <Label as='a' basic color='blue' pointing='left'>
                                    {commentCount}
                                </Label>
                            </Button>

                            {user && user.username === username && (
                                <DeleteButton postId={id} callback={() => navigate('/')} />
                            )}
                        </Card.Content>
                    </Card>

                    {/* Comments Section */}
                    <Card fluid>
                        <Card.Content>
                            <Comment.Group>
                                <Header as='h3' dividing>
                                    Comments
                                </Header>
                                <Transition.Group>
                                    {comments.map(c => {
                                        return (
                                            <CommentCustom key={c.id} comment={c} postId={id} user={user} />
                                        )
                                    })}
                                </Transition.Group>

                                {/* Reply Section */}
                                {user && (
                                    <Form reply>
                                        <div className='ui input fluid'>
                                            <textarea
                                                type='text'
                                                name='comment'
                                                value={comment}
                                                onChange={event => setComment(event.target.value)}
                                                ref={commentInputRef}
                                                rows='1'
                                            />
                                        </div>
                                        <Button
                                            type='submit'
                                            content='Add Reply'
                                            labelPosition='left'
                                            icon='edit'
                                            color='teal'
                                            onClick={createComment}
                                            disabled={comment.trim() === ''}
                                        />
                                    </Form>
                                )}
                            </Comment.Group>
                        </Card.Content>
                    </Card>
                </Grid.Column>

            </Grid>
        )
    }

    return postMarkup;
}

const CREATE_COMMENT_MUTATION = gql`
    mutation createComment($postId: ID!, $body: String!) {
        createComment(postId: $postId, body: $body) {
            id
            comments{
                id 
                body 
                createdAt 
                username
                likes{
                    id
                    username
                }
                likeCount
            }
            commentCount
        }
    }
`

const FETCH_POST_QUERY = gql`
    query getPost($postId: ID!) {
        getPost(postId: $postId) {
            id
            username
            body
            createdAt
            likes {
                id
                username
            }
            likeCount
            comments {
                id
                username
                body
                createdAt
                likes{
                    id
                    username
                }
                likeCount
            }
            commentCount
        }
    }
`


export default SinglePost;
