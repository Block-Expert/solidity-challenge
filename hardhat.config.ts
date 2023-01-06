import * as dotenv from "dotenv"

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import "@nomiclabs/hardhat-etherscan"
import "@typechain/hardhat"
import "hardhat-gas-reporter"
import "solidity-coverage"

dotenv.config()
const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
		goerli: {
			url: process.env.GOERLI_URL || "",
			accounts:
				process.env.PRIVATE_KEY !== undefined
					? [process.env.PRIVATE_KEY]
					: [],
			chainId: 5
		},
	},
	gasReporter: {
		enabled: process.env.REPORT_GAS !== undefined,
		currency: "USD",
	},
	etherscan: {
		apiKey: process.env.ETHERSCAN_API_KEY,
	},
};

export default config;
