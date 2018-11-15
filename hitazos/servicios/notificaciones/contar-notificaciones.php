<?php
include "../dbc.php";

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

$current_charset = 'ISO-8859-15';//or what it is now
array_walk_recursive($arre,function(&$value) use ($current_charset){
     $value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
});

$res = array();

$res['res'] = 'ok';

$json = $_POST['json'];
$arre = json_decode($json, true);

$id_usuario = utf8_decode(urldecode($arre['id_usuario']));
if($id_usuario==17)
  $query = "SELECT id FROM notificaciones where id_usuario<>17";
else{
  $query = "
            select n.id from 
            (select * from notificaciones where id_usuario=17) as n
            join
            (select * from reportes) as r
            on n.id_reporte = r.id
            join
            (select * from usuarios_admin where ID=$id_usuario) as u
            on r.idcentro = u.idcentro
            group by id
          ";
}


$q = mysql_query($query) or die(mysql_error());

$num = mysql_num_rows($q);

$res['notificaciones'] = $num;

echo json_encode($res);
?>
