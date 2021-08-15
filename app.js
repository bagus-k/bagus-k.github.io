//Leaflet OpenStreetMap
const map = L.map('map', {zoomControl: false, attributionControl: false
}).setView([0, 118.9414], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.control.zoom({
  position:'bottomright'
}).addTo(map);

map.doubleClickZoom.disable();

L.Control.MyControl = L.Control.extend({
  onAdd: function(map) {
    var el = L.DomUtil.create('div', 'leaflet-bar my-control');

    el.innerHTML = `
    <a id="filter-control" class="filter-control" href="#">
    <img src="assets/images/icons/filter.png">
    </a>`;

    return el;
  },

  onRemove: function(map) {
    // Nothing to do here
  }
});

L.control.myControl = function(opts) {
  return new L.Control.MyControl(opts);
}

L.control.myControl({
  position: 'bottomright'
}).addTo(map);

// BMKG API
// https://data.bmkg.go.id/
let apiUrl = 'https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json';

class DataGempa {
    static async listGempa(){
        const response = await fetch(apiUrl);
        const responseJson = await response.json();
        return responseJson.Infogempa.gempa;
    }
}

//Layer / Marker

let markers = [];
let marker;
let group = L.featureGroup();

async function showMarker() {
    const gempa = await DataGempa.listGempa();
    let iconUrl = 'assets/images/icons/gempa.png';

    gempa.forEach((marker) => {
        let getLongLat = marker['Coordinates'];
        let split = getLongLat.split(",");
        let getLong = split[0];
        let getLat = split[1];

        let popups = `
                <h4>Gempa Bumi</h4>
                <p><strong>${marker.Wilayah}</strong></p>
                <p>Tanggal : ${marker.Tanggal}</p>
         `;

        markers.push({
            pos: [getLong, getLat],
            popup:popups
        });
    });

    markers.forEach((markerGempa) => {
        marker = L.marker(markerGempa.pos, {
            icon: L.icon({
                iconUrl: iconUrl,
                iconSize: [100, 100],
                iconAnchor: [25, 25]
            })
        })
        .addTo(group),
        popUp = new L.Popup({ autoClose: false, closeOnClick: false })
                .setContent(markerGempa.popup)
                .setLatLng(markerGempa.pos);
        marker.bindPopup(popUp);
    });
}

showMarker();
map.addLayer(group);

// Memunculkan icon sesuai checkbox
const checkBoxEarthQuake = document.getElementById("checkbox-earthquake");
checkBoxEarthQuake.addEventListener('change', function() {
  if (this.checked) {
    map.addLayer(group);
  } else {
    map.removeLayer(group);
  }
});

//Megubah sidebar menjadi detail bencana

group.on("click", function (event) {
  detailBencana(event);
  if(!disasterDetail.classList.contains('disaster-open')) {
    disasterDetail.classList.toggle('disaster-open');
  }
});

async function detailBencana(event) {
  const gempa = await DataGempa.listGempa();
  let clickedMarker = event.latlng;
  let iconCoordinate = clickedMarker.lat +',' + clickedMarker.lng;

  gempa.forEach((marker) => {
      let getLongLat = marker['Coordinates'];
      if (iconCoordinate == getLongLat) {
          disasterDetail.innerHTML = `
              <div class="close-container">
                <button aria-label='Close' type='button' class="close-disaster-detail" onclick="closeDetail()">X</button>
              </div>
              <h2 class="disaster-header">Gempa Bumi</h2>
              <div class="disaster-time">
                <p><strong>${marker.Tanggal}</p>
                <p><strong>${marker.Jam}</p>
              </div>
              <div class="disaster-location">
                <h3>Lokasi</h3>
                <p>${marker.Wilayah}</p>
              </div>
              <div class="disaster-otherdetail">
                <p><strong>Coordinates:</strong> ${marker.Coordinates}</p>
                <p><strong>Lintang:</strong> ${marker.Lintang}</p>
                <p><strong>Bujur:</strong> ${marker.Bujur}</p>
                <p><strong>Magnitude:</strong> ${marker.Magnitude}</p>
                <p><strong>Kedalaman:</strong> ${marker.Kedalaman}</p>
                <p><strong>Potensi:</strong> ${marker.Potensi}</p>
              </div>
          `;
      }
  });
}

function closeDetail(){
  disasterDetail.classList.remove('disaster-open');
}


const main = document.querySelector('main');

const disasterDetail = document.querySelector('#disaster');

const hamburgerButton = document.querySelector('#hamburger');
const drawerLeftBar = document.querySelector('#drawer-leftbar');

const userButton = document.querySelector('#user');
const drawerUser = document.querySelector('#drawer-user');

const filterControl = document.querySelector('#filter-control');
const drawerFilterControl = document.querySelector('#drawer-filter-control');

const closeButton = document.querySelector('#close-disaster-detail');

hamburgerButton.addEventListener('click', function (event) {
  drawerLeftBar.classList.toggle('leftbar-open');
  event.stopPropagation();
});

userButton.addEventListener('click', function (event) {
  drawerUser.classList.toggle('drawer-user-open');
  event.stopPropagation();
});

main.addEventListener('click', function () {
  drawerLeftBar.classList.remove('leftbar-open');
  drawerUser.classList.remove('drawer-user-open');
  drawerFilterControl.classList.remove('drawer-filter-control-open');
});

filterControl.addEventListener('click', function (event) {
  drawerFilterControl.classList.toggle('drawer-filter-control-open');
  event.stopPropagation();
});