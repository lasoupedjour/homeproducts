<?php
// error_reporting(E_ALL);
// ini_set('display_errors', 1);
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


//subir adjuntos


$AdjuntosReciclaje = Array();


$AdjuntosReciclaje = subirAdjuntos($arre['IDReporte'], 'AdjuntosReciclaje', $arre['AdjuntosReciclajeSize']);

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

//actualizar
/*Obtenemos el estatus del costolanded*/
$query = "
select StatusCostoLanded from reportes Where id='" . $arre['IDReporte'] . "';
";

if ($result = $mysqli->query($query)) {
  while ($row = $result->fetch_array()) {
    $StatusCostoLanded = $row["StatusCostoLanded"];
  }
}
if($StatusCostoLanded==""){
  $query = "
            update reportes set
            MontoDespiece = ?,
            MontoReciclaje = ?,
            MontoOtro = ?,
            MontoOtroDescripcion = ?,
            MontoSubtotal = ?,
            MontoIVA = ?,
            MontoTotal = ?,
            AdjuntosReciclaje = ?,
            FechaAdjuntosCambioFisico = now()
            where id = ?
            ";
}else{
  $query = "
            update reportes set
            MontoDespiece = ?,
            MontoReciclaje = ?,
            MontoOtro = ?,
            MontoOtroDescripcion = ?,
            MontoSubtotal = ?,
            MontoIVA = ?,
            MontoTotal = ?,
            AdjuntosReciclaje = ?,
            SubStatusReporte = 'Cerrado',
            FechaAdjuntosCambioFisico = now()
            where id = ?
            ";
}

if ($stmt = $mysqli->prepare($query)) {
  $stmt->bind_param("dddsdddsd",
  $arre['MontoDespiece'],
  $arre['MontoReciclaje'],
  $arre['MontoOtro'],
  $arre['MontoOtroDescripcion'],
  $arre['MontoSubtotal'],
  $arre['MontoIVA'],
  $arre['MontoTotal'],
  json_encode($AdjuntosReciclaje),
  $arre['IDReporte']
  );
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

$mysqli->close();




echo json_encode($res);



?>
