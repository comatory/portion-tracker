const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const APP_EMAIL = process.env.SENDGRID_APP_EMAIL

class RegistrationUtils {
  static sendVerificationEmail(email, verificationCode) {
    const msg = {
      to: email,
      from: APP_EMAIL,
      subject: 'Verify your PortionTracker account',
      text: `Your verification code is: ${verificationCode}`,
    }
    sgMail.send(msg)
  }
}

module.exports = RegistrationUtils
