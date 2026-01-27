import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql', // Your GraphQL server URL
  cache: new InMemoryCache(),
});

export default client;
