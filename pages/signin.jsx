import { MetaMaskConnector } from "@wagmi/core/connectors/metaMask";
import axios from "axios";
import { useConnect, useDisconnect, useAccount, useSignMessage } from "wagmi";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

function SignIn() {
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const { push } = useRouter();

  const handleAuth = async () => {
    console.log(process.env.NEXT_PUBLIC_AUTH_URL);
    console.log(process.env.NEXT_PUBLIC_APP_DOMAIN);
    console.log(process.env.NEXT_PUBLIC_MORALIS_API_KEY);
    console.log(process.env.NEXT_PUBLIC_AUTH_SECRET);
    if (isConnected) {
      await disconnectAsync();
    }

    const { account, chain } = await connectAsync({
      connector: new MetaMaskConnector(),
    });

    console.log("connected");

    console.log(account);
    console.log(chain);

    const userData = {
      address: account,
      chain: chain.id,
      network: "evm",
    };

    const { data } = await axios.post("/api/auth/request-message", userData, {
      headers: {
        "content-type": "application/json",
      },
    });

    const message = data.message;
    console.log(message);

    const signature = await signMessageAsync({ message });
    console.log(signature);

    const { url } = await signIn("credentials", {
      message,
      signature,
      redirect: false,
      callbackUrl: "/user",
    });

    console.log(url);

    push(url);
  };

  return (
    <div>
      <h3>Web3 Authentication</h3>
      <button onClick={() => handleAuth()}>Authenticate via MetaMask</button>
    </div>
  );
}

export default SignIn;
