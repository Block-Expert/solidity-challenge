import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

let owner: SignerWithAddress;
let user1: SignerWithAddress;
let user2: SignerWithAddress;
let user3: SignerWithAddress;
let signatureReplay: Contract;
describe("SelfDestruct Test", function () {

  before(async function () {

    [owner, user1, user2, user3] = await ethers.getSigners();

    const MultiSigWalletForSignatureReplay = await ethers.getContractFactory("MultiSigWalletForSignatureReplay");
    signatureReplay = await MultiSigWalletForSignatureReplay.deploy([user1.address, user2.address]);
  });

  it("test_scene", async function () {
    expect(await signatureReplay.owners(0)).to.equal(user1.address);    
    expect(await signatureReplay.owners(1)).to.equal(user2.address);
  });
});
