import { apiKey, weatherLocation, weatherInfos } from '../../api/weatherAPI';
import styles from '../../styles/local.module.css';

import { BsClouds, BsCloudSnow, BsCloudHaze } from "react-icons/bs";
import { CiSun, CiCloudDrizzle } from "react-icons/ci";
import { IoRainyOutline, IoThunderstormOutline } from "react-icons/io5";
import { RiMistFill } from "react-icons/ri";
import { WiFog, WiSandstorm, WiSmoke, WiDust} from "react-icons/wi";
import { TbVolcano } from "react-icons/tb";
import { FiWind } from "react-icons/fi";
import { LuTornado } from "react-icons/lu";

export async function getServerSideProps(context){

  const { local } = context.params;

  if (!local) {
    return {
        props: {
            error: "Local não fornecido.",
        },
    };
}
  try{
    const coordinateLocal = await weatherLocation(apiKey, local);

    if (!coordinateLocal || !coordinateLocal.lat || !coordinateLocal.lon) {
      return {
          props: { error: "Coordenadas não encontradas para o local fornecido." },
      };
    }

    if(coordinateLocal){
      const { lat, lon } = coordinateLocal;
      const localData = await weatherInfos(lat, lon);
      if (localData && localData.main && localData.weather && localData.sys){
        return{
          props: {
            local,
            localData: {
              temperature: localData.main.temp,
              mintemperature: localData.main.temp_min,
              maxtemperature: localData.main.temp_max,
              main: localData.weather[0]?.main,
              description: localData.weather[0]?.description,
              humidity: localData.main.humidity,
              wind_speed: localData.wind.speed,
              pressure: localData.main.pressure,
              felltemperature: localData.main.feels_like,
              country: localData.sys.country || ''
            },
          }
        }
      } else {
          return {
            props: {
                error: "Dados climáticos não encontrados.",
            },
        };
      }
    }
  } catch (error) {
    console.error("Erro ao buscar dados do clima:", error);
    return {
        props: {
            error: "Erro ao buscar dados do clima.",
        },
    };
  }
}

export default function localPageWeather({ local, localData, error }){

  const getWeatherIcon = (mainCondition) => {
      switch (mainCondition) {
        case 'Clear':
          return <CiSun className={styles.localIcon}/>;
        case 'Clouds':
          return <BsClouds className={styles.localIcon}/>;
        case 'Rain':
          return <IoRainyOutline className={styles.localIcon}/>;
        case 'Drizzle':
          return <CiCloudDrizzle className={styles.localIcon}/>;
        case 'Thunderstorm':
          return <IoThunderstormOutline className={styles.localIcon}/>;
        case 'Snow':
          return <BsCloudSnow className={styles.localIcon}/>;
        case 'Smoke':
          return <WiSmoke className={styles.localIcon}/>;
        case 'Mist':
          return <RiMistFill className={styles.localIcon}/>;
        case 'Fog':
          return <WiFog className={styles.localIcon}/>;
        case 'Haze':
          return <BsCloudHaze className={styles.localIcon}/>;
        case 'Dust':
          return <WiDust className={styles.localIcon}/>;
        case 'Sand':
          return <WiSandstorm className={styles.localIcon}/>;
        case 'Ash':
          return <TbVolcano className={styles.localIcon}/>;
        case 'Squall':
          return <FiWind className={styles.localIcon}/>;
        case 'Tornado':
          return <LuTornado className={styles.localIcon}/>;
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
      <div className={styles.localPage}>
          <div className={styles.weatherDivLocal}>
              <h1 className={styles.titlePage}>Infomações climáticas de {local}</h1>
              {getWeatherIcon(localData.main)}
              <p className={styles.infoWeather}>Cidade/Local: <span className={styles.dadosLocal}>{local}</span></p>
              <p className={styles.infoWeather}>Temperatura: <span className={styles.dadosLocal}>{localData.temperature}°C</span></p>
              <p className={styles.infoWeather}>Temperatura Máxima: <span className={styles.dadosLocal}>{localData.maxtemperature}°C</span></p>
              <p className={styles.infoWeather}>Temperatura Mínima: <span className={styles.dadosLocal}>{localData.mintemperature}°C</span></p>
              <p className={styles.infoWeather}>Sensação Térmica: <span className={styles.dadosLocal}>{localData.felltemperature}°C</span></p>
              <p className={styles.infoWeather}>Descrição: <span className={styles.dadosLocal}>{upperWords(localData.description)}</span></p>
              <p className={styles.infoWeather}>Humidade: <span className={styles.dadosLocal}>{localData.humidity}%</span></p>
              <p className={styles.infoWeather}>Velocidade do Vento: <span className={styles.dadosLocal}>{localData.wind_speed} m/s</span></p>
              <p className={styles.infoWeather}>Pressão: <span className={styles.dadosLocal}>{localData.pressure} hPa</span></p>
              <p className={styles.infoWeather}>País: <span className={styles.dadosLocal}>{localData.country}</span></p>
          </div>
      </div>
  )
};