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

$notificaciones = array();

$id_usuario = utf8_decode(urldecode($arre['id_usuario']));
if($id_usuario==17)
  $query = "SELECT *, DATE_FORMAT(timestamp,  '%d/%m/%Y %H:%i:%s' ) as timestampNF FROM notificaciones where id_usuario<>17 order by id desc;";
else{
  $query = "
            select n.*, DATE_FORMAT(n.timestamp,  '%d/%m/%Y %H:%i:%s' ) as timestampNF from
            (select * from notificaciones where id_usuario=17) as n
            join
            (select * from reportes) as r
            on n.id_reporte = r.id
            join
            (select * from usuarios_admin where ID=$id_usuario) as u
            on r.idcentro = u.idcentro
            group by id
            ";
}


if ($result = $mysqli->query($query)) {
	while ($row = $result->fetch_array()) {

		$current_charset = 'ISO-8859-15';//or what it is now
		array_walk_recursive($row,function(&$value) use ($current_charset){
			 //$value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
			$value = utf8_encode($value);
		});
		$temp = json_encode($row);
		array_push($notificaciones, $temp);
	}
	$result->close();
}else{
	print_r (mysqli_error());
}


//Marcamos las notificaciones como leídas
$mysqli->query("
update notificaciones set
leida = 1
where leida = 0
");

$res['notificaciones'] = $notificaciones;

echo json_encode($res);

$mysqli->close();

?>
