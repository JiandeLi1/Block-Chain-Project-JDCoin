
    const SHA256 = require('crypto-js/sha256')
    const EC = require('elliptic').ec;
    const ec = new EC('secp256k1');
class Block {
        constructor(timestamp, transactions, previousHash = '') {
            this.timestamp = timestamp
            this.transactions = transactions
            this.previousHash = previousHash
            this.hash = this.calculateHash()
            this.nonce = 0
        }
    
        calculateHash() {
            return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transaction) + this.nonce).toString()
        }

        mineBlock(diff) {
            //If we generated a hash that 
            while (this.hash.substring(0, diff) != Array(diff + 1).join("0")) {
                this.nonce += 1
                this.hash = this.calculateHash()
            }
            alert("New Block Was Mined!")
        }

        hasValidTransactions() {
            for (const ts of this.transactions) {
                if (!ts.isValid()) {
                    return false;
                }
            }
            return true;
        }

    }
    class Blockchain {
        constructor() {
            this.chain = [this.createGenesisBlock()]
            this.diff = 3 // set the diff is 3, hash need to start with two 0's
            this.pendingTransactions = []
            this.reward = 50
        }
        createGenesisBlock() {
            return new Block(Date.now(), "Genesis Block", 0)
        }
        getLatestBlock() {
            return this.chain[this.chain.length - 1]
        }
        minePendingTransactions(mineRewardAddress) {
            let block = new Block(Date.now(), this.pendingTransactions)
            block.previousHash = this.getLatestBlock().hash
            block.mineBlock(this.diff)
            this.chain.push(block)
            this.pendingTransactions = [...this.pendingTransactions,new Transaction(null, mineRewardAddress, this.reward)]

        }
        addTransaction(transaction) {
            if (!transaction.fromAddress || !transaction.toAddress) {
                alert('Transaction must include from and to address');
                return
            }
            if (!transaction.isValid()) {
                alert('Cannot add invalid transaction to chain');
                return
            }
            this.pendingTransactions.push(transaction)
        }
        getBalanceOfAddress(address) {
            let balance = 0
            for (const block of this.chain) {
                for (const tran of block.transactions) {
                    if (tran.fromAddress == address) {
                        balance -= tran.amount
                    }
                    if (tran.toAddress == address) {
                        balance += tran.amount
                    }
                }
            }
            return balance
        }
        isChainValid() {
            for (let i = 1; i < this.chain.length; i++) {
                const currBlock = this.chain[i]
                //calculate the hash, if any data in the block was changed, new has is different with the hasg the block already has, if so return false 
                if (currBlock.hash != currBlock.calculateHash()) return false
                //If current block's previousHash is not match with last block's hash in the chain, return false 
                if (currBlock.previousHash != this.chain[i - 1].hash) return false
                //If any transaction is invalid, chain is invaild
                if (!currBlock.hasValidTransactions()) return false
            }
            return true
        }
    }


    class Transaction {
        constructor(fromAddress, toAddress, amount) {
            this.fromAddress = fromAddress;
            this.toAddress = toAddress;
            this.amount = amount;
        }

        calculateHash() {
            return SHA256(this.fromAddress + this.toAddress + this.amount).toString()
        }

        signTransaction(signingKey) {
            //If the private key is not the pair of fromAddress(public key), transaction is invalid!
            if (signingKey.getPublic('hex') !== this.fromAddress) {
                alert('Invalid transaction!')
                return false
            }
            //This transaction hash
            const myhash = this.calculateHash();
            //Using privaye key toand hash of this transaction to sign
            const sig = signingKey.sign(myhash, 'base64');
            //Export DER encoded signature
            this.signature = sig.toDER('hex');
        }

        isValid() {
            //System reward for mining
            if (this.fromAddress === null) return true;
            if (!this.signature || this.signature.length === 0) {
                alert('No signature in this transaction');
                return false
            }
            const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
            return publicKey.verify(this.calculateHash(), this.signature);
        }
    }

    let JDCoin = new Blockchain();
    //My Private key
    const myKey = ec.keyFromPrivate('ertyuihgfv456c678hnv1fghjkbnm');
    //My public key
    const myWalletAddress = myKey.getPublic('hex');

    
    // Mine block
    const mine = () => {
        JDCoin.minePendingTransactions(myWalletAddress);
    }
  
   let traAmount=document.getElementById("traAmount")
   let toAds = document.getElementById("toAds")
   let send = document.getElementById("send")
  
  send.addEventListener('click', () => {
    makeTransaction(toAds.value, traAmount.value)
  })
  
  
  
  let chainList = document.getElementById("chainList")
  let transactionList = document.getElementById("transactionList")
  
  const renew = () => {
    chainList.innerHTML=''
    for (let i = 0; i < JDCoin.chain.length; i++) {
      let list = document.createElement("i")
      
      list.innerHTML = "<div class='list'>" +
        "<div> <label>Timestamp: </label> "+ new Date(JDCoin.chain[i].timestamp) + "</div>"+
        "<div> <label>Hash: </label> "+ JDCoin.chain[i].hash + "</div>"+
        "<div> <label>PerHash: </label> " + JDCoin.chain[i].previousHash + "<div>"+
        "</div>"
    chainList.append(list)
    }
    document.getElementById("mine").innerHTML = "Your Total JDCoin: " + JDCoin.getBalanceOfAddress(myWalletAddress)
    if (JDCoin.isChainValid()) {
      document.getElementById("valid").innerHTML = "The JDCoin chain state: <span class='stateValid'>Valid</span>"
    } else {
      document.getElementById("valid").innerHTML = "The JDCoin chain state: <span class='stateInvalid'>Invalid</span>"
    }
}
  
// Make a transaction
    const makeTransaction = (to, amount) => {
        if (JDCoin.getBalanceOfAddress(myWalletAddress) < amount || to=="") {
            alert("invalid transaction!")
        }
        const t = new Transaction(myWalletAddress, to, amount);
        t.signTransaction(myKey);
        JDCoin.addTransaction(t);
        alert(`JDCoin was sent to ${to}!`)
        renew()
     
    }
  
renew()
  
  
let mining = document.getElementById("mining");
  mining.addEventListener('click', () => {
    mine()
    renew()
  })