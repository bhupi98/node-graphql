import { GraphQLObjectType, GraphQLInt, GraphQLString } from "graphql";
import db from "./db.mjs";
import { UserType, UserModel } from "./user.mjs";
import { PostType, PostModel } from "./post.mjs";

const CommentType = new GraphQLObjectType({
  name: "Comment",
  fields: () => ({
    id: { type: GraphQLInt },
    userId: { type: GraphQLInt },
    postId: { type: GraphQLInt },
    content: { type: GraphQLString },
    user: {
      type: UserType,
      resolve: (parent) => {
        return UserModel.getUserById(parent.userId);
      },
    },
    post: {
      type: PostType,
      resolve: (parent) => {
        return PostModel.getPostById(parent.postId);
      },
    },
  }),
});

const CommentModel = {
  getAllComments: async (limit = 10, offset = 0) => {
    const [rows] = await db.query("SELECT * FROM comments LIMIT ? OFFSET ?", [
      limit,
      offset,
    ]);
    return rows;
  },

  getCommentById: async (id) => {
    const [rows] = await db.query("SELECT * FROM comments WHERE id = ?", [id]);
    return rows[0];
  },

  getCommentsByUserId: async (userId, limit = 10, offset = 0) => {
    const [rows] = await db.query(
      "SELECT * FROM comments WHERE userId = ? LIMIT ? OFFSET ?",
      [userId, limit, offset]
    );
    return rows;
  },

  getCommentsByPostId: async (postId, limit = 10, offset = 0) => {
    const [rows] = await db.query(
      "SELECT * FROM comments WHERE postId = ? LIMIT ? OFFSET ?",
      [postId, limit, offset]
    );
    return rows;
  },

  createComment: async (userId, postId, content) => {
    const [result] = await db.query(
      "INSERT INTO comments (userId, postId, content) VALUES (?, ?, ?)",
      [userId, postId, content]
    );
    return { id: result.insertId, userId, postId, content };
  },

  updateComment: async (id, { content }) => {
    if (!content) {
      return CommentModel.getCommentById(id);
    }

    await db.query("UPDATE comments SET content = ? WHERE id = ?", [content, id]);
    return CommentModel.getCommentById(id);
  },

  deleteComment: async (id) => {
    const comment = await CommentModel.getCommentById(id);
    if (!comment) {
      throw new Error("Comment not found");
    }
    await db.query("DELETE FROM comments WHERE id = ?", [id]);
    return comment;
  },
};

export { CommentModel, CommentType }; 