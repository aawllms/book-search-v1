import express from "express";
import { ApolloServer } from "@apollo/server"; // Note: Import from @apollo/server-express
import path from "path";
import { fileURLToPath } from "url";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs, resolvers } from "./schemas/index.js";
import { authenticateToken } from "./services/auth.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
const startApolloServer = async () => {
    await server.start();
    const app = express();
    const PORT = process.env.PORT || 3001;
    //middleware
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use("/graphql", expressMiddleware(server, {
        context: authenticateToken,
    }));
    if (process.env.NODE_ENV === "production") {
        app.use(express.static(path.join(__dirname, "../../client/dist")));
        app.get("*", (_req, res) => {
            res.sendFile(path.join(__dirname, "../../client/dist"));
        });
    }
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
};
startApolloServer();
