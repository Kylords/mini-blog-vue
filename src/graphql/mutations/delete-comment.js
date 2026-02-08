import { gql } from '@apollo/client/core'

export const DELETE_COMMENT = gql`
  mutation DeleteComment($commentId: ID!) {
    deleteComment(input: {commentId: $commentId}) {
      comment {
        id
        body
      }
    }
  }
`