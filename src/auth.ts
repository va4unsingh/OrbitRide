import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import UserModel, { IUser } from "./models/user.model";
import bcrypt from "bcryptjs";
import captainModel, { ICaptain } from "./models/captain.model";
import dbConnect from "./lib/dbConnect";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        loginAs: { label: "Login as", type: "select" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          let user;
          let userType;

          if (credentials.loginAs === "user") {
            user = (await UserModel.findOne({
              email: credentials.email,
            }).select("+password")) as IUser | null;
            userType = "user";
          } else {
            user = (await captainModel
              .findOne({
                email: credentials.email,
              })
              .select("+password")) as ICaptain | null;
            userType = "captain";
          }

          if (!user) {
            throw new Error(`No ${userType} found with this email`);
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) {
            return {
              _id: String(user._id),
              email: user.email,
              name: `${user.fullname.firstname} ${user.fullname.lastname}`,
              userType,
            };
          } else {
            throw new Error("Incorrect password");
          }
        } catch (error: any) {
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.email = user.email;
        token.userType = user.userType;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && token._id && token.email) {
        session.user._id = token._id as string;
        session.user.email = token.email as string;
        session.user.userType = token.userType as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
});
