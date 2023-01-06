import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

let owner: SignerWithAddress;
let otherAccount: SignerWithAddress;
let dutchAuction: Contract;
let nft: Contract;
const tokenId = 1;
const startingBid = 100;
describe("DutchAuction", function () {

  before(async function () {
    [owner, otherAccount] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory("MockERC721");
    nft = await NFT.deploy("NFT", "NFT");

    const DutchAuction = await ethers.getContractFactory("DutchAuction");
    dutchAuction = await DutchAuction.deploy(nft.address, tokenId, startingBid);
  })

  it("test_constructor", async function () {
  });

  it("test_getPrice", async function () {
  });

  it("test_buy", async function () {
  });
});
