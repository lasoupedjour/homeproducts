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
$id_centro = utf8_decode(urldecode($arre['id_centro']));
$nivel= utf8_decode(urldecode($arre['nivel']));
$IDDistribuidor = utf8_decode(urldecode($arre['IDDistribuidor']));
$CustomerID = $arre['CustomerID'];

if($nivel=='administrador'){
  $query = "SELECT notificaciones.id FROM notificaciones,usuarios_admin where notificaciones.id_usuario=usuarios_admin.id and usuarios_admin.nivel <> 'administrador' and leida=0 order by notificaciones.id desc";
}else if($nivel=='operador'){
  $query = "
            select n.id from
            (select notificaciones.* from notificaciones where leida=0) as n
            left join
            (select * from usuarios_admin where (nivel='administrador')) as ua
            on ua.id = n.id_usuario
            join
            (select * from reportes) as r
            on n.id_reporte = r.id
            join
            (select * from usuarios_admin) as u
            on r.idcentro = u.idcentro
            Where (id_usuario=$id_usuario or (modulo='/cambio-fisico-dist-asigna' and id_centro=$id_centro)) or r.IDCentro=$id_centro
            group by id
            order by id desc
            ";
}else if($nivel=='distribuidor'){
  $res['nivel'] = $IDDistribuidor;
  $query = "
            select n.id from
            (select notificaciones.* from notificaciones where leida=0) as n
            join
            (select id from usuarios_admin) as ua
            on ua.id = n.id_usuario
            join
            (select id, Distribuidor from reportes) as r
            on n.id_reporte = r.id
            join
            (select IDDistribuidor from distribuidores where id=$IDDistribuidor) as d
            on r.Distribuidor = d.IDDistribuidor
            Where modulo not like '%cambio-fisico%' and modulo<>'/registro-caso-menaje-reparacion-a-centro'
            and modulo<>'/registro-caso-menaje-reparacion'
            and (descripcion not like '%Movilización del repot%')
            and (descripcion not like '%La movilización del report%')
            and r.IDDistribuidor=$id_usuario
            group by id
            order by id desc
            ";
}

$q = mysql_query($query) or die(mysql_error());

$num = mysql_num_rows($q);

$res['notificaciones'] = $num;

echo json_encode($res);
?>
