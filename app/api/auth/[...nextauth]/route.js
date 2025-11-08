import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User.model";
import connectToDB from "@/config/db";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials Login",
      async authorize(credentials) {
        await connectToDB();
        const user = await User.findOne({ email: credentials.email });

        if (!user) throw new Error("Email not found!");

        const match = await bcrypt.compare(credentials.password, user.password);
        if (!match) throw new Error("Incorrect password!");

        return user;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id;
        token.name = user.full_name;
        token.image = user.image_link;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.image = token.image;
      return session;
    },
  },

  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
