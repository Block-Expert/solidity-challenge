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
    await b.deployed();
  
    const A = await ethers.getContractFactory("A");
    a = await A.deploy(b.address);
  })

  it("test_A_fallback_setVarB", async function () {

    const bA = await ethers.getContractAt('B', a.address)

    const tx = await bA.setVars(10, {value: "20"});
    
    expect(await bA.num()).to.be.equal(10);
    expect(await bA.sender()).to.be.equal(owner.address);
    expect(await bA.value()).to.be.equal(20);
    
    expect(await a.num()).to.be.equal(10);
    expect(await a.value()).to.be.equal(20);

    expect(await b.num()).to.be.equal(0);
    expect(await b.value()).to.be.equal(0);

    // expect(await b.num()).to.be.equal(0);
    // expect(await b.sender()).to.be.equal(a.address);
    // expect(await b.value()).to.be.equal(10); //???????
    // expect(await ethers.provider.getBalance(a.address)).to.be.equal(10);
    // expect(await ethers.provider.getBalance(b.address)).to.be.equal(10);
  });

  it("test_A_setVarA", async function () {
    await a.setVarsA(b.address, 50, {value: "20"});
    expect(await a.num()).to.be.equal(50);
    expect(await a.sender()).to.be.equal(owner.address);
    expect(await a.value()).to.be.equal(20);

    expect(await b.num()).to.be.equal(0);
    expect(await b.value()).to.be.equal(0);
  });
});
