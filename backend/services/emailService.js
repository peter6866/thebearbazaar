const fs = require("fs").promises;
const path = require("path");
const transporter = require("../utils/emailTransporter");

/**
 * Centralized email service for Bear Bazaar
 *
 * Handles all email sending with HTML templates stored in backend/templates/email/
 * Uses {{variableName}} syntax for template variables
 */
class EmailService {
  constructor() {
    this.templatesPath = path.join(__dirname, "../templates/email");
  }

  // Load HTML template from templates/email/{templateName}.html
  async loadTemplate(templateName) {
    try {
      const templatePath = path.join(
        this.templatesPath,
        `${templateName}.html`
      );
      return await fs.readFile(templatePath, "utf8");
    } catch (error) {
      console.error(`Template loading failed for: ${templateName}`, error);
      throw new Error(`Failed to load email template: ${templateName}`);
    }
  }

  // Replace {{variableName}} with actual values
  substituteVariables(template, variables) {
    let result = template;
    Object.keys(variables).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      result = result.replace(regex, variables[key] || "");
    });
    return result;
  }

  // Core method that loads template, substitutes variables, and sends email
  async sendEmail(to, subject, templateName, variables = {}) {
    try {
      const template = await this.loadTemplate(templateName);
      const html = this.substituteVariables(template, variables);

      const mailOptions = {
        from: "The Bear Bazaar <no-reply@thebearbazaar.com>",
        to,
        subject,
        html,
      };

      return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(`Email sending failed to ${to}:`, error);
            reject(error);
          } else {
            console.log(`Email sent successfully to ${to}`);
            resolve(info);
          }
        });
      });
    } catch (error) {
      console.error(`Email service error for ${to}:`, error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  // === Public Email Methods ===

  // Send 6-digit verification code to user email
  async sendVerificationEmail(email, verificationCode) {
    return this.sendEmail(
      email,
      "Please verify your email for The Bear Bazaar!",
      "verification",
      { verificationCode }
    );
  }

  // Send match confirmation with contact details
  async sendMatchFoundEmail(
    email,
    price,
    matchedType,
    matchedEmail,
    phoneNum,
    phoneIsPrefered
  ) {
    const capitalizedMatchedType = `${matchedType
      .charAt(0)
      .toUpperCase()}${matchedType.slice(1)}`;

    let phoneSection = "";
    if (phoneIsPrefered && phoneNum) {
      phoneSection = `
        <p>${capitalizedMatchedType}'s phone number: ${phoneNum}</p>
        <p>The ${matchedType} prefers to use phone number.</p>
      `;
    }

    return this.sendEmail(
      email,
      `A matched ${matchedType} has been found`,
      "match-found",
      {
        matchedType,
        capitalizedMatchedType,
        price,
        matchedEmail,
        phoneSection,
      }
    );
  }

  // Send no match found notification
  async sendNoMatchEmail(email, unmatchedType) {
    return this.sendEmail(
      email,
      `No matched ${unmatchedType} has been found`,
      "no-match",
      { unmatchedType }
    );
  }

  // Warn buyer their bid might be too low (sent once per bid)
  async sendBidTooLowEmail(email) {
    return this.sendEmail(
      email,
      "Current bid price may be too low",
      "bid-too-low"
    );
  }

  // Warn seller their price might be too high (sent once per bid)
  async sendBidTooHighEmail(email) {
    return this.sendEmail(
      email,
      "Current bid price may be too high",
      "bid-too-high"
    );
  }

  // Send match cancellation notice, with optional re-matching info
  async sendMatchCanceledEmail(email, activeUserType = null) {
    let passiveMessage = "";

    if (activeUserType) {
      passiveMessage = `
        <p>
          The <strong>${activeUserType}</strong> you were matched with has canceled the transaction. 
          You've now been placed in a priority queue. Once another <strong>${activeUserType}</strong> becomes available, 
          you'll be automatically re-matched.
        </p>
      `;
    }

    return this.sendEmail(email, "Your match was canceled", "match-canceled", {
      passiveMessage,
    });
  }
}

// Export singleton instance
module.exports = new EmailService();
