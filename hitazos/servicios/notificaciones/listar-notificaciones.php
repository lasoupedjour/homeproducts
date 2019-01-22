<?php
include "../dbci.php";

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

$current_charset = 'ISO-8859-15';//or what it is now
array_walk_recursive($arre,function(&$value) use ($current_charset){
     $value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
});

$res = array();

$res['res'] = 'ok';

$json = $_POST['json'];
$arre = json_decode($json, true);

$notificaciones = array();

$id_usuario = utf8_decode(urldecode($arre['id_usuario']));
$id_centro = utf8_decode(urldecode($arre['id_centro']));
$nivel= utf8_decode(urldecode($arre['nivel']));
$IDDistribuidor = utf8_decode(urldecode($arre['IDDistribuidor']));
$CustomerID = $arre['CustomerID'];

if($nivel=='administrador'){
  $query = "SELECT notificaciones.*, DATE_FORMAT(notificaciones.timestamp,  '%d/%m/%Y %H:%i:%s' ) as timestampNF FROM notificaciones,usuarios_admin where notificaciones.id_usuario=usuarios_admin.id and usuarios_admin.nivel <> 'administrador' order by notificaciones.id desc";
}else if($nivel=='operador'){
  $query = "
            select n.*, DATE_FORMAT(n.timestamp,  '%d/%m/%Y %H:%i:%s' ) as timestampNF from
            (select notificaciones.* from notificaciones) as n
            left join
            (select id from usuarios_admin where (nivel='administrador')) as ua
            on ua.id = n.id_usuario
            join
            (select id, idcentro from reportes) as r
            on n.id_reporte = r.id
            join
            (select idcentro from usuarios_admin where ID=$id_usuario) as u
            on r.idcentro = u.idcentro
            Where (id_usuario=$id_usuario or (modulo='/cambio-fisico-dist-asigna' and id_centro=$id_centro)) or r.IDCentro=$id_centro
            group by id
            order by id desc
            ";
}else if($nivel=='distribuidor'){
  $res['nivel'] = $IDDistribuidor;
  $id_usuario = $arre['id_usuario'];

  $query = "
            select n.*, DATE_FORMAT(n.timestamp,  '%d/%m/%Y %H:%i:%s' ) as timestampNF from
            (select notificaciones.* from notificaciones) as n
            join
            (select id from usuarios_admin) as ua
            on ua.id = n.id_usuario
            join
            (select id, Distribuidor, iddistribuidor from reportes) as r
            on n.id_reporte = r.id
            join
            (select IDDistribuidor from distribuidores where id=$IDDistribuidor) as d
            on r.Distribuidor = d.IDDistribuidor
            Where modulo not like '%cambio-fisico%' and modulo<>'/registro-caso-menaje-reparacion-a-centro'
            and modulo<>'/registro-caso-menaje-reparacion'
            and (descripcion not like '%Movilización del repot%')
            and (descripcion not like '%La movilización del report%')
            and r.IDDistribuidor=$id_usuario
            group by id
            order by id desc
            ";
}
/*
echo($query);
die();
*/
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
if($nivel=='administrador'){
  $query = "update notificaciones set
            leida = 1
            where leida = 0 and (id_centro=0 and distribuidor='')";
}else if($nivel=='operador'){
  $query = "update notificaciones set
            leida = 1
            where leida = 0 and id_usuario=$id_usuario";
}else if($nivel=='distribuidor'){
  $query = "update notificaciones set
            leida = 1
            where leida = 0 and (id_usuario=$id_usuario or distribuidor='$CustomerID'" ;
}

$mysqli->query($query);

$res['notificaciones'] = $notificaciones;

echo json_encode($res);

$mysqli->close();

?>
