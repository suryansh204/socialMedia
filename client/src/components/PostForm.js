import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { gql, useMutation } from '@apollo/client';

import useForm from '../utils/hooks';
import { FETCH_POSTS_QUERY } from '../utils/graphql';

function PostForm() {
    const { onChange, onSubmit, values } = useForm(createPostCallback, {
        body: ''
    })

    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {

        // Update client-side cache to show created post 
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            })
            proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: { getPosts: [result.data.createPost, ...data.getPosts] }
            })
            values.body = '';
        },
        variables: values
    })

    function createPostCallback() {
        createPost();
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <h2>Create post:</h2>
                <Form.Field>
                    {/* <Form.Input
                        placeholder="What's on your mind?"
                        name='body'
                        onChange={onChange}
                        value={values.body}
                        error={error ? true : false}
                    /> */}
                    <div className='ui input fluid'>
                        <textarea
                            type='text'
                            name='body'
                            placeholder="What's on your mind?"
                            value={values.body}
                            onChange={onChange}
                            rows='3'
                        />
                    </div>
                    <Button
                        type='submit'
                        color='teal'
                        disabled={values.body.trim() === ''}
                    >
                        Post
                    </Button>
                </Form.Field>
            </Form>

            {error && (
                <div className="ui error message create-post-error">
                    <ul className="list">
                        <li>{error.graphQLErrors[0].message}</li>
                    </ul>
                </div>
            )}
        </>
    )

}

const CREATE_POST_MUTATION = gql`
    mutation createPost($body: String!) {
        createPost(body: $body) {
            id
            body
            username
            createdAt
            likes{
                id
                username
                createdAt
            }
            likeCount
            comments {
                id
                username
                body
                createdAt
            }
            commentCount
        }
    }
`

export default PostForm;