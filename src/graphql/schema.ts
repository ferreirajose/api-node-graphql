import User  from '../models/User';
import { makeExecutableSchema } from 'graphql-tools';

const users: Array<User> = [{
  id: 1,
  name: 'Jose',
  email: 'jose@gmail.com.br',
},
  {
    id: 2,
    name: 'Dani',
    email: 'dani@gmail.com.br',
  },
];

// defenindo schema

const typeDefs = `
    type User {
        id: ID
        name: String!
        email: String!
    }

    type Query {
        allUsers: [User!]!
    }

    type Mutation {
      createUser(name: String!, email: String!): User
    }
`;

const resolvers = {
  Query: {
    allUsers: () => users,

  },
  Mutation: {
    createUser: (parent: any, args: any) => {
      // const newUser = Object.assign({ id: users.length + 1 }, args);
      const newUser = { ...args, id: users.length + 1 };
      users.push(newUser);
      return users;
    }
  },
};

export default makeExecutableSchema({
  typeDefs,
  resolvers,
});
