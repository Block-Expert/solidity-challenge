import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

let owner: SignerWithAddress;
let otherAccount: SignerWithAddress;
let interviewTest: Contract;
let token: Contract;

describe("InterviewTest", function () {

  before(async function () {
    [owner, otherAccount] = await ethers.getSigners();
    const InterviewTest = await ethers.getContractFactory("InterviewTest");
    interviewTest = await InterviewTest.deploy();
    
    const Token = await ethers.getContractFactory("MockERC20");
    token = await Token.deploy("Mock", "Mock");

    console.log(token.address);
  })

  it("test_bondAsset", async function () {
    await interviewTest.bondAsset(100)
  });
});
