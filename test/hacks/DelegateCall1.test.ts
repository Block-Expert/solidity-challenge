import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

let owner: SignerWithAddress;
let user1: SignerWithAddress;
let user2: SignerWithAddress;
let user3: SignerWithAddress;
let attackContract: Contract;
let hackMe: Contract;
let libContract: Contract;
describe("SelfDestruct Test", function () {

  before(async function () {

    [owner, user1, user2, user3] = await ethers.getSigners();
    const LibContract = await ethers.getContractFactory("Lib");
    libContract = await LibContract.connect(user1).deploy();

    const HackMe = await ethers.getContractFactory("HackMe");
    hackMe = await HackMe.connect(user1).deploy(libContract.address);

    const AttackDelegatecall1 = await ethers.getContractFactory("AttackDelegatecall1");
    attackContract = await AttackDelegatecall1.connect(user2).deploy(hackMe.address);
  });

  it("test_scene", async function () {
    await libContract.connect(user1).pwn();
    
    expect(await libContract.owner()).to.equal(user1.address);
    expect(await hackMe.owner()).to.equal(user1.address);
    expect(await hackMe.lib()).to.equal(libContract.address);

    await attackContract.connect(user2).attack();

    expect(await libContract.owner()).to.equal(user1.address);
    expect(await hackMe.owner()).to.equal(attackContract.address);
  });
});
