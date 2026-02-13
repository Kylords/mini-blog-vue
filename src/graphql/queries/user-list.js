import { gql } from '@apollo/client/core';

export const SEARCH_USERS = gql`
  query UserList($first: Int!, $after: String) {
    searchUsers(first: $first, after: $after) {
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