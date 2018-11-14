<?php

require './phpmailer/class.phpmailer.php';
    $baseurl = 'http://'.$_SERVER['HTTP_HOST'].'/'; 
        
 
    try {
		$mail = new PHPMailer(true); //New instance, with exceptions enabled
		
		//$body             = file_get_contents('contents.html');
		$body = "
		
        <!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>
<html xmlns='http://www.w3.org/1999/xhtml'>
<head>
  <title>La moderna | Club Sauris</title>

<style type='text/css'>
* {
  margin: 0;
  padding: 0;
}
td {
  font-family: Arial Narrow, Helvetica, arial, Verdana, sans-serif;
  font-size: 16px;
  line-height: 1.8;
  color: #303e89;
}
@media screen and (max-width: 767px) {
  td, font {
    line-height: 1.4 !important;
    text-align: center !important;
  }
  .fullimage {
    width: 100% !important;
    height: auto !important;
  }
  .breacktable {
    width: 100% !important;
  }v
}
</style>
</head>
<body bgcolor='#ffffff'>
<table align='center' border='0' cellpadding='0' cellspacing='0' width='100%' style=''>
  <tr>
    <td align='center' style='text-align: center'>


<table align='center' border='0' cellpadding='0' cellspacing='0' width='600' style='border: 1px solid #cccccc; border-collapse: collapse; padding: 0px; width: 600px; margin: 0 auto;' class='breacktable'>
  <tr>
    <td bgcolor='#98c24d' style='font-family: Arial Narrow, Helvetica, arial, Verdana, sans-serif; font-size: 26px; color: #303e89; border-bottom: 5px solid white;'  colspan='3'>
      <img src='http://apps.pautacreativatemporales.com.mx/lamoderna/sauris/mailing/img/saurismail_01.jpg' width='600' height='50' border='0' alt='La moderna' style='display:block;' class='fullimage' />
    </td>
  </tr>
  <tr>
    <td bgcolor='#98c24d' style='font-family: Arial Narrow, Helvetica, arial, Verdana, sans-serif; font-size: 26px; color: #303e89;' colspan='3'>
      <img src='http://apps.pautacreativatemporales.com.mx/lamoderna/sauris/mailing/img/saurismail_03.jpg' width='600' height='260' border='0' alt='Únete al Club Sauris y ganarás increíbles premios' style='display:block;' class='fullimage' />
    </td>
  </tr>
  <tr>
    <td bgcolor='#519305' style='font-family: Arial Narrow, Helvetica, arial, Verdana, sans-serif; font-size: 26px; color: #303e89;' colspan='3'>
      <img src='http://apps.pautacreativatemporales.com.mx/lamoderna/sauris/mailing/img/saurismail_04.jpg' width='600' height='160' border='0' alt='Confirmación' style='display:block;' class='fullimage' />
    </td>
  </tr>
  <tr>
    <td bgcolor='#519305' style='font-family: Arial Narrow, Helvetica, arial, Verdana, sans-serif; font-size: 26px; color: #303e89;'>
      <img src='http://apps.pautacreativatemporales.com.mx/lamoderna/sauris/mailing/img/saurismail_05.jpg' width='108' height='187' border='0' alt='Confirmación' style='display:block;' class='fullimage' />
    </td>
    <td bgcolor='#937A5C' width='390' height='187' style='font-family: Arial Narrow, Helvetica, arial, Verdana, sans-serif; font-size: 26px; color: #FFFFFF; width: 390px; height: 187px;'>
        <p><font color='#FFFFFF' face='Arial Narrow, Helvetica, arial, Verdana, sans-serif;' style='font-family: Arial Narrow, Helvetica, arial, Verdana, sans-serif; font-size: 24px; color: #ffffff;'>
        ¡Tu registro se realizó con éxito!
        </font></p>
        
        <font color='#FFFFFF' face='Arial Narrow, Helvetica, arial, Verdana, sans-serif;' style='font-family: Arial Narrow, Helvetica, arial, Verdana, sans-serif; font-size: 16px; line-height: 100%; color: #ffffff;'>
        <br>
        <strong><span style='color: #3c2400;'>Número de participante:</span></strong> $id_participantes<br>
        <strong><span style='color: #3c2400;'>Contraseña:</span></strong> $pwd
        </font>
		<p><font color='#FFFFFF' face='Arial Narrow, Helvetica, arial, Verdana, sans-serif;' style='font-family: Arial Narrow, Helvetica, arial, Verdana, sans-serif; font-size: 16px; line-height: 100%; color: #ffffff;'>
        Recuerda que entre más <strong>códigos Sauris</strong> registres, más posibilidades tienes de ganar.
        </font></p>
    </td>
    <td bgcolor='#519305' style='font-family: Arial Narrow, Helvetica, arial, Verdana, sans-serif; font-size: 26px; color: #303e89;'>
      <img src='http://apps.pautacreativatemporales.com.mx/lamoderna/sauris/mailing/img/saurismail_07.jpg' width='102' height='187' border='0' alt='Confirmación' style='display:block;' class='fullimage' />
    </td>
  </tr>
  <tr>
    <td bgcolor='#519305' style='font-family: Arial Narrow, Helvetica, arial, Verdana, sans-serif; font-size: 26px; color: #303e89;' colspan='3'>
      <img src='http://apps.pautacreativatemporales.com.mx/lamoderna/sauris/mailing/img/saurismail_08.jpg' width='600' height='128' border='0' alt='Confirmación' style='display:block;' class='fullimage' />
    </td>
  </tr>
  <tr>
    <td bgcolor='#1d5029' width='600' height='60' style='font-family: Arial Narrow, Helvetica, arial, Verdana, sans-serif; font-size: 16; color: #f5e837; width: 600px; height: 60px;' colspan='3'>
        <font color='#FFFFFF' face='Arial Narrow, Helvetica, arial, Verdana, sans-serif;' style='font-family: Arial Narrow, Helvetica, arial, Verdana, sans-serif; font-size: 16px; line-height: 1.8; color: #f5e837;'>Aviso de privacidad</font>
    </td>
  </tr> 
</table>


    </td>
  </tr>
</table> 
</body>
</html>

		";
		
		$body             = preg_replace('/\\\\/','', $body); //Strip backslashes
		
		$mail->IsSMTP();                           // tell the class to use SMTP
		$mail->SMTPAuth   = false;                  // enable SMTP authentication
		//$mail->SMTPDebug = 1;
		//$mail->SMTPSecure = "ssl";
		//$mail->Port		  = "1025";                    // set the SMTP server port
		//$mail->Host       = "108.167.137.112"; // SMTP server
		$mail->Host       = "172.16.120.17";
		//$mail->Host       = "69.49.115.72";
		//$mail->Username   = "slazo@pautacreativa.com.mx";     // SMTP server username
		//$mail->Password   = "kordi4CONTA";            // SMTP server password
		
		//$mail->IsSendmail();  // tell the class to use Sendmail
		
		//$mail->AddReplyTo("$email",utf8_decode("$nombre"));
		
		$mail->From       = "slazo@pautacreativa.com.mx";
		$mail->FromName   = utf8_decode("Club Sauris");
		
		$mail->AddAddress($email);
		
		
		
		$mail->Subject  = "Reigstro Exitoso";
		
		$mail->AltBody    = "Para ver este mensaje por favor use un navegador web actual"; // optional, comment out and test
		$mail->WordWrap   = 80; // set word wrap
		
		$mail->MsgHTML($body);
		
		$mail->IsHTML(true); // send as HTML
		
		if($mail->Send()){
            $resultado['res'] = 'ok'; 
        }else{
            $resultado['res'] = 'error de envío'; 
        }
        
    } catch (phpmailerException $e) {
        //echo $e->errorMessage();
        //echo "Error en el envío, por favor intenta de nuevo.";
       
        $resultado['res'] = 'error de envío';
    }	


?>