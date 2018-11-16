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

//revisar si es update o nuevo

$StatusMovilidad = '';
if($arre['NecesitaAutorizacion'] == 1){
	$StatusMovilidad = 'En revisión';
}else if($arre['NecesitaAutorizacion'] == 0){
	$StatusMovilidad = 'Aprobada';
}

$IDOperadorCentro = 0;

if($arre['IDOperadorDistribuidor']==0)
  $IDOperadorCentro = $arre['IDUsuario'];

if(!$arre['Update']){
	//insertar
	if ($stmt = $mysqli->prepare("
	insert into reportes (IDCliente, IDCentro, IDOperadorDistribuidor, IDOperadorCentro, TipoCaso, Categoria, Subcategoria, Tipo, Modelo, CodigoSAP, FechaCompra, Sello, AplicaGarantia, Uso, Distribuidor, LugarCompra, Falla, FallaDescripcion, Comentarios, TipoRevision, IDTarifas, StatusMovilidad, MontoMovilizacion, FechaRevision, Descripcion, StatusReporte)
	values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Reporte')
	")) {
		$stmt->bind_param("ddddssssssssssssssssdsdss",
		$arre['IDCliente'],
		$arre['IDCentro'],
    $arre['IDOperadorDistribuidor'],
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
		$arre['Descripcion']

		);
		if($stmt->execute()){
			$res['idreporte'] = $stmt->insert_id;

			$reporte = array();


      //Se verifica si el registro lo realiza un distribuidores
      if(!$arre["IDDistribuidor"]==""){
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
			$res['res'] = 'errores';
			$res['msg'] = $stmt->error;

		}
	}

}else{
	//actualizar
	if ($stmt = $mysqli->prepare("

	update reportes set
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
	FechaRevision = ?,
	Descripcion = ?
	where id = ?

	")) {
		$stmt->bind_param("ssssssssssssssssdsssd",

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
