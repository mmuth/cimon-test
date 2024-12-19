const loggerPlugin = require("./../loggerPlugin");
const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  type Query {
    projects: [Project]
  }

  interface Project {
    id: ID!
    niceName: String!
    status: String!
  }

  type SoftwareDevelopmentProject implements Project @key(fields: "id") {
    id: ID!
    niceName: String!
    status: String!
    requiredEffortHours: Int!
  }

  type MarketingProject implements Project @key(fields: "id") {
    id: ID!
    niceName: String!
    status: String!
    budget: Int!
  }
`;

const internalState = [
  {
    id: "p1",
    niceName: "New Gantt View",
    status: "Planned",
    requiredEffortHours: 500,
  },
  {
    id: "p2",
    niceName: "Kubernetes Platform Improvement",
    status: "Started",
    requiredEffortHours: 150,
  },
  {
    id: "p3",
    niceName: "Online Campaign",
    status: "Cancelled",
    budget: 20000,
  },
  {
    id: "p4",
    niceName: "Website Relaunch",
    status: "Planned",
    budget: 50000,
  },
];

const resolvers = {
  Query: {
    projects() {
      return internalState;
    },
  },
  Project: {
    __resolveType(project) {
      console.log(JSON.stringify(project));
      return project.id == "p1" || project.id == "p2"
        ? "SoftwareDevelopmentProject"
        : "MarketingProject";
    },
    __resolveReference(reference) {
      console.log(JSON.stringify(reference));
      return internalState.find((x) => x.id == reference.id);
    },
  },
  SoftwareDevelopmentProject: {
    __resolveReference(reference) {
      console.log(JSON.stringify(reference));
      return internalState.find((x) => x.id == reference.id);
    },
  },
  MarketingProject: {
    __resolveReference(reference) {
      console.log(JSON.stringify(reference));
      return internalState.find((x) => x.id == reference.id);
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers,
    },
  ]),
  plugins: [loggerPlugin],
});

server.listen(9001).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
