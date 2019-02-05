<?php
include 'inc_header.php';
include "../servicios/dbc.php";

//echo("postback->" . $_POST["postback"]);
if($_POST["postback"]){
  $iddistribuidor = $_POST["iddistribuidor"];
  $pais = $_POST["pais"];
  $categoria = $_POST["categoria"];
  $tipo = $_POST["tipo"];
  $razonsocial = $_POST["razonsocial"];

  $q = mysql_query("
  Insert into distribuidores
  (IDDistribuidor, Pais, Categoria, Tipo, RazonSocial, Status)
  Values
  ('$iddistribuidor', '$pais', '$categoria', '$tipo', '$razonsocial', 1)
  ") or die(mysql_error());

  echo("<script>alert('Registro exitoso'); window.location.href='distribuidores.php';</script>");
}
?>
<div class="xs">
   <h3>Nuevo distribuidor</h3>
   <p><?= $mensaje ?></p>
   <div class="well1 white">
   <form class="form-floating ng-pristine ng-invalid ng-invalid-required ng-valid-email ng-valid-url ng-valid-pattern" action="distribuidores_registrar.php" method="POST">
     <fieldset>
       <div class="form-group">
         <label class="control-label">IDDistribuidor</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="iddistribuidor" name="iddistribuidor" ng-model="model.iddistribuidor" required="">
       </div>
       <div class="form-group">
         <label class="control-label">País</label>
         <select class="form-control1 ng-invalid ng-invalid-required" id="pais" name="pais" ng-model="model.pais" required="">
           <option value="? undefined:undefined ?"></option>
           <option value="Argentina">Argentina</option>
           <option value="Bolivia">Bolivia</option>
           <option value="Chile">Chile</option>
           <option value="Colombia">Colombia</option>
           <option value="Costa Rica">Costa Rica</option>
           <option value="Ecuador">Ecuador</option>
           <option value="EE.UU.">EE.UU.</option>
           <option value="El Salvador">El Salvador</option>
           <option value="Guatemala">Guatemala</option>
           <option value="Honduras">Honduras</option>
           <option value="Nicaragua">Nicaragua</option>
           <option value="Panamá">Panamá</option>
           <option value="Perú">Perú</option>
           <option value="Puerto Rico">Puerto Rico</option>
           <option value="República Dominicana">República Dominicana</option>
           <option value="Uruguay">Uruguay</option>
           <option value="Venezuela">Venezuela</option>
         </select>
       </div>
       <div class="form-group">
         <label class="control-label">Categoría</label>
         <select class="form-control1 ng-invalid ng-invalid-required" id="categoria" name="categoria" ng-model="model.categoria" required=""><option value="? undefined:undefined ?"></option>
           <option value="LINEA BLANCA">LINEA BLANCA</option>
           <option value="MENAJE">MENAJE</option>
         </select>
       </div>
       <div class="form-group">
         <label class="control-label">Tipo</label>
         <select class="form-control1 ng-invalid ng-invalid-required" id="tipo" name="tipo" ng-model="model.tipo" required="">
           <option value="? undefined:undefined ?"></option>
           <option value="Distribuidor">Distribuidor</option>
           <option value="Cadena">Cadena</option>
           <option value="Regional">Regional</option>
           <option value="Institucional">Institucional</option>
           <option value="Walmart">Walmart</option>
           <option value="Nicaragua">Nicaragua</option>
         </select>
       </div>
       <div class="form-group">
         <label class="control-label">Nombre</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="razonsocial" name="razonsocial" ng-model="model.razonsocial" value="<?= $razonsocial ?>" required="">
       </div>
       <div class="form-group">
         <button type="submit" class="btn btn-primary">Registrar</button>
         <button type="reset" class="btn btn-default" onclick="javaScript: window.location.href='distribuidores.php'">Cancelar</button>
       </div>
     </fieldset>
     <input type="hidden" value="1" name="postback">
     <input type="hidden" value="<?= $id_producto ?>" name="id">
   </form>
 </div>
</div>
<?php include 'inc_footer.php'; ?>
<script src="js/custom.js"></script>
