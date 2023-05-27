<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

//Usiamo il tool php mailer, per il cui uso é necessaria la cartella vendor, e i due file composer.
//Si inseriscono le credenziali della email, i destinatari (presi tramite query postgres), e l'oggetto.
$db = pg_connect("host=horton.db.elephantsql.com dbname=dxeyhugp user=dxeyhugp password=GrDEM1FdeRba7cH3KQT1MPajUGBWytj0"); //Connessione al DB
$query = 'SELECT email FROM users WHERE newsletter = true';
$res = pg_query($db, $query); //Risultato dela query
$row = pg_fetch_assoc($res);
$people = $row['email']; //Creazione di un array assiociativo con dentro le email dei destinatari

require_once 'vendor/autoload.php';


$mail = new PHPMailer(true);

try {
    //Autenticazione e formato di sicurezza delle email da inviare
    $mail->SMTPDebug = SMTP::DEBUG_SERVER;
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'theaitimesit@gmail.com';
    $mail->Password = '';
    $mail->SMTPSecure = 'ssl';
    $mail->Port = 465;

    $mail->setFrom('theaitimesit@gmail.com', 'TheAiTimes'); //Nome ed indirizzo del mittente

    while ($row = pg_fetch_assoc($res)) {
        $mail->addAddress($row['email']);
    }                
    $mail->isHTML(true);                                  //Il formato della mail viene impostato ad HTML
    $mail->Subject = 'Nuove News!';
    $mail->Body    = 'Ciao! Se hai ricevuto questa email vuol dire che probabilmente ci sono novita sul nostro sito \n <b>NO REPLY</b>';
    $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

    $mail->send();
    echo 'Message has been sent';     //Invio della email e stampa a schermo di avvenuto invio
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"; //Gestione degli
}









