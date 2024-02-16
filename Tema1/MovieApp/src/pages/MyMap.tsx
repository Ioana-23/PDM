import { GoogleMap } from '@capacitor/google-maps';
import {useEffect, useRef, useState} from 'react';
import { mapsApiKey } from '../mapsApiKey';

interface MyMapProps {
  lat: number;
  lng: number;
  onMapClick: (e: any) => void,
  onMarkerClick: (e: any) => void,
}

const MyMap: React.FC<MyMapProps> = ({ lat, lng, onMapClick, onMarkerClick }) => {
  const mapRef = useRef<HTMLElement>(null);
  useEffect(myMapEffect, [])

  return (
    <div className="component-wrapper">
      <capacitor-google-map ref={mapRef} style={{
        display: 'block',
        width: 500,
        height: 500
      }}></capacitor-google-map>
    </div>
  );

  function myMapEffect() {
    let canceled = false;
    let googleMap: GoogleMap | null = null;
    if(!googleMap)
    {
      createMap();
    }
    return () => {
      canceled = true;
      googleMap?.removeAllMapListeners();
    }

    async function createMap() {
      if (!mapRef.current) {
        return;
      }

      googleMap = await GoogleMap.create({
        id: 'my-cool-map',
        element: mapRef.current,
        apiKey: mapsApiKey,
        config: {
          center: {lat, lng},
          zoom: 8
        }
      })
      console.log('gm created');
      let myLocationMarkerId = await googleMap.addMarker({coordinate: {lat, lng}, title: 'My location2'});

      await googleMap.setOnMapClickListener(async ({latitude, longitude}) => {
        console.log({myLocationMarkerId});
        // googleMap?.removeMarker(myLocationMarkerId.current!);
        await googleMap?.addMarker({
          coordinate: {lat: latitude, lng: longitude},
          title: 'My location2'
        });
        onMapClick({latitude, longitude});
      });
      await googleMap.setOnMarkerClickListener(({markerId, latitude, longitude}) => {
        onMarkerClick({markerId, latitude, longitude});
      });
    }
  }
}

export default MyMap;
