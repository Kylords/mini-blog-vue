import { gql } from '@apollo/client/core'

export const POST_LIST = gql`
  query PostList($first: Int!, $after: String) {
    posts(first: $first, after: $after) {
      edges {
        node {
          id
          title
          body
          commentCount
          comments {
            id
          }
          user {
            id
            name
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`