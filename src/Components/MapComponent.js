// import GoogleMapReact from "google-map-react";
// import { Marker } from "google-maps-react";
import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { toast } from "react-toastify";

function MapComponent({ mapError, position, mapErrorTxt }) {
  const containerStyle = {
    width: "30vw",
    height: "55vh",
    borderRadius: "30em",
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBs7rvWtf9wbCNzqG4LPfpxM4AQH5wVm1o",
  });

  return isLoaded && mapError == false ? (
    <GoogleMap
      key={"AIzaSyBs7rvWtf9wbCNzqG4LPfpxM4AQH5wVm1o"}
      mapContainerStyle={containerStyle}
      center={position}
      zoom={20}
    >
      <Marker position={position} />
    </GoogleMap>
  ) : (
    <>
      <strong className="card  p-5 text-center rounded text-danger ">
        {mapErrorTxt}
      </strong>
    </>
  );
  // (
  //   useEffect(() => {
  //     getLocation();
  //     getPosition();
  //   }, []);
  //   const getPosition = () => {
  //     console.log(navigator.geolocation.getCurrentPosition(samp));
  //   };
  //   const samp = (e) => {
  //     console.log(e);
  //   };
  //   const getLocation = () => {
  //     // check if user's browser supports Navigator.geolocation
  //     // setShowMap(!showMap);
  //     if (navigator.geolocation) {
  //       navigator.geolocation.getCurrentPosition(
  //         displayLocation,
  //         showError,
  //         options
  //       );
  //     } else {
  //       console.log({
  //         html: "Sorry, your browser does not support this feature... Please Update your Browser to enjoy it",
  //         classes: "rounded",
  //       });
  //     }
  //   };
  //   let lat;
  //   let lng;
  //   const [mapErrortext, setMapErrortext] = useState(true);
  //   const showError = (error) => {
  //     switch (error.code) {
  //       case error.PERMISSION_DENIED:
  //         setMapErrortext("You denied the request for your location.");
  //         break;
  //       case error.POSITION_UNAVAILABLE:
  //         setMapErrortext("Your Location information is unavailable.");
  //         break;
  //       case error.TIMEOUT:
  //         setMapErrortext("Your request timed out. Please try again");
  //         break;
  //       case error.UNKNOWN_ERROR:
  //         setMapErrortext(
  //           "An unknown error occurred please try again after some time."
  //         );
  //         break;
  //     }
  //   };
  //   const displayLocation = (position) => {
  //     lat = position.coords.latitude;
  //     lng = position.coords.longitude;
  //     console.log(`Current Latitude is ${lat} and your longitude is ${lng}`);
  //     getLat(lat, lng);
  //   };
  //   const options = {
  //     enableHighAccuracy: true,
  //   };
  //   const center = {
  //     lat: 13,
  //     lng: 80,
  //   };
  //   const zoom = 11;
  //   return (
  //     <>
  //       <div className="row">
  //         {/* <p>Map Location (Latitude: 13.304 and longitude: 80.034)</p> */}
  //       </div>
  //       <div style={{ height: "63vh" }}>
  //         <GoogleMapReact
  //           bootstrapURLKeys={{
  //             key: "AIzaSyBs7rvWtf9wbCNzqG4LPfpxM4AQH5wVm1o",
  //           }}
  //           defaultCenter={center}
  //           defaultZoom={zoom}
  //         >
  //           <Marker position={center} />
  //           <AnyReactComponent lat={lat} lng={lng} />
  //         </GoogleMapReact>
  //       </div>
  //     </>
  // );
}

export default MapComponent;
