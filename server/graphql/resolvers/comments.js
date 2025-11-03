import { UserInputError, AuthenticationError } from 'apollo-server-express';

import Post from '../../models/Post.js';
import Profile from '../../models/Profile.js';
import checkAuth from '../../utils/check-auth.js';

export default {
    Mutation: {
        async createComment(_, { postId, body }, context) {
            const { username } = checkAuth(context);
            // validate body not empty
            if (body.trim() === '') {
                throw new UserInputError('Empty comment', {
                    errors: {
                        body: 'Comment body must not be empty'
                    }
                });
            }

            // find post, create comment, save post
            const post = await Post.findById(postId);

            if (post) {
                post.comments.push({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                })
                await post.save();
                return post;
            } else throw new UserInputError('Post not found');

        },

        async deleteComment(_, { postId, commentId }, context) {
            const { username } = checkAuth(context);

            const post = await Post.findById(postId);
            if (post) {
                const commentIndex = post.comments.findIndex(comment => comment.id === commentId);

                if (post.comments[commentIndex].username === username) {
                    post.comments.splice(commentIndex, 1);
                    await post.save();
                    return post;
                } else throw new AuthenticationError('Action not allowed');
            } else throw new UserInputError('Post not found');
        },

        async likeComment(_, { postId, commentId }, context) {
            const { username } = checkAuth(context);

            const post = await Post.findById(postId);

            if (post) {
                const commentIndex = post.comments.findIndex(c => c._id.toString() === commentId);

                if (post.comments[commentIndex].likes.find(likes => likes.username === username)) {
                    // Comment already liked, unlike it
                    post.comments[commentIndex].likes = post.comments[commentIndex].likes.filter(likes => likes.username !== username);
                } else {
                    // Comment not liked, like it
                    post.comments[commentIndex].likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    })
                }
                await post.save();
                return post.comments[commentIndex];
            } else throw new UserInputError('Post not found');
        }

    }
}