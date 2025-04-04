import UserModel from "../models/user.mjs";
import PostModel from "../models/post.mjs";

const resolvers = {
  Query: {
    users: async (parent, args) => {
      const { page = 1, limit = 10 } = args;
      return UserModel.getAllUsers(limit, (page - 1) * limit);
    },
    user: async (parent, { id }) => {
      return UserModel.getUserById(id);
    },
  },
  Mutation: {
    createUser: async (parent, { name, email, password }) => {
      const userId = await UserModel.createUser(name, email, password);
      return { id: userId, name, email };
    },
    createPost: async (parent, { userId, title, content }) => {
      const postId = await PostModel.createPost(userId, title, content);
      return { id: postId, title, content };
    },
  },
  User: {
    posts: async (parent, args) => {
      const { page = 1, limit = 10 } = args;
      return PostModel.getPostsByUserId(parent.id, limit, (page - 1) * limit);
    },
  },
};

export default resolvers;
