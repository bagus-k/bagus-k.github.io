import DisasterSource from "./disaster-source.js";

const DisasterData = {
  async getAllDisaster() {
    let markers = [];
    const disaster = await DisasterSource.showDisaster();
    let iconUrl;
    let shouldSkip = false;

    disaster.forEach((marker) => {
      let dateTemp = marker.eventdate.split(" ");
      let dayTemp = new Date(dateTemp);
      let today = new Date();
      let week = new Date(today.getTime() - (14 * 24 * 60 * 60 * 1000));
      today.setHours(0,0,0,0);

      if (marker.longitude !== null && marker.latitude !== null) {
        if (shouldSkip) {
          return;
        }
        if(dayTemp >= week) {
          iconUrl = 'src/public/image/disaster-icon/'+ marker.typeid +'.svg';
          let popups = `
            <div id="popup-marker" class="popup-marker-container">
              <h4 class="popup-disaster-name">${marker.disastertype.toUpperCase()}</h4>
              <p class="popup-disaster-detail">${marker.eventdate}</p>
              <p class="popup-disaster-detail">${marker.regency_city}</p>
              <button type="button" class="popup-disaster-detail-button" onClick="(function(){
                let disasterDetailContainer = document.querySelector('#disaster-detail-container');
                disasterDetailContainer.classList.toggle('disaster-open');
                return false;
            })();return false;">Detail Bencana</button>

            </div>
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
        } else {
          shouldSkip = true;
           return;
        }
      }
    });
    return markers;
  },
}

export default DisasterData;