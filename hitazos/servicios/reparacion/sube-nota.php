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


//subir adjuntos


$AdjuntosNota = Array();


$nombrenota = subirAdjuntos($arre['IDReporte'], 'AdjuntosNota', 1);


function subirAdjuntos($idreporte, $field, $size){
	
	$arrebd = Array();
	
	for($i = 0; $i < $size; $i++){

		if(!empty($_FILES[$field]['name'])){
			$uploadedFile = '';
			if(!empty($_FILES[$field]["type"])){
				$fileName = $idreporte.'_'.time().'_'.$_FILES[$field]['name'];
				$valid_extensions = array("jpeg", "jpg", "png", "pdf");
				$temporary = explode(".", $_FILES[$field]["name"]);
				$file_extension = end($temporary);
				if((($_FILES["hard_file"]["type"] == "image/png") || ($_FILES[$field]["type"] == "image/jpg") || ($_FILES[$field]["type"] == "image/jpeg") || ($_FILES[$field]["type"] == "image/png") || ($_FILES[$field]["type"] == "application/pdf")) && in_array($file_extension, $valid_extensions)){
					$sourcePath = $_FILES[$field]['tmp_name'];
					$targetPath = "uploads-reparaciones/".$fileName;
					if(move_uploaded_file($sourcePath,$targetPath)){
						$uploadedFile = $fileName;
						array_push($arrebd, $uploadedFile);
					}
				}
			}
		}

	}
	
	return $fileName;
	
}

$res['nombrenota'] = $nombrenota;


echo json_encode($res);



?>