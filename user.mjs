import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList } from "graphql";
import db from "./db.mjs";
import { PostType, PostModel } from "./post.mjs";
import { CommentType, CommentModel } from "./comment.mjs";

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    posts: {
      type: new GraphQLList(PostType),
      args: {
        page: { type: GraphQLInt },
        limit: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        const { page = 1, limit = 10 } = args;
        return PostModel.getPostsByUserId(parent.id, limit, (page - 1) * limit);
      },
    },
    comments: {
      type: new GraphQLList(CommentType),
      args: {
        page: { type: GraphQLInt },
        limit: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        const { page = 1, limit = 10 } = args;
        return CommentModel.getCommentsByUserId(parent.id, limit, (page - 1) * limit);
      },
    },
  }),
});

const UserModel = {
  getAllUsers: async (limit = 10, offset = 0) => {
    const [rows] = await db.query("SELECT * FROM users LIMIT ? OFFSET ?", [
      limit,
      offset,
    ]);
    return rows;
  },

  getUserById: async (id) => {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
  },

  createUser: async (name, email) => {
    const [result] = await db.query(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [name, email]
    );
    return { id: result.insertId, name, email };
  },

  updateUser: async (id, { name, email }) => {
    const updates = [];
    const values = [];

    if (name) {
      updates.push("name = ?");
      values.push(name);
    }
    if (email) {
      updates.push("email = ?");
      values.push(email);
    }
   

    if (updates.length === 0) {
      return UserModel.getUserById(id);
    }

    values.push(id);
    const query = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
    
    await db.query(query, values);
    return UserModel.getUserById(id);
  },

  deleteUser: async (id) => {
    const user = await UserModel.getUserById(id);
    if (!user) {
      throw new Error("User not found");
    }
    await db.query("DELETE FROM users WHERE id = ?", [id]);
    return user;
  },
};

export { UserModel, UserType };
