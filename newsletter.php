<?php
// Connessione al database
$servername = "ep-mute-block-096682.eu-central-1.aws.neon.tech:5432";
$username = "LongGian";
$password = "Ag3sxDF2BEWO";
$dbname = "neondb";

$conn = pg_connect("host=$servername port=5432 dbname=$dbname user=$username password=$password");

// Verifica della connessione al database
if (!$conn) {
    die("Connessione fallita: " . pg_last_error()); // gestione errori
}

// Recupero i destinatari dalla tabella "destinatari"
$sql = "SELECT nome, email FROM destinatari";
$result = pg_query($conn, $sql);

// Ciclo su tutti i destinatari
while($row = pg_fetch_assoc($result)) {
    $nome = $row["nome"];
    $email = $row["email"];

    // Invio dell'email al destinatario
    $to = $email;
    $subject = "Newsletter mensile";
    $message = "Ciao $nome,\n\nBenvenuto alla nostra newsletter mensile!";
    $headers = "From: newsletter@TheAITimes.it" . "\r\n" .
               "Questo è un messaggio a cui non si può rispondere" . "\r\n" .
               "X-Mailer: PHP/" . phpversion();

    mail($to, $subject, $message, $headers);
}

// Chiusura della connessione al database
pg_close($conn);
?>
