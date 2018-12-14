<?php
/*
error_reporting(E_ALL);
ini_set('display_errors', 1);
*/
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

$cds = $arre['cds'];
$ano = $arre['ano'];
$mes = $arre['mes'];
$categoria = $arre['categoria'];
$CustomerID = $arre['CustomerID'];
$Nombre = $arre['Nombre'];
$IDCentro = $arre['IDCentro'];
$IDDistribuidor = $arre['IDDistribuidor'];
$IDMaster = $arre['IDMaster'];
$IDDistribuidor = $arre['IDDistribuidor'];
/*
$mesnext =
if($mes)*/

$fechaIni = $ano.'-'.$mes.'-'.'01';
$fechaFin = $ano.'-'.$mes.'-'.'31';

/*
Query original sin nombre de centro y master
SELECT  reportes.*, clientes.Pais, clientes.RazonSocial, clientes.Nombre, clientes.APaterno, clientes.AMaterno
FROM reportes, clientes
where clientes.id = reportes.IDCliente and
StatusReporte = 'Orden de Servicio'
:filtros
order by FechaOrdenServicio desc;
*/
//Obtenemos el monto de refacciones

$queryMontos = "
            Select DISTINCT
            MontoRefacciones as MontoRefacciones,
            MontoReparacion as MontoReparacion,
            MontoMovilizacion as MontoMovilizacion,
            MontoDespiece as MontoDespiece,
            MontoReciclaje as MontoReciclaje,
            MontoOtro as MontoOtro,
            CostoLanded as CostoLanded,
            StatusReporte, FechaOrdenServicio, reportes.IDCentro, reportes.Categoria, reportes.Distribuidor, reportes.id
            from
            (select * from reportes) as reportes
            join
            (select * from clientes) as clientes
            on reportes.idcliente = clientes.id
            join
            (select * from centros) as centros
            on centros.id = reportes.idCentro
            join
            (select * from tarifas) as tarifas
            on centros.idGrupotarifa = tarifas.idGrupoTarifa
            left join
            (select * from centros where IDMaster=$IDMaster) as centros1
            on centros.idMaster = centros1.id
            where clientes.id = reportes.IDCliente and
            StatusReporte = 'Orden de Servicio'
            :filtros;
          ";

$queryFee = "
            select TarifaMensual, ImpuestoTarifaMensual,
            StatusReporte, FechaOrdenServicio, reportes.IDCentro, reportes.Categoria, reportes.Distribuidor from
            (select idcentro, StatusReporte, FechaOrdenServicio, Categoria, Distribuidor from reportes) as reportes
            join
            (select id, idgrupotarifa from centros where IDMaster=$IDMaster) as c
            on reportes.idcentro = c.id
            join
            (select * from tarifas) as t
            on c.idgrupotarifa = t.idgrupotarifa
            where StatusReporte = 'Orden de Servicio'
            :filtros
            GROUP by TarifaMensual, ImpuestoTarifaMensual
          ";

$filtroFecha  = "";
$filtroCds    = "";
$filtroCat    = "";
$filtroDist   = "";

if ($CustomerID!="" || $Nombre!=""){
  $filtroDist = " and (reportes.Distribuidor='$CustomerID' or reportes.Distribuidor='$Nombre')";
}

if ($categoria!=""){
  $filtroCat = " and reportes.Categoria='$categoria'";
}
/*
if ($cds!=""){
  $filtroCds = " and reportes.IDCentro=$cds";
}
*/
if($mes!=0 && $ano!=0){
  $filtroFecha = " and (FechaOrdenServicio >= '$fechaIni' and FechaOrdenServicio <= '$fechaFin')";
}

if($filtroDist==""){
  if($filtroCds!="" && $filtroFecha!="" && $filtroCat!=""){
    $queryMontos = str_replace(":filtros", $filtroCat . $filtroCds . $filtroFecha, $queryMontos);
    $queryFee = str_replace(":filtros", $filtroCat . $filtroCds . $filtroFecha, $queryFee);
  }elseif($filtroCds!="" && $filtroFecha=="" && $filtroCat!=""){
    $queryMontos = str_replace(":filtros", $filtroCat . $filtroCds, $queryMontos);
    $queryFee = str_replace(":filtros", $filtroCat . $filtroCds, $queryFee);
  }elseif($filtroCds=="" && $filtroFecha!="" && $filtroCat!=""){
    $queryMontos = str_replace(":filtros", $filtroCat . $filtroFecha, $queryMontos);
    $queryFee = str_replace(":filtros", $filtroCat . $filtroFecha, $queryFee);
  }elseif($filtroCds!="" && $filtroFecha=="" && $filtroCat==""){
    $queryMontos = str_replace(":filtros", $filtroCds, $queryMontos);
    $queryFee = str_replace(":filtros", $filtroCds, $queryFee);
  }elseif($filtroCds=="" && $filtroFecha!="" && $filtroCat==""){
    $queryMontos = str_replace(":filtros", $filtroFecha, $queryMontos);
    $queryFee = str_replace(":filtros", $filtroFecha, $queryFee);
  }elseif($filtroCds=="" && $filtroFecha=="" && $filtroCat!=""){
    $queryMontos = str_replace(":filtros", $filtroCat, $queryMontos);
    $queryFee = str_replace(":filtros", $filtroCat, $queryFee);
  }elseif($filtroCds!="" && $filtroFecha!="" && $filtroCat==""){
    $queryMontos = str_replace(":filtros", $filtroCds . $filtroFecha, $queryMontos);
    $queryFee = str_replace(":filtros", $filtroCds . $filtroFecha, $queryFee);
  }else{
    $queryMontos = str_replace(":filtros", "", $queryMontos);
    $queryFee = str_replace(":filtros", "", $queryFee);
  }
}else{
  if($filtroDist!="" && $filtroFecha!="" && $filtroCat!=""){
    $queryMontos = str_replace(":filtros", $filtroCat . $filtroDist . $filtroFecha, $queryMontos);
    $queryFee = str_replace(":filtros", $filtroCat . $filtroDist . $filtroFecha, $queryFee);
  }elseif($filtroDist!="" && $filtroFecha=="" && $filtroCat!=""){
    $queryMontos = str_replace(":filtros", $filtroCat . $filtroDist, $queryMontos);
    $queryFee = str_replace(":filtros", $filtroCat . $filtroDist, $queryFee);
  }elseif($filtroDist=="" && $filtroFecha!="" && $filtroCat!=""){
    $queryMontos = str_replace(":filtros", $filtroCat . $filtroFecha, $queryMontos);
    $queryFee = str_replace(":filtros", $filtroCat . $filtroFecha, $queryFee);
  }elseif($filtroCds!="" && $filtroFecha=="" && $filtroCat==""){
    $queryMontos = str_replace(":filtros", $filtroCds, $queryMontos);
    $queryFee = str_replace(":filtros", $filtroCds, $queryFee);
  }elseif($filtroCds=="" && $filtroFecha!="" && $filtroCat==""){
    $queryMontos = str_replace(":filtros", $filtroFecha, $queryMontos);
    $queryFee = str_replace(":filtros", $filtroFecha, $queryFee);
  }elseif($filtroCds=="" && $filtroFecha=="" && $filtroCat!=""){
    $queryMontos = str_replace(":filtros", $filtroCat, $queryMontos);
    $queryFee = str_replace(":filtros", $filtroCat, $queryFee);
  }else{
    $queryMontos = str_replace(":filtros", "", $queryMontos);
    $queryFee = str_replace(":filtros", "", $queryFee);
  }
}

//echo($queryMontos);
//die();
/*
echo("Montos-> " . $queryMontos . "<br><br>");
echo("Montos-> " . $queryFee . "<br>");
die();
*/
$qMontos = mysql_query($queryMontos) or die(mysql_error());
$qFee = mysql_query($queryFee) or die(mysql_error());

//echo($queryFee."<br><br>");
$MontoRefacciones = 0;
$MontoTAMov = 0;
$MontoFee = 0;
$MontoImpuestoFee = 0;
$MontoCambio = 0;
$MontoDespiece = 0;
$MontoReciclaje = 0;
$MontoOtro = 0;
$CostoLanded = 0;
$reportes = array();

while ($row = mysql_fetch_array($qMontos))
{
  $MontoRefacciones = $MontoRefacciones + floatval($row["MontoRefacciones"]);
	$MontoTAMov = $MontoTAMov+ (floatval($row["MontoReparacion"]) + floatval($row["MontoMovilizacion"]));
  $MontoDespiece = floatval($row["MontoDespiece"]);
  $MontoReciclaje = floatval($row["MontoReciclaje"]);
  $MontoOtro = floatval($row["MontoOtro"]);
  $CostoLanded = $CostoLanded + floatval($row["CostoLanded"]);
  if($IDCentro>0)
    $MontoCambio = $MontoCambio + ($MontoDespiece + $MontoReciclaje + $MontoOtro);
  else
    $MontoCambio = $MontoCambio + $CostoLanded;

  array_push($reportes, $row["id"]);
}

$TotalFee = 0;

while ($row = mysql_fetch_array($qFee))
{


  $MontoFee = $MontoFee + floatval($row["TarifaMensual"]);
	$MontoImpuestoFee = $MontoImpuestoFee + floatval($row["ImpuestoTarifaMensual"]);
  $ValorImpuesto = $MontoFee * $MontoImpuestoFee;
  $TotalFee = $TotalFee + ($MontoFee + $ValorImpuesto);
  $MontoFee = $MontoFee + floatval($row["TarifaMensual"]);

}

if($IDMaster>0){
  $queryPagos = "Select * from pagos where mes='" . $mes . "' and ano='" . $ano . "' and IDMaster=$IDMaster";
}elseif($IDDistribuidor>0){
  $queryPagos = "Select * from pagos where mes='" . $mes . "' and ano='" . $ano . "' and IDDistribuidor=$IDDistribuidor";
}else{
  $queryPagos = "Select * from pagos where mes='" . $mes . "' and ano='" . $ano . "'";
}
//echo("pagos>>>>> " . $queryPagos);
//die();
$pagos = array();
$qPagos = mysql_query($queryPagos) or die(mysql_error());

while ($row = mysql_fetch_array($qPagos))
{
  $pagos["id"] = $row["id"];
  $pagos["StatusPago"] = $row["StatusPago"];
  $pagos["Comprobante"] = $row["Comprobante"];
  $pagos["FechaRegistro"] = $row["FechaRegistro"];
  $pagos["Status"] = $row["Status"];
}

if($IDDistribuidor==0)
  $MontoTotal = $MontoRefacciones + $MontoTAMov + $TotalFee + $MontoCambio;
else
  $MontoTotal = $MontoCambio;

$res = array();
$res['MontoRefacciones'] = $MontoRefacciones;
$res['MontoTAMov'] = $MontoTAMov;
$res['MontoFee'] = $TotalFee;
$res['MontoTotal'] = $MontoTotal;
$res['MontoCambio'] = $MontoCambio;
$res['Reportes'] = $reportes;
$res['Pago'] = $pagos;
/*
echo("MontoRefacciones" . $MontoRefacciones . "--");
echo("MontoTAMov" . $MontoTAMov . "--");
echo("MontoFee" . $MontoFee . "--");
echo("MontoTotal" . $MontoTotal . "--");
echo("MontoDespiece" . $MontoDespiece . "--");
echo("MontoReciclaje" . $MontoReciclaje . "--");
echo("MontoOtro" . $MontoOtro . "--");
echo("MontoCambio" . $MontoCambio . "--");
die();
*/
echo json_encode($res);

/*
echo("Monto refacciones: " . $MontoRefacciones);
echo("<br>Monto TA y Mov.: " . $MontoRefacciones);
echo("<br>MontoFee: " . $MontoFee);
echo("<br>MontoImpuesto: " . $MontoImpuestoFee);
echo("<br>ValorImpuesto: " . $ValorImpuesto);
echo("<br>Monto Fee: " . $TotalFee);
*/
?>
