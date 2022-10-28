import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

let owner: SignerWithAddress;
let otherAccount: SignerWithAddress;
let receiverEther: Contract;
let sendEther: Contract;
describe("ReceiverEther", function () {

  before(async function () {

    [owner, otherAccount] = await ethers.getSigners();
    const ReceiverEther = await ethers.getContractFactory("ReceiverEther");
    receiverEther = await ReceiverEther.deploy();
  
    const SendEther = await ethers.getContractFactory("SendEther");
    sendEther = await SendEther.deploy();
  })

  it("test_sendViaSend", async function () {
    await sendEther.sendViaSend(receiverEther.address, {value: "10"});
    expect(await ethers.provider.getBalance(receiverEther.address)).to.be.equal(10);
  });

  it("test_sendviaTransfer", async function () {
    await sendEther.sendViaTransfer(receiverEther.address, {value: "10"});
    expect(await ethers.provider.getBalance(receiverEther.address)).to.be.equal(20);
  });

  it("test_sendViaCall", async function () {
    await sendEther.sendViaCall(receiverEther.address, {value: "10"});
    expect(await ethers.provider.getBalance(receiverEther.address)).to.be.equal(30);
  });
});
