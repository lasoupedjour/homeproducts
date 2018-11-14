<?php
include "dbc.php";

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}


$json = $_POST['json'];
$arre = json_decode($json, true);

$InformacionCompleta = utf8_decode(urldecode($arre['informacionCompleta']));
$RazonRechazo = utf8_decode(urldecode($arre['razonRechazo']));
$Reclamo = utf8_decode(urldecode($arre['reclamo']));
$ProcesadoPor = utf8_decode(urldecode($arre['procesadoPor']));
$FechaResolucion = utf8_decode(urldecode($arre['fechaResolucion']));
$NoOrden = utf8_decode(urldecode($arre['NoOrden']));

$res = array();
if($InformacionCompleta!="" &&
   $RazonRechazo!="" &&
   $Reclamo!="" &&
   $ProcesadoPor!="" &&
   $FechaResolucion!="" &&
   $NoOrden!=""){
  $res['res'] = 'ok';
  $query = "
  insert into resolucion
  (id_reporte, info_completa, reclamo, razon_rechazo, procesado_por, fecha)
  values
  ($NoOrden,$InformacionCompleta,$Reclamo,'$RazonRechazo','$ProcesadoPor','$FechaResolucion')
  ";
  //echo($query);
  //die();
  //registrar usuario
  $q = mysql_query($query) or die(mysql_error());

  $id_participantes = mysql_insert_id();

  $pwd = genPassword($id_participantes, $Nombrepadre, $Nombrenino);

  $q = mysql_query("
  update reportes set
  status = 2
  where id = $NoOrden
  ") or die(mysql_error());
}else{
  $res['res'] = 'error';
  $res['error'] = 'Error en los datos.';
}


echo json_encode($res);
?>
