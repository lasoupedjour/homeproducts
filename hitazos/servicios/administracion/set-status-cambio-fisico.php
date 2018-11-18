<?php
	/*ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);*/
error_reporting(E_ALL);
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

include "../dbci.php";



$json = $_POST['json'];
$arre = json_decode($json, true);

$current_charset = 'ISO-8859-15';//or what it is now
array_walk_recursive($arre,function(&$value) use ($current_charset){
     $value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
});


$res = array();

$res['res'] = 'ok';


$q = mysqli_query($con, "
update reportes set
StatusCambioFisico = '".$arre["StatusCambioFisico"]."',
FechaStatusCambioFisico = now()
where id = ".$arre["IDReporte"]."
");


/**************/
if($arre["StatusCambioFisico"] == "Aprobado"){
/*ENVÍO DE MAIL*/
require '../phpmailer/class.phpmailer.php';
require "../baseurl.php";

$q = mysqli_query($con, "
select centros.Nombre as NombreCentro, centros.Direccion, centros.Pais, reportes.Modelo, reportes.NoFactura, clientes.RazonSocial, clientes.Nombre as NombreCliente, clientes.APaterno, clientes.AMaterno, reportes.FechaStatusCambioFisico
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

$nombrecliente = $row["RazonSocial"].''.$row["NombreCliente"].' '.$row["APaterno"].' '.$row["AMaterno"];
//$nombrecliente = $row["NombreCliente"];
setlocale(LC_TIME, 'es_ES');
//$date=date_create($row["FechaStatusCambioFisico"]);
//$fecha = date_format($date,"d").' de '.date_format($date,"F, Y");
$fecha = strftime('%d de %B, %Y', strtotime($row["FechaStatusCambioFisico"]));

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

        	  <h1 style='font-size: 30px;'><font color='#033F92'>AUTORIZACIÓN</font></h1>

        	</td>
          <tr>
          </tr>
        	<td bgcolor='#FFFFFF' style='padding: 0px 40px 0px 40px;' align='left' valign='middle'>
        	  <h2 style='font-size: 16px;'><font color='#000'>Atención:</font></h2>

        	  <br><br>
        	  <font color='#00B4FF' face='arial, Verdana, Helvetica, sans-serif; ' style='font-family: arial, Verdana, Helvetica, sans-serif; font-size: 16px; line-height: 20px; color: #000;'>
        		<p style='text-align: left;'>
        		  <span style='color: black;'>Por medio de la presente Autorizamos <strong>CAMBIO</strong>, por Validación de Garantía con Orden de Servicio No. ".$arre["IDReporte"].", del centro de Servicio Autorizado ".$row["NombreCentro"].", Modelo ".$row["Modelo"].", según factura No. ".$row["NoFactura"].", a <strong>$nombrecliente</strong>.
        		</p>
        		<br>
        		<p style='text-align: left;'>
        		  ".$row["Direccion"].", ".$row["Pais"].", a ".$fecha.".
        		</p>
        		<br>
        		<p style='font-size: 16px;padding-top:20px;'><font color='#000'>Lic. Dulce María López. <br> Manager Servicio Postventa Latam.</font></p>
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

        $mail->AddAddress('slazo@pautacreativa.com.mx');
        //$mail->AddBCC('lasoupedjour@gmail.com');

        $mail->Subject  = utf8_decode("Autorización de Cambio Físico");

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



$q = mysqli_query($con, "
SELECT  reportes.*, clientes.Pais, clientes.RazonSocial, clientes.Nombre, clientes.APaterno, clientes.AMaterno, DATE_FORMAT(FechaRegistroReporte,  '%d/%m/%Y %H:%i:%s' ) as FechaRegistroReporteNF, DATE_FORMAT(FechaCompra,  '%d/%m/%Y %H:%i:%s' ) as FechaCompraNF
FROM reportes, clientes
where clientes.id = reportes.IDCliente
and StatusReporte = 'Orden de Servicio'
and TipoReclamoDiagnostico = 'Cambio'
order by FechaRegistroReporte desc LIMIT 5;
");




$reportes = array();

while ($row = mysqli_fetch_array($q))
{
	$current_charset = 'ISO-8859-15';//or what it is now
	array_walk_recursive($row,function(&$value) use ($current_charset){
		 //$value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
		$value = utf8_encode($value);
	});
	$temp = json_encode($row);
	array_push($reportes, $temp);
	/*if($agregar){
		//print_r($statuscotizacion);
		$temp = json_encode($row);
		array_push($reportes, $temp);
	}
	*/
}
$res['reportes'] = $reportes;

echo json_encode($res);








?>
