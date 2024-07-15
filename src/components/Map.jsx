import { useEffect, useState } from 'react';
import {GoogleMap,useLoadScript,Marker} from '@react-google-maps/api';
import {IoMdHome} from 'react-icons/io';
import { motion } from 'framer-motion';
import axios from 'axios';
import {REACT_APP_GOOGLE_API_KEY} from '../config';
const libraries=["places"];
const mapStyle={
  width:'100%',
  height:'400px'
}
const options={
  disableDefaultUI:true,
  zoomControl:true
}


const Map=({saveLocation})=>{
  const [coordinates,setCoordinates]=useState({});
  const [currLocation,setCurrLocation]=useState("");
  const [marker,setMarker]=useState({});
  useEffect(()=>{
       setLocation();
  },[])
useEffect(()=>{
  if(marker.lat&&marker.lng) getLocationAddress();
},[marker])


  const getLocationAddress=()=>{
    const lat=marker.lat;
    const lng=marker.lng;
    const options = {
      method: 'GET',
      url: 'https://trueway-geocoding.p.rapidapi.com/ReverseGeocode',
      params: {location: `${lat},${lng}`, language: 'en'},
      headers: {
        'X-RapidAPI-Key': '1286519813msh0ac994dc9844d46p1a8611jsnedfaefa5d20c',
        'X-RapidAPI-Host': 'trueway-geocoding.p.rapidapi.com'
      }
    };
    
    axios.request(options).then(function (response) {
      const {results}=response.data;
      setCurrLocation(results[0].address);
    }).catch(function (error) {
    });
  }

   
  const setLocation=()=>{
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoordinates({ lat: latitude, lng: longitude });
        setMarker({ lat: latitude, lng: longitude })
      }
    );
  }

  const {isLoaded,loadError}=useLoadScript({
    googleMapsApiKey:REACT_APP_GOOGLE_API_KEY,
    libraries,
  })
  if(loadError) return "Error Loading Maps";
  if(!isLoaded) return "Loading Maps";
  return <div className='w-full '>
    <GoogleMap
     
     zoom={15} 
     center={coordinates} 
     mapContainerStyle={mapStyle}
     options={options}
     onClick={(event)=>{
           setMarker({lat:event.latLng.lat(),lng:event.latLng.lng()})
     }}
    >
    
      <Marker position={{lat:marker.lat,lng:marker.lng}}/>
    </GoogleMap>

    <div className='mt-4 p-2'>
    <div className='flex gap-2'>
    <IoMdHome className='text-5xl text-teal-500/95'/>
    <div className='flex flex-col flex-1'>
      <p className='font-bold'>Selected Location</p>
      <p className='text-[15px]'>{currLocation}</p>
    </div>
    </div>
      <div className='flex justify-center mt-4'>
      <motion.button whileTap={{scale:0.85}} onClick={()=>saveLocation(currLocation)}
       className='self-center px-16 py-2 hover:bg-teal-600 
      text-white font-bold tracking-wider rounded-full outline-none border-none bg-teal-500 '>
        Set Location
        </motion.button>
      </div>
    </div>
  </div>
}

export default Map;