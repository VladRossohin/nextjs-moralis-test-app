import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import Moralis from "moralis";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "MoralisAuth",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        console.log("authorize");
        try {
          console.log(credentials);
          const { message, signature } = credentials;

          console.log("process.env.NEXT_PUBLIC_MORALIS_API_KEY");
          console.log(process.env.NEXT_PUBLIC_MORALIS_API_KEY);

          await Moralis.start({
            apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
          });

          const { address, profileId } = await Moralis.Auth.verify({
            message,
            signature,
            network: "evm",
          }).raw;

          const user = { address, profileId, signature };
          return user;
        } catch (err) {
          console.log(err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      user && (token.user = user);
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
