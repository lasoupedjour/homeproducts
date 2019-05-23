<?php

$mail->IsSMTP();                           // tell the class to use SMTP
$mail->SMTPAuth   = false;                  // enable SMTP authentication
//$mail->SMTPDebug = 1;
//$mail->SMTPSecure = "ssl";
$mail->Port		  = "25";                    // set the SMTP server port
$mail->Host       = "172.16.120.17"; // SMTP server
//$mail->Host       = "172.16.120.17";
//$mail->Host       = "69.49.115.72";
//$mail->Username   = "slazo@pautacreativa.com.mx";     // SMTP server username
//$mail->Password   = "kb#Zq83mIXS)";            // SMTP server password

//$mail->IsSendmail();  // tell the class to use Sendmail

//$mail->AddReplyTo("$email",utf8_decode("$nombre"));

$mail->From       = "alertas@solution-center.net";
//$mail->From       = "slazo@pautacreativa.com.mx";
$mail->FromName   = utf8_decode("Oster Home Products");

?>
