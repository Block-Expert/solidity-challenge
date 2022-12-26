import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

let owner: SignerWithAddress;
let user1: SignerWithAddress;
let user2: SignerWithAddress;
let user3: SignerWithAddress;
let attackContract: Contract;
let bank: Contract;
let honeypot: Contract;
describe("SelfDestruct Test", function () {

  before(async function () {

    [owner, user1, user2, user3] = await ethers.getSigners();

    const Honeypot = await ethers.getContractFactory("HoneyPot");
    honeypot = await Honeypot.deploy();

    const Bank = await ethers.getContractFactory("Bank");
    bank = await Bank.deploy(honeypot.address);

    const AttackHoneypot = await ethers.getContractFactory("AttackHoneypot");
    attackContract = await AttackHoneypot.connect(user2).deploy(bank.address);
  });

  it("test_scene", async function () {
    expect(await user1.getBalance()).to.equal(ethers.utils.parseEther("10000"));

    await bank.connect(user1).deposit({value: ethers.utils.parseEther("1")});
    
    expect(await user1.getBalance()).to.lt(ethers.utils.parseEther("9999"));
    expect(await ethers.provider.getBalance(bank.address)).to.equal(ethers.utils.parseEther("1"));

    await expect(attackContract.connect(user2).attack({value: ethers.utils.parseEther("1")})).to.be.revertedWith("It is a trap");

    expect(await ethers.provider.getBalance(bank.address)).to.equal(ethers.utils.parseEther("1"));
    expect(await user2.getBalance()).to.approximately(ethers.utils.parseEther("10000"), ethers.utils.parseEther("1")); 
    expect(await attackContract.getBalance()).to.equal(0);
  });
});
