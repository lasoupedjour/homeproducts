<?php
$_global_active = "tarifas";
include 'inc_header.php';
include "../servicios/dbc.php";

$query = "select * from tarifas Where status<>2";
$q = mysql_query($query) or die(mysql_error());
?>
<div class="col-md-12 span_3">
 <div class="bs-example1" data-example-id="contextual-table">
   <div class="text-right m-b">
     <button type="reset" class="btn btn-primary" onclick="javaScript: window.location.href='tarifa_registrar.php'">Registrar nueva tarifa</button>
   </div>
   <table class="table" id="myTable">
     <thead>
       <tr>
         <th>#</th>
         <th>IDGrupoTarifa</th>
         <th>Tipo Tarifa</th>
         <th>Tipo Servicio</th>
         <th>Subtipo Servicio</th>
         <th>Valor</th>
         <th>Impuesto</th>
         <th>Tarifa Mensual</th>
         <th>Impuesto T.M.</th>
         <th>Necesita Autorización</th>
         <th></th>
       </tr>
     </thead>
     <tbody>
       <?php
       while ($row = mysql_fetch_array($q))
       {
       ?>
       <tr>
         <td><?= $row["id"]?></td>
         <td><?= $row["IDGrupoTarifa"]?></td>
         <td><?= $row["TipoTarifa"]?></td>
         <td><?= $row["TipoServicio"]?></td>
         <td><?= $row["SubtipoServicio"]?></td>
         <td><?= $row["Valor"]?></td>
         <td><?= $row["Impuesto"]?></td>
         <td><?= $row["TarifaMensual"]?></td>
         <td><?= $row["ImpuestoTarifaMensual"]?></td>
         <td><?= $row["NecesitaAutorizacion"]?></td>
         <td>
           <a href="tarifa_editar.php?id=<?= $row["id"] ?>"><i class="far fa-edit"></i></a>
           <a href="tarifa_eliminar.php?id=<?= $row["id"] ?>"><i class="far fa-trash-alt"></i></a>
         </td>
       </tr>
       <?php
       }
       ?>
     </tbody>
   </table>
  </div>
</div>
<?php include 'inc_footer.php'; ?>
<script type="text/javascript">
$(document).ready( function () {
  $('#myTable').DataTable();
} );
</script>
