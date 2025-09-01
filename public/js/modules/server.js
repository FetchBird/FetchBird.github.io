const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

// Classe SendEmail
class SendEmail {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "mail.fetchbird.com.br",
      port: 465,
      secure: true,
      auth: {
        user: "contato@fetchbird.com.br",
        pass: "FetchBird2024"
      }
    });
  }

  async enviar({ nome, contatoInfo, subject, mensagem, contact, orcamento }) {
    try {
      // Tratamento de valores indefinidos ou ausentes
      const nomeFormatado = nome || 'indefinido';
      const contatoFormatado = contatoInfo || 'indefinido';
      const assuntoFormatado = subject || 'Novo contato no site 🚀';
      const mensagemFormatada = mensagem || 'indefinido';
      const contactFormatado = contact || 'indefinido';
      const orcamentoFormatado = orcamento || 'indefinido';

      // Texto simples (fallback)
      const textoEmail = `
      Nova mensagem de contato:

      Nome: ${nomeFormatado}
      Contato: ${contatoFormatado}
      Tipo de Contato: ${contactFormatado}
      Orçamento: ${orcamentoFormatado}

      Mensagem:
      ${mensagemFormatada}
    `;

      // HTML estilizado Dark Mode
      const htmlEmail = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; padding: 24px; border-radius: 10px; border: 1px solid #333; color: #f0f0f0;">
        <h2 style="color: #4A90E2; text-align: center;">📩 Nova mensagem de contato</h2>
        
        <p><strong style="color: #4A90E2;">Nome:</strong> ${nomeFormatado}</p>
        <p><strong style="color: #4A90E2;">Contato:</strong> ${contatoFormatado}</p>
        <p><strong style="color: #4A90E2;">Tipo de Contato:</strong> ${contactFormatado}</p>
        <p><strong style="color: #4A90E2;">Orçamento:</strong> ${orcamentoFormatado}</p>

        <hr style="margin: 20px 0; border: none; border-top: 1px solid #444;">

        <p><strong style="color: #4A90E2;">Mensagem:</strong></p>
        <p style="background: #262626; padding: 14px; border-radius: 8px; border: 1px solid #333; line-height: 1.6; color: #ddd;">
          ${mensagemFormatada.replace(/\n/g, '<br>')}
        </p>

        <p style="text-align: center; font-size: 12px; color: #666; margin-top: 20px;">
          Email enviado pelo passarinho <span style="color:#4A90E2;"><strong>${contatoFormatado}</strong></span>.
        </p>
      </div>
    `;

      let info = await this.transporter.sendMail({
        from: '"Site FetchBird" <contato@fetchbird.com.br>',
        to: "contato@fetchbird.com.br",
        subject: assuntoFormatado,
        replyTo: contatoInfo || "juliomsr098@gmail.com",
        text: textoEmail,
        html: htmlEmail
      });

      console.log("✅ Email enviado:", info.messageId);
    } catch (err) {
      console.error("❌ Erro ao enviar email:", err);
    }
  }



}

// Servidor
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Rota de envio
app.post("/send", async (req, res) => {
  const { nome, "contato-info": contatoInfo, subject, mensagem, contact, orcamento } = req.body;

  try {
    const mailer = new SendEmail();
    await mailer.enviar({ nome, contatoInfo, subject, mensagem, contact, orcamento });
    res.status(200).json({ ok: true, message: "Mensagem enviada com sucesso!" });
  } catch (err) {
    console.error("❌ Erro:", err);
    res.status(500).json({ ok: false, message: "Erro ao enviar email." });
  }
});

app.listen(PORT, () => console.log(`✅ Servidor rodando em http://localhost:${PORT}`));
