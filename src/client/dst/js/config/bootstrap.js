/**
 * This function is ran just before the application (router) is started, but after the app is initialized,
 * this is a good place to do an initial request to the server for data you need at the start of your application
 *
 * @param resolve
 * @param reject
 */
export default function (resolve, reject) {
  console.log('bootstrap');
  resolve();
}
