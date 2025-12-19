import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Ruta enviar código
app.post("/send-code", async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  try {
    await resend.emails.send({
      from: "Encuesta Gym <no-reply@tudominio.com>"
      to: email,
      subject: "Tu código de verificación",
      html: `
        <h2>Código de verificación</h2>
        <h1>${code}</h1>
        <p>Este código es válido por unos minutos.</p>
      `
    });

    res.json({ success: true });
  } catch (error) {
    console.error("ERROR RESEND:", error);
    res.status(500).json({ error: "Error enviando correo" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

