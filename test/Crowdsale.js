const {expect} = require("chai");

describe('Staking', () => {
    beforeEach(async () => {
        [owner, signer2, signer3] = await ethers.getSigners();

        CleoCoin = await ethers.getContractFactory('CleoCoin', owner);
        cleoCoin = await CleoCoin.deploy();

        Crowdsale = await ethers.getContractFactory('Crowdsale', owner);
        crowdSale = await Crowdsale.deploy(2, owner.address, cleoCoin.address);

    });



    describe('buyTokens', () => {
        it('add a token symbol', async () => {
            // ethers.utils.parseEther('100')
            let totalSupply;
            let signer2Balance;
            let signer3Balance;

            totalSupply = await cleoCoin.totalSupply();
            signer2Balance = await cleoCoin.balanceOf(signer2.address);
            signer3Balance = await cleoCoin.balanceOf(signer3.address);
            
            expect(totalSupply).to.be.equal(0);
            expect(signer2Balance).to.be.equal(0);
            expect(signer3Balance).to.be.equal(0);

            await cleoCoin.connect(owner).mint(
                crowdSale.address,
                ethers.utils.parseEther('1000')
            )

            const ownerEtherBalanceOld = await owner.getBalance()

            await crowdSale.connect(signer2).buyTokens(signer2.address, {value: ethers.utils.parseEther('10')})
            await crowdSale.connect(signer3).buyTokens(signer3.address, {value: ethers.utils.parseEther('27')})

            totalSupply = await cleoCoin.totalSupply();
            signer2Balance = await cleoCoin.connect(owner).balanceOf(signer2.address);
            signer3Balance = await cleoCoin.connect(owner).balanceOf(signer3.address);
            const ownerEtherBalanceNew = await owner.getBalance();

            expect(totalSupply).to.be.equal(ethers.utils.parseEther('1000'));
            expect(signer2Balance).to.be.equal(ethers.utils.parseEther('20'));
            expect(signer3Balance).to.be.equal(ethers.utils.parseEther('54'));
            expect(ownerEtherBalanceNew).to.be.above(ownerEtherBalanceOld);


        })
    })
});