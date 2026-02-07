import { gql } from '@apollo/client/core'

export const POST_LIST = gql`
  query PostList {
    posts {
      id
      title
      body
      comments {
        id
      }
      user {
        id
        name
      }
      commentCount
    }
  }
`