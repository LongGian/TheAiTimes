<?php
// Connessione al database
$servername = "horton.db.elephantsql.com";
$username = "dxeyhugp";
$password = "vdjLLvMZ83wlx6ilmDs20fx0DplSq_Wg";
$dbname = "dxeyhugp";

$conn = pg_connect("host=$servername port=5432 dbname=$dbname user=$username password=$password");

// Verifica della connessione al database
if (!$conn) {
    die("Connessione fallita: " . pg_last_error()); // gestione errori
}

// Recupero i destinatari dalla tabella "destinatari"
$sql = "SELECT first_name, email FROM users";
$result = pg_query($conn, $sql);

// Ciclo su tutti i destinatari
$count = 1;
while ($count < 50) {
    echo "\n[Try $count]\n";
    while ($row = pg_fetch_assoc($result)) {
        $first_name = $row["first_name"];
        $email = $row["email"];
    
        echo "Sending to\nfirst_name: $first_name\nemail: $email\n";
    
        // Invio dell'email al destinatario
        $to = $email;
        $subject = "Newsletter mensile";
        $message = "Ciao $first_name,\n\nBenvenuto alla nostra newsletter mensile!";
        $headers = "From: newsletter@TheAITimes.it" . "\r\n" .
                   "Questo è un messaggio a cui non si può rispondere" . "\r\n" .
                   "X-Mailer: PHP/" . phpversion();
    
        if (mail($to, $subject, $message, $headers)) {
            echo "\nMail sent!\n\n";
        } else {
            echo "\nError while sending email\n";
        }
    }
    $count++;
    sleep(60);
}
// Chiusura della connessione al database
pg_close($conn);
?>
