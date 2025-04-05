import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList } from "graphql";
import db from "./db.mjs";
import { UserType, UserModel } from "./user.mjs";
import { CommentType, CommentModel } from "./comment.mjs";

const PostType = new GraphQLObjectType({
  name: "Post",
  fields: () => ({
    id: { type: GraphQLInt },
    userId: { type: GraphQLInt },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    user: {
      type: UserType,
      resolve: (parent) => {
        return UserModel.getUserById(parent.userId);
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
        return CommentModel.getCommentsByPostId(parent.id, limit, (page - 1) * limit);
      },
    },
  }),
});

const PostModel = {
  getAllPosts: async (limit = 10, offset = 0) => {
    const [rows] = await db.query("SELECT * FROM posts LIMIT ? OFFSET ?", [
      limit,
      offset,
    ]);
    return rows;
  },

  getPostById: async (id) => {
    const [rows] = await db.query("SELECT * FROM posts WHERE id = ?", [id]);
    return rows[0];
  },

  getPostsByUserId: async (userId, limit = 10, offset = 0) => {
    const [rows] = await db.query(
      "SELECT * FROM posts WHERE userId = ? LIMIT ? OFFSET ?",
      [userId, limit, offset]
    );
    return rows;
  },

  createPost: async (userId, title, content) => {
    const [result] = await db.query(
      "INSERT INTO posts (userId, title, content) VALUES (?, ?, ?)",
      [userId, title, content]
    );
    return { id: result.insertId, userId, title, content };
  },

  updatePost: async (id, { title, content }) => {
    const updates = [];
    const values = [];

    if (title) {
      updates.push("title = ?");
      values.push(title);
    }
    if (content) {
      updates.push("content = ?");
      values.push(content);
    }

    if (updates.length === 0) {
      return PostModel.getPostById(id);
    }

    values.push(id);
    const query = `UPDATE posts SET ${updates.join(", ")} WHERE id = ?`;
    
    await db.query(query, values);
    return PostModel.getPostById(id);
  },

  deletePost: async (id) => {
    const post = await PostModel.getPostById(id);
    if (!post) {
      throw new Error("Post not found");
    }
    await db.query("DELETE FROM posts WHERE id = ?", [id]);
    return post;
  },
};

export { PostModel, PostType };
