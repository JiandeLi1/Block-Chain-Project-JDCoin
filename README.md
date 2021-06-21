# Block-Chain-Project-JDCoin
This project is a basic project for understand blockchain, <br />
Using 'crypto-js/sha256' to generate hash, and uisng 'elliptic' to generate private and public keys.<br />

 The Needed Classes For This Project: <br />

## Class Block:<br />
###### property:<br />
timestamp, transactions, previousHash, hash, nonce; <br />
###### method:**<br />
 **calculateHash():** using sha256 and the class' property to generate hash. <br />
 **mineBlock(diff):** if a generated hash start with diff 0’s, block can be mine. <br />
 **hasValidTransactions():** if any Transaction is invalid, chain is invalid; <br />
 <br />
 ## Class Blockchain:<br />
 ###### property: <br/>
 chain, diff, pendingTransactions, reward
 ###### method:<br />
 ** createGenesisBlock():** create Genesis Block. <br />
 ** getLatestBlock(): **get the last Block in the Blockchain. <br /> 
 ** minePendingTransactions(mineRewardAddress): **create a new block first, perhash equal last hash, <br/>
 mineBlock to generate the new hash for this block, push this block to chain, and push <br/>
 the reward to pendingTransaction, next time mine a new block,  pending reward add to <br />
 your account<br />
 ** addTransaction(transaction) **: if transaction is valid, push it to pendingTransaction. <br />
 ** getBalanceOfAddress(address)**: get the balance from all block transction's records. <br />
 ** isChainValid()**: if any block hash != data.hash, prehash not equal per block hash, and block is <br />
 invalid, invalid chain <br />
 <br />
 ##Class Transction:<br />
  ###### property: <br/>
  timestamp, transactions, previousHash, hash, nonce; <br />
 ###### method:<br />
 ** calculateHash():** calculate the transaction hash. <br />
 ** signTransaction(signingKey):** If the private key is not the pair of fromAddress(public key), <br /> 
 *transaction is invalid! Otherwise, calculateHash, sign it, this transction signature is  <br />
 this private key + hash encryption<br />
 ** isValid(): **if fromAddress is null, that is system reward for mining, if <br/>
 a transction is no signature, invalid, else, we compared hash and signature <br />
   