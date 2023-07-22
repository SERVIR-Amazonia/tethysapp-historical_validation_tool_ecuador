from tethys_sdk.base import TethysAppBase


class HistoricalValidationToolEcuador(TethysAppBase):
    """
    Tethys app class for Historical Validation Tool Ecuador.
    """

    name = 'Historical Validation Tool Ecuador'
    description = ''
    package = 'historical_validation_tool_ecuador'  # WARNING: Do not change this value
    index = 'home'
    icon = f'{package}/images/icon.gif'
    root_url = 'historical-validation-tool-ecuador'
    color = '#4074dd'
    tags = '"Geoglows", "Ecuador", "Historical data", "Flood forecast"'
    enable_feedback = False
    feedback_emails = []