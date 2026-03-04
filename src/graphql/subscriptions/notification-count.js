import { gql } from '@apollo/client/core';

export const NOTIFICATION_COUNT = gql`
  subscription UnreadNotificationCount($userId: ID!) {
    unreadNotificationCount(userId: $userId) {
      unreadNotificationCount
      notification {
        id
        message
        notifiable {
          __typename
          ... on Comment {
            id
            post {
              id
            }
          }
        }
      }
    }
  }
`;