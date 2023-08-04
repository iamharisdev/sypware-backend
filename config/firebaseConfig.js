const admin = require('firebase-admin');

var serviceAccount = require('../utils/vs-spyware-firebase-adminsdk-k9ye2-e7fbdf9fce.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

exports.messaging = admin.messaging();
