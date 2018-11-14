<?php
include "../dbc.php";

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}


$json = $_POST['json'];
$arre = json_decode($json, true);

$id_reporte = utf8_decode(urldecode($arre['id_reporte']));
$id_usuario = utf8_decode(urldecode($arre['id_usuario']));
$modulo = utf8_decode(urldecode($arre['modulo']));
$descripcion = utf8_decode(urldecode($arre['descripcion']));

$res = array();
if($modulo!="" &&
   $descripcion!=""){
  $res['res'] = 'ok';
  $query = "
  insert into notificaciones
  (id_reporte, id_usuario, modulo, descripcion)
  values
  ($id_reporte, $id_usuario,'$modulo','$descripcion')
  ";

  $q = mysql_query($query) or die(mysql_error());

	$id_insert = mysql_insert_id();

}else{
  $res['res'] = 'error';
  $res['error'] = 'Error en los datos.';
}

echo json_encode($res);
?>
