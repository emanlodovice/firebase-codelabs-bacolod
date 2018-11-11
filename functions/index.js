const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.processOrder = functions.firestore.document('orders/{orderId}').onCreate((snap, context) => {
    var orderInfo = snap.data.data();
    // do some server side code here, probably related to paypal
    const r = Math.floor((Math.random() * 5) + 1);
    if (r === 1) {
        orderInfo.status = 'fail';
    } else {
        orderInfo.status = 'pending';
        orderInfo.paypalRedirectUrl = 'https://github.com/emanlodovice/firebase-codelabs-bacolod/issues/10';
    }

    return snap.data.ref.set(orderInfo);
});
