const brevo = require('@getbrevo/brevo');
require('dotenv').config();
const emailExistence = require('email-existence');

async function recuperarPassEmail(token, email, name) {
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
            sendSmtpEmail.subject = "Recuperación de contraseña";
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
                <p>Hemos recibido una solicitud para recuperar tu contraseña. Tu código de recuperación es: <strong>${token}</strong>.</p>
                <p>Para restablecer tu contraseña, ingresa este código en la sección correspondiente de la aplicación.</p>
                <p>Asegúrate de hacerlo antes de que el código expire, ya que este código de recuperación caducará en 15 minutos.</p>
                <p>Si no solicitaste la recuperación de contraseña, puedes ignorar este mensaje.</p>
                <p class="footer">Gracias por utilizar nuestros servicios.</p>
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

module.exports = recuperarPassEmail;
