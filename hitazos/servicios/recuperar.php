<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

include "dbci.php";

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

$json = $_POST['json'];
$arre = json_decode($json, true);

$email = urldecode($arre['email']);

$res = array();

if ($stmt = $mysqli->prepare("select max(id) from usuarios_admin where email=? and status = 1")) {///1
  $stmt->bind_param("s", $email );


  $stmt->execute();

  $stmt->store_result();

  $num = $stmt->num_rows;

  //Si el código indicado no existe se devuelve un error
  if($num == 0){///2
    $res['res'] = 'error1';
  }else if($num > 0){///elseif 2
    $rand = rand(100000,999999);
  	$encodeemail = urlencode($email);
    $link = "http://apps.pautacreativatemporales.com.mx/oster/homeproducts/reestablecer-contrasena/?e=$encodeemail&c=$rand";

    if ($stmt = $mysqli->prepare("update usuarios_admin set codigo = ? where email = ?")) {///3
    	$stmt->bind_param("ss",
                      	$rand,
                      	$arre['email']
    	                 );

  	  if($stmt->execute()){///4
        /*ENVÍO DE MAIL*/
        require 'phpmailer/class.phpmailer.php';
        require "baseurl.php";

        $emailcentro = $email;
        $imagenHeader = "logo-hp.jpg";

        setlocale(LC_TIME, 'es_ES');

        try {
            $mail = new PHPMailer(true); //New instance, with exceptions enabled

            //$body             = file_get_contents('contents.html');
            $body = "

            <!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>
            <html xmlns='http://www.w3.org/1999/xhtml'>
            <head>
            <title>Autorización de Cambio Físico</title>
            <meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
            <style type='text/css'>
            * {
              margin: 0;
              padding: 0;
            }
            td {
              font-family: arial, Verdana, Helvetica, sans-serif;
              font-size: 14px;
              color: #033F92;
            }
            @media screen and (max-width: 767px) {
              .fullimage {
              width: 100% !important;
              height: auto !important;
              }
              .breacktable {
              width: 100% !important;
              }
              .breacktd {
              display: block;
              width: 100% !important;
              }
              h1 {font-size: 25px !important;}
            }
            </style>
            </head>
            <body bgcolor='#FFFFFF'>
            <table align='center' border='0' cellpadding='0' cellspacing='0' width='100%' style=''>
              <tr>
              <td align='center' style='text-align: center'>

            <table align='center' border='0' cellpadding='0' cellspacing='0' width='600' style='border: 1px solid #DDDDDD; border-collapse: collapse; padding: 0px; width: 600px; margin: 0 auto; background-color: #ffffff;' class='breacktable'>
              <tr>
              <td bgcolor='#fff' align='left' valign='middle' height='130'>
                <img src='$baseurl/email/cambios/$imagenHeader' width='400'  border='0' alt='Household Solutions' style='display:block;' />
              </td>
              </tr>

              <tr>
              <tr>
              </tr>
              <td bgcolor='#FFFFFF' style='padding: 0px 40px 0px 40px;' align='left' valign='middle'>
                <br><br>
                <font color='#00B4FF' face='arial, Verdana, Helvetica, sans-serif; ' style='font-family: arial, Verdana, Helvetica, sans-serif; font-size: 16px; line-height: 20px; color: #000;'>
                <p style='text-align: left;'>
                  <span style='color: black;'>¡Hola!<br /><br />
                                              ¿Solicitaste un restablecimiento de contraseña?<br /><br />
                                              <b>Haz clic en el siguiente botón:</b><br /><br />
                                              <a href='$link'>Reestablecer contraseña</a>
                </p>
                <br>
                <br>
                </font>
                <br><br><br>
                <table align='center' border='0' cellpadding='0' cellspacing='0' width='520'>
                <tr>
                  <td align='center' height='50' valign='middle'  style='color: white;margin:0 auto;padding-bottom:15px;'>
                  <img src='$baseurl/email/cambios/footer-licensee.jpg' width='350'  border='0' alt='Official licensee in Latin America'  />
                  </td>
                </tr>
                </table>

                <br><br>

              </td>
              </tr>
            </table>
            <br><br>

              </td>
              </tr>
            </table>
            </body>
            </html>


            ";

            $body             = utf8_decode(preg_replace('/\\\\/','', $body)); //Strip backslashes

            require "email-conf.php";

            $mail->AddAddress($email);
            $mail->AddBCC('jguillen@pautacreativa.com.mx');
            $mail->AddBCC('nguzman@pautacreativa.com.mx');
            //$mail->AddBCC('lasoupedjour@gmail.com');

            $mail->Subject  = utf8_decode("Recuperación de contraseña en HomeProducts");

            $mail->AltBody    = "Para ver este mensaje por favor use un navegador web actual"; // optional, comment out and test
            $mail->WordWrap   = 80; // set word wrap

            $mail->MsgHTML($body);

            $mail->IsHTML(true); // send as HTML

            if($mail->Send()){///6
                $res["res"] = 'ok';
            }else{///else 6
                $res["res"] = 'error';
            }///end 6
          } catch (phpmailerException $e) {
            $res["res"] =  $e->errorMessage();
          }
  	 }else{//else 5
  	    $res['res'] = 'error2';
  		    $res['msg'] = $stmt->error;
  	 }///end 5
  }else{///else 4
    $res['res'] = 'error3';
    $res['msg'] = 'error prepare';

  }///end 4
}else{///else 3
  $res['res'] = 'error4';
  $res['msg'] = 'error prepare';

}///end 3
}else{///else 1
  $res['res'] = 'error5';
  $res['msg'] = 'error prepare';

}///end 1


echo json_encode($res);
?>
