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

if($arre['Nivel']=='administrador'){
  $IDCentro = $arre['IDMaster'];
}else {
  $IDCentro = $arre['IDCentro'];
}

$query = "
SELECT id, Nombre, Ciudad from centros
where Pais = '".$arre["Pais"]."'
and (IDMaster = ".$IDCentro. " or id= ".$IDCentro.")";
//$query = utf8_encode($query);
//echo($query);
echo "<option value='' hidden>CDS</option>";
echo "<option value='Todos'>Todos</option>";

$result = mysql_query($query) or die(mysql_error());

while ($row = mysql_fetch_array($result)){
  $valor = utf8_encode($row[1]);
  if($row[2] != ''){
    $valor .= ' - '.utf8_encode($row[2]);
  }
?>
    <option value="<?php echo $row[0]; ?>" ><?=$valor?></option>
<?php
}





?>
