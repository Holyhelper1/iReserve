import { useEffect, useState } from 'react';
import styles from './weather-block.module.css';
import { createWetherIcon } from './utils/icon-weather';

export const WeatherBlock = () => {
	const [city, setCity] = useState('');
	const [temperature, setTemperature] = useState('');
	const [weather, setWeather] = useState('');
	const [weatherIcon, setWeatherIcon] = useState('');

	useEffect(() => {
		fetch('http://api.sypexgeo.net/json/')
			.then((response) => response.json())
			.then((data) => {
				const cityName = data.city.name_en;

				return cityName;
			})
			.then((cityName) => {
				fetch(
					`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=ru&appid=acd4f346c669d7400f4dbbeb7f1350e0`,
				)
					.then((res) => res.json())
					.then(({ main, name, weather }) => {
						setCity(name);
						setTemperature(Math.round(main.temp));
						setWeather(weather[0].description);
						setWeatherIcon(createWetherIcon(weather[0].description));
					});
			})
			.catch((error) => console.log(error));
	}, []);

	return (
		<div className={styles.footer_weather}>
			<div>
				{city},{' '}
				<div>
					{new Date().toLocaleDateString('ru', {
						day: 'numeric',
						month: 'long',
					})}
				</div>
			</div>
			<div className={styles.footer_weather_text}>
				<div className={styles.footer_weather_block}>
					<div>{weather}</div>
					<div>
						{temperature}°C
						<img
							className={styles.footer_weather_icon}
							src={weatherIcon}
							alt="weather-icon"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
