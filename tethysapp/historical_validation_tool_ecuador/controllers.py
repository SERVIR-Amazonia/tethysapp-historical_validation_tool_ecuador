####################################################################################################
##                                   LIBRARIES AND DEPENDENCIES                                   ##
####################################################################################################

# Tethys platform
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from tethys_sdk.routing import controller
from tethys_sdk.gizmos import PlotlyView
import hydrostats.data as hd

# Postgresql
import io
import psycopg2
import pandas as pd
from sqlalchemy import create_engine
from pandas_geojson import to_geojson

# App settings
from .app import HistoricalValidationToolEcuador as app

# App models
from .models.data import *
from .models.plots import *



####################################################################################################
##                                       STATUS VARIABLES                                         ##
####################################################################################################

# Import enviromental variables 
DB_USER = app.get_custom_setting('DB_USER')
DB_PASS = app.get_custom_setting('DB_PASS')
DB_NAME = app.get_custom_setting('DB_NAME')
APP_NAME = "historical_validation_tool_ecuador"
APP_URL = APP_NAME.replace("_", "-")

# Generate the conection token
tokencon = "postgresql+psycopg2://{0}:{1}@localhost:5432/{2}".format(DB_USER, DB_PASS, DB_NAME)




####################################################################################################
##                                   CONTROLLERS AND REST APIs                                    ##
####################################################################################################
@controller #(name='home', url=APP_URL)
def home(request):
    context = {
        "server": app.get_custom_setting('SERVER'),
        "app_name": APP_NAME
    }
    return render(request, '{0}/home.html'.format(APP_NAME), context)



@controller(name='get_stations',url='{0}/get-stations'.format(APP_URL))
def get_stations(request):
    # Establish connection to database
    db= create_engine(tokencon)
    conn = db.connect()
    # Query to database
    stations = pd.read_sql("select *, concat(code, ' - ', left(name, 23)) from streamflow_station", conn);
    conn.close()
    stations = to_geojson(
        df = stations,
        lat = "latitude",
        lon = "longitude",
        properties = ["basin", "code", "name", "latitude", "longitude", "elevation", "comid", "river", 
                      "loc1", "loc2", "loc3", "alert", "concat"]
    )
    return JsonResponse(stations)


@controller(name='get_rivers',url='{0}/get-rivers'.format(APP_URL))
def get_rivers(request):
    # Establish connection to database
    db = create_engine(tokencon)
    conn = db.connect()
    # Query to database
    stations = pd.read_sql("select * from drainage_network", conn);
    conn.close()
    stations = to_geojson(
        df = stations,
        lat = "latitude",
        lon = "longitude",
        properties = ["comid", "latitude", "longitude", "river", "loc0", "loc1", "loc2", "alert"]
    )
    return JsonResponse(stations)





@controller(name='get_data',url='{0}/get-data'.format(APP_URL))
def get_data(request):
    # Retrieving GET arguments
    station_code = request.GET['codigo']
    station_comid = request.GET['comid']
    station_name = request.GET['nombre']
    plot_width = float(request.GET['width']) - 12
    plot_width_2 = 0.5*plot_width

    # Establish connection to database
    db= create_engine(tokencon)
    conn = db.connect()

    # Data series
    observed_data = get_format_data("select datetime, {0} from streamflow_data order by datetime;".format(station_code), conn)
    simulated_data = get_format_data("select * from r_{0} where datetime < '2022-06-01 00:00:00';".format(station_comid), conn)
    corrected_data = get_bias_corrected_data(simulated_data, observed_data)
    
    # Raw forecast
    ensemble_forecast = get_format_data("select * from f_{0};".format(station_comid), conn)
    forecast_records = get_format_data("select * from fr_{0};".format(station_comid), conn)
    return_periods = get_return_periods(station_comid, simulated_data)

    # Corrected forecast
    corrected_ensemble_forecast = get_corrected_forecast(simulated_data, ensemble_forecast, observed_data)
    corrected_forecast_records = get_corrected_forecast_records(forecast_records, simulated_data, observed_data)
    corrected_return_periods = get_return_periods(station_comid, corrected_data)

    # Stats for raw and corrected forecast
    ensemble_stats = get_ensemble_stats(ensemble_forecast)
    corrected_ensemble_stats = get_ensemble_stats(corrected_ensemble_forecast)

    # Merge data (For plots)
    global merged_sim
    merged_sim = hd.merge_data(sim_df = simulated_data, obs_df = observed_data)
    global merged_cor
    merged_cor = hd.merge_data(sim_df = corrected_data, obs_df = observed_data)

    # Close conection
    conn.close()

    # Historical data plot
    corrected_data_plot = get_historic_simulation(
        sim = simulated_data, 
        cor = corrected_data, 
        obs = observed_data, 
        comid = station_comid)
    
    # Daily averages plot
    daily_average_plot = get_daily_average_plot(
        sim = merged_sim,
        cor = merged_cor,
        code = station_code,
        name = station_name) 
    
    # Monthly averages plot
    monthly_average_plot = get_monthly_average_plot(
        sim = merged_sim,
        cor = merged_cor,
        code = station_code,
        name = station_name) 
    
    # Scatter plot (Log scale)
    data_scatter_plot = get_scatter_plot(
        sim = merged_sim,
        cor = merged_cor,
        code = station_code,
        name = station_name,
        log = False) 
    
    # Scatter plot
    log_data_scatter_plot = get_scatter_plot(
        sim = merged_sim,
        cor = merged_cor,
        code = station_code,
        name = station_name,
        log = True) 
    
    # Acumulated volume plot
    acumulated_volume_plot = get_acumulated_volume_plot(
        sim = merged_sim,
        cor = merged_cor,
        code = station_code,
        name = station_name)
    
    # Ensemble forecast plot
    ensemble_forecast_plot = get_forecast_stats(
        stats = ensemble_stats, 
        rperiods = return_periods, 
        records = forecast_records, 
        sim = simulated_data,
        code = station_code,
        name = station_name)
    
    # Corrected Ensemble forecast plot
    corrected_ensemble_forecast_plot = get_forecast_stats(
        stats = corrected_ensemble_stats, 
        rperiods = corrected_return_periods, 
        records = corrected_forecast_records, 
        sim = corrected_data,
        code = station_code,
        name = station_name)
    
    # Metrics table
    metrics_table = get_metrics_table(
        cor = merged_cor,
        sim = merged_sim,
        my_metrics = ["ME", "RMSE", "NRMSE (Mean)", "NSE", "KGE (2009)", "KGE (2012)", "R (Pearson)", "R (Spearman)", "r2"]) 
    
    # Percent of Ensembles that Exceed Return Periods
    forecast_table = get_probabilities_table(
        stats = ensemble_stats, 
        ensem = ensemble_forecast, 
        rperiods = return_periods)
    corrected_forecast_table = get_probabilities_table(
        stats = corrected_ensemble_stats, 
        ensem = corrected_ensemble_forecast, 
        rperiods = corrected_return_periods)
    
    #returning
    context = {
        "corrected_data_plot": PlotlyView(corrected_data_plot.update_layout(width = plot_width)),
        "daily_average_plot": PlotlyView(daily_average_plot.update_layout(width = plot_width)),
        "monthly_average_plot": PlotlyView(monthly_average_plot.update_layout(width = plot_width)),
        "data_scatter_plot": PlotlyView(data_scatter_plot.update_layout(width = plot_width_2)),
        "log_data_scatter_plot": PlotlyView(log_data_scatter_plot.update_layout(width = plot_width_2)),
        "acumulated_volume_plot": PlotlyView(acumulated_volume_plot.update_layout(width = plot_width)),
        "ensemble_forecast_plot": PlotlyView(ensemble_forecast_plot.update_layout(width = plot_width)),
        "corrected_ensemble_forecast_plot": PlotlyView(corrected_ensemble_forecast_plot.update_layout(width = plot_width)),
        "metrics_table": metrics_table,
        "forecast_table": forecast_table,
        "corrected_forecast_table": corrected_forecast_table,
    }
    return render(request, '{0}/panel.html'.format(app.package), context)



@controller(name='get_metrics_custom',url='{0}/get-metrics-custom'.format(APP_URL))
def get_metrics_custom(request):
    # Combine metrics
    my_metrics_1 = ["ME", "RMSE", "NRMSE (Mean)", "NSE", "KGE (2009)", "KGE (2012)", "R (Pearson)", "R (Spearman)", "r2"]
    my_metrics_2 = request.GET['metrics'].split(",")
    lista_combinada = my_metrics_1 + my_metrics_2
    elementos_unicos = []
    elementos_vistos = set()
    for elemento in lista_combinada:
        if elemento not in elementos_vistos:
            elementos_unicos.append(elemento)
            elementos_vistos.add(elemento)
    # Compute metrics
    metrics_table = get_metrics_table(
                        cor = merged_cor,
                        sim = merged_sim,
                        my_metrics = elementos_unicos)
    return HttpResponse(metrics_table)







@controller(name='get_raw_forecast_date',url='{0}/get-raw-forecast-date'.format(APP_URL))
def get_raw_forecast_date(request):
    ## Variables
    station_code = request.GET['codigo']
    station_comid = request.GET['comid']
    station_name = request.GET['nombre']
    forecast_date = request.GET['fecha']
    plot_width = float(request.GET['width']) - 12

    # Establish connection to database
    db= create_engine(tokencon)
    conn = db.connect()

    # Data series
    observed_data = get_format_data("select datetime, {0} from streamflow_data order by datetime;".format(station_code), conn)
    simulated_data = get_format_data("select * from r_{0} where datetime < '2022-06-01 00:00:00';".format(station_comid), conn)
    corrected_data = get_bias_corrected_data(simulated_data, observed_data)
    
    # Raw forecast
    ensemble_forecast = get_forecast_date(station_comid, forecast_date)
    forecast_records = get_format_data("select * from fr_{0};".format(station_comid), conn)
    #forecast_records = get_forecast_record_date(station_comid, forecast_date)
    return_periods = get_return_periods(station_comid, simulated_data)

    # Corrected forecast
    corrected_ensemble_forecast = get_corrected_forecast(simulated_data, ensemble_forecast, observed_data)
    corrected_forecast_records = get_corrected_forecast_records(forecast_records, simulated_data, observed_data)
    corrected_return_periods = get_return_periods(station_comid, corrected_data)
    
    # Forecast stats
    ensemble_stats = get_ensemble_stats(ensemble_forecast)
    corrected_ensemble_stats = get_ensemble_stats(corrected_ensemble_forecast)

    # Close conection
    conn.close()
    
    # Ensemble forecast plot
    ensemble_forecast_plot = get_forecast_stats(
        stats = ensemble_stats, 
        rperiods = return_periods, 
        records = forecast_records, 
        sim = simulated_data,
        code = station_code,
        name = station_name).update_layout(width = plot_width).to_html()
    
    # Corrected Ensemble forecast plot
    corr_ensemble_forecast_plot = get_forecast_stats(
        stats = corrected_ensemble_stats, 
        rperiods = corrected_return_periods, 
        records = corrected_forecast_records, 
        sim = corrected_data,
        code = station_code,
        name = station_name).update_layout(width = plot_width).to_html()
    
    # Percent of Ensembles that Exceed Return Periods
    forecast_table = get_probabilities_table(
        stats = ensemble_stats, 
        ensem = ensemble_forecast, 
        rperiods = return_periods)
    corr_forecast_table = get_probabilities_table(
        stats = corrected_ensemble_stats, 
        ensem = corrected_ensemble_forecast, 
        rperiods = corrected_return_periods)

    return JsonResponse({
       'ensemble_forecast_plot': ensemble_forecast_plot,
       'forecast_table': forecast_table,
       'corr_ensemble_forecast_plot': corr_ensemble_forecast_plot,
       'corr_forecast_table': corr_forecast_table
    })
    




@controller(name='get_simulated_data_xlsx',url='{0}/get-simulated-data-xlsx'.format(APP_URL))
def get_simulated_data_xlsx(request):
    # Retrieving GET arguments
    station_comid = request.GET['comid'] #9027406
    # Establish connection to database
    db= create_engine(tokencon)
    conn = db.connect()
    # Data series
    simulated_data = get_format_data("select * from r_{0} where datetime < '2022-06-01 00:00:00';;".format(station_comid), conn)
    simulated_data = simulated_data.rename(columns={
                                "streamflow_m^3/s": "Historical simulation (m3/s)"})
    # Crear el archivo Excel
    output = io.BytesIO()
    writer = pd.ExcelWriter(output, engine='xlsxwriter')
    simulated_data.to_excel(writer, sheet_name='serie_historica_simulada', index=True)  # Aquí se incluye el índice
    writer.save()
    output.seek(0)
    # Configurar la respuesta HTTP para descargar el archivo
    response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = 'attachment; filename=serie_historica_simulada.xlsx'
    response.write(output.getvalue())
    return response


@controller(name='get_corrected_data_xlsx',url='{0}/get-corrected-data-xlsx'.format(APP_URL))
def get_corrected_data_xlsx(request):
    # Retrieving GET arguments
    station_code = request.GET['codigo'] #"h0267"
    station_comid = request.GET['comid'] #9027406
    # Establish connection to database
    db= create_engine(tokencon)
    conn = db.connect()
    # Data series
    observed_data = get_format_data("select datetime, {0} from streamflow_data order by datetime;".format(station_code), conn)
    simulated_data = get_format_data("select * from r_{0} where datetime < '2022-06-01 00:00:00';".format(station_comid), conn)
    corrected_data = get_bias_corrected_data(simulated_data, observed_data)

    corrected_data = corrected_data.rename(columns={
                                "Corrected Simulated Streamflow" : "Corrected Simulated Streamflow (m3/s)"})
    # Crear el archivo Excel
    output = io.BytesIO()
    writer = pd.ExcelWriter(output, engine='xlsxwriter')
    corrected_data.to_excel(writer, sheet_name='serie_historica_corregida', index=True)  # Aquí se incluye el índice
    writer.save()
    output.seek(0)
    # Configurar la respuesta HTTP para descargar el archivo
    response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = 'attachment; filename=serie_historica_corregida.xlsx'
    response.write(output.getvalue())
    return response


@controller(name='get_forecast_xlsx',url='{0}/get-forecast-xlsx'.format(APP_URL))
def get_forecast_xlsx(request):
    # Retrieving GET arguments
    station_comid = request.GET['comid']
    forecast_date = request.GET['fecha']
    # Raw forecast
    ensemble_forecast = get_forecast_date(station_comid, forecast_date)
    ensemble_stats = get_ensemble_stats(ensemble_forecast)
    # Crear el archivo Excel
    output = io.BytesIO()
    writer = pd.ExcelWriter(output, engine='xlsxwriter')
    ensemble_stats.to_excel(writer, sheet_name='ensemble_forecast', index=True)  # Aquí se incluye el índice
    writer.save()
    output.seek(0)
    # Configurar la respuesta HTTP para descargar el archivo
    response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = 'attachment; filename=ensemble_forecast.xlsx'
    response.write(output.getvalue())
    return response

@controller(name='get_corrected_forecast_xlsx',url='{0}/get-corrected-forecast-xlsx'.format(APP_URL))
def get_corrected_forecast_xlsx(request):
    # Retrieving GET arguments
    station_code = request.GET['codigo']
    station_comid = request.GET['comid']
    forecast_date = request.GET['fecha']
    # Establish connection to database
    db= create_engine(tokencon)
    conn = db.connect()
    # Data series
    observed_data = get_format_data("select datetime, {0} from streamflow_data order by datetime;".format(station_code), conn)
    simulated_data = get_format_data("select * from r_{0} where datetime < '2022-06-01 00:00:00';".format(station_comid), conn)
    corrected_data = get_bias_corrected_data(simulated_data, observed_data)
    # Raw forecast
    ensemble_forecast = get_forecast_date(station_comid, forecast_date)
    # Corrected forecast
    corrected_ensemble_forecast = get_corrected_forecast(simulated_data, ensemble_forecast, observed_data)
    # Forecast stats
    corrected_ensemble_stats = get_ensemble_stats(corrected_ensemble_forecast)
    # Crear el archivo Excel
    output = io.BytesIO()
    writer = pd.ExcelWriter(output, engine='xlsxwriter')
    corrected_ensemble_stats.to_excel(writer, sheet_name='corrected_ensemble_forecast', index=True)  # Aquí se incluye el índice
    writer.save()
    output.seek(0)
    # Configurar la respuesta HTTP para descargar el archivo
    response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = 'attachment; filename=corrected_ensemble_forecast.xlsx'
    response.write(output.getvalue())
    return response