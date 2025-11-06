
import { gql } from '@apollo/client';

export const FETCH_POSTS_QUERY = gql`
    query {
        getPosts {
            id
            body
            username
            createdAt
            likes{
                id 
                username
            }
            likeCount
            comments{
                id
                username
                body
                likes{
                    id
                    username
                }
            }
            commentCount
        }
    }
`

export const FETCH_PROFILE_QUERY = gql`
    query getProfileById($profileId: ID!) {
        getProfileById(profileId: $profileId) {
            id
            username
            email
            bio
            phone
            school
            location
            birthDate
            relationship
            picture
        }
    }
`

export const FETCH_USER_PROFILE = gql`
    query getProfileByUsername($username: String!) {
        getProfileByUsername(username: $username) {
            id
            username
            email
            bio
            phone
            school
            location
            birthDate
            relationship
            picture
        }
    }
`

export const FETCH_POST_PROFILE_QUERY = gql`
    query getPostProfile($postId: ID!) {
        getPostProfile(postId: $postId) {
            id
            username
            email
            bio
            phone
            school
            location
            birthDate
            relationship
            picture
        }
    }
`

export const LIKE_POST_MUTATION = gql`
    mutation likePost($postId: ID!) {
        likePost(postId: $postId) {
            id
            likes{
                id
                username
            }
            likeCount
        }
    }

`

export const LIKE_COMMENT_MUTATION = gql`
    mutation likeComment($postId: ID!, $commentId: ID!) {
        likeComment(postId: $postId, commentId: $commentId){
            id
            likes{
                id
                username
                createdAt
            }
            likeCount
        }
    }
`
export const FETCH_STATS_QUERY = gql`
    query getStats($username: String!) {
        getStats(username: $username) {
            likeCount
            commentCount
            postCount
        }
    }
`
