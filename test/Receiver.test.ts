import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, Contract } from "ethers";
import { ethers } from "hardhat";

let owner: SignerWithAddress;
let otherAccount: SignerWithAddress;
let receiver: Contract;
let caller: Contract;
describe("Receiver And Caller", function () {

  before(async function () {

    [owner, otherAccount] = await ethers.getSigners();
    const Receiver = await ethers.getContractFactory("Receiver");
    receiver = await Receiver.deploy();
  
    const Caller = await ethers.getContractFactory("Caller");
    caller = await Caller.deploy();
  })

  it("test_testCallFoo", async function () {
    const tx = await caller.testCallFoo(receiver.address, {value: "10"});
    expect(await ethers.provider.getBalance(receiver.address)).to.be.equal(10);

    console.log(tx.data);
    console.log(BigNumber.from(124)._hex)
    // await expect(tx).to.emit(caller, "Response").withArgs(true, 124);
    //await expect(tx).to.emit(receiver, "Received").withArgs(owner.address, 10, "call foo");
  });
});
