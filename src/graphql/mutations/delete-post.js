import { gql } from '@apollo/client/core'

export const DELETE_POST = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(input: {postId: $postId}) {
      post {
        id
        title
        body
      }
    }
  }
`