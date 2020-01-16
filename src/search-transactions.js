const OverledgerSDK = require('@quantnetwork/overledger-bundle').default;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = '<ENTER YOUR MAPPID>';
const bpiKey = '<ENTER YOUR BPIKEY>';

// If looking for transaction hashes, they can be returned by running the 'a-to-b-transaction' example
const ethereumTransactionHash = '0x4016406d985f0273d841353c95e88906fc805c700b7a5bf4c79124df1dd53985';
const rippleTransactionHash = 'A7606719C83BCE64A43D102FB7D6DDF0B1A8E7014512D395E0756D1D7EBA287F';

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
    try {
        const overledger = new OverledgerSDK(mappId, bpiKey, {
            dlts: [{ dlt: 'ethereum' }, { dlt: 'ripple' }],
            provider: { network: 'testnet' },

        });

        const ethereumTransaction = await overledger.search.getTransaction(ethereumTransactionHash);
        const rippleTransaction = await overledger.search.getTransaction(rippleTransactionHash);

        console.log('Ethereum transaction: ', ethereumTransaction.data);
        console.log('\n');
        console.log('Ripple transaction: ', rippleTransaction.data);
        console.log('\n');
    } catch (e) {
        console.error('error', e.response.data);
    }
})();