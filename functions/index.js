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

exports.sendNotif = functions.firestore.document('orders/{orderId}').onUpdate((change, context) => {
    const newValue = change.data.data();
    if (newValue.status === 'done') {
        var uid = newValue.uid;
        admin.firestore().collection('tokens').doc(uid).get().then(function(snapshot) {
            if (snapshot.exists) {
                console.log('sending notification');
                var message = {
                    "notification" : {
                        "body" : "Order has been fulfilled",
                        "title" : "Order fulfilled",
                        "icon": "http://localhost:5000/images/g.jpg",
                        "click_action": "http://localhost:5000/orders.html?order=" + change.params.orderId
                    }
                };
                return admin.messaging().sendToDevice(snapshot.data().token, message);
            }
        });
    }
    console.log('did not send notif');
    return null;
});

