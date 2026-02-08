import { gql } from '@apollo/client/core'

export const CREATE_COMMENT = gql`
  mutation CreateComment($postId: ID!, $body: String!) {
    createComment(input: {postId: $postId, body: $body}) {
      comment {
        id
        body
      }
    }
  }
`