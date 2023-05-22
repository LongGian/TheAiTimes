<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

//Load Composer's autoloader
require 'vendor/autoload.php';

$mail = new PHPMailer(true);
// Configura i parametri del server SMTP
$mail->isSMTP();
$mail->Host = 'smtp.example.com';
$mail->Port = 587;
$mail->SMTPAuth = true;
$mail->Username = 'tua_email@example.com';
$mail->Password = 'tua_password';

// Imposta il mittente e il destinatario
$mail->setFrom('tua_email@example.com', 'Tuo Nome');
$mail->addAddress('destinatario@example.com', 'Nome Destinatario');

// Imposta il soggetto e il corpo dell'email
$mail->Subject = 'Oggetto dell\'email';
$mail->Body = 'Corpo del messaggio';

// Invia l'email e controlla se l'invio è riuscito o no
if ($mail->send()) {
    echo 'Email inviata con successo!';
} else {
    echo 'Errore durante l\'invio dell\'email: ' . $mail->ErrorInfo;
}
