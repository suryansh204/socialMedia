// import { ApolloServer } from 'apollo-server-express';
// import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
// import express from 'express';
// import http from 'http';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';

// // Load environment variables from .env file
// dotenv.config();

// // Imports for TypeDefs and Resolvers (FIXED: Pointing resolvers to the index file)
// import typeDefs from './graphql/typeDefs.js';
// import resolvers from './graphql/resolvers/index.js'; // <--- CORRECTED PATH
// // Note: Node requires the full path to the directory/index.js or file.js

// const MONGO_URI = process.env.MONGO_URI;
// const PORT = process.env.PORT || 5000;

// async function startApolloServer(typeDefs, resolvers) {
//   const app = express();
//   const httpServer = http.createServer(app);

//   const server = new ApolloServer({
//     typeDefs,
//     resolvers,
//     // Add security measures
//     csrfPrevention: true,
//     cache: 'bounded',
//     plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
//   });

//   await server.start();
//   server.applyMiddleware({ app });

//   // Connect to MongoDB
//   try {
//     await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
//     console.log('MongoDB successfully connected!');
//   } catch (err) {
//     console.error('MongoDB connection error:', err.message);
//     process.exit(1);
//   }

//   // Start the HTTP server
//   await new Promise(resolve => httpServer.listen({ port: PORT }, resolve));
//   console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
// }

// startApolloServer(typeDefs, resolvers);

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

    const MONGODB = 'mongodb+srv://newUser1:newUser1@cluster0.h6wqeik.mongodb.net/?appName=Cluster0';

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
