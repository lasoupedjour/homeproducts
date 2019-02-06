<ul class="nav" id="side-menu">
    <li>
        <a href="productos.php" <?php if($_global_active=="productos") echo("class='active'"); ?>><i class="fab fa-product-hunt nav_icon"></i>Productos</a>
    </li>
    <li>
        <a href="refacciones.php" <?php if($_global_active=="refacciones") echo("class='active'"); ?>><i class="fa fa-laptop nav_icon"></i>Refacciones</a>
    </li>
    <li>
        <a href="tarifas.php" <?php if($_global_active=="tarifas") echo("class='active'"); ?>><i class="fas fa-donate nav_icon"></i>Tarifas</a>
    </li>
    <li>
        <a href="centros.php" <?php if($_global_active=="centros") echo("class='active'"); ?>><i class="fas fa-toolbox nav_icon"></i>CDs/Red</a>
    </li>
    <li>
        <a href="distribuidores.php" <?php if($_global_active=="distribuidores") echo("class='active'"); ?>><i class="fas fa-shipping-fast nav_icon"></i>Distribuidores</a>
    </li>
</ul>
