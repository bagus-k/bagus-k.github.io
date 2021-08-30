import DisasterSource from "../data/disaster-source.js";

const main = () => {

  const map = L.map('map', {zoomControl: false, attributionControl: false
  }).setView([-7.5468636, 111.9801192], 8);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  L.control.zoom({
    position:'bottomright'
  }).addTo(map);

  map.doubleClickZoom.disable();
  // markerClusterGroup
  //featuregroup
  let tornadoLayer = L.markerClusterGroup();
  map.addLayer(tornadoLayer);
  let floodLayer = L.markerClusterGroup();
  map.addLayer(floodLayer);
  let landslideLayer = L.markerClusterGroup();
  map.addLayer(landslideLayer);
  let earthquakeLayer = L.markerClusterGroup();
  map.addLayer(earthquakeLayer);
  let tsunamiLayer = L.markerClusterGroup();
  map.addLayer(tsunamiLayer);
  let highsurfLayer = L.markerClusterGroup();
  map.addLayer(highsurfLayer);
  let droughtLayer = L.markerClusterGroup();
  map.addLayer(droughtLayer);
  let wildfireLayer = L.markerClusterGroup();
  map.addLayer(wildfireLayer);
  let incidentLayer = L.markerClusterGroup();
  map.addLayer(incidentLayer);
  let volcanoLayer = L.markerClusterGroup();
  map.addLayer(volcanoLayer);
  let highwindLayer = L.markerClusterGroup();
  map.addLayer(highwindLayer);
  let markers = [];

  async function showMarker() {

    let marker;
    let popUp;

    const disaster = await DisasterSource.showDisaster();
    let iconUrl;

    disaster.forEach((marker) => {
      if (marker.longitude !== null && marker.latitude !== null) {

        iconUrl = 'src/public/image/disaster-icon/'+ marker.typeid +'.svg';
        let popups = `
          <h4>${marker.disastertype}</h4>
          <p>waktu : ${marker.eventdate}</p>
          <p>wilayah : ${marker.regency_city}</p>
        `;
        markers.push({
            pos: [marker.latitude, marker.longitude],
            popup:popups,
            iconUrl:iconUrl,
            typeid: marker.typeid,
            eventdate: marker.eventdate,
            disastertype: marker.disastertype,
            regency_city: marker.regency_city,
            area: marker.area,
            chronology: marker.chronology,
            dead: marker.dead,
            missing: marker.missing,
            serious_wound: marker.serious_wound,
            minor_injuries: marker.minor_injuries,
            damage: marker.damage,
            losses: marker.losses,
            response: marker.response,
            status: marker.status,
            level: marker.level
        });
      }
    });

    markers.forEach((disasterMarker) => {
      let dateTemp = disasterMarker.eventdate.split(" ");
      let dayTemp = new Date(dateTemp);
      let today = new Date();
      let week = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
      let month = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
      let year = new Date(today.getTime() - (365 * 24 * 60 * 60 * 1000));
      today.setHours(0,0,0,0);

      if(dayTemp >= week) {
        marker = L.marker(disasterMarker.pos, {
              icon: L.icon({
                  iconUrl: disasterMarker.iconUrl,
                  iconSize: [30, 30],
                  iconAnchor: [25, 25]
              }),
              draggable:true
          }).addTo(eval(disasterMarker.typeid.toLowerCase() + "Layer" )),
          popUp = new L.Popup({ autoClose: false, closeOnClick: false })
                  .setContent(disasterMarker.popup)
                  .setLatLng(disasterMarker.pos);
          map.addLayer(marker);
          marker.bindPopup(popUp)
          ;
      }

    });

  }

  // showMarker();
  showMarker().then(() => showDetail());
  // Memunculkan icon sesuai checkbox
  let cbElements = document.getElementsByClassName("nav-item");


  for (var i = 0; i < cbElements.length; ++i) {
    // console.log(cbElements[i].childNodes[1]);
    let getId = cbElements[i].childNodes[1];
    getId.addEventListener('change', function() {
      if (this.checked) {
        map.addLayer(eval(getId.id));
      } else {
        map.removeLayer(eval(getId.id));
      }
    });
  }

  //Megubah sidebar menjadi detail bencana

  function showDetail(){
    let cbElements = document.getElementsByClassName("nav-item");
    for (var i = 0; i < cbElements.length; ++i) {
      let getId = cbElements[i].childNodes[1].id;
      eval(getId).on("click", function (event) {
          showDisasterDetail(event);
          if(!disasterDetail.classList.contains('disaster-open')) {
            disasterDetail.classList.toggle('disaster-open');
          }
        });
    }
  }


  function showDisasterDetail(event) {
    let clickedMarker = event.latlng;
    let iconCoordinate = clickedMarker.lat +',' + clickedMarker.lng;

    let stopLoop = false;

    markers.forEach((marker) => {
        let getLongLat = marker.pos[0] + ',' + marker.pos[1];
        let eventDate = marker.eventdate.split(" ");
        if (iconCoordinate === getLongLat) {
            disasterDetail.innerHTML = `
                <div class="close-container">
                  <button aria-label='Close' type='button' class="close-disaster-detail" onclick="closeDetail()">X</button>
                </div>
                <h2 class="disaster-header">${marker.disastertype}</h2>
                <div class="disaster-time">
                  <p><strong>${eventDate[0]}</p>
                  <p><strong>${eventDate[1]}</p>
                </div>
                <div class="disaster-location">
                  <h3>Lokasi</h3>
                  <p>Area : ${marker.area}</p>
                  <p>Kota : ${marker.regency_city}</p>
                  <p>Provinsi : Jawa Timur</p>
                </div>
                <div class="disaster-otherdetail">
                  <h3>Kerusakan</h3>
                  <p>Level         :  Level ${marker.level}</p>
                  <p>Kerusakan     :  ${marker.damage}</p>
                  <p>Luka Ringan   :  ${marker.minor_injuries}</p>
                  <p>Luka Serius   :  ${marker.serious_wound}</p>
                  <p>Korban Jiwa   :  ${marker.losses}</p>
                  <p>Korban Hilang : ${marker.missing}</p>
                </div>
                <div>
                  <p>Status: ${marker.status}</p>
                </div>
            `;
            stopLoop = true;
        }
    });
  }
  // const closeDisasterDetail = document.getElementsByClassName('close-disaster-detail');

  // closeDisasterDetail.addEventListener('click', function (event) {
  //   drawerLeftBar.classList.toggle('leftbar-open');
  //   event.stopPropagation();
  // });

  // function closeDetail(){
  //   disasterDetail.classList.remove('disaster-open');
  // }

  const main = document.querySelector('main');
  const disasterDetail = document.querySelector('#disaster');

  const hamburgerButton = document.querySelector('#hamburger');
  const drawerLeftBar = document.querySelector('#drawer-leftbar');

  const closeButton = document.querySelector('#close-disaster-detail');

  hamburgerButton.addEventListener('click', function (event) {
    drawerLeftBar.classList.toggle('leftbar-open');
    event.stopPropagation();
  });

  main.addEventListener('click', function () {
    drawerLeftBar.classList.remove('leftbar-open');
    // disasterDetail.classList.remove('disaster-open');
    // drawerUser.classList.remove('drawer-user-open');
    // drawerFilterControl.classList.remove('drawer-filter-control-open');
  });

}



export default main;
/*
  Jenis Bencana :
  typeid /disastertype

  TORNADO / Angin Puting Beliung
  FLOOD / Banjir
  LANDSLIDE / Tanah Longsor
  EARTHQUAKE / Gempa Bumi
  TSUNAMI / Tsunami
  HIGHSURF / Gelombang Tinggi
  DROUGHT / Kekeringan
  WILDFIRE / Kebakaran Hutan
  INCIDENT / Kejadian Lain
  VOLCANO / Letusan Gunung Api
  HIGHWIND / Angin Kencang

*/