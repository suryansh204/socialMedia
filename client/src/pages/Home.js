
import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { Grid, Transition, Icon } from 'semantic-ui-react'

import { AuthContext } from '../context/auth';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { FETCH_POSTS_QUERY } from '../utils/graphql';

function Home() {
    const { user } = useContext(AuthContext);
    const { loading, data } = useQuery(FETCH_POSTS_QUERY);

    return (
        <Grid doubling stackable columns={3} >
            <Grid.Row className="home-page-title">
                <h1>Recent Posts</h1>
            </Grid.Row>
            <Grid.Row className="home-page-post-form">
                {user && (
                    <Grid.Column>
                        <PostForm />
                    </Grid.Column>
                )}
            </Grid.Row>
            <Grid.Row>

                {loading ? (
                    <Icon loading name='spinner' size='big' />
                ) : (
                    <Transition.Group>
                        {data.getPosts && data.getPosts.map(post => (
                            <Grid.Column className="grid-column" key={post.id}>
                                <PostCard post={post} />
                            </Grid.Column>
                        ))}
                    </Transition.Group>
                )}
            </Grid.Row>
        </Grid>
    )
}

export default Home;
