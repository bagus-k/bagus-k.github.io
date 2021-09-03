import CONFIG from "./config.js";

const API_ENDPOINT = {
  DATA: {
    BASE_URL: CONFIG.BASE_URL,
    HEADERS: {
      method: 'post',
      headers: {
        'Authorization': 'Basic '+ btoa(CONFIG.USERNAME + ":" + CONFIG.PASSWORD),
        'Content-Type': 'text/plain'
      },
      body: 'A=1&B=2',
      mode: 'cors',
      cache: 'default',
    }
  },
}

export default API_ENDPOINT;