const mjml2html = require("mjml");

/**
 * Password reset email template
 * @param {string} passwordResetLink
 * @returns {html}
 */
function passwordResetTemplate(passwordResetLink) {
  const htmlOutput = mjml2html(
    `
    <mjml>
  <mj-body background-color="#F2F2F2">
    <mj-section padding-top="10%"></mj-section>
    <mj-section background-color="#fff" border="1px solid #e9e9e9" padding="10px" border-radius="4px 4px 0px 0px">
      <mj-column width="400px">
        <mj-image align="center" alt="lyreform logo" width="50px" src="https://res.cloudinary.com/lyreform-com/image/upload/v1615955867/assets/email/logo-small_wyjo1e.png" />
        <mj-text align="left" color="#0060e8" font-size="30px" font-family="Helvetica" font-weight="700">Password reset</mj-text>
      </mj-column>
    </mj-section>
    <mj-section background-color="#ffffff" border="1px solid #e9e9e9" padding-top="60px" padding-bottom="60px">
      <mj-column width="400px">
        <mj-text padding-bottom="12px" font-size="22px" font-family="Helvetica" font-weight="600" color="#626262">Hey did you request a password reset?</mj-text>
        <mj-text font-size="14px" color="#525252">If you did request a password reset, you can go ahead click the button below. This link is valid for <b>24 hours</b>.</mj-text>
        <mj-button background-color="#0060e8" align="left" href="${passwordResetLink}">Reset my password</mj-button>
        <mj-text font-size="14px" color="#525252">If you didn't request a password reset, you can ignore this message.</mj-text>
        <mj-text font-size="14px" color="#525252" font-weight="700">The Lyreform Team</mj-text>
      </mj-column>
    </mj-section>
    <mj-section background-color="#424651" border="1px solid #e9e9e9" padding="30px" border-radius="4px 4px 0px 0px">
      <mj-column width="400px" background-color="#424651">
        <mj-button background-color="#424651" color="#fff" align="left" border="2px solid #fff" href="https://lyreform.com/">Visit Lyreform.com</mj-button>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
  `
  );
  return htmlOutput.html;
}

module.exports = passwordResetTemplate;
