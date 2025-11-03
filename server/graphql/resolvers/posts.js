import { AuthenticationError, UserInputError } from 'apollo-server-express';
import Post from '../../models/Post.js';
import Profile from '../../models/Profile.js';
import User from '../../models/User.js';
import checkAuth from '../../utils/check-auth.js';

export default {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find({}).sort({ createdAt: -1 });
                return posts;
            } catch (err) {
                throw new Error(err);
            }
        },

        async getPost(_, { postId }) {
            try {
                const post = await Post.findOne({ _id: postId });
                if (post) {
                    return post;
                } else {
                    throw new Error("Post not found");
                }
            } catch (err) {
                throw new Error(err);
            }
        },
    },

    Mutation: {
        async createPost(_, { body }, context) {
            const {id, username} = checkAuth(context);

            if (body.trim() === '') {
                throw new Error('Post body must not be empty');
            }

            const newPost = new Post({
                body,
                username,
                user: id,
                createdAt: new Date().toISOString()
            });

            // Link createdPost to the User
            const foundUser = await User.findById(id);
            foundUser.posts.push(newPost);
            await foundUser.save();

            const post = await newPost.save();

            return post;
        },

        async editPost(_, { postId, body }, context) {
            const { username } = checkAuth(context);

            if (body.trim() === '') {
                throw new Error('Post body must not be empty');
            }

            try {
                await Post.updateOne({_id: postId, username}, {body});
                return Post.findById(postId);
            } catch (err) {
                throw new Error(err);
            }
             
        },

        async deletePost(_, { postId }, context) {
            const { username } = checkAuth(context);

            try {
                await Post.deleteOne({_id: postId, username});
                return 'Post deleted successfully'    
            } catch (err) {
                throw new Error(err);
            }
        },

        async likePost(_, { postId }, context) {
            const { username } = checkAuth(context);

            const post = await Post.findById(postId);

            if (post) {
                if (post.likes.find(likes => likes.username === username)) {
                    // Post already liked, unlike it
                    post.likes = post.likes.filter(likes => likes.username !== username);
                } else {
                    // Post not liked, like it
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    })
                }
                await post.save()
                return post;
            } else throw new UserInputError("Post not found");
        }
    }
}