import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { faLocationPin } from '@fortawesome/free-solid-svg-icons';
import { Center, Text, createStyles } from '@mantine/core';
import { FootPrintCardProps } from './FootPrintCard';

const useStyles = createStyles(() => ({
  labeltext: {
    top: 15,
    left: 14,
    position: 'relative',
  },
}));

const containerStyle = {
  width: '100vw',
  height: '80vh',
  maxHeight: '80vw',
  borderRadius: '5px',
};

const mapOptions = {
  mapTypeControl: false,
};

interface mapProps {
  footprints: FootPrintCardProps[];
}

const markerIcon = (color: string) => ({
  path: faLocationPin.icon[4] as string,
  fillColor: color,
  fillOpacity: 1,
  strokeWeight: 1,
  strokeColor: '#ffffff',
  scale: 0.075,
  anchor: new google.maps.Point(
    faLocationPin.icon[0] / 2, // width
    faLocationPin.icon[1] // height
  ),
});

const Map = (props: mapProps) => {
  const { footprints } = props;
  const [mapRef, setMapRef] = useState<any>();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY!, // ,
  });
  const { classes } = useStyles();

  const setBound = (map: google.maps.Map) => {
    if (footprints.length > 1) {
      const bounds = new window.google.maps.LatLngBounds();
      for (let i = 0; i < footprints.length; i += 1) {
        const pos = {
          lat: footprints[i].location.lat,
          lng: footprints[i].location.lng,
        };
        bounds.extend(pos);
      }
      map.fitBounds(bounds);
    } else {
      map.setCenter({
        lat: footprints[0].location.lat,
        lng: footprints[0].location.lng,
      });
      map.setZoom(12);
    }
  };
  const onMapLoad = (map: google.maps.Map) => {
    setMapRef(map);
    setBound(map);
  };

  useEffect(() => {
    if (mapRef) setBound(mapRef);
  }, [footprints]);

  return (
    <Center mx={10} sx={{ position: 'sticky', top: 100 }}>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          zoom={12}
          options={mapOptions}
          onLoad={onMapLoad}
        >
          {footprints.map((fp, idx) => {
            const isLast = idx === footprints.length - 1;
            const pinLabel = {
              text: idx.toString(),
              className: classes.labeltext,
              fontSize: '15px',
            };
            return (
              <Marker
                key={fp.id}
                position={{
                  lat: fp.location.lat,
                  lng: fp.location.lng,
                }}
                label={pinLabel}
                icon={isLast ? markerIcon('#b90e0a') : markerIcon('#1971c2')}
                // Drop animation
                animation={2}
                onClick={() => {
                  window.location.href = `#${idx.toString()}`;
                }}
              />
            );
          })}
        </GoogleMap>
      )}
      {loadError && <Text>Error loading map, sorry</Text>}
    </Center>
  );
};

export default React.memo(Map);
