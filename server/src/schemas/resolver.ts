//replace controllers

import User from "../models/User.js";
import { signToken } from "../services/auth.js";

const resolvers = {
  Query: {
    getSingleUser: async (_parent: any, _args: any, context: any) => {
      const foundUser = await User.findOne({
        username: context.user.username,
      });

      if (!foundUser) {
        return null;
      }

      return foundUser;
    },
  },
  Mutation: {
    createUser: async (_parent: any, args: any, _context: any) => {
      //args is for req.body & req.params when in a resolver
      const user = await User.create(args);

      if (!user) {
        return null;
      }
      const token = signToken(user.username, user.password, user._id);
      return { token, user };
    },
    login: async (_parent: any, args: any, _context: any) => {
      const user = await User.findOne({
        $or: [{ username: args.username }, { email: args.email }],
      });
      if (!user) {
        return null;
      }

      const correctPw = await user.isCorrectPassword(args.password);

      if (!correctPw) {
        return null;
      }
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    saveBook: async (_parent: any, args: any, context: any) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: args } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      } catch (err) {
        return null;
      }
    },
    deleteBook: async (_parent: any, args: any, context: any) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId: args.bookId } } },
        { new: true }
      );
      if (!updatedUser) {
        return null;
      }
      return updatedUser;
    },
  },
};

export default resolvers;
