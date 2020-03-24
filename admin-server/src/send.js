const FCM = require('fcm-node');
const httpStatus = require('http-status');

const serverKey =
  'AAAA00Rd_F8:APA91bHVcOai9BRrxzCaqvRufw-K7E6ykzkaedgnnwJycve3LPxJmqjCUTsu9QpLJelABad1bIKQIsN8U_q4K3auox9nuiFSwrOMYI1p09voFOJqf1xTG3KUuOWzYeqjsJXav58g6fjZ';
const fcm = new FCM(serverKey);

const methods = {
  /**
   * Push notification functions
   */
  pushNotification(token, requestId, title, body) {
    const message = {
      to: token,
      notification: {
        title,
        body,
      },
      data: {
        // you can send only notification or only data(or include both)
        requestId,
      },
    };
    fcm.send(message, (err, response) => {
      if (err) {
        // console.log('Something has gone wrong!', err);
      } else {
        response.send(httpStatus.OK);
        // console.log('Successfully sent with response: ', response);
      }
    });
  },
  pushNotificationDriverAccpt(token, requestId, title, body, driverData, actualPickuptime) {
    const message = {
      to: token,
      notification: {
        title,
        body,
      },
      data: {
        // you can send only notification or only data(or include both)
        requestId,
        driverData,
        actualPickuptime,
      },
    };
    fcm.send(message, (err, response) => {
      if (err) {
        // console.log('Something has gone wrong!', err);
      } else {
        response.send(httpStatus.OK);
        // console.log('Successfully sent with response: ', response);
      }
    });
  },
};

exports.data = methods;
