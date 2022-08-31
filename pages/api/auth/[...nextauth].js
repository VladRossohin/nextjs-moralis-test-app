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
        try {
          const { message, signature } = credentials;

          await Moralis.start({
            apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
          });

          const result = (
            await Moralis.Auth.verify({
              message,
              signature,
              network: "evm",
            })
          ).raw;

          const address = result.address;
          const profileId = result.profileId;

          const user = { address, profileId, signature };
          return user;
        } catch (err) {
          console.log("ERROR");
          console.error(err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }

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
