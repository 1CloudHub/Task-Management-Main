import GoogleMapReact from "google-map-react";
import React, { useEffect, useState } from "react";

const AnyReactComponent = ({ text }) => <div>{text}</div>;

function MapComponent() {
  useEffect(() => {
    getLocation();
  }, []);
  const getLocation = () => {
    // check if user's browser supports Navigator.geolocation
    // setShowMap(!showMap);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        displayLocation,
        showError,
        options
      );
    } else {
      console.log({
        html: "Sorry, your browser does not support this feature... Please Update your Browser to enjoy it",
        classes: "rounded",
      });
    }
  };
  let lat;
  let lng;
  const [mapErrortext, setMapErrortext] = useState(true);

  const showError = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setMapErrortext("You denied the request for your location.");
        break;
      case error.POSITION_UNAVAILABLE:
        setMapErrortext("Your Location information is unavailable.");
        break;
      case error.TIMEOUT:
        setMapErrortext("Your request timed out. Please try again");
        break;
      case error.UNKNOWN_ERROR:
        setMapErrortext(
          "An unknown error occurred please try again after some time."
        );
        break;
    }
  };
  const displayLocation = (position) => {
    lat = position.coords.latitude;
    lng = position.coords.longitude;
    console.log(`Current Latitude is ${lat} and your longitude is ${lng}`);
  };
  const options = {
    enableHighAccuracy: true,
  };
  const center = {
    lat: 13,
    lng: 80,
  };

  const zoom = 11;
  return (
    <>
      <div className="row">
        {/* <p>Map Location (Latitude: 13.304 and longitude: 80.034)</p> */}
      </div>
      <div style={{ height: "63vh" }}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: "",
          }}
          defaultCenter={center}
          defaultZoom={zoom}
        >
          <AnyReactComponent lat={lat} lng={lng} />
        </GoogleMapReact>
      </div>
    </>
  );
}

export default MapComponent;
