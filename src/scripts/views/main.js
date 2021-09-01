import DisasterMarker from "../component/disaster-marker.js";

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

  async function showMarker() {

    const disaster = await DisasterMarker.getAllDisaster();

    disaster.forEach((disasterMarker) => {
      let marker = L.marker(disasterMarker.pos, {
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

    });

  }

  // showMarker();
  showMarker();
  showDetail();
  // .then(() => showDetail());
  // Memunculkan icon sesuai checkbox
  let checkBoxDisaster = document.getElementsByClassName("nav-item");
  for (var i = 0; i < checkBoxDisaster.length; ++i) {
    let getId = checkBoxDisaster[i].childNodes[1];
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
        if(!disasterDetailContainer.classList.contains('disaster-open')) {
          disasterDetailContainer.classList.toggle('disaster-open');
        }
          showDisasterDetail(event);
        });
    }
  }


  async function showDisasterDetail(event) {
    const disaster = await DisasterMarker.getAllDisaster();

    let clickedMarker = event.latlng;
    let iconCoordinate = clickedMarker.lat +',' + clickedMarker.lng;

    disaster.forEach((marker) => {
      let getLongLat = marker.pos[0] + ',' + marker.pos[1];
      let eventDate = marker.eventdate.split(" ");
      // console.log(iconCoordinate + " : " + getLongLat);
      if(getLongLat.localeCompare(iconCoordinate)){
        console.log("a");
      } else {
        console.log("b");
      }
      // if (iconCoordinate === getLongLat) {
      //   console.log("sc " + iconCoordinate + " : " + getLongLat);
      //   disasterDetail.innerHTML = `
      //         <h2 class="disaster-header">${marker.disastertype}</h2>
      //         <div class="disaster-time">
      //           <p><strong>${eventDate[0]}</p>
      //           <p><strong>${eventDate[1]}</p>
      //         </div>
      //         <div class="disaster-location">
      //           <h3>Lokasi</h3>
      //           <p>Area : ${marker.area}</p>
      //           <p>Kota : ${marker.regency_city}</p>
      //           <p>Provinsi : Jawa Timur</p>
      //         </div>
      //         <div class="disaster-otherdetail">
      //           <h3>Kerusakan</h3>
      //           <p>Level         :  Level ${marker.level}</p>
      //           <p>Kerusakan     :  ${marker.damage}</p>
      //           <p>Luka Ringan   :  ${marker.minor_injuries}</p>
      //           <p>Luka Serius   :  ${marker.serious_wound}</p>
      //           <p>Korban Jiwa   :  ${marker.losses}</p>
      //           <p>Korban Hilang : ${marker.missing}</p>
      //         </div>
      //         <div>
      //           <p>Status: ${marker.status}</p>
      //         </div>
      //     `;
      // }
    });
  }

  // function closeDetail(){
  //   disasterDetail.classList.remove('disaster-open');
  // }

  const main = document.querySelector('main');
  const disasterDetail = document.querySelector('#disaster');
  const disasterDetailContainer = document.querySelector('#disaster-detail');

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

  closeButton.addEventListener('click', function (event) {
    disasterDetailContainer.classList.remove('disaster-open');
    event.stopPropagation();
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