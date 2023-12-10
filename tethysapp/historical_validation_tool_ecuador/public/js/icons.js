// ------------------------------------------------------------------------------------------------------------ //
//                                     COLOR MARKER ACCORDING TO THE ALERT                                      //
// ------------------------------------------------------------------------------------------------------------ //

// Function to construct Icon Marker 
function IconMarker(type, rp) {
    const IconMarkerR = new L.Icon({
      iconUrl: `${server}/static/${app_name}/images/${type}/${rp}.png`,
      shadowUrl: `${server}/static/${app_name}/images/${type}/marker-shadow.png`,
      iconSize: [9, 14],
      iconAnchor: [5, 14],
      popupAnchor: [1, -14],
      shadowSize: [14, 14],
    });
    return IconMarkerR;
  }

// Icon markers for STATIONS
const station_R000 = IconMarker("station","0");
const station_R002 = IconMarker("station","2");
const station_R005 = IconMarker("station","5");
const station_R010 = IconMarker("station","10");
const station_R025 = IconMarker("station","25");
const station_R050 = IconMarker("station","50");
const station_R100 = IconMarker("station","100");

function IconParse(feature, latlng) {
    switch (feature.properties.alert) {
        case "R0":
            station_icon = station_R000;
            break;
        case "R2":
            station_icon = station_R002;
            break;
        case "R5":
            station_icon = station_R005;
            break;
        case "R10":
            station_icon = station_R010;
            break;
        case "R25":
            station_icon = station_R025;
            break;
        case "R50":
            station_icon = station_R050;
            break;
        case "R100":
            station_icon = station_R100;
            break;
    }
    return L.marker(latlng, { icon: station_icon });
}

function onEachFeature(feature, layer) {
    layer.bindPopup(
        "<div class='popup-container'>"+
            "<div class='popup-title'><b> DATOS DE LA ESTACION </b></div>"+
               "<table style='font-size:12px'>"+
                "<tbody>"+
                    "<tr>"+
                        "<th class='popup-cell-title popup-cell'>CODIGO: </th>"+
                        "<td class='popup-cell'>" + feature.properties.code.toUpperCase() + "</td>"+
                    "</tr>"+
                    "<tr>"+
                        "<th class='popup-cell-title popup-cell'>NOMBRE: </th>"+
                        "<td class='popup-cell'>" + feature.properties.name.toUpperCase() + "</td>"+
                    "</tr>"+
                    "<tr>"+
                        "<th class='popup-cell-title popup-cell'>RIO: </th>"+
                        "<td class='popup-cell'>" + feature.properties.river.toUpperCase() + "</td>"+
                    "</tr>"+
                    "<tr>"+
                        "<th class='popup-cell-title popup-cell'>CUENCA: </th>"+
                        "<td class='popup-cell'>" + feature.properties.basin.toUpperCase() + "</td>"+
                    "</tr>"+
                    "<tr>"+
                        "<th class='popup-cell-title popup-cell'>LATITUD: </th>"+
                        "<td class='popup-cell'>" + round10(parseFloat(feature.geometry.coordinates[1]), -4) + "</td>"+
                    "</tr>"+
                    "<tr>"+
                        "<th class='popup-cell-title popup-cell'>LONGITUD: </th>"+
                        "<td class='popup-cell'>" + round10(parseFloat(feature.geometry.coordinates[0]), -4) + "</td>"+
                    "</tr>"+
                    "<tr>"+
                        "<th class='popup-cell-title popup-cell'>ALTITUD: </th>"+
                        "<td class='popup-cell'>" + feature.properties.elevation + " msnm</td>"+ 
                    "</tr>"+
                "</tbody>"+
            "</table>"+ 
            "<br>"+ 
            
            "<div data-bs-toggle='tooltip'>"+
                "<div data-bs-toggle='modal' data-bs-target='#panel-modal'>" + 
                    "<button style='font-size:14px !important;' class='btn btn-primary popup-button' onclick='get_data_station(" + 
                        '"' + feature.properties.code + '",' +
                        '"' + feature.properties.comid + '",' +
                        '"' + feature.properties.name + '",' + 
                        '"' + feature.properties.river + '",' + 
                        '"' + feature.properties.basin + '",' + 
                        '"' + round10(parseFloat(feature.geometry.coordinates[1]), -4) + '",' + 
                        '"' + round10(parseFloat(feature.geometry.coordinates[0]), -4) + '",' + 
                        '"' + feature.properties.elevation + '",' + 
                        '"' + feature.properties.loc1 + '",' + 
                        '"' + feature.properties.loc2 + '",' + 
                        '"' + feature.properties.loc3 + '",' + 
                    ");' >"+
                        "<i class='fa fa-download'></i>&nbsp;Visualizar Datos"+
                    "</button>"+
                "</div>"+ 
            "</div>"+
        "</div>");
    layer.openPopup();
};

function add_station_icon(layer, RP){
    return(
        L.geoJSON(layer.features.filter(item => item.properties.alert === RP), {
            pointToLayer: IconParse,
            onEachFeature: onEachFeature,
        }))
} 

