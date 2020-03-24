const httpStatus = require('http-status');
const { sendEmail } = require('../../helpers/email');

/**
 * POST /contacts/email
 * Send confirm email when user submit a contact
 */
exports.sendConfirmContact = async (req, res, next) => {
  try {
    await Promise.all([
      // Send confirm email to customer
      sendEmail({
        sender: {
          Email: 'support@gobitcar.com',
          Name: '[BitCar] Support Team',
        },
        recipients: [
          {
            Email: req.body.email,
            Name: req.body.name,
          },
        ],
        templateId: 597539,
        subject: "Thank for contacting us! We'll reach you soon!",
        variables: {
          firstname: req.body.name,
          request_number: `"${req.body.subject}"`,
          message: req.body.message,
        },
      }),
      // Send email to support team
      sendEmail({
        sender: {
          Email: 'admin@gobitcar.com',
          Name: 'BitCar Admin',
        },
        recipients: [
          {
            Email: 'support@gobitcar.com',
            Name: 'Support',
          },
        ],
        templateId: 599834,
        subject: `[Contact Us] New Message: ${req.body.subject}`,
        variables: {
          subject: req.body.subject,
          message: req.body.message,
          email: req.body.email,
          name: req.body.name,
        },
      }),
    ]);
    res.status(httpStatus.NO_CONTENT).end();
  } catch (err) {
    return next(err);
  }
};
