<?php
	
	if (isset($_SERVER['HTTP_ORIGIN'])) {
		header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

	
	require_once('dbc.php');

    foreach ($_POST as $key => $value)
        $data[$key] = trim($value);

$json = $data['json'];
$arre = json_decode($json, true);
$idestado = utf8_decode(urldecode($arre['IDEstado']));
$idmunicipio = utf8_decode(urldecode($arre['IDMunicipio']));
$idlocalidad = utf8_decode(urldecode($arre['IDLocalidad']));

    $query = "SELECT d_codigo FROM `sepomex` where c_estado = '$idestado' and c_mnpio = '$idmunicipio' and id_asenta_cpcons = '$idlocalidad'";

    $result = mysql_query($query) or die(mysql_error());
    while ($row = mysql_fetch_row($result)) {
		echo $row[0]; 
    }
    
	
    

	
?>
