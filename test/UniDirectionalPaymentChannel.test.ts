import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

let owner: SignerWithAddress;
let alice: SignerWithAddress;
let bob: SignerWithAddress;
let uniDirectionalPaymentChannel: Contract;
describe("UniDirectionalPaymentChannel", function () {

  before(async function () {

    [owner, alice, bob] = await ethers.getSigners();
    const UniDirectionalPaymentChannel = await ethers.getContractFactory("UniDirectionalPaymentChannel");
    uniDirectionalPaymentChannel = await UniDirectionalPaymentChannel.deploy(bob.address, {value: "100"});
  });

  it("test_vefiry_getHash", async function () {
    const hash = await uniDirectionalPaymentChannel.getHash(100);
    console.log("hash: ", hash);

    const sig = await uniDirectionalPaymentChannel.getEthSignedHash(100);
    console.log("sig: ", sig);

    const success = await uniDirectionalPaymentChannel.verify(100, sig);
    console.log("success: ", success);
  });

  it("test_UniDirectionalPaymentChannel", async function () {
    const amount = 100;
    const sig = await uniDirectionalPaymentChannel.connect(alice).getEthSignedHash(amount);

    const balanceOfBob_before = await bob.getBalance();
    console.log("before: ", balanceOfBob_before);
    
    await uniDirectionalPaymentChannel.connect(bob).close(amount, sig);

    const balanceOfBob_after = await bob.getBalance();
    console.log("after: ", balanceOfBob_after);
  });
});
