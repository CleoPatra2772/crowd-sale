async function main() {
    [owner, signer2, signer3] = await ethers.getSigners();

    CleoCoin = await ethers.getContractFactory('CleoCoin', owner);
    cleoCoin = await CleoCoin.deploy();

    Crowdsale = await ethers.getContractFactory('Crowdsale', owner);
    crowdSale = await Crowdsale.deploy(2, owner.address, cleoCoin.address);

    await cleoCoin.connect(owner).mint(
        crowdSale.address,
        ethers.utils.parseEther('10000')
    )

    console.log('Crowdsale: ', crowdSale.address);
    console.log('CleoCoin: ',  cleoCoin.address);
    console.log('signer2: ', signer2.address);


}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});