import styles from '../styles/home.module.css';
import { apiKey, weatherLocation, weatherInfos } from '../api/weatherAPI';

import { FaCloudShowersHeavy } from "react-icons/fa";
import { BsCloudSnowFill, BsClouds, BsCloudSnow, BsCloudHaze } from "react-icons/bs";
import { CiSun, CiCloudDrizzle } from "react-icons/ci";
import { IoRainyOutline, IoThunderstormOutline } from "react-icons/io5";
import { RiMistFill } from "react-icons/ri";
import { WiFog, WiSandstorm, WiSmoke, WiDust} from "react-icons/wi";
import { TbVolcano } from "react-icons/tb";
import { FiWind } from "react-icons/fi";
import { LuTornado } from "react-icons/lu";

export async function getServerSideProps() {
  const cities = ['São Paulo', 'Londres', 'Tokyo', 'Sydney', 'Nova York', 'Cairo', 'Moscou', 'Joanesburgo'];
  const weatherData = await Promise.all(
      cities.map(async (city) => {
          const locationData = await weatherLocation(apiKey, city);
          if (locationData) {
              const { lat, lon } = locationData;
              const climateData = await weatherInfos(lat, lon);
              if (climateData && climateData.main && climateData.weather && climateData.sys) {
                return {
                  city,
                  climateData: {
                    temperature: climateData.main.temp,
                    mintemperature: climateData.main.temp_min,
                    maxtemperature: climateData.main.temp_max,
                    main: climateData.weather[0]?.main,
                    description: climateData.weather[0]?.description,
                    humidity: climateData.main.humidity,
                    wind_speed: climateData.wind.speed,
                    pressure: climateData.main.pressure,
                    sunrise: climateData.sys.sunrise,
                    sunset: climateData.sys.sunset,
                    country: climateData.sys.country || '',
                  }
                };
              }
          }
          return null;
      })
  );

  // Remove entradas nulas no caso de erro na busca
  const validWeatherData = weatherData.filter((data) => data);
  
  return {
      props: { weatherData: validWeatherData },
  };
}

export default function Home({ weatherData = [] }){

  const getWeatherIcon = (mainCondition) => {
    switch (mainCondition) {
      case 'Clear':
        return <CiSun className={styles.weatherIcon}/>;
      case 'Clouds':
        return <BsClouds className={styles.weatherIcon}/>;
      case 'Rain':
        return <IoRainyOutline className={styles.weatherIcon}/>;
      case 'Drizzle':
        return <CiCloudDrizzle className={styles.weatherIcon}/>;
      case 'Thunderstorm':
        return <IoThunderstormOutline className={styles.weatherIcon}/>;
      case 'Snow':
        return <BsCloudSnow className={styles.weatherIcon}/>;
      case 'Smoke':
        return <WiSmoke className={styles.weatherIcon}/>;
      case 'Mist':
        return <RiMistFill className={styles.weatherIcon}/>;
      case 'Fog':
        return <WiFog className={styles.weatherIcon}/>;
      case 'Haze':
        return <BsCloudHaze className={styles.weatherIcon}/>;
      case 'Dust':
        return <WiDust className={styles.weatherIcon}/>;
      case 'Sand':
        return <WiSandstorm className={styles.weatherIcon}/>;
      case 'Ash':
        return <TbVolcano className={styles.weatherIcon}/>;
      case 'Squall':
        return <FiWind className={styles.weatherIcon}/>;
      case 'Tornado':
        return <LuTornado className={styles.weatherIcon}/>;
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

  return(
    <div className={styles.Home}>
        <header>
            <div className={styles.linediv}>
                <span className={styles.beforeh1}></span>
                <FaCloudShowersHeavy className={`${styles.cloudIcons} ${styles.ciOne}`}/>
            </div>
              <h1>SAIBA COMO ESTÁ O CLIMA EM TODO O MUNDO</h1>
            <div className={styles.linediv}>
                <BsCloudSnowFill className={`${styles.cloudIcons} ${styles.ciTwo}`}/>
                <span className={styles.afterh1}></span>
            </div>
        </header>
      <main className={styles.mainWeathers}>
          {weatherData.length > 0 ? (
                weatherData.map(({ city, climateData }, index) => (
                    <div key={index} className={styles.infodiv}>
                        <div className={styles.cityName}>{getWeatherIcon(climateData.main)} <h1 className={styles.h1text}>{city}, {climateData.country}</h1></div>
                        <div className={styles.datadiv}>
                          <p className={styles.info}>Temperatura: <span className={styles.dados}>{climateData.temperature}°C</span></p>
                          <p className={styles.info}>Temperatura Máxima: <span className={styles.dados}>{climateData.maxtemperature}°C</span></p>
                          <p className={styles.info}>Temperatura Mínima: <span className={styles.dados}>{climateData.mintemperature}°C</span></p>
                          <p className={styles.info}>Condição: <span className={styles.dados}>{upperWords(climateData.description)}</span></p>
                          <p className={styles.info}>Umidade: <span className={styles.dados}>{climateData.humidity}%</span></p>
                          <p className={styles.info}>Vento: <span className={styles.dados}>{climateData.wind_speed} m/s</span></p>
                        </div>
                    </div>
                ))
            ) : (
                <p className={styles.info}>Dados não encontrados...</p>
            )}
      </main>
    </div>
  )
}
