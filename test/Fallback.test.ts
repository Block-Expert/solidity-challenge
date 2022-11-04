import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

let owner: SignerWithAddress;
let otherAccount: SignerWithAddress;
let fallback: Contract;
let sendToFallback: Contract;
describe("Fallback", function () {

  before(async function () {

    [owner, otherAccount] = await ethers.getSigners();
    const Fallback = await ethers.getContractFactory("Fallback");
    fallback = await Fallback.deploy();
  
    const SendToFallback = await ethers.getContractFactory("SendToFallback");
    sendToFallback = await SendToFallback.deploy();
  })

  it("test_transferToFallback", async function () {
    const tx = await sendToFallback.transferToFallback(fallback.address, {value: "10"});
    expect(await fallback.getBalance()).to.be.equal(10);

    await expect(tx).to.emit(fallback, "Log").withArgs("receive", 2240);
  });

  it("test_callFallback", async function () {
    const tx = await sendToFallback.callFallback(fallback.address, {value: "10"});
    expect(await fallback.getBalance()).to.be.equal(20);
    await expect(tx).to.emit(fallback, "Log").withArgs("fallback", 28538249);
  });
});
