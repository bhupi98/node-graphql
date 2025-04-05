import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
} from "graphql";
import { UserType, UserModel } from "./user.mjs";
import { PostType, PostModel } from "./post.mjs";
import { CommentType, CommentModel } from "./comment.mjs";

const Query = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    // User queries
    users: {
      type: new GraphQLList(UserType),
      args: {
        page: { type: GraphQLInt },
        limit: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        const { page = 1, limit = 10 } = args;
        return UserModel.getAllUsers(limit, (page - 1) * limit);
      },
    },
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        return UserModel.getUserById(args.id);
      },
    },
    // Post queries
    posts: {
      type: new GraphQLList(PostType),
      args: {
        page: { type: GraphQLInt },
        limit: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        const { page = 1, limit = 10 } = args;
        return PostModel.getAllPosts(limit, (page - 1) * limit);
      },
    },
    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        return PostModel.getPostById(args.id);
      },
    },
    // Comment queries
    comments: {
      type: new GraphQLList(CommentType),
      args: {
        page: { type: GraphQLInt },
        limit: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        const { page = 1, limit = 10 } = args;
        return CommentModel.getAllComments(limit, (page - 1) * limit);
      },
    },
    comment: {
      type: CommentType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        return CommentModel.getCommentById(args.id);
      },
    },
  }),
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    // User mutations
    createUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
       
      },
      resolve: (parent, args) => {
        return UserModel.createUser(args.name, args.email);
      },
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
      },
      resolve: (parent, args) => {
        return UserModel.updateUser(args.id, args);
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        return UserModel.deleteUser(args.id);
      },
    },
    // Post mutations
    createPost: {
      type: PostType,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLInt) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        return PostModel.createPost(args.userId, args.title, args.content);
      },
    },
    updatePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
      },
      resolve: (parent, args) => {
        return PostModel.updatePost(args.id, args);
      },
    },
    deletePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        return PostModel.deletePost(args.id);
      },
    },
    // Comment mutations
    createComment: {
      type: CommentType,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLInt) },
        postId: { type: new GraphQLNonNull(GraphQLInt) },
        content: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        return CommentModel.createComment(args.userId, args.postId, args.content);
      },
    },
    updateComment: {
      type: CommentType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        content: { type: GraphQLString },
      },
      resolve: (parent, args) => {
        return CommentModel.updateComment(args.id, args);
      },
    },
    deleteComment: {
      type: CommentType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        return CommentModel.deleteComment(args.id);
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});

export default schema;
