# Tutorial - Developing on Overledger

![](https://www.overledger.com/wp-content/uploads/2019/04/Overledger-Overview1.png)

## Introduction

An introduction to exploring the blockchain using [Quant Network's](https://www.quant.network) Overledger SDK.

Quant's Overledger is a platform that facilitates the development of decentralised, multi-chain applications which allows you build on the blockchain more quickly and efficiently.

During this tutorial we will demonstrate how to use the Overledger Javascript SDK to submit transactions and query data on multiple blockchains.

## Outcome

We will begin writing a NodeJS project which will allow us to run an Overledger example in JavaScript.

What we will be building: a simple script which automatically signs and sends transactions to multiple blockchains through Overledger.

## Setting up the environment

First, create a new project. Then, open a terminal shell inside it and run:

```sh
npm init -y
```

This will create a default `package.json` file which we can use to set up the dependencies of our project.

Only one dependency is required [@quantnetwork/overledger-bundle](https://www.npmjs.com/package/@quantnetwork/overledger-bundle):

```sh
# npm
npm install @quantnetwork/overledger-bundle

# yarn
yarn add @quantnetwork/overledger-bundle
```

The `overledger-bundle` includes all the sub-packages of the Overledger SDK which are required to read and write on the different blockchains supported.

Link to [Quant Overledger SDK JavaScript](https://github.com/quantnetwork/overledger-sdk-javascript) for some guidance and information.

### Additional environment setup

Please note that the package expects certain build tools already present. MacOS and Linux normally have these preinstalled, like the xcode-select gcc compiler etc.

For Windows, it is important to add the following steps if that is not already configured for your environment.

> PLEASE NOTE: If you already have Python and Windows Build Tools installed this may not work for you. The steps below are dependent on a clean machine. They are tested with node 10.15.1 LTS

```sh
# From an administrative privileged command prompt
npm install --global --production windows-build-tools
npm install -g node-gyp
```

## Application Flow / Outline

The objective is to succesfully send a multi-chain transaction and verify that it took place.

After that, we will explore some further examples on how to query data from the blockchains.

### Importing the dependency and setting up the accounts

```javascript
const OverledgerSDK = require('@quantnetwork/overledger-bundle').default;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = '<ENTER YOUR MAPPID>';
const bpiKey = '<ENTER YOUR BPIKEY>';

// Paste in your ethereum and ripple private keys.
// For Ethereum you can generate an account using `OverledgerSDK.dlts.ethereum.createAccount` then fund the address at the Ropsten Testnet Faucet.
const partyAEthereumPrivateKey = '';
const partyAEthereumAddress = ''
// For Ripple, you can go to the official Ripple Testnet Faucet to get an account already funded.
const partyARipplePrivateKey = '';
const partyARippleAddress = ''


const partyBEthereumAddress = '0x1a90dbb13861a29bFC2e464549D28bE44846Dbe4';
// Keep in mind that for Ripple, the minimum transfer amount is 20XRP (20,000,000 drops), if the address is not yet funded.
const partyBRippleAddress = 'rHVsZPVPjYJMR3Xa8YH7r7MapS7s5cyqgB';

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

```

### Instantiating the Overledger SDK and setting up the transaction message

First, create a file called `our-script.js`.
Inside the file, we will include all our code blocks.

To instantiate the OverledgerSDK, we need to specify the dlts we would like to use and the network we want to connect to. Optionally, we can set a request timeout period in ms. We will also set up the transactionMessage constant here, which we will send to the blockchains.

```javascript
const overledger = new OverledgerSDK(mappId, bpiKey, {
  dlts: [{ dlt: 'ethereum' }, { dlt: 'ripple' }],
  provider: {
    network: 'testnet',
    timeout: 10000,
  },
});

const transactionMessage = 'Hello world!';
```

### Getting our account transaction sequences through Overledger

In order to sign transactions offline, some information about the state of our accounts is required first. The transaction sequence is the number of transactions the respective account has submitted. We can use Overledger to request this information from the blockchains.

```javascript
; (async () => {
  try {
    // SET partyA accounts for signing;
    overledger.dlts.ethereum.setAccount(partyAEthereumPrivateKey);
    overledger.dlts.ripple.setAccount(partyARipplePrivateKey);

    // Get the address sequences.
    const ethereumSequenceRequest = await overledger.dlts.ethereum.getSequence(partyAEthereumAddress);
    const rippleSequenceRequest = await overledger.dlts.ripple.getSequence(partyARippleAddress);
    const ethereumAccountSequence = ethereumSequenceRequest.data.dltData[0].sequence;
    const rippleAccountSequence = rippleSequenceRequest.data.dltData[0].sequence;

    console.log("The transaction sequence of our Ethereum account is: ", ethereumAccountSequence);
    console.log("The transaction sequence of our Ripple account is: ", rippleAccountSequence);
  } catch (e) {
    console.error('error:', e);
  }
})();
```

### Signing the transactions

To submit our transactions, we need to sign them first. The Overledger SDK uses the respective libraries for the blockchains in order to sign transactions offline, therefore avoiding the exposure of our private keys.

We will now include this block before the `} catch (e) {` line in the previous block.

```javascript
    // Sign the transactions.
    const signedTransactions = await overledger.sign([
    {
      // In order to sign an ethereum transaction offline, we have to specify the sequence (nonce), a feePrice (gasPrice) and feeLimit (gasLimit).
      dlt: 'ethereum',
      toAddress: partyBEthereumAddress,
      message: transactionMessage,
      options: {
        amount: '0', // On Ethereum you can send 0 amount transactions. But you still pay network fees
        sequence: ethereumAccountSequence, // Sequence starts at 0 for newly created addresses
        feePrice: '1000', // Price for each individual gas unit this transaction will consume
        feeLimit: '80000', // The maximum fee that this transaction will use
      },
    },
    {
      // In order to sign a ripple transaction offline, we have to specify a fee, sequence and maxLedgerVersion.
      dlt: 'ripple',
      toAddress: partyBRippleAddress,
      message: transactionMessage,
      options: {
        amount: '1', // Minimum allowed amount of drops is 1 for Ripple.
        sequence: rippleAccountSequence, // Sequence increases by 1 with each transaction and starts at 1 right after getting the address from the XRP testnet faucet.
        feePrice: '12', // Minimum feePrice on Ripple is 12 drops.
        maxLedgerVersion: '4294967295', // The maximum ledger version the transaction can be included in.
      },
    },]);
```

### Sending the signed transactions through Overledger

Lastly, we will send our signed transactions to Overledger.

We will include this block right below the block above, but before the `} catch (e) {` line.

```javascript
    // Send the transactions to Overledger.
    const result = (await overledger.send(signedTransactions)).data;

    // Log the result.
    console.log(JSON.stringify(result, null, 2));
```


### Running

To run our script, from the terminal, simply execute

```sh
node our-script.js
```

You should see the terminal output stating the transactions have been successfuly broadcasted, together with an overledgerTransactionId which can be used to search for both transactions:

```sh
{
  "mappId": "network.quant.examples.a-to-b-transaction",
  "overledgerTransactionId": "f0c1f314-7cda-4f67-8a21-3761d09af452",
  "timestamp": "2019-04-29T14:05:40.189878Z",
  "dltData": [
    {
      "dlt": "ethereum",
      "transactionHash": "0x4016406d985f0273d841353c95e88906fc805c700b7a5bf4c79124df1dd53985",
      "status": {
        "status": "broadcasted",
        "code": "0",
        "message": "Successfully broadcasted"
      },
      "links": []
    },
    {
      "dlt": "ripple",
      "transactionHash": "A7606719C83BCE64A43D102FB7D6DDF0B1A8E7014512D395E0756D1D7EBA287F",
      "status": {
        "status": "broadcasted",
        "code": "tesSUCCESS",
        "message": "The transaction was applied. Only final in a validated ledger."
      },
      "links": []
    }
  ]
}
```

A full example can be found in [src/send-transaction.js](../master/src/send-transaction.js).

## More examples

Further examples can be found in the `src` folder for:
- reading an Overledger transaction
- getting address balances
- getting address sequences
- searching for transactions
- searching for blocks