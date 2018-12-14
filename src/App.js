import React from 'react'
import './App.css'
import axios from 'axios';

// Main Application
class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      locations: ["uppal", "Gandipet", "Hussain sagar", "kukatpally", "Secunderabad"]
    }

    // extra initializations
    this.allLocations = ["uppal", "Gandipet", "Hussain sagar", "kukatpally", "Secunderabad"];
    this.markers = [];
    this.timeOut = null;
    this.api = "https://api.foursquare.com/v2/venues/explore?";
    // authentication
    this.post = {
      client_id: "QC4FSNPTGY1WVEJ5MR030NKRAV05TM5BY52A1RB1DZMGNAWS",
      client_secret: "Z1I1Q4KTEOOLTJQGM04DF40LBAMSORJABABYUEZJKYXKUFPA",
      query: "Food",
      limit: 7,
      near: null,
      v: "20181214",
    }
    
  }


  // Map loading...
  loadMap = () => {
    const mapProp = {
      center: { lat: 17.387140, lng: 78.491684 },
      zoom: 10,
    };
    const map = new window.google.maps.Map(document.getElementById("mapView"), mapProp);
    this.Map = map;
    this.tooltip = new window.google.maps.InfoWindow()
    
  }

  // removes all the markers from the screen
  clearMarkers() {
    this.markers.forEach((marker) => {
      marker.setMap(null);
    })
  }

  // search list filter
  filterInput = (e) => {
    const query = e.target.value;
    const filter = this.allLocations.filter(loc => loc.toLowerCase().includes(query.toLowerCase()))
    clearTimeout(this.timeOut);
    this.timeOut = setTimeout(() => {
      this.clearMarkers();
      filter.forEach((loc) => {
        this.markOnMap(loc);
      })
    }, 1000);

    this.setState({ locations: filter })
  }

  // set a mark on map
  markOnMap(locationName) {

    this.post.near = locationName;
    axios.get(this.api + new URLSearchParams(this.post)).then(response => {
      // console.log(response.data.response.groups[0].items[0].venue);
      const venue = response.data.response.groups[0].items[0].venue;
      const content = `<b>Name</b> : ${venue.name}<br>
                     <b>Address</b> : ${venue.location.address || "NA"} <br>
                     <b>City</b> : ${venue.location.city || "NA"}<br>
                     <b>State</b> : ${venue.location.state || "NA"}
                    `
      // console.log(window.google.maps.Animation)
      const marker = new window.google.maps.Marker({
        position: venue.location,
        animation: window.google.maps.Animation.en,
        map: this.Map
      })
      this.Map.panTo(marker.getPosition());
      this.markers.push(marker);
      marker.addListener("click", () => {
        // this.Map.setCenter(marker.position);
        this.tooltip.setContent(content);
        this.tooltip.open(this.Map, marker);
      })
    })
      .catch(error => {
        // console.log(error);
      });

    // fetch(api, {
    //   method: "POST",
    //   body: JSON.stringify(credentials),
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   credentials: "same-origin"
    // }).then(function(response) {
    //   console.log(response);
    // }, function(error) {
    //   console.log(error.message);
    // })
  }


  // point a location on map
  showLocation = (e)=>{
    this.clearMarkers();
    this.markOnMap(e.target.innerText);
  }

  serviceWorker() {
    /**
* Register the service worker
*/
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(function (registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }).catch(function (err) {
        //registration failed
        console.log('ServiceWorker registration failed: ', err);
      });
    } else {
      console.log('No service-worker on this browser');
    }
  }

  // asynchronous requests here
  componentDidMount() {
    const script = document.createElement("script");
    const apiUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDmu0VrodQ6EKBtKkwS5H-cZ4WbULG7yks&callback=loadMap";

    script.src = apiUrl;
    script.async = true;
    document.body.appendChild(script);
    window.loadMap = this.loadMap;
    this.state.locations.forEach((loc) => {
      this.markOnMap(loc);
    })
    this.serviceWorker();
  }

  // finally redering
  render() {
    return (
      <div>
        <div id="searchBar" role='application' tabIndex='0'>
          <div id="topLayout" >
            <input id="search" placeholder="Search ..." onChange={this.filterInput} />
          </div>
          <div id="bottomLayout" >
            {this.state.locations.map((loc, id) => {
              return <li className="location" key={id} onClick={this.showLocation} > {loc} </li>
            })}
          </div>
        </div>
        <div id="mapView" tabIndex='0'></div>
      </div>
    )
  }
}

export default App
