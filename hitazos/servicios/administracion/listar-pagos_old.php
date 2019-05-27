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

$IDMaster = $arre['IDMaster'];
$nivel = $arre['nivel'];
$IDDistribuidor = $arre['IDDistribuidor'];

if($IDMaster>0 && $arre["Nivel"]!="administrador"){
  $queryPagos = "SELECT  id, IDMaster, IDCentro, IDOperadorAdmin, IDDistribuidor, replace(Categoria, '', 'No seleccionada') as Categoria, ODS, MontoTotal, StatusPago, Comprobante, FechaRegistro, FechaPago,
  REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(Mes, '12', 'Diciembre'), '11', 'Noviembre'), '10', 'Octubre'), '09', 'Septiembre'), '08', 'Agosto'), '07', 'Julio'), '06', 'Junio'), '05', 'Mayo'), '04', 'Abril'), '03', 'Marzo'), '02', 'Febrero'), '01', 'Enero') AS  Mes, Ano, Status
  FROM  pagos where IDMaster=$IDMaster order by id desc";
}elseif($IDDistribuidor>0){
  $queryPagos = "select pagos.id, pagos.IDMaster, pagos.IDCentro, pagos.IDOperadorAdmin, replace(pagos.Categoria, '', 'No seleccionada') as Categoria, pagos.ODS, pagos.MontoTotal, pagos.StatusPago, pagos.Comprobante, pagos.FechaRegistro, pagos.FechaPago, REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(Mes, '12', 'Diciembre'), '11', 'Noviembre'), '10', 'Octubre'), '09', 'Septiembre'), '08', 'Agosto'), '07', 'Julio'), '06', 'Junio'), '05', 'Mayo'), '04', 'Abril'), '03', 'Marzo'), '02', 'Febrero'), '01', 'Enero') AS Mes, pagos.Ano, pagos.Status, distribuidores.IDDistribuidor from
                 (SELECT * FROM pagos where IDDistribuidor=$IDDistribuidor) as pagos
                 left join
                 (select * from distribuidores) as distribuidores
                 on pagos.IDDistribuidor=distribuidores.id
                 order by pagos.id desc";

  /*
  "SELECT  id, IDMaster, IDCentro, IDOperadorAdmin, IDDistribuidor,  replace(Categoria, '', 'No seleccionada') as Categoria, ODS, MontoTotal, StatusPago, Comprobante, FechaRegistro, FechaPago,
  REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(Mes, '12', 'Diciembre'), '11', 'Noviembre'), '10', 'Octubre'), '09', 'Septiembre'), '08', 'Agosto'), '07', 'Julio'), '06', 'Junio'), '05', 'Mayo'), '04', 'Abril'), '03', 'Marzo'), '02', 'Febrero'), '01', 'Enero') AS  Mes, Ano, Status
  FROM  pagos where IDDistribuidor=$IDDistribuidor order by id desc";
  */
}elseif($arre["Nivel"]=="administrador"){
  $queryPagos = "select pagos.id, pagos.IDMaster, pagos.IDCentro, pagos.IDOperadorAdmin, replace(pagos.Categoria, '', 'No seleccionada') as Categoria, pagos.ODS, pagos.MontoTotal, pagos.StatusPago, pagos.Comprobante, pagos.FechaRegistro, pagos.FechaPago, REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(Mes, '12', 'Diciembre'), '11', 'Noviembre'), '10', 'Octubre'), '09', 'Septiembre'), '08', 'Agosto'), '07', 'Julio'), '06', 'Junio'), '05', 'Mayo'), '04', 'Abril'), '03', 'Marzo'), '02', 'Febrero'), '01', 'Enero') AS Mes, pagos.Ano, pagos.Status, distribuidores.IDDistribuidor from
                 (SELECT * FROM pagos) as pagos
                 left join
                 (select * from distribuidores) as distribuidores
                 on pagos.IDDistribuidor=distribuidores.id
                 order by pagos.id desc";
  /*
  "SELECT  id, IDMaster, IDCentro, IDOperadorAdmin, IDDistribuidor,  replace(Categoria, '', 'No seleccionada') as Categoria, ODS, MontoTotal, StatusPago, Comprobante, FechaRegistro, FechaPago,
  REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(Mes, '12', 'Diciembre'), '11', 'Noviembre'), '10', 'Octubre'), '09', 'Septiembre'), '08', 'Agosto'), '07', 'Julio'), '06', 'Junio'), '05', 'Mayo'), '04', 'Abril'), '03', 'Marzo'), '02', 'Febrero'), '01', 'Enero') AS  Mes, Ano, Status
  FROM  pagos order by id desc";
  */
}
/*
echo($queryPagos);
die();


select pagos.id, pagos.IDMaster, pagos.IDCentro, pagos.IDOperadorAdmin, pagos.IDDistribuidor, replace(pagos.Categoria, '', 'No seleccionada') as Categoria, pagos.ODS, pagos.MontoTotal, pagos.StatusPago, pagos.Comprobante, pagos.FechaRegistro, pagos.FechaPago, REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(Mes, '12', 'Diciembre'), '11', 'Noviembre'), '10', 'Octubre'), '09', 'Septiembre'), '08', 'Agosto'), '07', 'Julio'), '06', 'Junio'), '05', 'Mayo'), '04', 'Abril'), '03', 'Marzo'), '02', 'Febrero'), '01', 'Enero') AS Mes, pagos.Ano, pagos.Status, distribuidores.IDDistribuidor from
(SELECT * FROM pagos) as pagos
left join
(select * from distribuidores) as distribuidores
on pagos.IDDistribuidor=distribuidores.id
order by pagos.id desc
*/
$pagos = array();
$qPagos = mysql_query($queryPagos) or die(mysql_error());

while ($row = mysql_fetch_array($qPagos))
{
  $detalle = detallePago($row['IDCentro'], $row['Mes'], $row['Ano'], $row['Categoria'], $row['IDDistribuidor'], $row['IDDistribuidor'], $row['IDMaster']);
  $temp["cuentas"] = $detalle;

  $temp["detalle"]["id"] = $row["id"];
  $temp["detalle"]["IDMaster"] = $row["IDMaster"];
  $temp["detalle"]["IDCentro"] = $row["IDCentro"];
  $temp["detalle"]["IDOperadorAdmin"] = $row["IDOperadorAdmin"];
  $temp["detalle"]["IDDistribuidor"] = $row["IDDistribuidor"];
  $temp["detalle"]["Categoria"] = $row["Categoria"];
  $temp["detalle"]["ODS"] = $row["ODS"];
  $temp["detalle"]["MontoTotal"] = $row["MontoTotal"];
  $temp["detalle"]["StatusPago"] = $row["StatusPago"];
  $temp["detalle"]["Comprobante"] = $row["Comprobante"];
  $temp["detalle"]["FechaRegistro"] = $row["FechaRegistro"];
  $temp["detalle"]["FechaPago"] = $row["FechaPago"];
  $temp["detalle"]["Mes"] = $row["Mes"];
  $temp["detalle"]["Ano"] = $row["Ano"];
  $temp["detalle"]["Status"] = $row["Status"];
  //$temp["detalle"] = json_encode($row);
	array_push($pagos, $temp);
}

$res['pagos'] = $pagos;

echo json_encode($res);

function detallePago($cds, $ano, $mes, $categoria, $CustomerID, $Nombre, $IDMaster){
  $fechaIni = $ano.'-'.$mes.'-'.'01';
  $fechaFin = $ano.'-'.$mes.'-'.'31';

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
              OtroCostoDistribuidor as OtroCostoDistribuidor,
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
    //$filtroFecha = " and (FechaOrdenServicio >= '$fechaIni' and FechaOrdenServicio <= '$fechaFin')";
    $filtroFecha = " and (FechaCierre >= '$fechaIni' and FechaCierre <= '$fechaFin')";
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
  $OtroCostoDistribuidor = 0;
  $reportes = array();

  while ($row = mysql_fetch_array($qMontos))
  {
    $MontoRefacciones = $MontoRefacciones + floatval($row["MontoRefacciones"]);
  	$MontoTAMov = $MontoTAMov+ (floatval($row["MontoReparacion"]) + floatval($row["MontoMovilizacion"]));
    $MontoDespiece = floatval($row["MontoDespiece"]);
    $MontoReciclaje = floatval($row["MontoReciclaje"]);
    $MontoOtro = floatval($row["MontoOtro"]);
    $OtroCostoDistribuidor = floatval($row["OtroCostoDistribuidor"]);
    $CostoLanded = $CostoLanded + floatval($row["CostoLanded"]);
    if($IDCentro>0)
      $MontoCambio = $MontoCambio + ($MontoDespiece + $MontoReciclaje + $MontoOtro);
    else
      $MontoCambio = $MontoCambio + ($CostoLanded + $OtroCostoDistribuidor);

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

  return $res;
}
?>
