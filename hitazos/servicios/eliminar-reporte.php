<?php
/*
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
*/
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

include "dbci.php";

$json = $_POST['json'];
$arre = json_decode($json, true);

$current_charset = 'ISO-8859-15';//or what it is now
array_walk_recursive($arre,function(&$value) use ($current_charset){
     $value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
});

$res = array();
$res['res'] = 'ok';
$reporte = array();
//insertar
if ($stmt = $mysqli->prepare("
update reportes set
SubStatusReporte = 'Eliminado',
Status = 0
where id = ?

")) {
	$stmt->bind_param("d",
	 $arre['IDReporte']
	);
	if($stmt->execute()){

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

		$res['objreporte'] = $reporte[0];
    $res['res'] = "ok";
    $res['msg'] = "Reporte eliminado correctamente.";
  }else{
		$res['res'] = 'error';
		$res['msg'] = $stmt->error;
	}
}

echo json_encode($res);

$stmt->close();
$mysqli->close();
?>
