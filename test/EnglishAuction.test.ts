import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

let owner: SignerWithAddress;
let otherAccount: SignerWithAddress;
let englishAuction: Contract;
let nft: Contract;
const tokenId = 1;
const startingBid = 100;
describe("EnglishAuction", function () {

  before(async function () {
    [owner, otherAccount] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory("MockERC721");
    nft = await NFT.deploy("NFT", "NFT");

    const EnglishAuction = await ethers.getContractFactory("EnglishAuction");
    englishAuction = await EnglishAuction.deploy(nft.address, tokenId, startingBid);
  })

  it("test_constructor", async function () {
  });

  it("test_start", async function () {
  });
});
