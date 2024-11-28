import styles from '../styles/header.module.css'
import  Link from 'next/link';
import { useRef } from 'react';
import { useRouter } from 'next/router';
import { TiHome } from "react-icons/ti";
import { LiaSearchLocationSolid } from "react-icons/lia";


export default function Header(){

const router = useRouter();

const localRef = useRef();
const longitudeRef = useRef();
const latitudeRef = useRef();

const localSearching = () => {
    const local = localRef.current.value.trim();
    if (local && typeof local === 'string') {
      router.push(`/localWeather/${encodeURIComponent(local)}`);
    } else {
      alert("Por favor, insira um local válido!");
    }
  };

  const coordinateSearching = () => {
      const latitude = latitudeRef.current.value.trim();
      const longitude = longitudeRef.current.value.trim();

      if (latitude && longitude) {
        router.push(
          `/coordinateWeather/${encodeURIComponent(latitude)},${encodeURIComponent(longitude)}`
        );
      } else {
        alert("Por favor, insira coordenadas válidas!");
      }
  };

    return (
        <header className={styles.header}>
            <Link href='/'><TiHome className={styles.homeIcon}/></Link>
            <div className={styles.searchDiv}>
                <LiaSearchLocationSolid className={styles.searchIcon}/>
                <input type="text" className={styles.search} ref={localRef} placeholder='☀︎ Veja como está o clima nesta localização ❄︎'/>
                <button className={styles.searchButton} title='Pesquisar por nome do local' onClick={localSearching}>Pesquisar</button>
            </div>
            <div className={styles.coordenadaSearch}>
                <input type="text" className={styles.coordenadaInpt} ref={latitudeRef} placeholder='Latitude. Ex: -22.9028'/>
                <input type="text" className={styles.coordenadaInpt} ref={longitudeRef} placeholder='Longitude. Ex: 43.2075'/>
                <button className={styles.searchButton} title='Pesquisar por coordenadas' onClick={coordinateSearching}>Pesquisar</button>
            </div>
        </header>
    )
}