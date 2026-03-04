import { gql } from '@apollo/client/core'

export const GET_COMMENT = gql`
  query GetComment($commentId: ID!) {
    comment(commentId: $commentId) {
      id
      body
      user {
        id
        name
      }
    }
  }
`