import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

let owner: SignerWithAddress;
let otherAccount: SignerWithAddress;
let interviewTest: Contract;
let dai: Contract;

describe("InterviewTest", function () {

  before(async function () {
    [owner, otherAccount] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("MockERC20");
    dai = await Token.deploy("Mock", "Mock");

    console.log(dai.address);

    const InterviewTest = await ethers.getContractFactory("InterviewTest");
    interviewTest = await InterviewTest.deploy(dai.address);
    
    console.log(interviewTest.address);
  })
  it("test_init", async function () { 
    expect(await dai.balanceOf(owner.address)).to.be.equal(1000);
    expect(await dai.balanceOf(interviewTest.address)).to.be.equal(0);
  });
  
  it("test_bondAsset", async function () {
    await dai.approve(interviewTest.address, 100);
    await interviewTest.bondAsset(100);

    expect(await dai.balanceOf(interviewTest.address)).to.be.equal(100);
    expect(await dai.balanceOf(owner.address)).to.be.equal(900);

    expect(await interviewTest.balanceOf(owner.address)).to.be.equal(100);
  });

  it("test_unbondAsset_withNotEnoughBalance_thenRevertedWithPanic", async function () {
    await expect(interviewTest.unbondAsset(1000)).to.be.revertedWithPanic(0x11);
  });
  
  it("test_addCollateral", async function () {
    expect(await interviewTest.getCollateral()).to.be.equal(0);
    expect(await interviewTest.totalCollateral()).to.be.equal(0);

    const balanceBeforeAddCollateral = await owner.getBalance();
    const tx = await interviewTest.addCollateral({value: ethers.utils.parseEther("1")});
    const balanceAfterAddCollateral = await owner.getBalance();

    const receipt = await tx.wait()
    const gasCost = receipt.gasUsed.mul(receipt.effectiveGasPrice);

    expect(balanceBeforeAddCollateral.sub(balanceAfterAddCollateral).sub(gasCost)).to.be.equal(ethers.utils.parseEther("1"));

    expect(await interviewTest.getCollateral()).to.be.equal(ethers.utils.parseEther("1"));
    expect(await interviewTest.totalCollateral()).to.be.equal(ethers.utils.parseEther("1"));
  });

  it("test_removeCollateral", async function () {
    
  });

  it("test_unbondAsset", async function () {
  });

  it("test_unbondAsset", async function () {
  });

  it("test_unbondAsset", async function () {
  });
});
