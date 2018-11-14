<?php
	
	if (isset($_SERVER['HTTP_ORIGIN'])) {
		header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

	
	require_once('dbc.php');

    foreach ($_POST as $key => $value)
        $data[$key] = trim($value);

$json = $data['json'];
$arre = json_decode($json, true);
$idestado = utf8_decode(urldecode($arre['IDEstado']));
$idmunicipio = utf8_decode(urldecode($arre['IDMunicipio']));

    $query = "SELECT distinct id_asenta_cpcons, d_asenta FROM `sepomex` where c_estado = '$idestado' and c_mnpio = '$idmunicipio' order by d_asenta asc";

    $result = mysql_query($query) or die(mysql_error());
    echo "<option value='' hidden>Localidad</option>";
    while ($row = mysql_fetch_row($result)) {
?>
        <option value="<?php echo $row[0]; ?>" ><?php echo utf8_encode($row[1]); ?></option>
<?php
    }
    
	
    

	
?>
