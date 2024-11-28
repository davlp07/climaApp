import { apiKey, weatherLocation, weatherInfos } from '../../api/weatherAPI';
import styles from '../../styles/coordinate.module.css'

import { BsClouds, BsCloudSnow, BsCloudHaze } from "react-icons/bs";
import { CiSun, CiCloudDrizzle } from "react-icons/ci";
import { IoRainyOutline, IoThunderstormOutline } from "react-icons/io5";
import { RiMistFill } from "react-icons/ri";
import { WiFog, WiSandstorm, WiSmoke, WiDust} from "react-icons/wi";
import { TbVolcano } from "react-icons/tb";
import { FiWind } from "react-icons/fi";
import { LuTornado } from "react-icons/lu";

export async function getServerSideProps(context){

    const { coordinate } = context.params;

    if (!coordinate) {
        return {
            props: {
                error: "Coordenadas não fornecidas.",
            },
        };
    }

    const [latitude, longitude] = coordinate.split(",").map(coord => coord.trim());

    if (!latitude || !longitude) {
        return {
            props: {
                error: "Coordenadas inválidas.",
            },
        };
    }

    try {
        const coordinatesWeatherData = await weatherInfos(latitude, longitude);

        // console.log("Latitude:", latitude, "Longitude:", longitude);
        // console.log("Dados do Clima:", coordinatesWeatherData);

        if (  coordinatesWeatherData &&
            coordinatesWeatherData.main &&
            coordinatesWeatherData.weather &&
            coordinatesWeatherData.sys ) {
            return {
                props: {
                    latitude,
                    longitude,
                    coordinatesWeatherData: {
                        temperature: coordinatesWeatherData.main.temp,
                        mintemperature: coordinatesWeatherData.main.temp_min,
                        maxtemperature: coordinatesWeatherData.main.temp_max,
                        main: coordinatesWeatherData.weather[0]?.main,
                        description: coordinatesWeatherData.weather[0]?.description,
                        humidity: coordinatesWeatherData.main.humidity,
                        wind_speed: coordinatesWeatherData.wind.speed,
                        pressure: coordinatesWeatherData.main.pressure,
                        felltemperature: coordinatesWeatherData.main.feels_like,
                        country: coordinatesWeatherData.sys.country || '',
                        local: coordinatesWeatherData.name
                    },
                },
            };
        } else {
            return {
                props: {
                    error: "Dados climáticos não encontrados.",
                },
            };
        }
    } 
    catch (error) {
        console.error("Erro ao buscar dados do clima:", error);
        return {
            props: {
                error: "Erro ao buscar dados do clima.",
            },
        };
    }

};


export default function coordinatePageWeather({ latitude, longitude, coordinatesWeatherData, error }){

    const getWeatherIcon = (mainCondition) => {
        switch (mainCondition) {
          case 'Clear':
            return <CiSun className={styles.coordinateIcon}/>;
          case 'Clouds':
            return <BsClouds className={styles.coordinateIcon}/>;
          case 'Rain':
            return <IoRainyOutline className={styles.coordinateIcon}/>;
          case 'Drizzle':
            return <CiCloudDrizzle className={styles.coordinateIcon}/>;
          case 'Thunderstorm':
            return <IoThunderstormOutline className={styles.coordinateIcon}/>;
          case 'Snow':
            return <BsCloudSnow className={styles.coordinateIcon}/>;
          case 'Smoke':
            return <WiSmoke className={styles.coordinateIcon}/>;
          case 'Mist':
            return <RiMistFill className={styles.coordinateIcon}/>;
          case 'Fog':
            return <WiFog className={styles.coordinateIcon}/>;
          case 'Haze':
            return <BsCloudHaze className={styles.coordinateIcon}/>;
          case 'Dust':
            return <WiDust className={styles.coordinateIcon}/>;
          case 'Sand':
            return <WiSandstorm className={styles.coordinateIcon}/>;
          case 'Ash':
            return <TbVolcano className={styles.coordinateIcon}/>;
          case 'Squall':
            return <FiWind className={styles.coordinateIcon}/>;
          case 'Tornado':
            return <LuTornado className={styles.coordinateIcon}/>;
          default:
            return null;
        }
      };

    const upperWords = (str) =>{
        return str
          .toLowerCase()
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }

    if (error){
        return( 
            <div className={styles.error}><h1>Ocorreu um erro: {error}</h1></div>
        );
    }

    return (
        <div className={styles.coordinatePage}>
            <div className={styles.weatherDivCoordinate}>
                <h1 className={styles.titlePage}>Infomações climáticas das coordenadas: {latitude}, {longitude}</h1>
                {getWeatherIcon(coordinatesWeatherData.main)}
                <p className={styles.infoWeather}>Cidade/Local: <span className={styles.dadosCoordinate}>{coordinatesWeatherData.local}</span></p>
                <p className={styles.infoWeather}>Temperatura: <span className={styles.dadosCoordinate}>{coordinatesWeatherData.temperature}°C</span></p>
                <p className={styles.infoWeather}>Temperatura Máxima: <span className={styles.dadosCoordinate}>{coordinatesWeatherData.maxtemperature}°C</span></p>
                <p className={styles.infoWeather}>Temperatura Mínima: <span className={styles.dadosCoordinate}>{coordinatesWeatherData.mintemperature}°C</span></p>
                <p className={styles.infoWeather}>Sensação Térmica: <span className={styles.dadosCoordinate}>{coordinatesWeatherData.felltemperature}°C</span></p>
                <p className={styles.infoWeather}>Descrição: <span className={styles.dadosCoordinate}>{upperWords(coordinatesWeatherData.description)}</span></p>
                <p className={styles.infoWeather}>Humidade: <span className={styles.dadosCoordinate}>{coordinatesWeatherData.humidity}%</span></p>
                <p className={styles.infoWeather}>Velocidade do Vento: <span className={styles.dadosCoordinate}>{coordinatesWeatherData.wind_speed} m/s</span></p>
                <p className={styles.infoWeather}>Pressão: <span className={styles.dadosCoordinate}>{coordinatesWeatherData.pressure} hPa</span></p>
                <p className={styles.infoWeather}>País: <span className={styles.dadosCoordinate}>{coordinatesWeatherData.country}</span></p>
            </div>
        </div>
    )
};