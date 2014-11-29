<div class="navbar colorVert navbar-inverse navbar-fixed-top" role="navigation">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="index.php">PENLESS</a>
        </div>
        <div class="navbar-collapse collapse">
          <ul class="nav navbar-nav navbar-right">
            <li><a href=<?php echo '/?&U='.$_SESSION["id"]; ?> >Mon compte</a></li>
            <li><a href="../../Controller/processDisconnection.php">Deconnexion</a></li>
          </ul>

          <div class="navbar-form navbar-right">
            <input id="recherche" type="text" autocomplete="off"   class="form-control" placeholder="Search...">
            <div id="labelRecherche"   class="bulleUser bullUser-control" style="display: none">  </div>
          </div>
        </div>
      </div>
    </div>
