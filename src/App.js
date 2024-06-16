import './App.css'

import { Component } from 'react'



const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class App extends Component{  
  
  state = {        
    apiStatus: apiStatusConstants.initial,
    weatherData:{},
    error:null,
    userInput:'',   
}


componentDidMount() {
    this.getWeatherData()
}


getFormattedData=data=>({
    city:data.name,
    country:data.sys.country,
    temperature:data.main.temp,
    humidity:data.main.humidity,
    windSpeed:data.wind.speed,
    description:data.weather[0].description,       
})


getWeatherData=async()=>{
  const{userInput}=this.state    
    const city_name=userInput
   
    if(city_name!==''){
      this.setState({
        apiStatus: apiStatusConstants.inProgress,
    })        
    const api_key='9a961307454c69290ae7d4f70355541f'
    const apiurl=`https://api.openweathermap.org/data/2.5/weather?q=${city_name},IN&appid=${api_key}&units=metric`
    
    const response=await fetch(apiurl)
    if(response.ok){
        const data=await response.json()
        // console.log(data)
        const required_data=this.getFormattedData(data)
        // console.log(required_data)
        this.setState({
            weatherData:required_data,
            apiStatus:apiStatusConstants.success
          })

    }
    else if(response.status===404){
        this.setState({
            apiStatus:apiStatusConstants.failure
          })
      }        
    
    }
  }

  renderWeatherDetailsView = () => {
    const {weatherData} = this.state
    const {city,country,temperature,humidity,windSpeed,description} = weatherData
    return(
        <div>
            <h3>city: {city}</h3>
            <h3>country: {country}</h3>
            <h3>temperature: {temperature} °C</h3>
            <h3>humidity: {humidity} %</h3>
            <h3>windSpeed: {windSpeed} m/s</h3>
            <h3>description: {description}</h3>
        </div>
    )
  }

  renderLoadingView = () => {
    return(
      <h2>loading...</h2>
    )
  }

  renderFailureView = () => {
    return(
        <div>
            <h2>City not found</h2>
        </div>
    )
  }


  renderContentDetails = () => {
    const {apiStatus} = this.state    
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderWeatherDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return <p>weather details visible here</p>
    }
  }
  render(){
      return(
          <div className="main-container"> 
            <div className="content-container">              
              <div>
                  <h1>
                  Weather App <span className="small-text">*(for indian cities)</span>
                  </h1>
                  <input                      
                      type="text"
                      className="city-search"
                      placeholder="Enter City Name.."
                      onChange= {e=>this.setState({userInput:e.target.value})}
                      onKeyDown={e=>e.key==='Enter'&&this.getWeatherData()}                      
                  />
              </div>
              <div className='weather-details'>{this.renderContentDetails()}</div>
            </div>               
          
        </div>
  )
  }
  
  
}




export default App
