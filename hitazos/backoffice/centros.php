<?php
$_global_active = "centros";
include 'inc_header.php';
include "../servicios/dbc.php";

$query = "Select c1.*, c2.Nombre as Master from
          (Select * from centros) as c1
          left join
          (Select * from centros) as c2
          on c1.idMaster = c2.id
          where c1.Status<>2";
$q = mysql_query($query) or die(mysql_error());
?>
<div class="col-md-12 span_3">
 <div class="bs-example1" data-example-id="contextual-table">
   <div class="text-right m-b">
     <button type="reset" class="btn btn-primary" onclick="javaScript: window.location.href='centro_registrar.php'">Registrar nuevo CD´s</button>
   </div>
   <table class="table" id="myTable">
     <thead>
       <tr>
         <th>#</th>
         <th>Master</th>
         <th>Nombre</th>
         <th>Red</th>
         <th>Categoría</th>
         <th>Ciudad</th>
         <th>IDGrupoTarifa</th>
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
         <td><?= $row["Master"]?></td>
         <td><?= $row["Nombre"]?></td>
         <td><?= $row["Red"]?></td>
         <td><?= $row["Categoria"]?></td>
         <td><?= $row["Ciudad"]?></td>
         <td><?= $row["IDGrupoTarifa"]?></td>
         <td>
           <a href="centro_editar.php?id=<?= $row["id"] ?>"><i class="far fa-edit"></i></a>
           <a href="centro_eliminar.php?id=<?= $row["id"] ?>"><i class="far fa-trash-alt"></i></a>
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
