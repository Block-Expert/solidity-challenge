import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

let owner: SignerWithAddress;
let otherAccount: SignerWithAddress;
let crowdFund: Contract;
let token: Contract;
describe("CrowdFund", function () {

  before(async function () {
    [owner, otherAccount] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("MockERC20");
    token = await Token.deploy("CRO", "CRO");

    const CrowdFund = await ethers.getContractFactory("CrowdFund");
    crowdFund = await CrowdFund.deploy(token.address);
  })

  it("test_constructor", async function () {
  });

  it("test_launch", async function () {
  });
});
