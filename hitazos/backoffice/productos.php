<?php
$_global_active = "productos";
include 'inc_header.php';
include "../servicios/dbc.php";

$query = "select * from productos Where status<>2";
$q = mysql_query($query) or die(mysql_error());
?>
<div class="col-md-12 span_3">
 <div class="bs-example1" data-example-id="contextual-table">
   <div class="text-right m-b">
     <button type="reset" class="btn btn-primary" onclick="javaScript: window.location.href='productos_registrar.php'">Registrar nuevo producto</button>
   </div>
   <table class="table" id="myTable">
     <thead>
       <tr>
         <th>#</th>
         <th>SAP</th>
         <th>Categoría</th>
         <th>Subcategoría</th>
         <th>Tipo Tarifa</th>
         <th>Modelo</th>
         <th>Producto</th>
         <!--th>País</th-->
         <!--th>Voltaje</th>
         <th>Status</th-->
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
         <td><?= $row["SAP"]?></td>
         <td><?= $row["Categoria"]?></td>
         <td><?= $row["Subcategoria"]?></td>
         <td><?= $row["TipoTarifa"]?></td>
         <td><?= $row["Modelo"]?></td>
         <td><?= $row["Producto"]?></td>
         <!--td><?= $row["Pais"]?></td-->
         <!--td><?= $row["Voltaje"]?></td>
         <td><?= $row["Status"]?></td-->
         <td>
           <!--a href="producto_ver.php"><i class="far fa-eye"></i></a-->
           <a href="producto_editar.php?id=<?= $row["id"] ?>"><i class="far fa-edit"></i></a>
           <a href="producto_eliminar.php?id=<?= $row["id"] ?>"><i class="far fa-trash-alt"></i></a>
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
});
</script>
