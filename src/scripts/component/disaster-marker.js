import DisasterSource from "../data/disaster-source.js";

const DisasterMarker = {
  async getAllDisaster() {
    let markers = [];

    const disaster = await DisasterSource.showDisaster();
    let iconUrl;
    let shouldSkip = false;

    disaster.forEach((marker) => {
      let dateTemp = marker.eventdate.split(" ");
      let dayTemp = new Date(dateTemp);
      let today = new Date();
      let week = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
      let month = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
      let year = new Date(today.getTime() - (365 * 24 * 60 * 60 * 1000));
      today.setHours(0,0,0,0);

      if (marker.longitude !== null && marker.latitude !== null) {
        if (shouldSkip) {
          return;
        }
        if(dayTemp >= week) {
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
        } else {
          shouldSkip = true;
           return;
        }
      }
    });
    return markers;
  },
}

export default DisasterMarker;