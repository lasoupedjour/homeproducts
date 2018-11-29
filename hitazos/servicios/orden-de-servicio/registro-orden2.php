<?php

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
        $valid_extensions = array("jpeg", "jpg", "png", "pdf");
        $temporary = explode(".", $_FILES[$field.$i]["name"]);
        $file_extension = end($temporary);
        if((($_FILES["hard_file"]["type"] == "image/png") || ($_FILES[$field.$i]["type"] == "image/jpg") || ($_FILES[$field.$i]["type"] == "image/jpeg") || ($_FILES[$field.$i]["type"] == "image/png") || ($_FILES[$field.$i]["type"] == "application/pdf")) && in_array($file_extension, $valid_extensions)){
          $sourcePath = $_FILES[$field.$i]['tmp_name'];
          $targetPath = "uploads-ordenes/".$fileName;
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

$update = $arre['Update'];
//subir adjuntos

if(!$update){
  $AdjuntosFacturasNotasCompra = Array();
  $AdjuntosFotosModeloSerie = Array();
  $AdjuntosFacturasRepuestos = Array();
  $AdjuntosOtros = Array();

  $AdjuntosFacturasNotasCompra = subirAdjuntos($arre['IDReporte'], 'AdjuntosFacturasNotasCompra', $arre['AdjuntosFacturasNotasCompraSize']);
  $AdjuntosFotosModeloSerie = subirAdjuntos($arre['IDReporte'], 'AdjuntosFotosModeloSerie', $arre['AdjuntosFotosModeloSerieSize']);
  $AdjuntosFacturasRepuestos = subirAdjuntos($arre['IDReporte'], 'AdjuntosFacturasRepuestos', $arre['AdjuntosFacturasRepuestosSize']);
  $AdjuntosOtros = subirAdjuntos($arre['IDReporte'], 'AdjuntosOtros', $arre['AdjuntosOtrosSize']);

  $query = "
  update reportes set
  HomeProductsGroupNo = ?,
  NoFactura = ?,
  FechaFactura = ?,
  NoParteCausoDano = ?,
  Resolucion = ?,
  TipoReparacion = ?,
  TipoMovilidad = ?,
  FechaOrdenServicio = now(),
  MontoRefacciones = ?,
  MontoReparacion = ?,
  MontoDespiece = ?,
  MontoReciclaje = ?,
  MontoOtro = ?,
  MontoOtroDescripcion = ?,
  MontoSubtotal = ?,
  MontoIVA = ?,
  MontoTotal = ?,
  AdjuntosFacturasNotasCompra = ?,
  AdjuntosFotosModeloSerie = ?,
  AdjuntosFacturasRepuestos = ?,
  AdjuntosOtros = ?,
  StatusReporte = 'Orden de Servicio',
  SubStatusReporte = ?,
  StatusCambioFisico = ''
  where id = ?
  ";
  $params = "sssssssdddddsdddsssssd";
}else{
  $query = "
  update reportes set
  HomeProductsGroupNo = ?,
  NoFactura = ?,
  FechaFactura = ?,
  NoParteCausoDano = ?,
  Resolucion = ?,
  TipoReparacion = ?,
  TipoMovilidad = ?,
  FechaOrdenServicio = now(),
  MontoRefacciones = ?,
  MontoReparacion = ?,
  MontoDespiece = ?,
  MontoReciclaje = ?,
  MontoOtro = ?,
  MontoOtroDescripcion = ?,
  MontoSubtotal = ?,
  MontoIVA = ?,
  MontoTotal = ?,
  StatusReporte = 'Orden de Servicio',
  SubStatusReporte = ?,
  StatusCambioFisico = ''
  where id = ?
  ";
  $params = "sssssssdddddsdddsd";
}


//actualizar
//determinar substatus reporte ABIERTO o Cerrado
$SubStatusReporte = "Cerrado";
if($arre['TipoReclamoDiagnostico']=='Cambio'){
  $SubStatusReporte = "Abierto";
}

$FechaFactura = urldecode($arre['FechaFactura']['year']).'-'.urldecode($arre['FechaFactura']['month']).'-'.urldecode($arre['FechaFactura']['day']);

if ($stmt = $mysqli->prepare($query)) {
  if(!$update){
    $stmt->bind_param($params,
  	$arre['HomeProductsGroupNo'],
  	$arre['NoFactura'],
  	$FechaFactura,
  	$arre['NoParteCausoDano'],
  	$arre['Resolucion'],
  	$arre['TipoReparacion'],
  	$arre['TipoMovilidad'],
  	$arre['MontoRefacciones'],
  	$arre['MontoReparacion'],
    $arre['MontoDespiece'],
    $arre['MontoReciclaje'],
    $arre['MontoOtro'],
    $arre['MontoOtroDescripcion'],
  	$arre['MontoSubtotal'],
  	$arre['MontoIVA'],
  	$arre['MontoTotal'],
  	json_encode($AdjuntosFacturasNotasCompra),
  	json_encode($AdjuntosFotosModeloSerie),
  	json_encode($AdjuntosFacturasRepuestos),
  	json_encode($AdjuntosOtros),
    $SubStatusReporte,
  	$arre['IDReporte']

  	);
  }else{
    $stmt->bind_param($params,
  	$arre['HomeProductsGroupNo'],
  	$arre['NoFactura'],
  	$FechaFactura,
  	$arre['NoParteCausoDano'],
  	$arre['Resolucion'],
  	$arre['TipoReparacion'],
  	$arre['TipoMovilidad'],
  	$arre['MontoRefacciones'],
  	$arre['MontoReparacion'],
    $arre['MontoDespiece'],
    $arre['MontoReciclaje'],
    $arre['MontoOtro'],
    $arre['MontoOtroDescripcion'],
  	$arre['MontoSubtotal'],
  	$arre['MontoIVA'],
  	$arre['MontoTotal'],
    $SubStatusReporte,
  	$arre['IDReporte']
  	);
  }

	if($stmt->execute()){

		$reporte = array();

		$query = "
		select * from reportes where id = ".$arre['IDReporte'].";
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


		$res['idreporte'] = $arre['IDReporte'];
		$res['objreporte'] = $reporte[0];

	}else{
		$res['res'] = 'error';
		$res['msg'] = $stmt->error;

	}
}

$stmt->close();
$mysqli->close();




echo json_encode($res);



?>
