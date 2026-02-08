import { gql } from '@apollo/client/core';

export const POST_DETAIL = gql`
  query PostDetail($postId: ID!) {
    post(postId: $postId) {
      id
      title
      body
      user {
        id
        name
      }
      visibleComments {
        id
        body
        user {
          id
          name
        }
      }
    }
  }
`;