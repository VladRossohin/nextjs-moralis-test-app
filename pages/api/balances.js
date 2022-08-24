import Moralis from "moralis";

export default async function handler(req, res) {
  await Moralis.start({
    apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
  });

  const address = "0x6cA037dbd5d6117496393F5653F47B33022EDb81";

  const [nativeBalance, tokenBalance] = await Promise.all([
    Moralis.EvmApi.account.getNativeBalance({ address }),
    Moralis.EvmApi.account.getTokenBalances({ address }),
  ]);

  res.status(200).json({
    nativeBalance: nativeBalance.result.balance.ether,
    tokenBalance: tokenBalance.result.map((token) => token.display()),
  });
}
