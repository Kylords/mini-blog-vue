import { gql } from '@apollo/client/core';

export const POST_DETAIL = gql`
  query PostDetail($postId: ID!, $first: Int!, $after: String) {
    post(postId: $postId) {
      id
      title
      body
      user {
        id
        name
      }
      visibleComments(first: $first, after: $after) {
        edges {
          node {
            id
            body
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
  }
`;