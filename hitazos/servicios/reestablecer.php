<?php
/*
error_reporting(E_ALL);
ini_set('display_errors', 1);
*/
include "dbc.php";

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

$json = $_POST['json'];
$arre = json_decode($json, true);

$codigo = urldecode($arre['codigo']);
$pwd = urldecode($arre['pwd']);

$res = array();
/*
$q = mysql_query("
select usuarios_admin.id, usuarios_admin.IDCentro, centros.IDMaster, usuarios_admin.nombre, usuarios_admin.nivel, centros.Nombre as NombreCentro, centros.Red, centros.Categoria, centros.Pais, centros.Ciudad, centros.Direccion, centros.Telefono1, centros.Telefono2, centros.Telefono3, centros.Email, centros.Horarios, centros.Responsable, centros.TelefonoResponsable, centros.IDGrupoTarifa, centros.ModoDePago
from usuarios_admin, centros
where
usuario = '$usuario' and pwd = '$pwd'
and usuarios_admin.IDCentro = centros.id
and usuarios_admin.status = 1
and centros.status = 1
") or die(mysql_error());
*/

$q = mysql_query("
select id
from usuarios_admin
where
codigo = '$codigo'
and status = 1
") or die(mysql_error());
$num = mysql_num_rows($q);

//Si el código indicado no existe se devuelve un error
if($num == 0){
  $res['res'] = 'error';
}else if($num > 0){

  $q = mysql_query("
  update usuarios_admin set
  pwd = '$pwd'
  where id = $num
  ") or die(mysql_error());

  $res['res'] = 'ok';
}
$current_charset = 'ISO-8859-15';//or what it is now
array_walk_recursive($res,function(&$value) use ($current_charset){
	 //$value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
	$value = utf8_encode($value);
});



echo json_encode($res);





?>
