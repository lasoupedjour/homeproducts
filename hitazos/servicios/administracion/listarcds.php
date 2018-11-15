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

if($arre["Nivel"] == "administrador" || $arre["Nivel"] == "MKT"){
  $query = "
  SELECT id, Nombre from centros
  where Pais like '%".$arre["Pais"]."%'";
}else{
  $query = "
  SELECT id, Nombre from centros
  where Pais like '%".$arre["Pais"]."%'
  and (IDMaster=0 and id = ".$arre["IDCentro"].") or IDMaster = ".$arre["IDCentro"];
}


$query = utf8_encode($query);

$result = mysql_query($query) or die(mysql_error());
echo "<option value='' hidden>CDS</option>";
while ($row = mysql_fetch_row($result)) {
?>
    <option value="<?php echo $row[0]; ?>" ><?php echo utf8_encode($row[1]); ?></option>
<?php
}





?>
