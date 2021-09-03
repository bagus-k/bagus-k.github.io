import API_ENDPOINT from "../globals/api-endpoint.js";

class DisasterSource {
  static async showDisaster() {
    // const response = await fetch(API_ENDPOINT.DATA.BASE_URL, API_ENDPOINT.DATA.HEADERS);
    const response = await fetch('../../../data.json');
    const responseJson = await response.json();
    return responseJson.data;
  }
}

export default DisasterSource;