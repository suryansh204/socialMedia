
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';

import postsResolvers from './posts.js';
import usersResolvers from './users.js';
import commentsResolvers from './comments.js';
import profilesResolvers from './profiles.js';
import fileuploadsResolvers from './fileUploads.js';

export default {
    /* Find out how this part works */
    Upload: GraphQLUpload,
    Comment: {
        likeCount: (parent) => parent.likes.length,
    },
    Post: {
        likeCount: (parent) => parent.likes.length,
        commentCount: (parent) => parent.comments.length
        
    },
    Query: {
        ...postsResolvers.Query,
        ...profilesResolvers.Query,
        ...usersResolvers.Query,
    },

    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentsResolvers.Mutation,
        ...profilesResolvers.Mutation,
        ...fileuploadsResolvers.Mutation
    }
}
