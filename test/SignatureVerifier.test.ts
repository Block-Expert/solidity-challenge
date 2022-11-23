import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

require("dotenv").config();
const EthUtil = require('ethereumjs-util');
let owner: SignerWithAddress;
let otherAccount: SignerWithAddress;
let signatureVerifier: Contract;

let nonce = 0;
const getSignaturePrivateKey = (signerPK: string, param: string) => {
  const messageHash = ethers.utils.solidityKeccak256([param], [++nonce]);

  const messageHashX = EthUtil.hashPersonalMessage(EthUtil.toBuffer(messageHash));
}
describe("SignatureVerifier test", function () {
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
  const SIGNER_ADDRESS = process.env.SIGNER_ADDRESS;
  const SIGNER_PRIVATE_KEY = process.env.SIGNER_PRIVATE_KEY;
  const WRONG_PRIVATE_KEY = "0x6dcdf55aae26fe4a2a1adb3aa07e89cf2305330e6da4afa010d6a5f21dacbb2f";
  before(async function () {

    [owner, otherAccount] = await ethers.getSigners();
    const SignatureVerifier = await ethers.getContractFactory("SignatureVerifier");
    signatureVerifier = await SignatureVerifier.deploy(ZERO_ADDRESS);
  })

  it("test_verifier", async function () {

  });
});
