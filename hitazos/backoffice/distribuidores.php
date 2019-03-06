<?php
$_global_active = "distribuidores";
include 'inc_header.php';
include "../servicios/dbc.php";

$query = "select * from distribuidores Where status<>2";
$q = mysql_query($query) or die(mysql_error());
?>
<div class="col-md-12 span_3">
 <div class="bs-example1" data-example-id="contextual-table">
   <div class="text-right m-b">
     <button type="reset" class="btn btn-primary" onclick="javaScript: window.location.href='distribuidor_registrar.php'">Registrar nuevo distribuidor</button>
   </div>
   <table class="table" id="myTable">
     <thead>
       <tr>
         <th>#</th>
         <th>IDDistribuidor</th>
         <th>País</th>
         <th>Categoría</th>
         <th>Nombre</th>
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
         <td><?= $row["IDDistribuidor"]?></td>
         <td><?= $row["Pais"]?></td>
         <td><?= $row["Categoria"]?></td>
         <td><?= $row["RazonSocial"]?></td>
         <td>
           <a href="distribuidor_editar.php?id=<?= $row["id"] ?>"><i class="far fa-edit"></i></a>
           <a href="distribuidor_eliminar.php?id=<?= $row["id"] ?>"><i class="far fa-trash-alt"></i></a>
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
