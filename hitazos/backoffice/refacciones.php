<?php
$_global_active = "refacciones";
include 'inc_header.php';
include "../servicios/dbc.php";

$query = "select * from refacciones_productos";
$q = mysql_query($query) or die(mysql_error());
?>
<div class="col-md-12 span_3">
 <div class="bs-example1" data-example-id="contextual-table">
   <div class="text-right m-b">
     <button type="reset" class="btn btn-primary" onclick="javaScript: window.location.href='refacciones_registrar.php'">Registrar nueva refacción</button>
   </div>
   <table class="table" id="myTable">
     <thead>
       <tr>
         <th>#</th>
         <th>Categoría</th>
         <th>Subcategoría</th>
         <th>Nombre</th>
         <th>No. de parte</th>
         <th>Modelo producto</th>
         <!--th>Voltaje</th>
         <th>Diagrama</th-->
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
         <td><?= $row["Categoria"]?></td>
         <td><?= $row["Subcategoria"]?></td>
         <td><?= $row["Nombre"]?></td>
         <td><?= $row["NoParte"]?></td>
         <td><?= $row["ModeloProducto"]?></td>
         <!--td><?= $row["Voltaje"]?></td>
         <td><?= $row["Diagrama"]?></td-->
         <td>
           <a href="refacciones_editar.php?id=<?= $row["id"] ?>"><i class="far fa-edit"></i></a>
           <a href="refacciones_eliminar.php?id=<?= $row["id"] ?>"><i class="far fa-trash-alt"></i></a>
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
