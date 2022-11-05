import React, { useEffect, useState } from 'react';
import { CssBaseline, Grid } from '@material-ui/core';

// import { getPlacesData, getWeatherData } from './api/travelAdvisorAPI';
import { getPlacesData } from './api';
import Header from './components/Header/Header.jsx';
import List from './components/List/List.jsx';
import Map from './components/Map/Map.jsx';

const App = () => {
    const [places, setPlaces] = useState([]);
    const [filteredPlaces, setfilteredPlaces] = useState([]);


    const [coordinates, setCoordinates] = useState({});
    const [bounds, setBounds] = useState({});

    const [childClicked, setChildClicked] = useState(null);
    const [type, setType] = useState("restaurants");
    const [rating, setRating] = useState(0);

    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
            setCoordinates({ lat: latitude, lng: longitude });
        })
    }, []);


    useEffect(() => {

        setfilteredPlaces(places?.filter((place) => place.rating > rating));
    }, [rating]);

    useEffect(() => {
        if (bounds.sw && bounds.ne) {
            setLoading(true);
            getPlacesData(type, bounds.sw, bounds.ne)
                .then((data) => {
                    console.log(data);
                    setPlaces(data?.filter((place) => place.name && place.num_reviews > 0));
                    console.log(data);
                    setfilteredPlaces([]);
                    setLoading(false);
                }).finally(() => setLoading(false))
        }
    }, [bounds, type]);

    return (
        <>
            <CssBaseline />
            <Header setCoordinates={setCoordinates} />
            <Grid container spacing={3} style={{ width: '100%' }}>
                <Grid item xs={12} md={4}>
                    <List places={filteredPlaces.length ? filteredPlaces : places} childClicked={childClicked} isLoading={isLoading} type={type} setType={setType} rating={rating} setRating={setRating} />
                </Grid>
                <Grid item xs={12} md={8} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Map setBounds={setBounds} setCoordinates={setCoordinates} coordinates={coordinates} places={filteredPlaces.length ? filteredPlaces : places} setChildClicked={setChildClicked} />
                </Grid>
            </Grid>
        </>
    );
};

export default App;