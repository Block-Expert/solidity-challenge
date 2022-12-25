import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

let owner: SignerWithAddress;
let user1: SignerWithAddress;
let user2: SignerWithAddress;
let user3: SignerWithAddress;
let attackContract: Contract;
let etherGame: Contract;
describe("SelfDestruct Test", function () {

  before(async function () {

    [owner, user1, user2, user3] = await ethers.getSigners();
    const EtherGame = await ethers.getContractFactory("EtherGame");
    etherGame = await EtherGame.deploy();

    const AttackSelfDestruct = await ethers.getContractFactory("AttackSelfDestruct");
    attackContract = await AttackSelfDestruct.deploy(etherGame.address);
  })

  it("test_scene", async function () {
    expect(await user1.getBalance()).to.equal(ethers.utils.parseEther("10000"));
    expect(await user2.getBalance()).to.equal(ethers.utils.parseEther("10000"));

    await etherGame.connect(user1).deposit({value: ethers.utils.parseEther("1")});
    await etherGame.connect(user2).deposit({value: ethers.utils.parseEther("1")});
    
    expect(await user1.getBalance()).to.lt(ethers.utils.parseEther("9999"));
    expect(await user2.getBalance()).to.lt(ethers.utils.parseEther("9999"));
    expect(await ethers.provider.getBalance(etherGame.address)).to.equal(ethers.utils.parseEther("2"));

    await attackContract.connect(user3).attack({value: ethers.utils.parseEther("5")});

    expect(await ethers.provider.getBalance(etherGame.address)).to.equal(ethers.utils.parseEther("7"));
  });
});
