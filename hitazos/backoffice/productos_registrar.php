<?php
$_global_active = "productos";
include 'inc_header.php';
include "../servicios/dbc.php";

//echo("postback->" . $_POST["postback"]);
if($_POST["postback"]){
  $sap = $_POST["sap"];
  $categoria = $_POST["categoria"];
  $subcategoria = $_POST["subcategoria"];
  $tipotarifa = $_POST["tipotarifa"];
  $modelo = $_POST["modelo"];
  $producto = $_POST["producto"];
  $pais = $_POST["pais"];

  $q = mysql_query("
  Insert into productos (sap, categoria, subcategoria, TipoTarifa, modelo, producto, pais, status)
  Values
  ('$sap', '$categoria', '$subcategoria', '$tipotarifa', '$modelo', '$producto', '$pais', 1)
  ") or die(mysql_error());

  echo("<script>alert('Registro exitoso'); window.location.href='productos.php';</script>");
}
?>
<div class="xs">
   <h3>Nuevo producto</h3>
   <p><?= $mensaje ?></p>
   <div class="well1 white">
   <form class="form-floating ng-pristine ng-invalid ng-invalid-required ng-valid-email ng-valid-url ng-valid-pattern" action="productos_registrar.php" method="POST">
     <fieldset>
       <div class="form-group">
         <label class="control-label">SAP</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="sap" name="sap" ng-model="model.sap" required="">
       </div>
       <div class="form-group">
         <label class="control-label">Categoría</label>
         <select class="form-control1 ng-invalid ng-invalid-required" id="categoria" name="categoria" ng-model="model.categoria" required="">
           <option value="? undefined:undefined ?"></option>
           <option value="LINEA BLANCA">LINEA BLANCA</option>
           <option value="MENAJE">MENAJE</option>
         </select>
       </div>
       <div class="form-group">
         <label class="control-label">Sub categoría</label>
         <select class="form-control1 ng-invalid ng-invalid-required" id="subcategoria" name="subcategoria" ng-model="model.subcategoria" required=""><option value="? undefined:undefined ?"></option>
           <option class="data-lineablanca" value="AIRE ACONDICIONADO">AIRE ACONDICIONADO</option>
           <option class="data-lineablanca" value="CAMPANAS/VENTILACION">CAMPANAS/VENTILACION</option>
           <option class="data-lineablanca" value="CONGELADOR">CONGELADOR</option>
           <option class="data-menaje" value="CUBIERTOS">CUBIERTOS</option>
           <option class="data-menaje" value="CUCHILLOS">CUCHILLOS</option>
           <option class="data-lineablanca" value="DISPENSADOR DE AGUA">DISPENSADOR DE AGUA</option>
           <option class="data-lineablanca" value="ESTUFA">ESTUFA</option>
           <option class="data-menaje" value="HORNEAR">HORNEAR</option>
           <option class="data-lineablanca" value="LAVADORA">LAVADORA</option>
           <option class="data-lineablanca" value="LAVAVAJILLA">LAVAVAJILLA</option>
           <option class="data-lineablanca" value="MICROONDA">MICROONDA</option>
           <option class="data-menaje" value="OLLAS Y SARTENES">OLLAS Y SARTENES</option>
           <option class="data-menaje" value="RECIPIENTES">RECIPIENTES</option>
           <option class="data-lineablanca" value="REFRIGERADOR">REFRIGERADOR</option>
           <option class="data-lineablanca" value="SECADOR">SECADOR</option>
           <option class="data-menaje" value="UTENSILIOS">UTENSILIOS</option>
           <option class="data-menaje" value="VAJILLA">VAJILLA</option>
         </select>
       </div>
       <div class="form-group">
         <label class="control-label">Tipo de tarifa</label>
         <select class="form-control1 ng-invalid ng-invalid-required" id="tipotarifa" name="tipotarifa" ng-model="model.tipotarifa" required=""><option value="? undefined:undefined ?"></option>
           <option class="data-lineablanca" value="AIRE ACONDICIONADO">AIRE ACONDICIONADO</option>
           <option class="data-lineablanca" value="CAMPANAS/VENTILACION">CAMPANAS/VENTILACION</option>
           <option class="data-lineablanca" value="CONGELADOR">CONGELADOR</option>
           <option class="data-menaje" value="CUBIERTOS">CUBIERTOS</option>
           <option class="data-menaje" value="CUCHILLOS">CUCHILLOS</option>
           <option class="data-lineablanca" value="DISPENSADOR DE AGUA">DISPENSADOR DE AGUA</option>
           <option class="data-lineablanca" value="ESTUFA">ESTUFA</option>
           <option class="data-menaje" value="HORNEAR">HORNEAR</option>
           <option class="data-lineablanca" value="LAVADORA">LAVADORA</option>
           <option class="data-lineablanca" value="LAVAVAJILLA">LAVAVAJILLA</option>
           <option class="data-lineablanca" value="MICROONDA">MICROONDA</option>
           <option class="data-menaje" value="OLLAS Y SARTENES">OLLAS Y SARTENES</option>
           <option class="data-menaje" value="RECIPIENTES">RECIPIENTES</option>
           <option class="data-lineablanca" value="REFRIGERADOR">REFRIGERADOR</option>
           <option class="data-lineablanca" value="SECADOR">SECADOR</option>
           <option class="data-menaje" value="UTENSILIOS">UTENSILIOS</option>
           <option class="data-menaje" value="VAJILLA">VAJILLA</option>
         </select>
       </div>
       <div class="form-group">
         <label class="control-label">Modelo</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="modelo" name="modelo" ng-model="model.modelo" required="">
       </div>
       <div class="form-group">
         <label class="control-label">Producto</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="producto" name="producto" ng-model="model.producto" required="">
       </div>
       <div class="form-group">
         <label class="control-label">País</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="pais" name="pais" ng-model="model.pais" required="">
       </div>
       <div class="form-group">
         <button type="submit" class="btn btn-primary">Registrar</button>
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
