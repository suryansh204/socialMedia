import React, { useContext, useState, useEffect } from "react";
import { Button, Label } from 'semantic-ui-react';
import { useMutation } from '@apollo/client'
import { Link } from 'react-router-dom';

import { AuthContext } from '../context/auth';
import { LIKE_POST_MUTATION, LIKE_COMMENT_MUTATION } from '../utils/graphql';

function LikeButton({ postId, likes, likeCount, commentId, subtle }) {
    const [liked, setLiked] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user && likes.find(like => like.username === user.username)) {
            setLiked(true);
        } else setLiked(false);
    }, [likes, user]);

    const mutation = commentId ? LIKE_COMMENT_MUTATION : LIKE_POST_MUTATION;

    const [likePostorComment] = useMutation(mutation, {
        variables: { postId, commentId }
    })

    const likeButton = user ? (
        liked ? (
            <div style={{color: 'LightSeaGreen'}}>Liked</div>
        ) : (
            <div>Like</div>

        )
    ) : (
        <div as={Link} to='/login'>Like</div>
    )

    return (
        <Button
            as='div'
            size='mini'
            labelPosition='left'
            onClick={likePostorComment}
            className={liked ? 'comment-liked-button' : 'comment-like-button'}
        >
            {likeButton}

            {!subtle && (
                <Label basic color='teal' pointing='left'>
                    {likeCount}
                </Label>
            )}
        </Button>
    )
}

export default LikeButton;