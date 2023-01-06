import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

let owner: SignerWithAddress;
let user1: SignerWithAddress;
let user2: SignerWithAddress;
let user3: SignerWithAddress;
let target: Contract;
let failedAttack: Contract;
let hackForContractSize: Contract;
describe("SelfDestruct Test", function () {

  before(async function () {

    [owner, user1, user2, user3] = await ethers.getSigners();

    const Target = await ethers.getContractFactory("Target");
    target = await Target.deploy();

    const FailedAttack = await ethers.getContractFactory("FailedAttack");
    failedAttack = await FailedAttack.deploy();
  });

  it("test_scene", async function () {
    expect(await target.isContract(user1.address)).to.false;
    //////////////////////
    expect(await target.isContract(failedAttack.address)).to.true;  
    
    expect(await target.pwned()).to.false;
    await expect(failedAttack.pwn(target.address)).to.be.revertedWith("no contract allowed");
    expect(await target.pwned()).to.false;
    
    await expect(failedAttack.pwn(user1.address)).to.be.reverted;
    
    const HackForContractSize = await ethers.getContractFactory("HackForContractSize");
    hackForContractSize = await HackForContractSize.deploy(target.address);
    
    //////////////////////
    expect(await hackForContractSize.isContract()).to.false;
    expect(await hackForContractSize.addr()).to.be.equal(hackForContractSize.address)
    
    expect(await target.pwned()).to.true;
  });
});
