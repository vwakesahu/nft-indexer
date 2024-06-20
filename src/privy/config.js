export const ethereum = {
  id: 1,
  network: "Ethereum Mainnet",
  name: "ETH",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://eth.merkle.io/"],
    },
    public: {
      http: ["https://eth.merkle.io/"],
    },
  },
  blockExplorers: {
    default: {
      name: "Etherscan",
      url: "https://etherscan.io/",
    },
  },
};

export const privyConfig = {
  appId: "cltn4pfm807ld12sf83bqr3iy",
  config: {
    logo: "https://your.logo.url",
    appearance: { theme: "dark" },
    loginMethods: ["wallet"],
    appearance: {
      walletList: ["metamask", "detected_wallets", "rainbow"],
      theme: "dark",
    },
    defaultChain: ethereum,
    // supportedChains: [eth],
    embeddedWallets: {
      createOnLogin: "users-without-wallets",
    },
  },
};
