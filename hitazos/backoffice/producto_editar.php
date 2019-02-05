<?php
include 'inc_header.php';
include "../servicios/dbc.php";

//echo("postback->" . $_POST["postback"]);
if($_POST["postback"]){
  $id_producto = $_POST["id"];
  $sap = $_POST["sap"];
  $categoria = $_POST["categoria"];
  $subcategoria = $_POST["subcategoria"];
  $tipotarifa = $_POST["tipotarifa"];
  $modelo = $_POST["modelo"];
  $producto = $_POST["producto"];
  $pais = $_POST["pais"];

  $q = mysql_query("
  update productos set
  sap='$sap', categoria='$categoria', subcategoria='$subcategoria', TipoTarifa='$tipotarifa',
  modelo='$modelo', producto='$producto', pais='$pais'
  where id = $id_producto
  ") or die(mysql_error());

  $mensaje = "Registro actualizado";
}else{
  $id_producto = $_GET["id"];
  if($id_producto==""){
    header("Location: productos.php");
    die();
  }
}
//die();
$query = "select * from productos Where id=$id_producto";
$q = mysql_query($query) or die(mysql_error());

while ($row = mysql_fetch_array($q))
{
  $sap = $row["SAP"];
  $categoria = $row["Categoria"];
  $subcategoria = $row["Subcategoria"];
  $tipotarifa = $row["TipoTarifa"];
  $modelo = $row["Modelo"];
  $producto = $row["Producto"];
  $pais = $row["Pais"];
}
?>
<div class="xs">
   <h3>Editar producto</h3>
   <p><?= $mensaje ?></p>
   <div class="well1 white">
   <form class="form-floating ng-pristine ng-invalid ng-invalid-required ng-valid-email ng-valid-url ng-valid-pattern" action="producto_editar.php" method="POST">
     <fieldset>
       <div class="form-group">
         <label class="control-label">SAP</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="sap" name="sap" ng-model="model.sap" value="<?= $sap ?>" required="">
       </div>
       <div class="form-group">
         <label class="control-label">Categoría</label>
         <select class="form-control1 ng-invalid ng-invalid-required" id="categoria" name="categoria" ng-model="model.categoria" required=""><option value="? undefined:undefined ?"></option>
           <option value="LINEA BLANCA" <?php if($categoria=='LINEA BLANCA') echo('selected'); ?>>LINEA BLANCA</option>
           <option value="MENAJE" <?php if($categoria=='MENAJE') echo('selected'); ?>>MENAJE</option>
         </select>
       </div>
       <div class="form-group">
         <label class="control-label">Sub categoría</label>
         <select class="form-control1 ng-invalid ng-invalid-required" id="subcategoria" name="subcategoria" ng-model="model.subcategoria" required=""><option value="? undefined:undefined ?"></option>
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
         <label class="control-label">Tipo de tarifa</label>
         <select class="form-control1 ng-invalid ng-invalid-required" id="tipotarifa" name="tipotarifa" ng-model="model.tipotarifa" required=""><option value="? undefined:undefined ?"></option>
           <option class="data-lineablanca" value="AIRE ACONDICIONADO" <?php if($tipotarifa=='AIRE ACONDICIONADO') echo('selected'); ?>>AIRE ACONDICIONADO</option>
           <option class="data-lineablanca" value="CAMPANAS/VENTILACION" <?php if($tipotarifa=='CAMPANAS/VENTILACION') echo('selected'); ?>>CAMPANAS/VENTILACION</option>
           <option class="data-lineablanca" value="CONGELADOR" <?php if($tipotarifa=='CONGELADOR') echo('selected'); ?>>CONGELADOR</option>
           <option class="data-menaje" value="CUBIERTOS" <?php if($tipotarifa=='CUBIERTOS') echo('selected'); ?>>CUBIERTOS</option>
           <option class="data-menaje" value="CUCHILLOS" <?php if($tipotarifa=='CUCHILLOS') echo('selected'); ?>>CUCHILLOS</option>
           <option class="data-lineablanca" value="DISPENSADOR DE AGUA" <?php if($tipotarifa=='DISPENSADOR DE AGUA') echo('selected'); ?>>DISPENSADOR DE AGUA</option>
           <option class="data-lineablanca" value="ESTUFA" <?php if($tipotarifa=='ESTUFA') echo('selected'); ?>>ESTUFA</option>
           <option class="data-menaje" value="HORNEAR" <?php if($tipotarifa=='HORNEAR') echo('selected'); ?>>HORNEAR</option>
           <option class="data-lineablanca" value="LAVADORA" <?php if($tipotarifa=='LAVADORA') echo('selected'); ?>>LAVADORA</option>
           <option class="data-lineablanca" value="LAVAVAJILLA" <?php if($tipotarifa=='LAVAVAJILLA') echo('selected'); ?>>LAVAVAJILLA</option>
           <option class="data-lineablanca" value="MICROONDA" <?php if($tipotarifa=='MICROONDA') echo('selected'); ?>>MICROONDA</option>
           <option class="data-menaje" value="OLLAS Y SARTENES" <?php if($tipotarifa=='OLLAS Y SARTENES') echo('selected'); ?>>OLLAS Y SARTENES</option>
           <option class="data-menaje" value="RECIPIENTES" <?php if($tipotarifa=='RECIPIENTES') echo('selected'); ?>>RECIPIENTES</option>
           <option class="data-lineablanca" value="REFRIGERADOR" <?php if($tipotarifa=='REFRIGERADOR') echo('selected'); ?>>REFRIGERADOR</option>
           <option class="data-lineablanca" value="SECADOR" <?php if($tipotarifa=='SECADOR') echo('selected'); ?>>SECADOR</option>
           <option class="data-menaje" value="UTENSILIOS" <?php if($tipotarifa=='UTENSILIOS') echo('selected'); ?>>UTENSILIOS</option>
           <option class="data-menaje" value="VAJILLA" <?php if($tipotarifa=='VAJILLA') echo('selected'); ?>>VAJILLA</option>
         </select>
       </div>
       <div class="form-group">
         <label class="control-label">Modelo</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="modelo" name="modelo" ng-model="model.modelo" value="<?= $modelo ?>" required="">
       </div>
       <div class="form-group">
         <label class="control-label">Producto</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="producto" name="producto" ng-model="model.producto" value="<?= $producto ?>" required="">
       </div>
       <div class="form-group">
         <label class="control-label">País</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="pais" name="pais" ng-model="model.pais" value="<?= $pais ?>" required="">
       </div>
       <div class="form-group">
         <button type="submit" class="btn btn-primary">Actualizar</button>
         <button type="reset" class="btn btn-default" onclick="javaScript: window.location.href='productos.php'">Cancelar</button>
       </div>
     </fieldset>
     <input type="hidden" value="1" name="postback">
     <input type="hidden" value="<?= $id_producto ?>" name="id">
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
