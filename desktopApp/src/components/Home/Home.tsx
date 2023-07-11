import Header from 'components/Header';
import styles from './Home.module.scss';
import React, { useEffect, useRef, useState } from 'react';

import mapboxgl from 'mapbox-gl';
import geoJson from './chicago-parks.json';
import ReactDOM from 'react-dom';

interface IMarkerProps {
  onClick: (e: any) => void;
  feature: any;
}

function Marker({ onClick, feature }: IMarkerProps) {
  return (
    <button
      className={styles.marker}
      onClick={() => onClick(feature.properties.description)}
      type="button"
    ></button>
  );
}

function Home() {
  // const TOKEN = process.env.MAPBOX_TOKEN;
  // const TOKEN =
  //   'pk.eyJ1IjoiZGVsYmVydGVyIiwiYSI6ImNsanhuZWd3bzA3cnQzcGp6ZnViand4bTcifQ.i_1YygIcP4dPc3CWOlSTZA';
  mapboxgl.accessToken =
    'pk.eyJ1IjoiZGVsYmVydGVyIiwiYSI6ImNsanhuNjdleTAyMGUzaHBpZmlraWtjc3QifQ.ANklWzEb3cDU8l8E-JhoeA';
  const mapContainerRef = useRef(null);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-87.65, 41.84],
      zoom: 10,
    });

    // Render custom marker components
    geoJson.features.forEach((feature) => {
      // Create a React ref
      const ref = useRef<HTMLDivElement | null>(null);
      // Create a new DOM node and save it to the React ref
      ref.current = document.createElement('div');
      // Render a Marker Component on our new DOM node
      ReactDOM.render(
        <Marker
          onClick={() => {
            window.alert('clicked');
          }}
          feature={feature}
        />,
        ref.current
      );

      // Create a Mapbox Marker at our new DOM node
      new mapboxgl.Marker(ref.current)
        .setLngLat(feature.geometry.coordinates as [number, number])
        .addTo(map);
    });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Clean up on unmount
    return () => map.remove();
  }, []);

  return <div className={styles.Home__map} ref={mapContainerRef} />;
}

export default Home;
