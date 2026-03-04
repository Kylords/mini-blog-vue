import { gql } from '@apollo/client/core'

export const NOTIFICATION_LIST = gql`
  query NotificationList(
    $first: Int!,
    $after: String
  ) {
    notifications(
      first: $first,
      after: $after
    ) {
      edges {
        node {
          id
          message
          readAt
          notifiable {
            __typename

            ... on Comment {
              id
              body
              post {
                id
              }
            }
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