import Moralis from "moralis";

function Native({ nativeBalance, address, transactions }) {
  console.log(transactions);
  return (
    <div>
      <h3>Wallet: {address}</h3>
      <h3>Native Balance: {nativeBalance}</h3>
    </div>
  );
}

export async function getServerSideProps(context) {
  await Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  });

  const address = "0x1D6176510cAD158F1EF46Cf9cA54aE0593D99c9c";

  const nativeBalance = await Moralis.EvmApi.account.getNativeBalance({
    address,
  });

  const transactions = await Moralis.EvmApi.account.getTransactions({
    address,
  });

  console.log(transactions);

  return {
    props: {
      address,
      nativeBalance: nativeBalance.result.balance.ether,
      transactions: transactions.result.map((t) => t.result),
    },
  };
}

export default Native;
