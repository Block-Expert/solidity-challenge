import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

let owner: SignerWithAddress;
let otherAccount: SignerWithAddress;
let abiEncode: Contract;
let tokenContract: Contract;

describe("ABIEncode", function () {

  before(async function () {
    [owner, otherAccount] = await ethers.getSigners();
    const AbiEncode = await ethers.getContractFactory("AbiEncode");
    abiEncode = await AbiEncode.deploy();

    const TokenContract = await ethers.getContractFactory("Token");
    tokenContract = await TokenContract.deploy();
  })

  it("test_encodeWithSignature", async function () {
    const encodedBytesWithSignature = await abiEncode.encodeWithSignature(otherAccount.address, 100);
    console.log(encodedBytesWithSignature);

    await abiEncode.test(tokenContract.address, encodedBytesWithSignature);
  });

  it("test_encodeWithSelector", async function () {
    const encodedBytesWithSelector = await abiEncode.encodeWithSelector(otherAccount.address, 100);
    console.log(encodedBytesWithSelector);

    await abiEncode.test(tokenContract.address, encodedBytesWithSelector);
  })

  it("test_encodeCall", async function () {
    const encodedBytesCall = await abiEncode.encodeCall(otherAccount.address, 100);
    console.log(encodedBytesCall);

    await abiEncode.test(tokenContract.address, encodedBytesCall);
  })
});
