<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;
//Database connection and Query
$db = pg_connect("host=horton.db.elephantsql.com dbname=dxeyhugp user=dxeyhugp password=GrDEM1FdeRba7cH3KQT1MPajUGBWytj0");
$query = 'SELECT email FROM users WHERE newsletter = true';
$res = pg_query($db, $query);
$row = pg_fetch_assoc($res);
$people = $row['email'];

require_once 'vendor/autoload.php';


$mail = new PHPMailer(true);

try {
    //Server settings
    $mail->SMTPDebug = SMTP::DEBUG_SERVER;
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'theaitimesit@gmail.com';
    $mail->Password = '';
    $mail->SMTPSecure = 'ssl';
    $mail->Port = 465;

    $mail->setFrom('theaitimesit@gmail.com', 'TheAiTimes');

    while ($row = pg_fetch_assoc($res)) {
        $mail->addAddress($row['email']);
    }

    $mail->isHTML(true);
    $mail->Subject = 'Nuove News!';
    $mail->Body = 'Ciao! Se hai ricevuto questa email vuol dire che probabilmente ci sono novita sul nostro sito <b>NO REPLY</b>';
    $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

    $mail->send();
    echo 'Message has been sent';
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
