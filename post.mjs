import db from "../db.mjs";

const PostModel = {
  getPostsByUserId: async (userId, limit, offset) => {
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
    return result.insertId;
  },
};

export default PostModel;
