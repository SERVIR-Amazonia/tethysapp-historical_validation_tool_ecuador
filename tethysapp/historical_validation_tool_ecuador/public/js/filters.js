// ------------------------------------------------------------------------------------------------------------ //
//                                    DATA ON LOCALITIES AND BASIN DISTRICTS                                    //
// ------------------------------------------------------------------------------------------------------------ //

// Localities
let loc = [
    { name: "Todas las provincias", file:"ecuador.geojson"},
    { name: "Azuay", file:"azuay.geojson"},
    { name: "Bolivar", file:"bolivar.geojson"},
    { name: "Cañar", file:"canar.geojson"},
    { name: "Carchi", file:"carchi.geojson"},
    { name: "Chimborazo", file:"chimborazo.geojson"},
    { name: "Cotopaxi", file:"cotopaxi.geojson"},
    { name: "El Oro", file:"el_oro.geojson"},
    { name: "Esmeraldas", file:"esmeraldas.geojson"},
    { name: "Galápagos", file:"galapagos.geojson"},
    { name: "Guayas", file:"guayas.geojson"},
    { name: "Imbabura", file:"imbabura.geojson"},
    { name: "Loja", file:"loja.geojson"},
    { name: "Los Ríos", file:"los_rios.geojson"},
    { name: "Manabí", file:"manabi.geojson"},
    { name: "Morona Santiago", file:"morona_santiago.geojson"},
    { name: "Napo", file:"napo.geojson"},
    { name: "Orellana", file:"orellana.geojson"},
    { name: "Pastaza", file:"pastaza.geojson"},
    { name: "Pinchincha", file:"pichincha.geojson"},
    { name: "Santa Elena", file:"santa_elena.geojson"},
    { name: "Santo Domingo", file:"santo_domingo.geojson"},
    { name: "Sucumbíos", file:"sucumbios.geojson"},
    { name: "Tungurahua", file:"tungurahua.geojson"},
    { name: "Zamora Chinchipe", file:"zamora_chinchipe.geojson"},
];
const loc_url = `${server}/static/historical_validation_tool_ecuador/geojson/loc/`


// River basin districts
let basin = [
    { name: "Todas las demarcaciones", file:"ecuador.geojson"},
    { name: "Demarcación Esmeraldas", file:"esmeraldas.geojson"},
    { name: "Demarcación Guayas", file:"guayas.geojson"},
    { name: "Demarcación Jubones", file:"jubones.geojson"},
    { name: "Demarcación Manabí", file:"manabi.geojson"},
    { name: "Demarcación Mira", file:"mira.geojson"},
    { name: "Demarcación Napo", file:"napo.geojson"},
    { name: "Demarcación Pastaza", file:"pastaza.geojson"},
    { name: "Demarcación Puyango-Catamayo", file:"puyango_catamayo.geojson"},
    { name: "Demarcación Santiago", file:"santiago.geojson"},
];
const basin_url = `${server}/static/historical_validation_tool_ecuador/geojson/basin/`



// Generate options for Localities
loc = loc.map((item) => {
        var option_custom = `<option value="${item.file}">${item.name}</option>`;
        return(option_custom);
    }).join("");

// Generate options for River basin districts
basin = basin.map((item) => {
        var option_custom = `<option value="${item.file}">${item.name}</option>`;
        return(option_custom);
    }).join("");




// ------------------------------------------------------------------------------------------------------------ //
//                                             HTML FOR SELECTIZE                                               //
// ------------------------------------------------------------------------------------------------------------ //
const selectHTML = `<div class="control control-group">
                       <div class="control-group">
                        <label class="label-control" for="select-loc">Provincia:</label>
                        <select id="select-loc" required class="demo-default" placeholder="Seleccione una provincia." name="loc">
                            <option value="">Seleccione una provincia.</option>
                            ${loc}
                        </select>
                        <label class="label-control" for="select-basin">Demarcación Hidrográfica:</label>
                        <select id="select-basin" required class="demo-default" placeholder="Seleccione una demarcación hidrográfica." name="basin">
                            <option value="">Seleccione una demarcación hidrográfica.</option>
                            ${basin}
                        </select>
                    </div>`;

// Add HTML into the control panel
$("#filters")[0].innerHTML = selectHTML;


// Select box for ZOOM to localities (Provincias)
$('#select-loc').selectize({
    create: false,
    //sortField: { field: 'text', direction: 'asc'},
    onChange: function(value, isOnInitialize) {
        // Retrieve geojson from REST API
        fetch(`${loc_url}${value}`)
        .then((response) => (layer = response.json()))
        .then((layer) => {
            // Remove the current layer
            if (typeof layerSHP !== 'undefined') {
                map.removeLayer(layerSHP)
            }
            // Add retrieved layer and fit to map
            if(value === "ecuador.geojson"){
                layerSHP = L.geoJSON(layer, { style:  {color: "#000000", weight: 1.5, fillOpacity: 0} }).addTo(map);
            }else{
                layerSHP = L.geoJSON(layer, { style: { color: "#000000", weight: 2.5, fillOpacity: 0.1} }).addTo(map);
            }
            map.fitBounds(layerSHP.getBounds());
        });
    }
});


// Select box for ZOOM to to basin district
$('#select-basin').selectize({
    create: true,
    //sortField: { field: 'text', direction: 'asc'},
    onChange: function(value, isOnInitialize) {
        // Retrieve geojson from REST API
        fetch(`${basin_url}${value}`)
        .then((response) => (layer = response.json()))
        .then((layer) => {
            // Remove the current layer
            if (typeof layerSHP !== 'undefined') {
                map.removeLayer(layerSHP)
            }
            // Add retrieved layer and fit to map
            if(value === "ecuador.geojson"){
                layerSHP = L.geoJSON(layer, { style: {color: "#000000", weight: 1.5, fillOpacity: 0} }).addTo(map);
            }else{
                layerSHP = L.geoJSON(layer, { style: {color: "#000000", weight: 2.5, fillOpacity: 0.1} }).addTo(map);
            }
            map.fitBounds(layerSHP.getBounds());
        });
    }
});

