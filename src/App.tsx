import React, { useEffect, useState } from "react";
import { Grid, TextField, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import cloudImg from "../src/assets/cloud.png";
import moment from "moment";
import "./App.css";
import "./weather-icons.css";

type City = {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  admin1: string;
  timezone: string;
};
// type Weather = { current_weather: Temperature };
// type Temperature = { temperature: number; weathercode: number };

export default function App() {
  const textFieldStyle = {
    marginTop: "8%",
  };
  const buttonStyle = {
    marginTop: "9%",
    marginLeft: "3%",
  };
  const [cityData, setCityData] = useState(undefined);
  const [cityInput, setCityInput] = useState("");
  const [citiesData, setCitiesData] = useState<Array<City>>([]);

  const fetchData = async () => {
    console.log("Ciudad", cityInput);
    const response = await fetch(
      "https://geocoding-api.open-meteo.com/v1/search?name=" +
        cityInput +
        "&count=1"
    );
    const actualCityData = await response.json();
    console.log("Recibido", actualCityData);
    if (!actualCityData.results) {
      alert("This is not a valid city name");
    }
    setCityData(actualCityData.results[0]);
    console.log(
      "Data que le envio a cities data",
      citiesData.concat(actualCityData.results[0])
    );
    setCitiesData(citiesData.concat(actualCityData.results[0]));
    console.log("Ciudad Actual", actualCityData);
  };

  const deleteCity = (id: number) => {
    setCitiesData(citiesData.filter((city) => city.id !== id));
  };
  console.log("Ciudades en lista", citiesData);

  return (
    <>
      <div className="App">
        <TextField
          style={textFieldStyle}
          id="outlined-basic"
          label="City"
          variant="outlined"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
        />
        <Button
          style={buttonStyle}
          onClick={() => fetchData()}
          variant="contained"
        >
          Submit
        </Button>
        <Grid container spacing={2}>
          {citiesData.map((city) => (
            <WeatherData cityData={city} onDelete={() => deleteCity(city.id)} />
          ))}
        </Grid>
        {!cityData && <EmptyWeatherData />}
      </div>
    </>
  );
}

const EmptyWeatherData = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6} md={12} marginTop={10}>
        <img width={120} src={cloudImg} alt="Cloud" />
        <h2>Please submit a city to start</h2>
      </Grid>
    </Grid>
  );
};

const WeatherData = (props: { cityData: City; onDelete: () => void }) => {
  const [weatherData, setWeatherData] = useState<any>(undefined);
  const [temperatureUnit, setTemperatureUnit] = useState("celsius");
  const [unit, setUnit] = useState("°C");

  const [cardColor, setcardColor] = useState("#3EA1D2");
  const [iconWeather, setIconWeather] = useState("");

  const today = moment();
  const endDate = moment().add(4, "days");
  const date = today.format("YYYY-MM-DD");
  const lastDate = endDate.format("YYYY-MM-DD");

  console.log("fecha de hoy", date);
  console.log("fecha de ultimo dia", lastDate);

  const handleChange = (event: SelectChangeEvent) => {
    setTemperatureUnit(event.target.value as string);
    if (event.target.value === "fahrenheit") {
      setUnit("°F");
    } else {
      setUnit("°C");
    }
  };

  useEffect(() => {
    const fetchWeather = async () => {
      const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=" +
          props.cityData.latitude +
          "&longitude=" +
          props.cityData.longitude +
          "&current_weather=true&temperature_unit=" +
          temperatureUnit +
          "&daily=temperature_2m_max&timezone=" +
          props.cityData.timezone +
          "&start_date=" +
          date +
          "&end_date=" +
          lastDate
      );

      const actualWeatherData = await response.json();
      setWeatherData(actualWeatherData);

      const calculate = () => {
        console.log(
          "entro a calculate",
          actualWeatherData.daily.temperature_2m_max
        );
        const total = actualWeatherData.daily.temperature_2m_max.reduce(
          (acc: any, num: any) => acc + num,
          0
        );
        const average =
          total / actualWeatherData.daily.temperature_2m_max.length;

        console.log("Total", total);
        console.log("Promedio", average);

        if (average > 30 && unit === '°C') {
          setcardColor("#FE2A2A");
        } else if (average > 86 && unit === '°F'){
          setcardColor("#FE2A2A");
        } else {
          setcardColor("#3EA1D2");
        }
      };
      calculate();

      const iconW = () => {
        console.log(
          "entro a icon",
          actualWeatherData.current_weather.weathercode
        );

        const iconCode: number = actualWeatherData.current_weather.weathercode;

        switch(iconCode){
          case 0:
            setIconWeather("wi wi-fw wi-day-sunny");
            break;
          case 1: 
            setIconWeather("wi wi-day-cloudy");
            break;
          case 2: case 3:
            setIconWeather("wi wi-cloudy");
            break;
          case 45: case 48:
            setIconWeather("wi wi-fog");
            break;
          case 51: case 53: case 55:
            setIconWeather("wi wi-day-hail");
            break;
          case 56: case 57:
            setIconWeather("wi wi-hail");
            break;
          case 61: case 63: case 65:
            setIconWeather("wi wi-day-rain");
            break;
          case 66: case 67:
            setIconWeather("wi wi-rain");
            break;
          case 71: case 73: case 75:
            setIconWeather("wi wi-day-snow");
            break;
          case 77:
            setIconWeather("wi wi-snow");
            break;
          case 80: case 81: case 82:
            setIconWeather("wi wi-showers");
            break;
          case 85: case 86:
            setIconWeather("wi wi-snow-wind");
            break;
          case 95:
            setIconWeather("wi wi-storm-showers");
            break;
          case 96: case 99:
            setIconWeather("wi wi-thunderstorm");
            break;
          default:
            setIconWeather("wi wi-day-sunny");
            break;
        }

      };
      iconW();
    };
    fetchWeather();
  }, [props.cityData, temperatureUnit, date, lastDate, unit]);
  console.log("Weather", weatherData);

  // eslint-disable-next-line react-hooks/exhaustive-deps

  return (
    <Grid item xs={6} md={4}>
      <Card
        sx={{
          marginTop: 2,
          marginLeft: 2,
          minWidth: 350,
          minHeight: 350,
          marginRight: 5,
          marginBottom: 2,
          // bgColor: cardColor,
        }}
        style={{ backgroundColor: cardColor }}
      >
        <CardContent>
          <span className={iconWeather}></span>
          <Typography variant="h5" component="div">
            {props.cityData.name} - {props.cityData.admin1}
          </Typography>
          <i className=""> </i>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {props.cityData.latitude}° {props.cityData.longitude}°
          </Typography>
          <Typography variant="body2">
            <TableContainer component={Paper}>
              <Table sx={{ mb: 1 }} size="small" aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell>Today</TableCell>
                    <TableCell>Day+1</TableCell>
                    <TableCell>Day+2</TableCell>
                    <TableCell>Day+3</TableCell>
                    <TableCell>Day+4</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>
                      {weatherData && weatherData.current_weather && (
                        <>
                          {weatherData.daily.temperature_2m_max[0]}
                          {unit}
                        </>
                      )}
                    </TableCell>
                    <TableCell align="left">
                      {weatherData && weatherData.current_weather && (
                        <>
                          {weatherData.daily.temperature_2m_max[1]}
                          {unit}
                        </>
                      )}
                    </TableCell>
                    <TableCell align="left">
                      {weatherData && weatherData.current_weather && (
                        <>
                          {weatherData.daily.temperature_2m_max[2]}
                          {unit}
                        </>
                      )}
                    </TableCell>
                    <TableCell align="left">
                      {weatherData && weatherData.current_weather && (
                        <>
                          {weatherData.daily.temperature_2m_max[3]}
                          {unit}
                        </>
                      )}
                    </TableCell>
                    <TableCell align="left">
                      {weatherData && weatherData.current_weather && (
                        <>
                          {weatherData.daily.temperature_2m_max[4]}
                          {unit}
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Typography>
        </CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Temperature
        </Typography>
        <Select
          size="small"
          labelId="unit-label"
          id="unit-select"
          value={temperatureUnit}
          label="Temperature"
          onChange={handleChange}
        >
          <MenuItem value={"celsius"}>Celsius</MenuItem>
          <MenuItem value={"fahrenheit"}>Fahrenheit</MenuItem>
        </Select>
        <CardActions>
          <Button
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              color: "#df1c44",
            }}
            onClick={props.onDelete}
            variant="outlined"
            startIcon={<DeleteIcon />}
            size="small"
          >
            Delete
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

// const WeatherWeekData = () => {

//   return(

//   );

// }
