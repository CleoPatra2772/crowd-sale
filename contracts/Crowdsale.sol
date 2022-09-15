pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Crowdsale{

    //The token being sold
    ERC20 public token;

    //address where the funds are collected
    address payable public  wallet;

    //how many units a buyer gets per wei
    uint256 public rate;

    //Amount of wei raised
    uint256 public weiRaised;

    event TokenPurchased(
        address indexed purchaser,
        address indexed beneficiary,
        uint256 value,
        uint256 amount
    );

    constructor(uint256 _rate, address payable _wallet, ERC20 _token) public {
        require(_rate > 0);
        require(_wallet != address(0));

        rate = _rate;
        wallet = _wallet;
        token = _token;
    }

    //Crowdsale external interface

        fallback() external payable {
            buyTokens(msg.sender);
        }



    function buyTokens(address _beneficiary) public payable {

        uint256 weiAmount = msg.value;
        _preValidatePurchase(_beneficiary, weiAmount);

        //calculate token amount to be created
        uint256 tokens = _getTokenAmount(weiAmount);

        //update state
        weiRaised += weiAmount;

        _processPurchase(_beneficiary, tokens);
       
        emit TokenPurchased(
            msg.sender,
            _beneficiary,
            weiAmount,
            tokens
        );

        _updatePurchasingState(_beneficiary, weiAmount);
        _forwardFunds();
        _postValidatePurchase(_beneficiary, weiAmount);
    }

    //Internal interface (extensible)

    function _preValidatePurchase(
        address _beneficiary,
        uint _weiAmount
    )

    internal {
        require(_beneficiary != address(0));
        require(_weiAmount != 0);
    }

    function _postValidatePurchase(
        address _beneficiary,
        uint256 _weiAmount
    )
        internal{
            
        }


    function _deliverTokens(
        address _beneficiary,
        uint256 _tokenAmount
    )

    internal {
        token.transfer(_beneficiary, _tokenAmount);
    }

//calls deliver tokens
    function _processPurchase (
        address _beneficiary,
        uint256 _tokenAmount
    )
    internal{
        _deliverTokens(_beneficiary, _tokenAmount);
    }

    function _updatePurchasingState(
        address _beneficiary, 
        uint256 _weiAmount

    )
    internal{

    }

    function _getTokenAmount(uint256 _weiAmount)
    internal view returns (uint256){
        return _weiAmount * rate;
    }

    function _forwardFunds() internal {
        wallet.transfer(msg.value);
    }

}