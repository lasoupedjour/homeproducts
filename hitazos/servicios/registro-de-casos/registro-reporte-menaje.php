<?php
/*
error_reporting(E_ALL);
ini_set('display_errors', 1);
*/

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

function subirAdjuntos($idreporte, $field, $size){

  $arrebd = Array();

  for($i = 0; $i < $size; $i++){
    if(!empty($_FILES[$field.$i]['name'])){
      $uploadedFile = '';
      if(!empty($_FILES[$field.$i]["type"])){
        $fileName = $idreporte.'_'.time().'_'.$_FILES[$field.$i]['name'];
        $valid_extensions = array("jpeg", "jpg", "png", "pdf", "mp4", "mov", "avi", "webm");
        $temporary = explode(".", $_FILES[$field.$i]["name"]);
        $file_extension = end($temporary);
        if((($_FILES["hard_file"]["type"] == "image/png") || ($_FILES[$field.$i]["type"] == "image/jpg") || ($_FILES[$field.$i]["type"] == "image/jpeg") || ($_FILES[$field.$i]["type"] == "image/png") ||
        ($_FILES[$field.$i]["type"] == "video/mp4") ||
        ($_FILES[$field.$i]["type"] == "video/mov") ||
        ($_FILES[$field.$i]["type"] == "video/avi") ||
        ($_FILES[$field.$i]["type"] == "video/webm") || ($_FILES[$field.$i]["type"] == "application/pdf")) && in_array($file_extension, $valid_extensions)){
          $sourcePath = $_FILES[$field.$i]['tmp_name'];
          $targetPath = "../orden-de-servicio/uploads-ordenes/".$fileName;
          if(move_uploaded_file($sourcePath,$targetPath)){
            $uploadedFile = $fileName;
            array_push($arrebd, $uploadedFile);
          }
        }
      }
    }

  }

  return $arrebd;

}

$res = array();



$res['res'] = 'ok';

$FechaCompra = urldecode($arre['FechaCompra']['year']).'-'.urldecode($arre['FechaCompra']['month']).'-'.urldecode($arre['FechaCompra']['day']);
$FechaRevision = urldecode($arre['FechaRevision']['year']).'-'.urldecode($arre['FechaRevision']['month']).'-'.urldecode($arre['FechaRevision']['day']);

if($arre['Sello'] == 'true'){
	$arre['Sello'] = 1;
}

$IDTarifas = $arre['TipoKilometraje'];
if($IDTarifas == ''){
	$IDTarifas = 0;
}
/*$StatusMovilidad = '';
if($IDTarifas != 0){
	$StatusMovilidad = 'En revisión';
}*/

$id_reporte = 0;
//revisar si es update o nuevo

$StatusMovilidad = '';
if($arre['NecesitaAutorizacion'] == 1){
	$StatusMovilidad = 'En revisión';
}else if($arre['NecesitaAutorizacion'] == 0){
	$StatusMovilidad = 'Aprobada';
}

$IDOperadorCentro = 0;
$IDCentro = 0;

$IDOperadorDistribuidor = 0;
$IDDistribuidor = 0;

if($arre['IDDistribuidor']==0){
  $IDCentro = $arre['IDCentro'];
  $IDOperadorCentro = $arre['IDUsuario'];
}else{//Si se trata de un distribuidor obtenemos el ID
  $IDCentro = $arre['IDCentro'];
  $query = "
  select id from distribuidores Where IDDistribuidor='" . $arre['Distribuidor'] . "';
  ";

  if ($result = $mysqli->query($query)) {
    while ($row = $result->fetch_array()) {
      $IDDistribuidor = $row["id"];
    }
  }

  $IDOperadorDistribuidor = $arre['IDDistribuidor'];
}

if(!$arre['Update']){
  //insertar
	if ($stmt = $mysqli->prepare("
	insert into reportes (IDCliente, IDCentro, IDDistribuidor, IDCentroAsigno, IDOperadorDistribuidor, IDOperadorCentro, TipoCaso, Categoria, Subcategoria, Tipo, Modelo, CodigoSAP, FechaCompra, Sello, AplicaGarantia, Uso, Distribuidor, LugarCompra, Falla, FallaDescripcion, Comentarios, TipoRevision, IDTarifas, StatusMovilidad, MontoMovilizacion, FechaRevision, Descripcion, StatusReporte, NoSerie, CondicionProductoDiagnostico, CostoLanded, OtroCostoDistribuidor)
	values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Reporte', ?, ?, ?, ?)
	")) {
		$stmt->bind_param("ddddddssssssssssssssssdsdssssss",
		$arre['IDCliente'],
		$IDCentro,
    $IDDistribuidor,
    $arre['IDCentroAsigno'],
    $IDOperadorDistribuidor,
    $IDOperadorCentro,
    $arre['TipoCaso'],
		$arre['Categoria'],
		$arre['Subcategoria'],
		$arre['Tipo'],
		$arre['Modelo'],
		$arre['CodigoSAP'],
		$FechaCompra,
		$arre['Sello'],
		$arre['AplicaGarantia'],
		$arre['Uso'],
		$arre['Distribuidor'],
		$arre['LugarCompra'],
		$arre['Falla'],
		$arre['FallaDescripcion'],
		$arre['Comentarios'],
		$arre['TipoRevision'],
		$IDTarifas,
		utf8_decode($StatusMovilidad),
		$arre['CostoKilometraje'],
		$FechaRevision,
		$arre['Descripcion'],
    $arre['NoSerie'],
    $arre['CondicionProductoDiagnostico'],
    $arre['CostoLanded'],
    $arre['OtroCostoDistribuidor']
		);

		if($stmt->execute()){
			$res['idreporte'] = $stmt->insert_id;
      $id_reporte = $stmt->insert_id;
			$reporte = array();

      //regresa el reporte como objeto

			$query = "
			select * from reportes where id = ".$res['idreporte'].";
			";

			if ($result = $mysqli->query($query)) {
				while ($row = $result->fetch_array()) {

					$current_charset = 'ISO-8859-15';//or what it is now
					array_walk_recursive($row,function(&$value) use ($current_charset){
						 //$value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
						$value = utf8_encode($value);
					});
					$temp = json_encode($row);
					array_push($reporte, $temp);
				}
				$result->close();


        /*Actualizamos los adjuntos*/
        $AdjuntosFacturasNotasCompra = Array();
        $AdjuntosFotosModeloSerie = Array();

        $AdjuntosFacturasNotasCompra = subirAdjuntos($id_reporte, 'AdjuntosFacturasNotasCompra', $arre['AdjuntosFacturasNotasCompraSize']);
        $AdjuntosFotosModeloSerie = subirAdjuntos($id_reporte, 'AdjuntosFotosModeloSerie', $arre['AdjuntosFotosModeloSerieSize']);
        /*
        $queryUpdate = "update clientes set
                        AdjuntosFacturasNotasCompra = '" . json_encode($AdjuntosFacturasNotasCompra) . "',
                        AdjuntoFotosProducto = '" . json_encode($AdjuntosFotosProducto) . "'
                        where id = $id_reporte
                        ";


        print_r($AdjuntosFacturasNotasCompra);
        echo("<br>");
        print_r($AdjuntosFotosProducto);
        die();
        */
        if ($stmt = $mysqli->prepare("
                                      update reportes set
                                      AdjuntosFacturasNotasCompra = ?,
                                      AdjuntosFotosModeloSerie = ?
                                      where id = ?
                                      ")) {
          $stmt->bind_param("ssd",
          json_encode($AdjuntosFacturasNotasCompra),
          json_encode($AdjuntosFotosModeloSerie),
          $id_reporte
          );

          $stmt->execute();
        }

        //Se verifica si el registro lo realiza un distribuidores
        if(!$arre["IDDistribuidor"]>0){
          //Actualzamos el registro del cliente para asignarlo al centro randsSeleccionado
          //siempre y cuando no esté asignado ya a otro centro
          if ($stmt = $mysqli->prepare("
                                        update clientes set
                                    		IDCentro = ?
                                    		where id = ? and IDCentro=0
                                    		")) {
      			$stmt->bind_param("dd",
      			$arre['IDCentro'],
      			$arre['IDCliente']
      			);

            $stmt->execute();
      		}
        }
			}else{
				print_r (mysqli_error());
			}
			//$refaccionestemp = array("Refacciones"=>$refaccionesbkp);
			//array_push($refaccionestemp, $refaccionesbkp);
			//$refaccionestemp['refacciones'] = $refaccionesbkp
			//print_r(json_encode($refaccionestemp));
			//array_push($reporte, json_encode($refaccionestemp));


			$res['objreporte'] = $reporte[0];
			$res['objrefacciones'] = $refaccionesbkp;

      if(utf8_encode($arre['TipoCaso'])=="Garantía"){
        /*ENVÍO DE MAIL*/
        require '../phpmailer/class.phpmailer.php';
        require "../baseurl.php";

        $q = mysqli_query($con, "
        select centros.Nombre as NombreCentro, centros.Email, centros.Direccion, centros.Pais, reportes.Modelo, reportes.NoFactura, clientes.RazonSocial, clientes.Nombre as NombreCliente, clientes.APaterno, clientes.AMaterno, clientes.Email as EmailCliente, reportes.FechaStatusCambioFisico, reportes.Categoria
        from reportes, centros, clientes
        where
        reportes.id = ".$id_reporte." and
        reportes.IDCentro = centros.id and
        reportes.IDCliente = clientes.id
        ");
        $row = mysqli_fetch_array($q);
        array_walk_recursive($row,function(&$value) use ($current_charset){
          $value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
          //$value = utf8_encode($value);
        });

        $emailcentro = $row["Email"];
        //$emailcliente = $row["EmailCliente"];
        $emailcliente = "jguillen@pautacreativa.com.mx";
        $categoria = $row["Categoria"];
        $imagenHeader = "logo-hp.jpg";
        if($categoria!="LINEA BLANCA"){
          $imagenHeader = "logo-hpgroup.jpg";
        }
        $modelo = $row["Modelo"];

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
                    <span style='color: black;'>Estimado cliente, gracias por estar en contacto.<br /><br />
                                                Se ha registrado número de reporte <strong>" . $id_reporte . "</strong> para revisión del producto modelo <strong>" . $modelo . "</strong> que será atendido por el Centro de Servicio Autorizado.<br /><br />
                                                <a href='www.homeproductslatam.com.mx'>www.homeproductslatam.com.mx</a>.
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
              $mail->AddBCC('slazo@pautacreativa.com.mx');
              $mail->AddBCC('nguzman@pautacreativa.com.mx');
              //$mail->AddBCC('lasoupedjour@gmail.com');

              $mail->Subject  = utf8_decode("Caso registrado en HomeProducts");

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
			$res['res'] = 'errores';
			$res['msg'] = $stmt->error;

		}
	}

}else{
	//actualizar
	if ($stmt = $mysqli->prepare("

	update reportes set
  IDDistribuidor = ?,
	TipoCaso = ?,
	Categoria = ?,
	Subcategoria = ?,
	Tipo = ?,
	Modelo = ?,
	CodigoSAP = ?,
	FechaCompra = ?,
	Sello = ?,
	AplicaGarantia = ?,
	Uso = ?,
	Distribuidor = ?,
	LugarCompra = ?,
	Falla = ?,
	FallaDescripcion = ?,
	Comentarios = ?,
	TipoRevision = ?,
	IDTarifas = ?,
	StatusMovilidad = ?,
  MontoMovilizacion = ?,
	FechaRevision = ?,
	Descripcion = ?
	where id = ?

	")) {
		$stmt->bind_param("dssssssssssssssssdsdssd",

		$IDDistribuidor,
    $arre['TipoCaso'],
		$arre['Categoria'],
		$arre['Subcategoria'],
		$arre['Tipo'],
		$arre['Modelo'],
		$arre['CodigoSAP'],
		$FechaCompra,
		$arre['Sello'],
		$arre['AplicaGarantia'],
		$arre['Uso'],
		$arre['Distribuidor'],
		$arre['LugarCompra'],
		$arre['Falla'],
		$arre['FallaDescripcion'],
		$arre['Comentarios'],
		$arre['TipoRevision'],
		$IDTarifas,
		utf8_decode($StatusMovilidad),
    $arre['CostoKilometraje'],
		$FechaRevision,
		$arre['Descripcion'],
		$arre['IDReporte']
		);
		if($stmt->execute()){

			$res['idreporte'] = $arre['IDReporte'];
			$reporte = array();

			//inserta refacciones en caso de existir
			$refaccionesbkp = $arre['Refacciones'];
			$refacciones = json_decode($arre['Refacciones']);

			//print_r($refacciones);
			/*foreach($refacciones as $refaccion){
				//print_r($refaccion);
				//echo $refaccion->FechaEntrega->year;
				$Fecha = '0000-00-00 00:00:00';
				if($refaccion->FechaEntrega->year != null){
					$Fecha = $refaccion->FechaEntrega->year.'-'.$refaccion->FechaEntrega->month.'-'.$refaccion->FechaEntrega->day;
				}
				//echo $Fecha;
				if ($stmt = $mysqli->prepare("

				update refacciones

				insert into refacciones (IDReporte, Proveedor, Nota, NombreRefaccion, Cantidad, CostoUnitario, CostoTotal, FechaEntrega, FechaRegistro, StatusRefaccion)
				values (?,?,?,?,?,?,?,?,now(),?)
				")) {
					$stmt->bind_param("dssssssss",
					$arre['IDReporte'],
					$refaccion->Proveedor,
					$refaccion->Nota,
					$refaccion->NombreRefaccion,
					$refaccion->Cantidad,
					$refaccion->CostoUnitario,
					$refaccion->CostoTotal,
					$Fecha,
					$refaccion->StatusCotizacion
					);
					if($stmt->execute()){
						//echo 'exec';
					}else{
						echo $stmt->error;
					}

				}else{
					$res['res'] = 'error';
					$res['msg'] = $stmt->error;
					echo $stmt->error;
				}

			}*/


			//regresa el reporte como objeto

			$query = "
			select reportes.*, tarifas.SubtipoServicio, tarifas.Valor
			from reportes
			LEFT JOIN tarifas on IDTarifas = tarifas.id
			where reportes.id = ".$arre['IDReporte'].";
			";

			if ($result = $mysqli->query($query)) {
				while ($row = $result->fetch_array()) {

					$current_charset = 'ISO-8859-15';//or what it is now
					array_walk_recursive($row,function(&$value) use ($current_charset){
						 //$value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
						$value = utf8_encode($value);
					});
					$temp = json_encode($row);
					array_push($reporte, $temp);
				}
				$result->close();
			}else{
				print_r (mysqli_error());
			}
			//$refaccionestemp = array("Refacciones"=>$refaccionesbkp);
			//array_push($refaccionestemp, $refaccionesbkp);
			//$refaccionestemp['refacciones'] = $refaccionesbkp
			//print_r(json_encode($refaccionestemp));
			//array_push($reporte, json_encode($refaccionestemp));


			$res['objreporte'] = $reporte[0];
			$res['objrefacciones'] = $refaccionesbkp;


		}else{
			$res['res'] = 'errores2';
			$res['msg'] = $stmt->error;

		}
	}

}



echo json_encode($res);


$mysqli->close();









?>
