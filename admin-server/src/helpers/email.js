const { mailjetKeyPrivate, mailjetKeyPublic } = require('../config/config');
/**
 * This call sends an email to one recipient, using a validated sender address
 * Do not forget to update the sender address used in the sample
 */
const mailjet = require('node-mailjet').connect( // eslint-disable-line
  mailjetKeyPublic,
  mailjetKeyPrivate,
);

/**
 * Send email base on Template
 */
exports.sendEmail = async ({ sender, recipients = [], templateId, subject, variables }) => {
  try {
    return await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: sender,
          To: recipients,
          TemplateID: templateId,
          TemplateLanguage: true,
          Subject: subject,
          Variables: variables,
        },
      ],
    });
  } catch (err) {
    throw err;
  }
};
