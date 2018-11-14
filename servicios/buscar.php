<?php
include "dbc.php";

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

if($arre['nivel'] == 'administrador' || $arre['nivel'] == 'MKT'){
	$arre["Pais"] = '';
}

switch($arre["TipoBusqueda"]){
	
	case "IDCliente":
		$query = "SELECT * FROM clientes where ";
		if($arre["Pais"] != null && $arre["Pais"] != ''){$query .= " Pais = '".$arre['Pais']."' and ";}
		$query .= "id = ".$arre['IDCliente'];
		$q = mysql_query($query) or die(mysql_error());
	break;
	case "IDOrden":
		$query = "SELECT IDCliente FROM reportes where id = ".$arre['IDOrden']." and StatusReporte = 'Orden de Servicio' and Status = 1";
		$q = mysql_query($query) or die(mysql_error());
		
		$idcliente = -1;
		while ($row = mysql_fetch_array($q))   
		{  
			$idcliente = $row[0];
		}
		
		$query = "SELECT * FROM clientes where ";
		
			if($arre["Pais"] != null && $arre["Pais"] != ''){
				$query .= " Pais = '".$arre['Pais']."' and ";
			}
		
		$query .= " id = $idcliente and Status = 1";
		
		$q = mysql_query($query) or die(mysql_error());
		
	break;
	
	case "IDReporte":
		$query = "SELECT IDCliente FROM reportes where id like '%".$arre['IDReporte']."%' and StatusReporte <> 'Orden de Servicio' ";
		$q = mysql_query($query) or die(mysql_error());
		
		$idcliente = -1;
		while ($row = mysql_fetch_array($q))   
		{  
			$idcliente = $row[0];
		}
		
		$query = "SELECT * FROM clientes where ";
		if($arre["Pais"] != null && $arre["Pais"] != ''){$query .= " Pais = '".$arre['Pais']."' and ";}
		$query .= "id = $idcliente";
		$q = mysql_query($query) or die(mysql_error());
		
	break;
	
	case "Nombre":
		
		$partes = explode(" ", $arre['RazonSocial']);
		
		$query = "
		SELECT * FROM clientes where 
		";
		
		foreach($partes as $parte){
		$query .="
		(Nombre like '%".$parte."%') or 
		(APaterno like '%".$parte."%') or
		(AMaterno like '%".$parte."%') or
		";
		}
		
		if($arre["Pais"] != null && $arre["Pais"] != ''){$query .= " Pais = '".$arre['Pais']."' and ";}
		
		$query .= "
		(RazonSocial like '%".$arre['RazonSocial']."%')
		";
		
		$q = mysql_query($query) or die(mysql_error());
	break;
	case "Email":
		$query = "SELECT * FROM clientes where ";
		if($arre["Pais"] != null && $arre["Pais"] != ''){$query .= " Pais = '".$arre['Pais']."' and ";}
		$query .= " Email like '%".$arre['Email']."%'";
		$q = mysql_query($query) or die(mysql_error());
	break;
	case "IDDistribuidor":
		
		if($arre['IDDistribuidor'] != ''){
		
			$q = mysql_query("
		
			SELECT RazonSocial FROM distribuidores where IDDistribuidor = '".$arre['IDDistribuidor']."'
			
			") or die(mysql_error());
			
			$num = mysql_num_rows($q);
		
		}
		
		if($num > 0){
		
			list($RazonSocial) = mysql_fetch_row($q);
		
			$q = mysql_query("
		
				SELECT IDCliente FROM reportes where Distribuidor like '%".$RazonSocial."%'
			
			") or die(mysql_error());
			
			$idcliente = -1;
			while ($row = mysql_fetch_array($q))   
			{  
				$idcliente = $row[0];
			}
			
			$query = "SELECT * FROM clientes where ";
			if($arre["Pais"] != null && $arre["Pais"] != ''){$query .= " Pais = '".$arre['Pais']."' and ";}
			$query .= "id = $idcliente";
			$q = mysql_query($query) or die(mysql_error());
			
		}else if($arre['NombreDistribuidor'] != ''){
		
			$q = mysql_query("
		
				SELECT IDCliente FROM reportes where Distribuidor like '%".$arre['NombreDistribuidor']."%'
			
			") or die(mysql_error());
			
			$idcliente = -1;
			while ($row = mysql_fetch_array($q))   
			{  
				$idcliente = $row[0];
			}
			
			$query = "SELECT * FROM clientes where ";
			if($arre["Pais"] != null && $arre["Pais"] != ''){$query .= " Pais = '".$arre['Pais']."' and ";}
			$query .= "id = $idcliente";
			$q = mysql_query($query) or die(mysql_error());
		
		}
		
	break;
	
	
	case "NoSerie":
		
		if($arre['NoSerie'] != ''){
		
			$q = mysql_query("
		
			SELECT IDCliente FROM reportes where NoSerie like '%".$arre['NoSerie']."%'
			
			") or die(mysql_error());
			
			$num = mysql_num_rows($q);
		
		}
		
		$idcliente = -1;
		while ($row = mysql_fetch_array($q))   
		{  
			$idcliente = $row[0];
		}
		
		$query = "SELECT * FROM clientes where ";
		if($arre["Pais"] != null && $arre["Pais"] != ''){$query .= " Pais = '".$arre['Pais']."' and ";}
		$query .= "id = $idcliente";
		$q = mysql_query($query) or die(mysql_error());
		
		
	break;
	
}


$clientes = array();

while ($row = mysql_fetch_array($q))   
{  
	$current_charset = 'ISO-8859-15';//or what it is now
	array_walk_recursive($row,function(&$value) use ($current_charset){
		 //$value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
		$value = utf8_encode($value);
	});
	$temp = json_encode($row);
	array_push($clientes, $temp);
}
$res['clientes'] = $clientes;

echo json_encode($res);




	
?>