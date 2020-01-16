const OverledgerSDK = require('@quantnetwork/overledger-bundle').default;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = '<ENTER YOUR MAPPID>';
const bpiKey = '<ENTER YOUR BPIKEY>';

const ethereumAddress = '0x650A87cfB9165C9F4Ccc7B971D971f50f753e761';
const rippleAddress = 'rhTa8RGotyJQAW8sS2tFVVfvcHYXaps9hC';

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
    try {
        const overledger = new OverledgerSDK(mappId, bpiKey, {
            dlts: [{ dlt: 'ethereum' }, { dlt: 'ripple' }],
            provider: { network: 'testnet' },
        });

        const ethereumAddressSequence = await overledger.dlts.ethereum.getSequence(ethereumAddress);
        console.log('Ethereum address sequence:\n', ethereumAddressSequence.data);
        console.log('\n');

        const rippleAddressSequence = await overledger.dlts.ripple.getSequence(rippleAddress);
        console.log('Ripple address sequence:\n', rippleAddressSequence.data);
        console.log('\n');

    } catch (e) {
        console.error('error', e.response.data);
    }
})();