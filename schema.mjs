import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
} from "graphql";
import UserType from "./types/userType.mjs";
import PostType from "./types/postType.mjs";

const Query = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    users: {
      type: new GraphQLList(UserType),
      args: {
        page: { type: GraphQLInt },
        limit: { type: GraphQLInt },
      },
      resolve: (parent, args, { dataSources }) => {
        return dataSources.userAPI.getAllUsers(args.limit, args.page);
      },
    },
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args, { dataSources }) => {
        return dataSources.userAPI.getUserById(args.id);
      },
    },
  }),
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    createUser: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve: (parent, args, { dataSources }) => {
        return dataSources.userAPI.createUser(
          args.name,
          args.email,
          args.password
        );
      },
    },

    createPost: {
      type: PostType,
      args: {
        userId: { type: GraphQLInt },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
      },
      resolve: (parent, args, { dataSources }) => {
        return dataSources.postAPI.createPost(
          args.userId,
          args.title,
          args.content
        );
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});

export default schema;
