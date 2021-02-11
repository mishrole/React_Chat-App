const functions = require("firebase-functions");
const Filter = require('bad-words');

const admin = require('firebase-admin');
admin.initializeApp();

const database = admin.firestore();

exports.detectEvilUsers = functions.firestore
    .document('messages/{msgId}')
    .onCreate(async function (doc, ctx) {
        const oFilter = new Filter();
        const { text, uid } = doc.data();

        if(oFilter.isProfane(text)) {
            const cleaned = filter.clean(text);
            await doc.ref.update({text: `📢 I got BANNED for life for saying... ${cleaned} 📢`})
            
            await database.collection('banned').doc(uid).set({});
        }
    });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
