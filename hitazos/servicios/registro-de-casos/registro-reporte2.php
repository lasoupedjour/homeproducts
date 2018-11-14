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
	

$res = array();



$res['res'] = 'ok';

$FechaCompra = urldecode($arre['FechaCompra']['year']).'-'.urldecode($arre['FechaCompra']['month']).'-'.urldecode($arre['FechaCompra']['day']);
$FechaRevision = urldecode($arre['FechaRevision']['year']).'-'.urldecode($arre['FechaRevision']['month']).'-'.urldecode($arre['FechaRevision']['day']);


//insertar
if ($stmt = $mysqli->prepare("
insert into reportes (IDCliente, TipoCaso, Categoria, Tipo, Modelo, CodigoSAP, FechaCompra, AplicaGarantia, Uso, LugarCompra, Falla, Comentarios, TipoRevision, FechaRevision, Descripcion, StatusReporte)
values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , 'Reporte')
")) {
	$stmt->bind_param("dssssssssssssss", 
	$arre['IDCliente'], 
	$arre['TipoCaso'], 
	$arre['Categoria'], 
	$arre['Tipo'], 
	$arre['Modelo'], 
	$arre['CodigoSAP'], 
	$FechaCompra,
	$arre['AplicaGarantia'],
	$arre['Uso'],
	$arre['LugarCompra'],
	$arre['Falla'],
	$arre['Comentarios'],
	$arre['TipoRevision'],
	$FechaRevision,
	$arre['Descripcion']
	
	);
	if($stmt->execute()){
		$res['idreporte'] = $stmt->insert_id;
		
		$reporte = array();
		
		
		
		//inserta refacciones en caso de existir
		$refaccionesbkp = $arre['Refacciones'];
		$refacciones = json_decode($arre['Refacciones']);
		
		//print_r($refacciones);
		foreach($refacciones as $refaccion){
			//print_r($refaccion);
			//echo $refaccion->FechaEntrega->year;
			$Fecha = '0000-00-00 00:00:00';
			if($refaccion->FechaEntrega->year != null){
				$Fecha = $refaccion->FechaEntrega->year.'-'.$refaccion->FechaEntrega->month.'-'.$refaccion->FechaEntrega->day;
			}
			//echo $Fecha;
			if ($stmt = $mysqli->prepare("
			insert into refacciones (IDReporte, Proveedor, Nota, NombreRefaccion, Cantidad, CostoUnitario, CostoTotal, FechaEntrega, FechaRegistro, StatusRefaccion)
			values (?,?,?,?,?,?,?,?,now(),?)
			")) {
				$stmt->bind_param("dssssssss", 
				$res['idreporte'],
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
		
		}
		
		
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
		$res['res'] = 'error';
		$res['msg'] = $stmt->error;
		
	}
}



echo json_encode($res);

$stmt->close();
$mysqli->close();








	
?>
