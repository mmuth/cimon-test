const loggerPlugin = require("./../loggerPlugin");
const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  type Query {
    user: User
  }

  type User {
    id: String!
    name: String!
    accessibleProjects: [Project]
  }

  extend interface Project {
    id: ID! @external
  }

  extend type SoftwareDevelopmentProject implements Project @key(fields: "id") {
    id: ID! @external
  }

  extend type MarketingProject implements Project @key(fields: "id") {
    id: ID! @external
  }
`;

const user = {
  id: "u1",
  name: "Mister Meister",
  accessibleProjects: [
    {
      id: "p1",
    },
    {
      id: "p2",
    },
    {
      id: "p3",
    },
    {
      id: "p4",
    },
  ],
};

const resolvers = {
  Query: {
    user() {
      return user;
    },
  },
  Project: {
    __resolveType(ref) {
      return resolveType(ref);
    },
    isEditable(field) {
      return editableFields.includes(field.id);
    },
  },
  SoftwareDevelopmentProject: {
    __isTypeOf(ref) {
      return resolveType(ref);
    },
  },
  MarketingProject: {
    __isTypeOf(ref) {
      return resolveType(ref);
    },
  },
};

const resolveType = (ref) =>
  ref.id == "p1" || ref.id == "p2"
    ? "SoftwareDevelopmentProject"
    : "MarketingProject";

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers,
    },
  ]),
  plugins: [loggerPlugin],
});

server.listen(9002).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
