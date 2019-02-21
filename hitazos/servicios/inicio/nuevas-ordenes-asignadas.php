<?php
include "../dbc.php";

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

$json = $_POST['json'];
$arre = json_decode($json, true);

$current_charset = 'ISO-8859-15';//or what it is now
array_walk_recursive($arre,function(&$value) use ($current_charset){
     $value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
});




$res = array();

$res['res'] = 'ok';

$query = "";
/*
if($arre["nivel"] != "MKT" && $arre["nivel"] != "administrador" ){
  if($arre["IDDistribuidor"]==0){

    $query = "
    SELECT  reportes.*, clientes.Pais, clientes.RazonSocial, clientes.Nombre, clientes.APaterno, clientes.AMaterno , DATE_FORMAT(FechaRegistroReporte,  '%d/%m/%Y %H:%i:%s' ) as FechaRegistroReporteNF, DATE_FORMAT(FechaCompra,  '%d/%m/%Y %H:%i:%s' ) as FechaCompraNF
    FROM reportes, clientes
    where clientes.id = reportes.IDCliente
    and reportes.IDCentro = ".$arre["IDCentro"]."
    and StatusReporte <> 'Orden de Servicio'
    :filtroCds
    order by FechaRegistroReporte desc LIMIT 5;
    ";
  }else{
    $query = "
  	SELECT  reportes.*, clientes.Pais, clientes.RazonSocial, clientes.Nombre, clientes.APaterno, clientes.AMaterno , DATE_FORMAT(FechaRegistroReporte,  '%d/%m/%Y %H:%i:%s' ) as FechaRegistroReporteNF, DATE_FORMAT(FechaCompra,  '%d/%m/%Y %H:%i:%s' ) as FechaCompraNF
  	FROM reportes, clientes
  	where clientes.id = reportes.IDCliente
  	and (reportes.IDOperadorDistribuidor = ".$arre["IDDistribuidor"]." or reportes.IDDistribuidor = ".$arre["IDDistribuidor"].")
  	and StatusReporte <> 'Orden de Servicio'
    :filtroCds
  	order by FechaRegistroReporte desc LIMIT 5;
  	";
  }
}else{
	$query = "
	SELECT  reportes.*, clientes.Pais, clientes.RazonSocial, clientes.Nombre, clientes.APaterno, clientes.AMaterno, DATE_FORMAT(FechaRegistroReporte,  '%d/%m/%Y %H:%i:%s' ) as FechaRegistroReporteNF
	FROM reportes, clientes
	where clientes.id = reportes.IDCliente
	and StatusReporte <> 'Orden de Servicio'
  :filtroCds
	order by FechaRegistroReporte desc LIMIT 5;
	";
}
*/
if($arre["nivel"] != "MKT" && $arre["nivel"] != "administrador" ){
  if($arre["IDDistribuidor"]>0){ //Si es un distribuidor
    $query = "
    select reportes.*, clientes.Pais, clientes.RazonSocial, clientes.Nombre, clientes.APaterno, clientes.AMaterno , DATE_FORMAT(FechaRegistroReporte,  '%d/%m/%Y %H:%i:%s' ) as FechaRegistroReporteNF, DATE_FORMAT(FechaCompra,  '%d/%m/%Y %H:%i:%s' ) as FechaCompraNF from
    (select * from reportes) as reportes
    join
    (select * from clientes) as clientes
    on reportes.IDCliente = clientes.id
    Where (StatusReporte <> 'Orden de Servicio' and StatusReporte <> 'Cerrado')
    and (reportes.IDOperadorDistribuidor = ".$arre["IDDistribuidor"]." or reportes.IDDistribuidor = ".$arre["IDDistribuidor"].")
    order by FechaRegistroReporte desc LIMIT 5;
    ";
  }else{
    $query = "
    select reportes.*, clientes.Pais, clientes.RazonSocial, clientes.Nombre, clientes.APaterno, clientes.AMaterno , DATE_FORMAT(FechaRegistroReporte,  '%d/%m/%Y %H:%i:%s' ) as FechaRegistroReporteNF, DATE_FORMAT(FechaCompra,  '%d/%m/%Y %H:%i:%s' ) as FechaCompraNF from
    (select * from reportes) as reportes
    join
    (select * from clientes) as clientes
    on reportes.IDCliente = clientes.id
    Where (StatusReporte <> 'Orden de Servicio' and StatusReporte <> 'Cerrado')
    and reportes.IDCentro = ".$arre["IDCentro"]."
    order by FechaRegistroReporte desc LIMIT 5;
    ";
  }

  if($arre["nivel"] == "contactcenter"){
    $query = "
    select reportes.*, clientes.Pais, clientes.RazonSocial, clientes.Nombre, clientes.APaterno, clientes.AMaterno , DATE_FORMAT(FechaRegistroReporte,  '%d/%m/%Y %H:%i:%s' ) as FechaRegistroReporteNF, DATE_FORMAT(FechaCompra,  '%d/%m/%Y %H:%i:%s' ) as FechaCompraNF from
    (select * from reportes) as reportes
    join
    (select * from clientes) as clientes
    on reportes.IDCliente = clientes.id
    Where (StatusReporte <> 'Orden de Servicio' and StatusReporte <> 'Cerrado')
    and reportes.IDCentroAsigno = ".$arre["IDCentro"]."
    order by FechaRegistroReporte desc LIMIT 5;
    ";
  }
}else{
  $query = "
  select reportes.*, clientes.Pais, clientes.RazonSocial, clientes.Nombre, clientes.APaterno, clientes.AMaterno , DATE_FORMAT(FechaRegistroReporte,  '%d/%m/%Y %H:%i:%s' ) as FechaRegistroReporteNF, DATE_FORMAT(FechaCompra,  '%d/%m/%Y %H:%i:%s' ) as FechaCompraNF from
  (select * from reportes) as reportes
  join
  (select * from clientes) as clientes
  on reportes.IDCliente = clientes.id
  left join
  (select * from centros) as centros
  on reportes.IDCentro = centros.id
  Where (StatusReporte <> 'Orden de Servicio' and StatusReporte <> 'Cerrado')
  :filtroCds
  order by FechaRegistroReporte desc LIMIT 5;
  ";
}

if($arre["Cds"]!=""){
  $query = str_replace(":filtroCds", " and reportes.IDCentro=" . $arre["Cds"], $query);
}elseif($arre["Master"]!=""){
  $query = str_replace(":filtroCds", " and centros.IDMaster=" . $arre["Master"], $query);
}else{
  $query = str_replace(":filtroCds", "", $query);
}

$q = mysql_query($query) or die(mysql_error());

$reportes = array();

while ($row = mysql_fetch_array($q))
{
	$current_charset = 'ISO-8859-15';//or what it is now
	array_walk_recursive($row,function(&$value) use ($current_charset){
		 //$value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
		$value = utf8_encode($value);
	});
	$temp = json_encode($row);
	array_push($reportes, $temp);
}
$res['reportes'] = $reportes;

echo json_encode($res);





?>
