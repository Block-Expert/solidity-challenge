import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

let owner: SignerWithAddress;
let user: SignerWithAddress;
let verifySignature: Contract;
let tokenContract: Contract;

describe("VerifySignature", function () {

  before(async function () {
    [owner, user] = await ethers.getSigners();
    const VerifySignature = await ethers.getContractFactory("VerifySignature");
    verifySignature = await VerifySignature.deploy();
    await verifySignature.deployed();
  })

  it("test_signature", async function () {
    const signer = owner;
    const to = user.address;
    const amount = 999;
    const message = "Hello";
    const nonce = 123;

    const hash = await verifySignature.getMessageHash(to, amount, message, nonce);
    const sig = await signer.signMessage(ethers.utils.arrayify(hash));

    const ethHash = await verifySignature.getEthSignedMessageHash(hash);

    console.log("signer: ", signer.address);
    console.log("recovered signer: ", await verifySignature.recoverSigner(ethHash, sig));

    expect(await verifySignature.verify(signer.address, to, amount, message, nonce, sig)).to.equal(true);
    expect(await verifySignature.verify(signer.address, to, amount + 1, message, nonce, sig)).to.equal(false);
  });
});
