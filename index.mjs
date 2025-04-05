import express from "express";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import dotenv from "dotenv";
import schema from "./schema.mjs";

dotenv.config();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: "*", // Set appropriate frontend URL
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
