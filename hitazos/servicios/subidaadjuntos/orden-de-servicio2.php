<?php
include "dbc.php";

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

$json = $_POST['json'];
$arre = json_decode($json, true);

$current_charset = 'ISO-8859-15';//or what it is now
array_walk_recursive($arre,function(&$value) use ($current_charset){
     $value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
});




$res = array();

$res['res'] = 'ok';

subirAdjuntos($arre['IDReporte'], 'AdjuntosFacturasNotasCompra', $arre['AdjuntosFacturasNotasCompraSize']);
subirAdjuntos($arre['IDReporte'], 'AdjuntosFotosModeloSerie', $arre['AdjuntosFotosModeloSerieSize']);
subirAdjuntos($arre['IDReporte'], 'AdjuntosFacturasRepuestos', $arre['AdjuntosFacturasRepuestosSize']);
subirAdjuntos($arre['IDReporte'], 'AdjuntosOtros', $arre['AdjuntosOtrosSize']);

function subirAdjuntos($idreporte, $field, $size){

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
					$targetPath = "uploads-tickets/".$fileName;
					if(move_uploaded_file($sourcePath,$targetPath)){
						$uploadedFile = $fileName;
					}
				}
			}
		}

	}

}



//echo "bien subido: ".$uploadedFile;

	//$res['res'] = $arre['IDReporte'];

	echo $arre['IDReporte'];
?>
