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

$resolucion = array();

$query = "select * from resolucion where id_reporte = '".$arre['IDReporte']."';";

if ($result = $mysqli->query($query)) {
	while ($row = $result->fetch_array()) {

		$current_charset = 'ISO-8859-15';//or what it is now
		array_walk_recursive($row,function(&$value) use ($current_charset){
			 //$value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
			$value = utf8_encode($value);
		});
		$temp = json_encode($row);
		array_push($resolucion, $temp);
	}
	$result->close();

	$res["resolucion"] = $resolucion;

}else{
	$res['res'] = 'ok';
	$res['error'] = mysqli_error();
}

$mysqli->close();


echo json_encode($res);











?>
