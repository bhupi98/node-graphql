import express from "express";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import dotenv from "dotenv";
import schema from "./graphql/schema.mjs";

dotenv.config();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: "http://yourfrontend.com", // Set appropriate frontend URL
    methods: ["GET", "POST"],
  })
);

// GraphQL endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true, // For development only
  })
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
