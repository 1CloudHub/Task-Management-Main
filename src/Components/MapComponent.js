// import GoogleMapReact from "google-map-react";
// import { Marker } from "google-maps-react";
import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { toast } from "react-toastify";

function MapComponent({ getLat }) {
  const [position, setPosition] = useState({
    lat: 0,
    lng: 0,
  });
  useEffect(() => {
    getPosition();
  }, []);
  const [mapError, setMapError] = useState(false);
  const [mapErrorTxt, setMapErrorTxt] = useState(false);

  // to show the error message
  const showError = (error) => {
    console.log("showError", error);
    switch (error.code) {
      case error.PERMISSION_DENIED:
        toast.warn("You denied the request for your location.");
        setMapError(true);
        setMapErrorTxt("Permission Denied for Location");
        break;
      case error.POSITION_UNAVAILABLE:
        toast.warn("Your Location information is unavailable.");
        setMapError(true);
        setMapErrorTxt("Location is Unavailable");
        break;
      case error.TIMEOUT:
        toast.warn("Your request timed out. Please try again");
        setMapErrorTxt("Request Time Out");
        setMapError(true);
        break;
      case error.UNKNOWN_ERROR:
        toast.warn(
          "An unknown error occurred please try again after some time."
        );
        setMapErrorTxt("Unknown Error occured !");
        setMapError(true);
        break;
    }
  };
  // to get the lat and long
  const displayLocation = (e) => {
    console.log(e.coords.latitude);
    const latitude = e.coords.latitude;
    const longitude = e.coords.longitude;
    console.log(latitude, longitude);
    setPosition({ lat: latitude, lng: longitude });
    console.log(position);
  };

  const getPosition = () => {
    navigator.geolocation.getCurrentPosition(
      displayLocation,
      showError,
      options
    );
  };
  const containerStyle = {
    width: "400px",
    height: "400px",
    borderRadius: "30em",
  };
  const options = {
    enableHighAccuracy: true,
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBs7rvWtf9wbCNzqG4LPfpxM4AQH5wVm1o",
  });
  // console.log(out);
  // The marker, positioned at Uluru

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
