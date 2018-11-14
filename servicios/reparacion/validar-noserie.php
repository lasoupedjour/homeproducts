<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
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

$reporte = array();

$query = "
select id from reportes where NoSerie = ".$arre['NoSerie'].";
";

$id_reporte =  0;
if ($result = $mysqli->query($query)) {
	while ($row = $result->fetch_array()) {
	   $id_reporte =  $row["id"];
	}
	$result->close();
}else{
	print_r (mysqli_error());
}

if($id_reporte>0)
  $res['res'] = "error";

echo json_encode($res);

$mysqli->close();
?>
