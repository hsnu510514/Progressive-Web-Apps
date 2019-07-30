var functions = require('firebase-functions');
var admin = require('firebase-admin');
var cors = require('cors')({ origin: true });
var webpush = require('web-push');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
var serviceAccount = require("./pwagram-fb-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pwagram0719.firebaseio.com"
});

exports.storePostData = functions.https.onRequest(function (request, response) {
  cors(request, response, function () {
    admin.database().ref('posts').push({
      id: request.body.id,
      title: request.body.title,
      location: request.body.location,
      image: request.body.image
    })
      .then(function () {
        webpush.setVapidDetails('mailto: hsnu51051@gmail.com', 'BKo814-ZuO3PS3-AKHy3ZhMrKl-kLkHCoI0OjI8C_ELfWkEF6jopuuN3akp5EoEtH34uAW1jPNt5Tx8sdf0aLQw',
        'ayHzUlerGHqRoVo241b9zYGBjdQWe9otQw_CgCXkIv8');
        return admin.database().ref('subscriptions').once('value')
      })
      .then(function(subscriptions) {
        subscriptions.forEach(function(sub) {
          var pushConfig = {
            endpoint: sub.val().endpoint,
            keys: {
              auth: sub.val().keys.auth,
              p256dh: sub.val().keys.p256dh
            }
          };

          webpush.sendNotification(pushConfig, JSON.stringify({title: 'New Post', content: 'New Post added'}))
            .catch(function(err) {
              console.log(err);
            })
        })
        response.status(201).json({message: 'Data stored', id: request.body.id});
      })
      .catch(function (err) {
        response.status(500).json({ error: err });
      });
  });
});
