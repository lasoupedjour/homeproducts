<?php
$_global_active = "refacciones";
include 'inc_header.php';
include "../servicios/dbc.php";

//echo("postback->" . $_POST["postback"]);
if($_POST["postback"]){
  $id_refaccion = $_POST["id"];

  $q = mysql_query("
  update refacciones_productos set
  status=2
  where id = $id_refaccion
  ") or die(mysql_error());

  echo("<script>alert('Registro eliminado'); window.location.href='refacciones.php';</script>");
}else{
  $id_refaccion = $_GET["id"];
  if($id_refaccion==""){
    header("Location: refacciones.php");
    die();
  }
  $mensaje = "Favor de confirmar que desea eliminar la refacción.";
}
//die();
$query = "select * from refacciones_productos Where id=$id_refaccion";
$q = mysql_query($query) or die(mysql_error());

while ($row = mysql_fetch_array($q))
{
  $categoria = $row["Categoria"];
  $subcategoria = $row["Subcategoria"];
  $nombre = $row["Nombre"];
  $noparte = $row["NoParte"];
  $modeloproducto = $row["ModeloProducto"];
  $voltaje = $row["Voltaje"];
  $diagrama = $row["Diagrama"];
}
?>
<div class="xs">
   <h3>Eliminar producto</h3>
   <p><?= $mensaje ?></p>
   <div class="well1 white">
   <form class="form-floating ng-pristine ng-invalid ng-invalid-required ng-valid-email ng-valid-url ng-valid-pattern" action="producto_eliminar.php" method="POST">
     <fieldset>
       <div class="form-group">
         <label class="control-label">Categoría</label>
         <select class="form-control1 ng-invalid ng-invalid-required" id="categoria" name="categoria" ng-model="model.categoria" disabled>
           <option value="? undefined:undefined ?"></option>
           <option value="LINEA BLANCA" <?php if($categoria=='LINEA BLANCA') echo('selected'); ?>>LINEA BLANCA</option>
           <option value="MENAJE" <?php if($categoria=='MENAJE') echo('selected'); ?>>MENAJE</option>
         </select>
       </div>
       <div class="form-group">
         <label class="control-label">Sub categoría</label>
         <select class="form-control1 ng-invalid ng-invalid-required" id="subcategoria" name="subcategoria" ng-model="model.subcategoria" disabled>
           <option value="? undefined:undefined ?"></option>
           <option class="data-lineablanca" value="AIRE ACONDICIONADO" <?php if($subcategoria=='AIRE ACONDICIONADO') echo('selected'); ?>>AIRE ACONDICIONADO</option>
           <option class="data-lineablanca" value="CAMPANAS/VENTILACION" <?php if($subcategoria=='CAMPANAS/VENTILACION') echo('selected'); ?>>CAMPANAS/VENTILACION</option>
           <option class="data-lineablanca" value="CONGELADOR" <?php if($subcategoria=='CONGELADOR') echo('selected'); ?>>CONGELADOR</option>
           <option class="data-menaje" value="CUBIERTOS" <?php if($subcategoria=='CUBIERTOS') echo('selected'); ?>>CUBIERTOS</option>
           <option class="data-menaje" value="CUCHILLOS" <?php if($subcategoria=='CUCHILLOS') echo('selected'); ?>>CUCHILLOS</option>
           <option class="data-lineablanca" value="DISPENSADOR DE AGUA" <?php if($subcategoria=='DISPENSADOR DE AGUA') echo('selected'); ?>>DISPENSADOR DE AGUA</option>
           <option class="data-lineablanca" value="ESTUFA" <?php if($subcategoria=='ESTUFA') echo('selected'); ?>>ESTUFA</option>
           <option class="data-menaje" value="HORNEAR" <?php if($subcategoria=='HORNEAR') echo('selected'); ?>>HORNEAR</option>
           <option class="data-lineablanca" value="LAVADORA" <?php if($subcategoria=='LAVADORA') echo('selected'); ?>>LAVADORA</option>
           <option class="data-lineablanca" value="LAVAVAJILLA" <?php if($subcategoria=='LAVAVAJILLA') echo('selected'); ?>>LAVAVAJILLA</option>
           <option class="data-lineablanca" value="MICROONDA" <?php if($subcategoria=='MICROONDA') echo('selected'); ?>>MICROONDA</option>
           <option class="data-menaje" value="OLLAS Y SARTENES" <?php if($subcategoria=='OLLAS Y SARTENES') echo('selected'); ?>>OLLAS Y SARTENES</option>
           <option class="data-menaje" value="RECIPIENTES" <?php if($subcategoria=='RECIPIENTES') echo('selected'); ?>>RECIPIENTES</option>
           <option class="data-lineablanca" value="REFRIGERADOR" <?php if($subcategoria=='REFRIGERADOR') echo('selected'); ?>>REFRIGERADOR</option>
           <option class="data-lineablanca" value="SECADOR" <?php if($subcategoria=='SECADOR') echo('selected'); ?>>SECADOR</option>
           <option class="data-menaje" value="UTENSILIOS" <?php if($subcategoria=='UTENSILIOS') echo('selected'); ?>>UTENSILIOS</option>
           <option class="data-menaje" value="VAJILLA" <?php if($subcategoria=='VAJILLA') echo('selected'); ?>>VAJILLA</option>
         </select>
       </div>
       <div class="form-group">
         <label class="control-label">Nombre</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="modelo" name="modelo" ng-model="model.modelo" value="<?= $nombre ?>" readonly>
       </div>
       <div class="form-group">
         <label class="control-label">No. de parte</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="modelo" name="modelo" ng-model="model.modelo" value="<?= $noparte ?>" readonly>
       </div>
       <div class="form-group">
         <label class="control-label">Modelo producto</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="producto" name="producto" ng-model="model.producto" value="<?= $modeloproducto ?>" readonly>
       </div>
       <!--div class="form-group">
         <label class="control-label">Voltaje</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="pais" name="pais" ng-model="model.pais" value="<?= $voltaje ?>" readonly>
       </div>
       <div class="form-group">
         <label class="control-label">Diagrama</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="sap" name="sap" ng-model="model.sap" value="<?= $diagrama ?>" readonly>
       </div-->
       <div class="form-group">
         <button type="submit" class="btn btn-primary">Eliminar</button>
         <button type="reset" class="btn btn-default" onclick="javaScript: window.location.href='refacciones.php'">Cancelar</button>
       </div>
     </fieldset>
     <input type="hidden" value="1" name="postback">
     <input type="hidden" value="<?= $id_refaccion ?>" name="id">
   </form>
 </div>
</div>
<?php include 'inc_footer.php'; ?>
<script src="js/custom.js"></script>
<script type="text/javascript">
  $("#categoria").change(function () {
      var categoria = this.value;
      $(".data-lineablanca").show();
      $(".data-menaje").show();

      if(categoria=='LINEA BLANCA')
        $(".data-menaje").hide();
      else
        $(".data-lineablanca").hide();
  });
</script>
