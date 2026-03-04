import { gql } from '@apollo/client/core';

export const USER_LIST = gql`
  query UserList($first: Int!, $after: String, $query: String) {
    searchUsers(first: $first, after: $after, query: $query) {
      edges {
        node {
          id
          name
          email
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;