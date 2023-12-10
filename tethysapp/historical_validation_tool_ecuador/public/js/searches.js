// ------------------------------------------------------------------------------------------------------------ //
//                                             HTML FOR SELECTIZE                                               //
// ------------------------------------------------------------------------------------------------------------ //
const searchesHTML = `<div class="control control-group">
                        <label class="label-control" for="select-river">Nombre de río:</label>
                        <select id="select-river" multiple placeholder="Escriba el nombre del río de interés."></select>
                        <label class="label-control" for="select-station">Estación hidrológica:</label>
                        <select id="select-station" multiple placeholder="Escriba el código o nombre de la estación."></select>
                        <label class="label-control" for="select-comid">COMID de río:</label>
                        <select id="select-comid" multiple placeholder="Escriba el COMID del río de interés."></select>
                    </div>`;

// Add HTML into the control panel
$("#searches")[0].innerHTML = searchesHTML;






//  Select box for ZOOM to stations and rivers
fetch("get-stations")
    .then((response) => (layer = response.json()))
    .then((layer) => {
        // Format json as input of selectize
        est_layer = layer.features.map(item => item.properties);
        // Rendering the select box for stations
        $('#select-station').selectize({
            maxItems: 1,
            options: est_layer,
            valueField: 'code',
            labelField:  'concat',
            searchField: ['codigo', 'name', 'concat'],
            create: false,
            onChange: function(value, isOnInitialize) {
                // Station item selected
                est_item = est_layer.filter(item => item.code == value)[0];
                // Remove marker if exists
                if (typeof ss_marker !== 'undefined') {
                    map.removeLayer(ss_marker)
                }
                // Add marker to selected station
                ss_marker = L.circleMarker([est_item.latitude, est_item.longitude], {
                    radius : 7,
                    color  : '#AD2745',
                    opacity: 0.75,
                  }).addTo(map);
                // Bounds
                southWest = L.latLng(est_item.latitude - 0.01, est_item.longitude - 0.01);
                northEast = L.latLng(est_item.latitude + 0.01, est_item.longitude + 0.01);
                bounds = L.latLngBounds(southWest, northEast);
                // Fit the map
                map.fitBounds(bounds);
            }
        });

        // Rendering the select box for rivers
        $('#select-river').selectize({
            maxItems: 1,
            options: est_layer,
            valueField:  'river',
            labelField:  'river',
            searchField: 'river',
            create: false,
            onChange: function(value, isOnInitialize) {
                // Station item selected
                river_item = est_layer.filter(item => item.river == value);
                // Remove marker if exists
                if (typeof ss_marker !== 'undefined') {
                    map.removeLayer(ss_marker)
                }
                // Create the layer Groups that contain the selected stations
                ss_marker = L.layerGroup();
                // Add marker to visualize the selected stations
                river_item.map(item => {
                    //L.marker([item.latitud, item.longitud]).addTo(ss_river)
                    L.circleMarker([item.latitude, item.longitude], {
                        radius : 7,
                        color  : '#AD2745',
                        opacity: 0.75,
                      }).addTo(ss_marker);
                });
                ss_marker.addTo(map);
                
                // Coordinates of selected stations
                lon_item = river_item.map(item => item.longitude);
                lat_item = river_item.map(item => item.latitude);
                // Bounds
                southWest = L.latLng(Math.min(...lat_item), Math.min(...lon_item));
                northEast = L.latLng(Math.max(...lat_item), Math.max(...lon_item));
                bounds = L.latLngBounds(southWest, northEast);
                // Fit the map
                map.fitBounds(bounds);
            }
        });

        // Rendering the select box for rivers
        $('#select-comid').selectize({
            maxItems: 1,
            options: est_layer,
            valueField:  'comid',
            labelField:  'comid',
            searchField: 'comid',
            create: false,
            onChange: function(value, isOnInitialize) {
                // Station item selected
                river_item = est_layer.filter(item => item.comid == value);
                // Remove marker if exists
                if (typeof ss_marker !== 'undefined') {
                    map.removeLayer(ss_marker)
                }
                // Create the layer Groups that contain the selected stations
                ss_marker = L.layerGroup();
                // Add marker to visualize the selected stations
                river_item.map(item => {
                    L.circleMarker([item.latitude, item.longitude], {
                        radius : 7,
                        color  : '#AD2745',
                        opacity: 0.75,
                      }).addTo(ss_marker);
                });
                ss_marker.addTo(map);
                
                // Coordinates of selected stations
                lon_item = river_item.map(item => item.longitude);
                lat_item = river_item.map(item => item.latitude);
                // Bounds
                southWest = L.latLng(Math.min(...lat_item), Math.min(...lon_item));
                northEast = L.latLng(Math.max(...lat_item), Math.max(...lon_item));
                bounds = L.latLngBounds(southWest, northEast);
                // Fit the map
                map.fitBounds(bounds);
            }
        });
    });

