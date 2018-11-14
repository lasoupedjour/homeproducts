<?php
/**
* Simple example script using PHPMailer with exceptions enabled
* @package phpmailer
* @version $Id$
*/

require 'class.phpmailer.php';

try {
	$mail = new PHPMailer(true); //New instance, with exceptions enabled

	$body             = file_get_contents('contents.html');
	$body             = preg_replace('/\\\\/','', $body); //Strip backslashes

	$mail->IsSMTP();                           // tell the class to use SMTP
	$mail->SMTPAuth   = true;                  // enable SMTP authentication
	$mail->Port       = 587;                    // set the SMTP server port
	$mail->Host       = "mail.nutrisa.com"; // SMTP server
	$mail->Username   = "pcreativa@nutrisa.com";     // SMTP server username
	$mail->Password   = "ko1941j233";            // SMTP server password

	//$mail->IsSendmail();  // tell the class to use Sendmail

	$mail->AddReplyTo("contacto@iee.edu.mx","Sergio Lazo");

	$mail->From       = "contacto@iee.edu.mx";
	$mail->FromName   = "Sergio Lazo";

	$to = "vcarmona@nutrisa.com";

	$mail->AddAddress($to);

	$mail->Subject  = "Prueba mails franquicia";

	$mail->AltBody    = "To view the message, please use an HTML compatible email viewer!"; // optional, comment out and test
	$mail->WordWrap   = 80; // set word wrap

	$mail->MsgHTML($body);

	$mail->IsHTML(true); // send as HTML

	$mail->Send();
	echo 'Message has been sent.';
} catch (phpmailerException $e) {
	echo $e->errorMessage();
}
?>