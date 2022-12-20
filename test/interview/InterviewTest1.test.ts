import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

type MyStruct = {
  name: string;
  nums: number[];
} 

let owner: SignerWithAddress;
let otherAccount: SignerWithAddress;
let lottery: Contract;
let weth: Contract;
let encodedBytes: any;
describe("InterviewTest1", function () {

  before(async function () {

    [owner, otherAccount] = await ethers.getSigners();

    const Weth = await ethers.getContractFactory("BasicERC20");
    weth = await Weth.deploy("WETH", "WETH", 18);

    const Lottery = await ethers.getContractFactory("Lottery");
    lottery = await Lottery.deploy(weth.address, 1010);
  })

  it("test_encode", async function () {
   
  });

  it("test_decode", async function () {
    
  });
});
