<?php

$conexion = mssql_connect("172.16.120.3", "desarrollo2", "AngAlex?749%*") or die("Error de conexion SQL Server.");
mssql_select_db("EneosMexico160217", $conexion) or die(error_query());

?>