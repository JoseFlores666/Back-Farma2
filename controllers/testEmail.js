const brevo = require('@getbrevo/brevo');
require('dotenv').config();
const emailExistence = require('email-existence'); 

async function sendVerificationEmail(token, email, name) {
  const apiInstance = new brevo.TransactionalEmailsApi();

 apiInstance.setApiKey(
    brevo.TransactionalEmailsApiApiKeys.apiKey,
    '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'
  );

  emailExistence.check(email, async (err, res) => {
    if (err) {
      console.error('Error al verificar el correo:', err);
      return;
    }

    if (!res) {
      console.error('El correo electrónico no existe:', email);
      return;
    }
    try {
      const sendSmtpEmail = new brevo.SendSmtpEmail();
      sendSmtpEmail.subject = "Verificación de Correo Electrónico";
      sendSmtpEmail.to = [{ email: email, name: name }];
      sendSmtpEmail.htmlContent = `
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #007bff;
                text-align: center;
            }
            p {
                line-height: 1.6;
            }
            .footer {
                text-align: center;
                margin-top: 20px;
                font-size: 0.9em;
                color: #777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Hola ${name}</h1>
            <p>Gracias por registrarte. Para activar tu cuenta, utiliza el siguiente código de verificación: <strong>${token}</strong>.</p>
            <p>Ingresa este código en la FarmaMedic para confirmar tu dirección de correo electrónico y activar tu cuenta.</p>
            <p>Recuerda que este código de verificación caducará en 15 minutos, así que asegúrate de utilizarlo a tiempo.</p>
            <p>Si no te registraste en nuestra plataforma, puedes ignorar este mensaje.</p>
            <p class="footer">¡Gracias por ser parte de nuestra comunidad!</p>
        </div>
    </body>
    </html>`;


      sendSmtpEmail.sender = {
        name: "FarmaMedic",
        email: "20221043@uthh.edu.mx",
      };

      const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    } catch (error) {
      console.error("Error enviando correo:", error);
    }
  });
}

module.exports = sendVerificationEmail;
