import React from "react";
import Info from "./components/info";
import Formula from "./formula";
import Weather from "./components/weather";

const API_KEY = "0aa1ef00ba1eef48b77caa7689dcfaea";

class App extends React.Component {


  state = {
    temp: undefined,
    city: undefined,
    country: undefined,
    pressure: undefined,
    sunset: undefined,
    error: undefined
  }

  gettingWeather = async (event) => {
    event.preventDefault();
    const city = event.target.city.value;
    
     

if(city) {
  const api_url = await 
  fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
  const data = await api_url.json();

  var sunset = data.sys.sunset;
  var date = new Date();
  date.setTime(sunset);
  var sunset_date = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  
  this.setState ( {
       temp: data.main.temp,
       city: data.name,
       country: data.sys.country,
       sunset: sunset_date,
       pressure: data.main.pressure,
       error: undefined
     });
  } else {
    this.setState ({
      temp: undefined,
    city: undefined,
    country: undefined,
    pressure: undefined,
    sunset: undefined,
    error: "Enter city name, please"
    })
  }
}

  render () {
    return (
      <div className="wrapper">
       <div className="main">
        <div className="container">
          <div className="row">
            <div className="col-sm-5 info">
            <Info />
            </div>
            <div className="col-sm-7 form">
            <Formula weatherMethod={this.gettingWeather} />    
        <Weather 
       temp={this.state.temp}
       city={this.state.city}
       country={this.state.country}
       sunset={this.state.sunset}
       pressure={this.state.pressure}
       error={this.state.error}
       />
                   </div>
          </div>
        </div>
        </div> 
        
      </div>
    );
  }
}

export default App;