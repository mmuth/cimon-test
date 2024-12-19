const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");

const gateway = new ApolloGateway({
  serviceList: [
    {
      name: "projects",
      url: "http://localhost:9001",
    },
    {
      name: "rights",
      url: "http://localhost:9002",
    },
  ],
});

const server = new ApolloServer({
  gateway,
  subscriptions: false,
});
server.listen(9000).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
