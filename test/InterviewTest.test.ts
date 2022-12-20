import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

let owner: SignerWithAddress;
let otherAccount: SignerWithAddress;
let interviewTest: Contract;
let dai: Contract;

describe("InterviewTest", function () {

  before(async function () {
    [owner, otherAccount] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("MockERC20");
    dai = await Token.deploy("Mock", "Mock");

    console.log(dai.address);

    const InterviewTest = await ethers.getContractFactory("InterviewTest");
    interviewTest = await InterviewTest.deploy(dai.address);
    
    console.log(interviewTest.address);
  })

  it("test_bondAsset", async function () {
    
  });
});
