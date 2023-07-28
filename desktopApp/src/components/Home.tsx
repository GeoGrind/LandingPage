import styles from './Home.module.scss';
import Map from './Map/Map';

// TODO: fetch the data from firebase

function Home() {
  return (
    <div className={styles.Home}>
      <Map />
    </div>
  );
}

export default Home;
