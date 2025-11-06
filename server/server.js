import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import mongoose from 'mongoose';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import {fileURLToPath} from 'url';

import typeDefs from './graphql/typeDefs.js';
import resolvers from './graphql/resolvers/index.js';

const __filename = fileURLToPath(import.meta.url);

async function startServer() {

    const MONGODB = 'Key';

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => ({ req }),
    })

    await server.start();

    const app = express();
     app.use(cors());

    // This middleware should be added before calling `applyMiddleware`.
    app.use(graphqlUploadExpress());

    server.applyMiddleware({ app });



    // ------------ Deployment ------------ //    

    const __dirname = path.dirname(__filename);

    app.use(express.static(path.join(__dirname, "/client/build")));

    app.get(/^(?!\/graphql).*/, (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })

    // ------------ Deployment ------------ //

   

    const port = process.env.PORT || 5000;

    mongoose.connect(MONGODB)
        .then(() => {
            console.log("MongoDB connected successfully");
            return app.listen({ port })
        })
        .then(() => {
            console.log(`🚀  Server started successfully on ${port}`);
        });
}

startServer();
