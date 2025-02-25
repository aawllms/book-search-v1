//replace routes
const typeDefs = `

type User {
    _id: ID!
    username: String
    email: String
    savedBooks: [Book]
    bookCount: Int
}

type Book {
    bookId: String
    title: String
    authors: [String]
    description: String
    image: String
    link: String
}

type Auth {
    token: String!
    user: User
}


type Query {
    getSingleUser: User
}


type Mutation {

    createUser(username: String!, email: String!, password: String!): Auth

    login(email: String!, password: String!): Auth

    saveBook(description: String!, bookId: String!, title: String!, authors: [String], image: String, link: String): User

    deleteBook(bookId: String!): User
}

`;

export default typeDefs;
