import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
    likes: [User!]!
    createdAt: String!
    updatedAt: String!
  }

  type Comment {
    id: ID!
    content: String!
    author: User!
    post: Post!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    getPosts: [Post!]!
    getPostById(id: ID!): Post!
    getCommentsByPost(postId: ID!): [Comment!]!
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): String!
    login(email: String!, password: String!): String!
    createPost(title: String!, content: String!): Post!
    updatePost(id: ID!, title: String, content: String): Post!
    deletePost(id: ID!): Boolean!
    likePost(id: ID!): Post!
    createComment(postId: ID!, content: String!): Comment!
    deleteComment(id: ID!): Boolean!
  }
`;

export default typeDefs;
