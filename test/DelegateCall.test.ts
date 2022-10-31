import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, Contract } from "ethers";
import { ethers } from "hardhat";

let owner: SignerWithAddress;
let otherAccount: SignerWithAddress;
let a: Contract;
let b: Contract;
describe("DelegateCallTest", function () {

  before(async function () {

    [owner, otherAccount] = await ethers.getSigners();
    const B = await ethers.getContractFactory("B");
    b = await B.deploy();
  
    const A = await ethers.getContractFactory("A");
    a = await A.deploy();
  })

  it("test_A_setVars", async function () {
    const tx = await a.setVars(b.address, 10, {value: "20"});
    expect(await ethers.provider.getBalance(b.address)).to.be.equal(0);
    
    expect(await a.num()).to.be.equal(10);
    expect(await a.sender()).to.be.equal(owner.address);
    expect(await a.value()).to.be.equal(20);

    expect(await b.num()).to.be.equal(50);
    expect(await b.sender()).to.be.equal(a.address);
    expect(await b.value()).to.be.equal(0); //???????
  });
});
