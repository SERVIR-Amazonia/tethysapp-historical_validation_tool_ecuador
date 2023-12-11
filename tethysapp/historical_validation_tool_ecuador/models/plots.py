####################################################################################################
##                                   LIBRARIES AND DEPENDENCIES                                   ##
####################################################################################################
import geoglows
import numpy as np
import math
import plotly.graph_objs as go
import hydrostats.data as hd
import hydrostats as hs
import datetime as dt
import pandas as pd
import jinja2
import os

####################################################################################################
##                                  AUXILIAR PLOTTING FUNCTIONS                                   ##
####################################################################################################
def _plot_colors():
    return {
        '2 Year': 'rgba(254, 240, 1, .4)',
        '5 Year': 'rgba(253, 154, 1, .4)',
        '10 Year': 'rgba(255, 56, 5, .4)',
        '20 Year': 'rgba(128, 0, 246, .4)',
        '25 Year': 'rgba(255, 0, 0, .4)',
        '50 Year': 'rgba(128, 0, 106, .4)',
        '100 Year': 'rgba(128, 0, 246, .4)',
    }


def _rperiod_scatters(startdate: str, enddate: str, rperiods: pd.DataFrame, y_max: float, max_visible: float = 0):
    colors = _plot_colors()
    x_vals = (startdate, enddate, enddate, startdate)
    r2 = round(rperiods['return_period_2'].values[0], 1)
    if max_visible > r2:
        visible = True
    else:
        visible = 'legendonly'

    def template(name, y, color, fill='toself'):
        return go.Scatter(
            name=name,
            x=x_vals,
            y=y,
            legendgroup='returnperiods',
            fill=fill,
            visible=visible,
            mode="lines",
            line=dict(color=color, width=0))

    r5 = round(rperiods['return_period_5'].values[0], 1)
    r10 = round(rperiods['return_period_10'].values[0], 1)
    r25 = round(rperiods['return_period_25'].values[0], 1)
    r50 = round(rperiods['return_period_50'].values[0], 1)
    r100 = round(rperiods['return_period_100'].values[0], 1)
    rmax = int(max(2 * r100 - r25, y_max))
    
    return [
        template('Periodos de retorno', (rmax, rmax, rmax, rmax), 'rgba(0,0,0,0)', fill='none'),
        template(f'2 años: {r2}', (r2, r2, r5, r5), colors['2 Year']),
        template(f'5 años: {r5}', (r5, r5, r10, r10), colors['5 Year']),
        template(f'10 años: {r10}', (r10, r10, r25, r25), colors['10 Year']),
        template(f'25 años: {r25}', (r25, r25, r50, r50), colors['25 Year']),
        template(f'50 años: {r50}', (r50, r50, r100, r100), colors['50 Year']),
        template(f'100 años: {r100}', (r100, r100, rmax, rmax), colors['100 Year']),
    ]



####################################################################################################
##                                      PLOTTING FUNCTIONS                                        ##
####################################################################################################

# Plotting daily averages values
def get_daily_average_plot(sim, cor, code, name):
    # Generate the average values
    daily_avg_sim = hd.daily_average(sim)
    daily_avg_cor = hd.daily_average(cor)
    # Generate the plots on Ploty
    daily_avg_obs_Q = go.Scatter(x = daily_avg_sim.index, y = daily_avg_sim.iloc[:, 1].values, name = 'Observado', )
    daily_avg_sim_Q = go.Scatter(x = daily_avg_sim.index, y = daily_avg_sim.iloc[:, 0].values, name = 'Simulado', )
    daily_avg_corr_sim_Q = go.Scatter(x = daily_avg_cor.index, y = daily_avg_cor.iloc[:, 0].values, name = 'Corregido', )
    # PLot Layout
    layout = go.Layout(
        title='Caudal medio multi-diario<br>{0} - {1}'.format(str(code).upper(), name),
        xaxis=dict(title='Día del año'), 
        yaxis=dict(title='Caudal (m<sup>3</sup>/s)', autorange=True),
        plot_bgcolor='white',
        paper_bgcolor='white',
        template='simple_white',
        showlegend=True)
    # Generate the output
    chart_obj = go.Figure(data=[daily_avg_obs_Q, daily_avg_sim_Q, daily_avg_corr_sim_Q], layout=layout)
    chart_obj.update_yaxes(linecolor='gray', mirror=True, showline=True) 
    chart_obj.update_xaxes(linecolor='gray', mirror=True, showline=True) 
    return(chart_obj)


# Plotting monthly averages values
def get_monthly_average_plot(sim, cor, code, name):
    # Generate the average values
    monthly_avg_sim = hd.monthly_average(sim)
    monthly_avg_cor = hd.monthly_average(cor)
    # Generate the plots on Ploty
    monthly_avg_obs_Q = go.Scatter(x = monthly_avg_sim.index, y = monthly_avg_sim.iloc[:, 1].values, name = 'Observado', )
    monthly_avg_sim_Q = go.Scatter(x = monthly_avg_sim.index, y = monthly_avg_sim.iloc[:, 0].values, name = 'Simulado', )
    monthly_avg_corr_sim_Q = go.Scatter(x = monthly_avg_cor.index, y = monthly_avg_cor.iloc[:, 0].values, name = 'Corregido', )
    # PLot Layout
    layout = go.Layout(
        title='Caudal medio multi-mensual<br>{0} - {1}'.format(str(code).upper(), name),
        xaxis=dict(title='Mes'), 
        yaxis=dict(title='Caudal (m<sup>3</sup>/s)', autorange=True),
        plot_bgcolor='white',
        paper_bgcolor='white',
        template='simple_white',
        showlegend=True)
    # Generate the output
    chart_obj = go.Figure(data=[monthly_avg_obs_Q, monthly_avg_sim_Q, monthly_avg_corr_sim_Q], layout=layout)
    chart_obj.update_yaxes(linecolor='gray', mirror=True, showline=True) 
    chart_obj.update_xaxes(linecolor='gray', mirror=True, showline=True) 
    return(chart_obj)
    

# Scatter plot (Simulated/Corrected vs Observed)
def get_scatter_plot(sim, cor, code, name, log):
    merged_cor = cor
    merged_sim = sim
    # Generate Scatter (sim vs obs)
    scatter_data = go.Scatter(
        x = merged_sim.iloc[:, 0].values,
        y = merged_sim.iloc[:, 1].values,
        mode='markers',
        name='Original',
        marker=dict(color='#ef553b'))
    # Generate Scatter (cor vs obs)
    scatter_data2 = go.Scatter(
        x = merged_cor.iloc[:, 0].values,
        y = merged_cor.iloc[:, 1].values,
        mode='markers',
        name='Corregido',
        marker=dict(color='#00cc96'))
    # Get the max and min values
    min_value = min(min(merged_sim.iloc[:, 1].values), min(merged_sim.iloc[:, 0].values))
    max_value = max(max(merged_sim.iloc[:, 1].values), max(merged_sim.iloc[:, 0].values))
    # Construct the line 1:1
    line_45 = go.Scatter(
        x = [min_value, max_value],
        y = [min_value, max_value],
        mode = 'lines',
        name = 'Linea 1:1',
        line = dict(color='black'))
    # Plot Layout
    if log == True:
        layout = go.Layout(title = "Gráfica de dispersión (escala logarítmica) <br>{0} - {1}".format(code.upper(), name),
                       xaxis = dict(title = 'Caudal simulado (m<sup>3</sup>/s)', type = 'log', ), 
                       yaxis = dict(title = 'Caudal observado (m<sup>3</sup>/s)', type = 'log', autorange = True), 
                       showlegend=True,
                       template='simple_white')
    else:
        layout = go.Layout(title = "Gráfica de dispersión <br>{0} - {1}".format(code.upper(), name),
                       xaxis = dict(title = 'Caudal simulado (m<sup>3</sup>/s)',  ), 
                       yaxis = dict(title = 'Caudal observado (m<sup>3</sup>/s)', autorange = True), 
                       showlegend=True,
                       template='simple_white')
    # Plotting data
    chart_obj = go.Figure(data=[scatter_data, scatter_data2, line_45], layout=layout)
    chart_obj.update_yaxes(linecolor='gray', mirror=True, showline=True) 
    chart_obj.update_xaxes(linecolor='gray', mirror=True, showline=True)
    return(chart_obj)



# Acumulate volume
def get_acumulated_volume_plot(sim, cor, code, name):
    merged_sim = sim
    merged_cor = cor
    # Parse dataframe to array
    sim_array = merged_sim.iloc[:, 0].values * 0.0864
    obs_array = merged_sim.iloc[:, 1].values * 0.0864
    cor_array = merged_cor.iloc[:, 0].values * 0.0864
    # Convert from m3/s to Hm3
    sim_volume = sim_array.cumsum()
    obs_volume = obs_array.cumsum()
    cor_volume = cor_array.cumsum()
    # Generate plots
    observed_volume  = go.Scatter(x = merged_sim.index, y = obs_volume, name='Observado', )
    simulated_volume = go.Scatter(x = merged_sim.index, y = sim_volume, name='Simulado', )
    corrected_volume = go.Scatter(x = merged_cor.index, y = cor_volume, name='Corregido', )
    # Plot layouts
    # Plot layouts
    layout = go.Layout(
                title='Volumen acumulado simulado <br>{0} - {1}'.format(str(code).upper(), name),
                xaxis=dict(title='Fecha', ), 
                yaxis=dict(title='Volumen (Mm<sup>3</sup>)', autorange=True),
                showlegend=True,
                template='simple_white')
    # Integrating the plots
    chart_obj = go.Figure(data=[observed_volume, simulated_volume, corrected_volume], layout=layout)
    chart_obj.update_yaxes(linecolor='gray', mirror=True, showline=True) 
    chart_obj.update_xaxes(linecolor='gray', mirror=True, showline=True) 
    return(chart_obj)






def get_historic_simulation(sim, cor, obs, code, name):
    dates = sim.index.tolist()
    startdate = dates[0]
    enddate = dates[-1]
    simulated_data = {
        'x_datetime': sim.index.tolist(),
        'y_flow': sim.values.flatten(),
    }
    corrected_data = {
        'x_datetime': cor.index.tolist(),
        'y_flow': cor.values.flatten(),
    }
    observed_data = {
        'x_datetime': obs.index.tolist(),
        'y_flow': obs.values.flatten(),
    }
    scatter_plots = [
        go.Scatter(name='Simulación histórica', x=simulated_data['x_datetime'], y=simulated_data['y_flow']),
        go.Scatter(name='Simulación histórica corregida', x=corrected_data['x_datetime'], y=corrected_data['y_flow']),
        go.Scatter(name='Datos observados', x=observed_data['x_datetime'], y=observed_data['y_flow'])
    ]
    layout = go.Layout(
        title=f"Simulación histórica <br>{str(code).upper()} - {name}",
        yaxis={'title': 'Caudal (m<sup>3</sup>/s)', 'range': [0, 'auto']},
        xaxis={'title': 'Fecha (UTC +0:00)', 'range': [startdate, enddate], 'hoverformat': '%b %d %Y', 'tickformat': '%Y'},
    )
    figure = go.Figure(scatter_plots, layout=layout)
    figure.update_layout(template='simple_white')
    figure.update_yaxes(linecolor='gray', mirror=True, showline=True) 
    figure.update_xaxes(linecolor='gray', mirror=True, showline=True)
    return figure
    


def get_date_values(startdate, enddate, df):
    date_range = pd.date_range(start=startdate, end=enddate)
    month_day = date_range.strftime("%m-%d")
    pddf = pd.DataFrame()
    pddf.index = month_day
    pddf.index.name = "datetime"
    combined_df = pd.merge(pddf, df, how='left', left_index=True, right_index=True)
    combined_df.index = pd.to_datetime(date_range)
    return(combined_df)



def get_forecast_stats(stats, rperiods, records, sim, code, name):
    # Define the records 
    records = records.loc[records.index >= pd.to_datetime(stats.index[0] - dt.timedelta(days=8))]
    records = records.loc[records.index <= pd.to_datetime(stats.index[0])]
    
    # Start processing the inputs
    dates_forecast = stats.index.tolist()
    dates_records = records.index.tolist()
    try:
        startdate = dates_records[0]
    except:
        startdate = dates_forecast[0]
    enddate = dates_forecast[-1]

    # Generate the average values
    daily = sim.groupby(sim.index.strftime("%m-%d"))
    daymin_df = get_date_values(startdate, enddate, daily.min())
    daymax_df = get_date_values(startdate, enddate, daily.max()) 

    plot_data = {
        'x_stats': stats['flow_avg_m^3/s'].dropna(axis=0).index.tolist(),
        'x_hires': stats['high_res_m^3/s'].dropna(axis=0).index.tolist(),
        'y_max': max(stats['flow_max_m^3/s']),
        'flow_max': list(stats['flow_max_m^3/s'].dropna(axis=0)),
        'flow_75%': list(stats['flow_75%_m^3/s'].dropna(axis=0)),
        'flow_avg': list(stats['flow_avg_m^3/s'].dropna(axis=0)),
        'flow_25%': list(stats['flow_25%_m^3/s'].dropna(axis=0)),
        'flow_min': list(stats['flow_min_m^3/s'].dropna(axis=0)),
        'high_res': list(stats['high_res_m^3/s'].dropna(axis=0)),
    }
    
    plot_data.update(rperiods.to_dict(orient='index').items())
    max_visible = max(max(plot_data['flow_max']), max(plot_data['flow_avg']), max(plot_data['high_res']))
    rperiod_scatters = _rperiod_scatters(startdate, enddate, rperiods, plot_data['y_max'], max_visible)

    scatter_plots = [
        go.Scatter(
            name='Máximos y mínimos históricos',
            x=np.concatenate([daymax_df.index, daymin_df.index[::-1]]),
            y=np.concatenate([daymax_df.iloc[:, 0].values, daymin_df.iloc[:, 0].values[::-1]]),
            legendgroup='historical',
            fill='toself',
            line=dict(color='lightgrey', dash='dash'),
            mode="lines",
        ),
        go.Scatter(
            name='Maximum',
            x=daymax_df.index,
            y=daymax_df.iloc[:, 0].values,
            legendgroup='historical',
            showlegend=False,
            line=dict(color='grey', dash='dash'),
            mode="lines",
        ),
        go.Scatter(
            name='Minimum',
            x=daymin_df.index,
            y=daymin_df.iloc[:, 0].values,
            legendgroup='historical',
            showlegend=False,
            line=dict(color='grey', dash='dash'),
            mode="lines",
        ),

        go.Scatter(name='Máximos y mínimos pronosticados',
                   x=plot_data['x_stats'] + plot_data['x_stats'][::-1],
                   y=plot_data['flow_max'] + plot_data['flow_min'][::-1],
                   legendgroup='boundaries',
                   fill='toself',
                   line=dict(color='lightblue', dash='dash')),
        go.Scatter(name='Máximo pronosticado',
                   x=plot_data['x_stats'],
                   y=plot_data['flow_max'],
                   legendgroup='boundaries',
                   showlegend=False,
                   line=dict(color='darkblue', dash='dash')),
        go.Scatter(name='Minimo pronosticado',
                   x=plot_data['x_stats'],
                   y=plot_data['flow_min'],
                   legendgroup='boundaries',
                   showlegend=False,
                   line=dict(color='darkblue', dash='dash')),

        go.Scatter(name='Rango percentílico 25%-75%',
                   x=plot_data['x_stats'] + plot_data['x_stats'][::-1],
                   y=plot_data['flow_75%'] + plot_data['flow_25%'][::-1],
                   legendgroup='percentile_flow',
                   fill='toself',
                   line=dict(color='lightgreen'), ),
        go.Scatter(name='75%',
                   x=plot_data['x_stats'],
                   y=plot_data['flow_75%'],
                   showlegend=False,
                   legendgroup='percentile_flow',
                   line=dict(color='green'), ),
        go.Scatter(name='25%',
                   x=plot_data['x_stats'],
                   y=plot_data['flow_25%'],
                   showlegend=False,
                   legendgroup='percentile_flow',
                   line=dict(color='green'), ),

        go.Scatter(name='Pronóstico de alta resolución',
                   x=plot_data['x_hires'],
                   y=plot_data['high_res'],
                   line={'color': 'black'}, ),
        go.Scatter(name='Promedio del ensamble',
                   x=plot_data['x_stats'],
                   y=plot_data['flow_avg'],
                   line=dict(color='blue'), ),
    ]
    
    if len(records.index) > 0:
        records_plot = [go.Scatter(
            name='Condiciones antecedentes',
            x=records.index,
            y=records.iloc[:, 0].values,
            line=dict(color='#FFA15A',))]
        scatter_plots += records_plot

    scatter_plots += rperiod_scatters

    layout = go.Layout(
        title=f"Pronóstico de caudales <br>{str(code).upper()} - {name}",
        yaxis={'title': 'Caudal (m<sup>3</sup>/s)', 'range': [0, 'auto']},
        xaxis={'title': 'Fecha (UTC +0:00)', 'range': [startdate, enddate], 'hoverformat': '%b %d %Y %H:%M',
               'tickformat': '%b %d %Y'},
    )
    figure = go.Figure(scatter_plots, layout=layout)
    figure.update_layout(template='simple_white')
    figure.update_yaxes(linecolor='gray', mirror=True, showline=True) 
    figure.update_xaxes(linecolor='gray', mirror=True, showline=True)
    return(figure)




# STREAMFLOW HTML TABLES
def get_probabilities_table(stats, ensem, rperiods):
    dates = stats.index.tolist()
    startdate = dates[0]
    enddate = dates[-1]
    span = enddate - startdate
    uniqueday = [startdate + dt.timedelta(days=i) for i in range(span.days + 2)]
    # get the return periods for the stream reach
    rp2 = rperiods['return_period_2'].values
    rp5 = rperiods['return_period_5'].values
    rp10 = rperiods['return_period_10'].values
    rp25 = rperiods['return_period_25'].values
    rp50 = rperiods['return_period_50'].values
    rp100 = rperiods['return_period_100'].values
    # fill the lists of things used as context in rendering the template
    days = []
    r2 = []
    r5 = []
    r10 = []
    r25 = []
    r50 = []
    r100 = []
    for i in range(len(uniqueday) - 1):  # (-1) omit the extra day used for reference only
        tmp = ensem.loc[uniqueday[i]:uniqueday[i + 1]]
        days.append(uniqueday[i].strftime('%b %d'))
        num2 = 0
        num5 = 0
        num10 = 0
        num25 = 0
        num50 = 0
        num100 = 0
        for column in tmp:
            column_max = tmp[column].to_numpy().max()
            if column_max > rp100:
                num100 += 1
            if column_max > rp50:
                num50 += 1
            if column_max > rp25:
                num25 += 1
            if column_max > rp10:
                num10 += 1
            if column_max > rp5:
                num5 += 1
            if column_max > rp2:
                num2 += 1
        r2.append(round(num2 * 100 / 52))
        r5.append(round(num5 * 100 / 52))
        r10.append(round(num10 * 100 / 52))
        r25.append(round(num25 * 100 / 52))
        r50.append(round(num50 * 100 / 52))
        r100.append(round(num100 * 100 / 52))
    path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'probabilities_table.html'))
    with open(path) as template:
        return jinja2.Template(template.read()).render(
            days=days, 
            r2=r2, 
            r5=r5, 
            r10=r10, 
            r25=r25, 
            r50=r50, 
            r100=r100,
            colors=_plot_colors())


# Metrics table
def get_metrics_table(sim, cor, my_metrics):
    # Metrics for simulated data
    table_sim = hs.make_table(sim, my_metrics)
    table_sim = table_sim.rename(index={'Full Time Series': 'Serie Simulada'})
    table_sim = table_sim.transpose()
    # Metrics for corrected simulation data
    table_cor = hs.make_table(cor, my_metrics)
    table_cor = table_cor.rename(index={'Full Time Series': 'Serie Corregida'})
    table_cor = table_cor.transpose()
    # Merging data
    table_final = pd.merge(table_sim, table_cor, right_index=True, left_index=True)
    table_final = table_final.round(decimals=2)
    table_final = table_final.to_html(classes="table table-hover table-striped", table_id="corrected_1")
    table_final = table_final.replace('border="1"', 'border="0"').replace('<tr style="text-align: right;">','<tr style="text-align: left;">')
    return(table_final)