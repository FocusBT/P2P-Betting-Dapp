const Web3 = require("web3");
const WalletProvider = require("@truffle/hdwallet-provider");

const getExeAccount = () => {
  let provider = new WalletProvider({
    mnemonic: {
      phrase:
        "shove decline gentle subject local donor dolphin voyage place claim crane crystal",
    },
    providerOrUrl:
      "https://goerli.infura.io/v3/bd9db9e900d142cfb1a3403c88aa6a4a",
  });

  const web3 = new Web3(provider);

  return web3;
};

export default getExeAccount;

// const fetch123 = async () => {
//   const accounts = await web3.eth.getAccounts();
//   console.log(accounts);
// };
// fetch123();
