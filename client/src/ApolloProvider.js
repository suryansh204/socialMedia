import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client';

import ReactDOM from 'react-dom/client'; // <-- NEW: Import ReactDOM

import App from './App';

const uploadLink = createUploadLink({
    uri: '/graphql'
});

const authLink = setContext(() => {
    const token = localStorage.getItem('jwtToken');
    return {
        headers: { Authorization: token ?  `Bearer ${token}` : ''}
    }
})
const client = new ApolloClient({
    link: authLink.concat(uploadLink),
    cache: new InMemoryCache(),
});

// NEW: Define the root element
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

// NEW: Use the render method to mount the application
root.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
);
