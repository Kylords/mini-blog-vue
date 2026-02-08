import { gql } from '@apollo/client/core';

export const POST_CREATED = gql`
  subscription PostCreated {
    postCreated {
      post {
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
  }
`;