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

$usuario = urldecode($arre['usuario']);
$pwd = urldecode($arre['pwd']);

$res = array();

$q = mysql_query("
select usuarios_admin.id, usuarios_admin.IDCentro, centros.IDMaster, usuarios_admin.nombre, usuarios_admin.nivel, centros.Nombre as NombreCentro, centros.Red, centros.Categoria, centros.Pais, centros.Ciudad, centros.Direccion, centros.Telefono1, centros.Telefono2, centros.Telefono3, centros.Email, centros.Horarios, centros.Responsable, centros.TelefonoResponsable, centros.IDGrupoTarifa
from usuarios_admin, centros
where
usuario = '$usuario' and pwd = '$pwd'
and usuarios_admin.IDCentro = centros.id
and usuarios_admin.status = 1
and centros.status = 1
") or die(mysql_error());

$num = mysql_num_rows($q);

if($num == 0){
  //Si no es un usuario de la tabla usuarios_admin
  $q = mysql_query("
  select usuarios_distribuidores.id, usuarios_distribuidores.IDDistribuidor, usuarios_distribuidores.nombre, usuarios_distribuidores.nivel, distribuidores.Pais, distribuidores.IDDistribuidor as CustomerID
  from usuarios_distribuidores, distribuidores
  where
  usuario = '$usuario' and pwd = '$pwd'
  and usuarios_distribuidores.IDDistribuidor = distribuidores.id
  and usuarios_distribuidores.status = 1
  ") or die(mysql_error());

  $num = mysql_num_rows($q);

  if($num==0){//verificamos si es un distribuidor
    $res['res'] = 'error';
  }else{
    $res['res'] = 'ok';
    
  	list($id, $IDDistribuidor, $nombre, $nivel, $Pais, $CustomerID) = mysql_fetch_row($q);
  	$res['id'] = $id;
  	$res['IDDistribuidor'] = $IDDistribuidor;
  	$res['nombre'] = $nombre;
  	$res['nivel'] = $nivel;
  	$res['Pais'] = $Pais;
  	$res['CustomerID'] = $CustomerID;
  }
}else if($num > 0){
	$res['res'] = 'ok';
	list($id, $IDCentro, $IDMaster, $nombre, $nivel, $NombreCentro, $Red, $Categoria, $Pais, $Ciudad, $Direccion, $Telefono1, $Telefono2, $Telefono3, $Email, $Horarios, $Responsable, $TelefonoResponsable, $IDGrupoTarifa) = mysql_fetch_row($q);
	$res['id'] = $id;
	$res['IDCentro'] = $IDCentro;
  $res['IDMaster'] = $IDMaster;
	$res['nombre'] = $nombre;
	$res['nivel'] = $nivel;
	$res['NombreCentro'] = $NombreCentro;
	$res['Red'] = $Red;
	$res['Categoria'] = $Categoria;
	$res['Pais'] = $Pais;
	$res['Ciudad'] = $Ciudad;
	$res['Direccion'] = $Direccion;
	$res['Telefono1'] = $Telefono1;
	$res['Telefono2'] = $Telefono2;
	$res['Telefono3'] = $Telefono3;
	$res['Email'] = $Email;
	$res['Horarios'] = $Horarios;
	$res['Responsable'] = $Responsable;
	$res['TelefonoResponsable'] = $TelefonoResponsable;
	$res['IDGrupoTarifa'] = $IDGrupoTarifa;

}
$current_charset = 'ISO-8859-15';//or what it is now
array_walk_recursive($res,function(&$value) use ($current_charset){
	 //$value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
	$value = utf8_encode($value);
});



echo json_encode($res);





?>
