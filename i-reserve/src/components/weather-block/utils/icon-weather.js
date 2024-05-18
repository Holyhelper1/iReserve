const SUN_ICON =
	'https://cdn.icon-icons.com/icons2/8/PNG/256/sunrise_sun_sunny_shower_showers_sunny_cloudy_fog_day_time_1458.png';
const RAIN_ICON =
	'https://cdn.icon-icons.com/icons2/2533/PNG/512/rain_weather_icon_151998.png';
const CLOUDY_ICON =
	'https://cdn.icon-icons.com/icons2/588/PNG/96/cloud_weather_cloudy_forecast_sky_icon-icons.com_55350.png';
const SNOW_ICON = 'https://cdn.icon-icons.com/icons2/412/PNG/96/Snow_41027.png';

export const createWetherIcon = (weatherPhrase) => {
	if (weatherPhrase.includes('солн')) {
		return SUN_ICON;
	} else if (weatherPhrase.includes('дожд')) {
		return RAIN_ICON;
	} else if (weatherPhrase.includes('ясн')) {
		return SUN_ICON;
	} else if (weatherPhrase.includes('пасмурн')) {
		return CLOUDY_ICON;
	} else if (weatherPhrase.includes('облачно')) {
		return CLOUDY_ICON;
	} else if (weatherPhrase.includes('снег')) {
		return SNOW_ICON;
	} else if (weatherPhrase.includes('снеж')) {
		return SNOW_ICON;
	}
};
