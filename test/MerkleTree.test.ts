import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { keccak256 } from "ethers/lib/utils";
import { ethers } from "hardhat";


let owner: SignerWithAddress;
let otherAccount: SignerWithAddress;
let merkleProof: Contract;
describe("MerkleTree Test", function () {

  before(async function () {
    [owner, otherAccount] = await ethers.getSigners();
    const MerkleProof = await ethers.getContractFactory("TestMerkleProof");
    merkleProof = await MerkleProof.deploy();
  })

  it("test_verify", async function () {
    const index = 2;
    const leaf = "0xdca3326ad7e8121bf9cf9c12333e6b2271abe823ec9edfe42f813b1e768fa57b";
    const root = "0xcc086fcc038189b4641db2cc4f1de3bb132aefbd65d510d817591550937818c7";

    const proof = ["0x8da9e1c820f9dbd1589fd6585872bc1063588625729e7ab0797cfc63a00bd950",
                  "0x995788ffc103b987ad50f5e5707fd094419eb12d9552cc423bd0cd86a3861433"];
    expect(await merkleProof.verify(proof, root, leaf, index)).to.be.equal(true);

    const leaf3 = keccak256(Buffer.from("carol -> alice"));
    console.log(leaf3)
  });
});
