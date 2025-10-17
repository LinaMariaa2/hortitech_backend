import nodemailer from 'nodemailer';

// Temporalmente desactivamos el transporte de correo para evitar errores en producción
// Si luego configuras el correo, puedes descomentar esto

/* 
export const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Error al conectar con el servidor de correo:', error);
        console.error('Por favor, revisa tus variables de entorno EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS en .env.');
    } else {
        console.log('Servidor de correo listo para enviar mensajes.');
    }
});
*/

// 🚧 Mientras tanto exportamos un "falso" transporter para que el resto del código no falle
export const transporter = {
  sendMail: async () => {
    console.log('Simulación: correo no enviado (servicio de correo deshabilitado temporalmente)');
  },
};
