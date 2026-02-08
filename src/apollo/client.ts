import { ApolloClient, InMemoryCache, ApolloLink, Observable, split } from '@apollo/client/core';
import { HttpLink } from '@apollo/client/core';


import { getMainDefinition } from '@apollo/client/utilities';
import ActionCable from 'actioncable';
import ActionCableLink from 'graphql-ruby-client/subscriptions/ActionCableLink';

const HTTP_ENDPOINT = import.meta.env.VITE_GRAPHQL_HTTP || 'http://localhost:3000/graphql';
const WS_ENDPOINT = import.meta.env.VITE_GRAPHQL_WS || 'ws://localhost:3000/cable';
const AUTH_TOKEN = 'token';

const httpLink = new HttpLink({
    uri: HTTP_ENDPOINT,
    headers: {
      authorization: localStorage.getItem(AUTH_TOKEN) || '',
    },
  });

const cable = ActionCable.createConsumer(WS_ENDPOINT);

const wsLink = new ActionCableLink({
  cable,
  connectionParams: {
    token: localStorage.getItem(AUTH_TOKEN) || '',
  },
});

const link = split(
  ({ query }) => {
    const def = getMainDefinition(query);
    return def.kind === 'OperationDefinition' && def.operation === 'subscription';
  },
  new ApolloLink((operation) => {
    return new Observable((observer) => {
      const dummyNext: any = (op: any) => null;
      const sub = wsLink.request(operation, dummyNext)?.subscribe({
        next: (result) => observer.next(result),
        error: (err) => observer.error(err),
      });
      return () => sub?.unsubscribe();
    });
  }),
  httpLink
);

export const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});