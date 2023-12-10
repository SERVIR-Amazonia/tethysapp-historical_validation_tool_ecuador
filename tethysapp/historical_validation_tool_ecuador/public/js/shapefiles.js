// ------------------------------------------------------------------------------------------------------------ //
//                                          HTML FOR SHAPEFILE INPUT                                            //
// ------------------------------------------------------------------------------------------------------------ //
const shp_control =  `
    <div class="control control-group">
        <label for="shpFile" class="label-control">Area geográfica:</label>
        <input class="form-control" type="file" id="shpFile" accept=".shp">
        <div style="color:white; font-size:12px; width: 95%; padding-top: 5px"> El archivo shapefile debe estar proyectado en EPSG:4326 (Coordenadas geográficas) </div>
    </div>`;

    // Add HTML into the control panel
$("#loading-shp")[0].innerHTML = shp_control;




function insert_shapefile(){
    $("#shpFile").on("change",  function(){
        // Lee el archivo desde la entrada de archivos
        var file = document.getElementById('shpFile').files[0];
        // Crea un objeto FileReader para leer el archivo
        var reader = new FileReader();
        reader.onload = function(e) {
            // Convierte el archivo shapefile a GeoJSON usando shpjs
            shp(e.target.result).then(function(geojson) {
                // Crea una capa de Leaflet con los datos del archivo GeoJSON
                if (typeof layerSHP !== 'undefined') {
                    map.removeLayer(layerSHP)
                }
                layerSHP = L.geoJSON(geojson, { style: { weight: 1 } }).addTo(map);
                map.fitBounds(layerSHP.getBounds());
            });
        };
      // Lee el archivo como una URL de datos
      reader.readAsDataURL(file);
    });
}

