<?php
include "../dbc.php";

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}


$json = $_POST['json'];
$arre = json_decode($json, true);

$id_reporte = utf8_decode(urldecode($arre['id_reporte']));
$id_usuario = utf8_decode(urldecode($arre['id_usuario']));
$modulo = utf8_decode(urldecode($arre['modulo']));
$descripcion = utf8_decode(urldecode($arre['descripcion']));

$id_centro = 0;
if($arre['id_centro']!="")
  $id_centro = $arre['id_centro'];

$distribuidor = '';
if($arre['id_distribuidor']!="")
  $distribuidor = $arre['id_distribuidor'];

$res = array();
if($modulo!="" &&
   $descripcion!=""){
  $res['res'] = 'ok';
  $query = "
  insert into notificaciones
  (id_reporte, id_usuario, id_centro, distribuidor, leida, modulo, descripcion)
  values
  ($id_reporte, $id_usuario, $id_centro, '$distribuidor', 0, '$modulo','$descripcion')
  ";

  $q = mysql_query($query) or die(mysql_error());

	$id_insert = mysql_insert_id();

  //Validamos si se registró la notificación para hacer el envío de correo
  if($id_insert>0){
    /*ENVÍO DE MAIL*/
    require '../phpmailer/class.phpmailer.php';
    require "../baseurl.php";

    $q = mysqli_query($con, "
    select centros.Nombre as NombreCentro, centros.Email, centros.Direccion, centros.Pais, reportes.Modelo, reportes.NoFactura, clientes.RazonSocial, clientes.Nombre as NombreCliente, clientes.APaterno, clientes.AMaterno, reportes.FechaStatusCambioFisico
    from reportes, centros, clientes
    where
    reportes.id = ".$arre["IDReporte"]." and
    reportes.IDCentro = centros.id and
    reportes.IDCliente = clientes.id
    ");
    $row = mysqli_fetch_array($q);
    array_walk_recursive($row,function(&$value) use ($current_charset){
      $value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
      //$value = utf8_encode($value);
    });
    //
    // while ($row = mysqli_fetch_array($q))
    // {
    // 	$current_charset = 'ISO-8859-15';//or what it is now
    // 	array_walk_recursive($row,function(&$value) use ($current_charset){
    // 		$value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
    // 		//$value = utf8_encode($value);
    // 	});
    //
    // }

    $nombrecentro = $row["NombreCentro"];
    $emailcentro = $row["Email"];
    //$nombrecliente = $row["NombreCliente"];
    setlocale(LC_TIME, 'es_ES');
    //$date=date_create($row["FechaStatusCambioFisico"]);
    //$fecha = date_format($date,"d").' de '.date_format($date,"F, Y");

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
                <img src='$baseurl/email/cambios/logo-hp.jpg' width='400'  border='0' alt='Household Solutions' style='display:block;' />
              </td>
              </tr>

              <tr>
              <td bgcolor='#FFFFFF' style='padding: 40px 40px 20px 40px;' align='center' valign='middle'>

                <h1 style='font-size: 30px;'><font color='#033F92'>NOTIFICACIÓN</font></h1>

              </td>
              <tr>
              </tr>
              <td bgcolor='#FFFFFF' style='padding: 0px 40px 0px 40px;' align='left' valign='middle'>
                <br><br>
                <font color='#00B4FF' face='arial, Verdana, Helvetica, sans-serif; ' style='font-family: arial, Verdana, Helvetica, sans-serif; font-size: 16px; line-height: 20px; color: #000;'>
                <p style='text-align: left;'>
                  <span style='color: black;'>" . $arre['descripcion'] . "</strong>.
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

            require "../email-conf.php";

            //$mail->AddAddress('slazo@pautacreativa.com.mx');
            $mail->AddAddress('jguillen@pautacreativa.com.mx');
            //$mail->AddBCC('lasoupedjour@gmail.com');

            $mail->Subject  = utf8_decode("Nueva notificación en HomeProducts");

            $mail->AltBody    = "Para ver este mensaje por favor use un navegador web actual"; // optional, comment out and test
            $mail->WordWrap   = 80; // set word wrap

            $mail->MsgHTML($body);

            $mail->IsHTML(true); // send as HTML

            if($mail->Send()){
                $res["mail"] = 'ok';
            }else{
                $res["mail"] = 'error';
            }


        } catch (phpmailerException $e) {
            $res["mail"] =  $e->errorMessage();
        }
  }
}else{
  $res['res'] = 'error';
  $res['error'] = 'Error en los datos.';
}

echo json_encode($res);
?>
