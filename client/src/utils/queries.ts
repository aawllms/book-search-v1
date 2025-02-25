import { gql } from '@apollo/client';

export const GET_SINGLE_USER = gql`
query GetMe {
  getSingleUser {
    username
    _id
    email
    bookCount
    savedBooks {
      bookId
      title
      authors
      description
      image
      link
    }
  }
}
`;