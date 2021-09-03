import DisasterData from "../data/disaster-data.js";

const main = () => {

  const main = document.querySelector('main');
  const disasterDetail = document.querySelector('#disaster');
  const hamburgerButton = document.querySelector('#hamburger');
  const drawerLeftBar = document.querySelector('#drawer-leftbar');
  const closeButton = document.querySelector('#close-disaster-detail-container');
  const sideBarNav = document.querySelector('#sidebar-nav');
  const layerList = document.querySelector('#layer-list');
  const listDisaster = document.querySelector('#drawer-leftbar-content');
  const map = L.map('map', {zoomControl: false, attributionControl: false
  }).setView([-7.5468636, 111.9801192], 9);
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

  async function showMarker() {
    const disaster = await DisasterData.getAllDisaster();
    // listDisaster.innerHTML = "";

    disaster.forEach((disasterMarker) => {
      // const restaurantElement = document.createElement('article');
      // restaurantElement.setAttribute('class', 'nav-item')
      let MarkerCluster = eval(disasterMarker.typeid.toLowerCase() + "Layer" );
      let eventDate = disasterMarker.eventdate.split(" ");
      let disasterLevel = disasterMarker.level.charAt(0).toUpperCase() + disasterMarker.level.slice(1).toLowerCase();
      let marker = L.marker(disasterMarker.pos, {
            icon: L.icon({
                iconUrl: disasterMarker.iconUrl,
                iconSize: [35, 35],
                iconAnchor: [25, 25]
            }),
            draggable:true
        }).addTo(MarkerCluster),
        popUp = new L.Popup({ autoClose: false, closeOnClick: false })
                .setContent(disasterMarker.popup)
                .setLatLng(disasterMarker.pos);
        map.addLayer(marker);
        marker.bindPopup(popUp)
        ;
        marker.addEventListener('click', function(event) {
          disasterDetail.innerHTML = `
              <div class="disaster-detail-logo">
                <img src="./src/public/image/disaster-icon/${disasterMarker.typeid}.svg" alt="Logo Bencana">
              </div>
              <h2 class="disaster-header">${disasterMarker.disastertype}</h2>
              <div class="disaster-time">
                <p><strong>${eventDate[0]}</strong></p>
                <p>${eventDate[1]}</p>
              </div>
              <div class="disaster-location">
                <h3>Lokasi</h3>
                <p><strong>Area : </strong>${disasterMarker.area}</p>
                <p><strong>Kota : </strong>${disasterMarker.regency_city}</p>
                <p><strong>Provinsi : </strong>Jawa Timur</p>
              </div>
              <div class="disaster-otherdetail">
                <h3>Kerusakan</h3>
                <p><strong>Level         : </strong>Level ${disasterLevel}</p>
                <p><strong>Kerusakan     : </strong>${disasterMarker.damage}</p>
                <p><strong>Luka Ringan   : </strong>${disasterMarker.minor_injuries}</p>
                <p><strong>Luka Serius   : </strong>${disasterMarker.serious_wound}</p>
                <p><strong>Korban Jiwa   : </strong>${disasterMarker.losses}</p>
                <p><strong>Korban Hilang : </strong>${disasterMarker.missing}</p>
              </div>
              <div class="disaster-detail-status-container">
                <p><strong>Status :</strong></p>
                <div class="disaster-detail-status" style="background-color:${disasterMarker.status == "BELUM" ? 'red' : 'green'};">
                ${disasterMarker.status}
                </div>
              </div>
          `;
        });
    });
  }

  showMarker().then(() => {
    checkboxDisaster();
  });

  hamburgerButton.addEventListener('click', function (event) {
    sideBarNav.classList.toggle('sidebar-nav-open');
    if(drawerLeftBar.classList.contains('leftbar-open')) {
      drawerLeftBar.classList.toggle('leftbar-open');
    }
    event.stopPropagation();
  });

  layerList.addEventListener('click', function (event) {
    drawerLeftBar.classList.toggle('leftbar-open');
    layerList.classList.toggle('sidebar-nav-item-active')
    event.stopPropagation();
  });

  main.addEventListener('click', function (event) {
    drawerLeftBar.classList.remove('leftbar-open');
    event.stopPropagation();
  });


  closeButton.addEventListener('click', function (event) {
  const disasterDetailContainer = document.querySelector('#disaster-detail-container');
    disasterDetailContainer.classList.remove('disaster-open');
    event.stopPropagation();
  });

    // Memunculkan icon sesuai checkbox

    function checkboxDisaster() {
          let checkBoxDisaster = document.getElementsByClassName("nav-item");
          for (var i = 0; i < checkBoxDisaster.length; ++i) {
            let getId = checkBoxDisaster[i].childNodes[3].control;
            getId.addEventListener('change', function() {
              if (this.checked) {
                map.addLayer(eval(getId.id));
              } else {
                map.removeLayer(eval(getId.id));
              }
            });
          }

    }

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