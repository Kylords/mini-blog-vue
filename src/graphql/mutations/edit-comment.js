import { gql } from '@apollo/client/core'

export const EDIT_COMMENT = gql`
  mutation EditComment($commentId: ID!, $body: String!) {
    editComment(input: {commentId: $commentId, body: $body}) {
      comment {
        id
        body
      }
    }
  }
`