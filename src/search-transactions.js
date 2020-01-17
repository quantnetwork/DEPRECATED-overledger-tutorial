const OverledgerSDK = require('@quantnetwork/overledger-bundle').default;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = '<ENTER YOUR MAPPID>';
const bpiKey = '<ENTER YOUR BPIKEY>';

// If looking for transaction hashes, they can be returned by running the 'a-to-b-transaction' example
const rippleTransactionHash = 'C8538AAD92EE6B6479BABAADD49695521303E43E5912494A2B267D34236AB1BD';

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
    try {
        const overledger = new OverledgerSDK(mappId, bpiKey, {
            dlts: [{ dlt: 'ethereum' }, { dlt: 'ripple' }],
            provider: { network: 'testnet' },

        });

        const rippleTransaction = await overledger.search.getTransaction(rippleTransactionHash);

        console.log('Ripple transaction: ', rippleTransaction.data);
        console.log('\n');
    } catch (e) {
        console.error('error', e.response.data);
    }
})();
