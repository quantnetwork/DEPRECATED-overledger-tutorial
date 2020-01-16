const OverledgerSDK = require('@quantnetwork/overledger-bundle').default;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = '<ENTER YOUR MAPPID>';
const bpiKey = '<ENTER YOUR BPIKEY>';

// If looking for a transaction hashe, it can be returned by running the 'send-transactions' example
const overledgerTransactionHash = '';

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
    try {
        const overledger = new OverledgerSDK(mappId, bpiKey, {
            dlts: [{ dlt: 'ethereum' }, { dlt: 'ripple' }],
            provider: { network: 'testnet' },

        });

        const overledgerTransaction = await overledger.readOverledgerTransaction(overledgerTransactionHash);

        console.log('Overledger transaction: ', overledgerTransaction.data);
        console.log('\n');
    } catch (e) {
        console.error('error', e.response.data);
    }
})();