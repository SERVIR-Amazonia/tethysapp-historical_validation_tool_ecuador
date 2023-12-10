
// ------------------------------------------------------------------------------------------------------------ //
//                                       LOADING METEOROLOGICAL WARNINGS                                        //
// ------------------------------------------------------------------------------------------------------------ // 

  // Alertas meteorologicas INAMHI
  warnings = L.geoJSON(null, {
    style: function (feature) {
      var color;
      if (feature.properties.Nivel === 'Muy Alto') {
        color = '#EF4C4D';
        opacity = 1;
      } else if (feature.properties.Nivel === 'Alto') {
        color = '#FFC44E';
        opacity = 1;
      } else if (feature.properties.Nivel === 'Medio') {
        color = '#FFFF4D';
        opacity = 1;
      } else {
        color = '#FFFFFF';
        opacity = 1;
      }
  
      return {
        fillColor: color,
        fillOpacity: opacity,
        stroke: true,
        color: color,
        weight: 1
      };
    }
  });
    
  // Filtrar alertas
  function filter_warnings(data, nivel){
    var filteredFeatures = data.features.filter(function(feature) {
      return feature.properties.Nivel === nivel;
    });
    return(filteredFeatures )
  }
    
  // URL y parametros del recurso de hydroshare
  var url = 'https://geoserver.hydroshare.org/geoserver/HS-e1920951d6194c78948e45ae7b08ec64/wfs';
  var params = {
    service: 'WFS',
    version: '1.1.0',
    request: 'GetFeature',
    typeName: 'Advertencia',
    outputFormat: 'application/json'
  }; 
    
  // Carga los datos WFS utilizando AJAX y agrega los resultados a la capa geoJSON
  $.ajax({
    url: url,
    data: params,
    dataType: 'json'
  }).done(function(response){
      console.log("Funciona");
    alertas =  {
      type: 'FeatureCollection',
      features: filter_warnings(response, "Medio").concat(
                filter_warnings(response, "Alto"),
                filter_warnings(response, "Muy Alto")) };
    warnings.addData(alertas);
    console.log("Termina");
  });
  
  



  var legendWarning = L.control({ position: 'bottomleft' });
  legendWarning.onAdd = function(map) {
      var div = L.DomUtil.create('div', 'legend');
      div.innerHTML = `<div style='background-color:rgba(255,255,255,0.8); width:350px !important'>
                            <div style='margin: 12px !important; padding-bottom:10px !important; padding-top: 5px !important;'>
                                <div style='font-size:14px; font-weight:bold; padding-bottom:6px;'>Niveles de alerta por lluvias y tormentas:</div>
                                <table class="table-warning" id="table-warning-selector" style="width:330px !important">
                                    <tr class="tr-warning">
                                        <th class="th-warning bajo">Bajo</th>
                                        <th class="th-warning medio">Medio</th>
                                        <th class="th-warning alto">Alto</th>
                                        <th class="th-warning muy-alto">Muy Alto</th>
                                    </tr>
                                </table>
                            </div>
                      </div>`;
      return div;
  }; 


  $('#check-warning').on('change', function () {
      if($('#check-warning').is(':checked')){
          warnings.addTo(map);
          
          var layers = warnings.getLayers();
          if (layers[0].feature.properties.Nivel === "Medio") { 
              layers.reverse();
          }
          for (var i = 0; i < layers.length; i++) {
            layers[i].bringToBack();
          }

          legendWarning.addTo(map);
          $('#table-warning-selector').on('click', function () {
            $('#warning-modal').modal('show');
          });
      } else {
          map.removeLayer(warnings); 
          map.removeControl(legendWarning);
      };
  }); 
  
