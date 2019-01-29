"use strict"

import Glide from "@glidejs/glide";
import fetchJsonp from "fetch-jsonp";
import greetTheUser from '../components/greettheuser';
// GLOBAL OBJECT
import { unit, languagesList, defaultParameters, userAutho, months, fullMonths, weekDay, } from "../components/objectdata"
// END GLOBAL OBJECT

import "babel-polyfill";
//***** Author */
//** @eWeather App by @ePhraimIlunga
// Github Ephraim Ilung |  Twitter : @EphraimIlunga | LInkedIn : Ephraim Ilunga*/
// Check out my Design on Dribbble.com  as Ephraim lunga
//***** en Author  */

//********************* */

// GLOBAL SELECTE
const formContainer = document.querySelector(".weather_filter_para_form");

// call the follower elment
const follower = document.querySelector(".follow_along");

// get all dropdown
const allDropdown = formContainer.querySelectorAll(".dropdown_options");

// get the close button
const closeButton = document.querySelector(".close_option");

// get the main contaienr of optional options
const mainOptionalContainer = document.querySelector(".weather_filter_para");

// get the language dropdown container
const languageDropdown = formContainer.querySelector(".language_droplist");

// get today prevision container 
const todayPrevisionContainer = document.querySelector(".today_previson");

// get tomorrow container 
const tomorrowContainer = document.querySelector(".tomorrow_block");

// get next tweo days 
const nextTwoDaysContainer = document.querySelector('.next_two_days');

// get 8 days overcast container 
const nextHeightDaysContainer = document.querySelector('.next_8days_forcast_blocks_container');

// get next 8 days title text
const nextHeightDaysText = document.querySelector('.next_8days_title_text');

// loader conatiner 
const loaderContainer = document.querySelector('.authorisation_panel_content');

// select the greeting user contaienr 
const greetContainer = document.querySelector(".greet_the_user_container");
// END GLOBAL SELECT


// GLOBAL VARIABLES

// this variable hold all next 8 days weather data

let nextHeightDays = '';

let weatherData = '';

let thirdDay = '';

let fourthDay = '';

let moreDetails = '';

// END GLOBAL VARIABLES 




//***** HTML CONTENTS  **/

// Goodbey Message
const goodByeMessage = `
    <div class="goodbye_message">
        <p class="main_message">Goodbye !</p>
        <p class="sub_message">Your sky can be Dangerous ! </p>
        <p class="sub_message_jok">Hey ! just for laught :) Don't forget to check the weather.</p>
    </div>
`;

const loader = `
  <div class="loader_container">
      <div class="loader_title">
          Please wait ... while your Sky is being Spy !
      </div>
      <div class="loader_image">
          <div class="loader"></div>
      </div>
  </div>
`;

// display error message 
function erroMessage() {
  return `
    <div class="loader_container">
      <div class="loader_title" style="text-align: center">
          Oops ! We couldn't Spy your Sky !
      </div>
      <div class="loader_title" style="font-size: 25px; margin: 10px 0 60px 0; letter-spacing: 0.6px; text-align: center">
        Please make sure you have a good internet connexion <br> and reload the page
      </div>
  </div>
  `;
}


// This function check weither the User Agree or Not to Share their location

function handleAuthorisation(e) {
  // get the target element
  const elementThatHasBeenClicked = e.target;

  if (!elementThatHasBeenClicked.classList.contains("agree")) {
    // eWeather says good by to the user :)
    authorisationMainContainer.innerHTML = goodByeMessage;

    return; // we stop the execution if Authorisation Rejected
  }

  // hide authorisatin panel if the User Agree
  handleDisplay(mainWrapper);
  
  //handleHidden(authorisationMainContainer);
  loaderContainer.innerHTML = loader;

  // change the user authorisation status to true
  userAutho.status = true;
  
  // save the user to the LocalStorage for later visit.
  handleSaveUserInLocalStorage("userAutho", userAutho);

  // empty the authorisation div element
  //authorisationMainContainer.innerHTML = "";

  // save user parameter in the local storage
  handleSaveUserInLocalStorage("defaultParameters", defaultParameters);

  /*************************
   * HANDLE FETCH WEATHER DATA
   ***************************/
  handleFetchWeatherData(defaultParameters);
}

// Select the Authorisation Main Conatiner
const authorisationMainContainer = document.querySelector(
  ".authorisation_panel"
);

// Select DOM Helement
//Select all button within the Authorisation Panal
const allAuthorizeButton = authorisationMainContainer.querySelectorAll(
  ".authorisation_button"
);

// Selected the wrapper that contains all the weather app components
const mainWrapper = document.querySelector("#wrapper");

// Check if the user has been already authorised eWeather to access its location
/**
 * @return value from the localstorage
 * @param localstorage key
 * */
const isUserAgree = handleGetStorageData("userAutho");

// check if the local storage has a value
// if no, ask him for the authorisation
// anotherwhise display app.
if (isUserAgree === null) {
  //display the authorisation panel
  handleDisplay(authorisationMainContainer);
  // Add Event Listener to the Authorisation Buttons
  addEventListenerToElement(allAuthorizeButton, "click", handleAuthorisation);
} else {
  /// do not display the authorisation request panel
  handleDisplay(mainWrapper);
  //handleHidden(authorisationMainContainer);
  loaderContainer.innerHTML = loader;
}

//****** FOLLOW ELONG ON HOVER */

// selector all elments to follow
const elementToFollow = document.querySelectorAll(".fa");

// add mouse hover on all elements to follow
elementToFollow.forEach(element =>
  element.addEventListener("mouseover", handleFollower)
);

// this function handle the follow along effect
function handleFollower(e) {
  // get current element that is being hover
  let currentHoverElement = e.target.getBoundingClientRect();

  //get the coordinate of the current hover element
  const currentElementLeft = currentHoverElement.left;
  const currentElementTop = currentHoverElement.top;

  // get the dimension of the current hover element
  const currentElementWidth = currentHoverElement.width;
  const currentElementHeight = currentHoverElement.height;

  //get window cordonate in case we add an element to the document
  // and the current over change the coordinate

  const coords = {
    left: currentElementLeft + window.scrollX,
    top: currentElementTop + window.scrollY,
    width: currentElementWidth,
    height: currentElementHeight
  };

  // apply the style of the current hover element to the flollwer element
  follower.style.width = coords.width + "px";
  follower.style.height = coords.height + "px";
  follower.style.transform = `translate(${coords.left}px, ${coords.top}px)`;

  follower.style.backgroundColor = "#80626263";
  follower.style.zIndex = 999;

  // show the follewer
  handleDisplay(follower);
}

//*** HELPERS FUNCTIONS */

// add event listener to element 
/**
 * @param  elementNode the list node of html element
 * @param  eventName String. The name of event to be attached to each element of the elementNode
 * @param functionToBeCalled function. The function to be called each time the event is triggered
 */
function addEventListenerToElement(elementNode, eventName, functionToBeCalled) {
  elementNode.forEach(element =>
    element.addEventListener(eventName, functionToBeCalled)
  );
}
// This function hide all element passed as parameter
function handleHidden(element) {
  element.classList.add("hidden");
  //element.style.opacity = 0;
  //element.style.zIndex = -999;
}

// This function remove the hiden state to all element passed as parameter
function handleDisplay(element) {
  element.classList.remove("hidden");
  element.style.opacity = 1;
  element.style.zIndex = 999;
}

// this function get data from the localStorage base on the key we pass has parameter
function handleGetStorageData(key) {
  return JSON.parse(localStorage.getItem(key));
}

// this function set the user Agrement into the LocalStorage
function handleSaveUserInLocalStorage(key, obj) {
  const value = JSON.stringify(obj);
  const objKey = key;

  localStorage.setItem(objKey, value);
}

// this function check if an certain key exist in the local storage
function isUserCustomParametersAvailable(key) {
  return  JSON.parse(localStorage.getItem(key));
}


function setUserDefaultParameter() {

  const parameterData = isUserCustomParametersAvailable('defaultParameters');

  if (parameterData) {
    const { language, unit, days } = parameterData;

    defaultParameters.language = language;
    defaultParameters.unit = unit;
    defaultParameters.days = days;

    translateWeekDays(parameterData, weekDay);
    translateWeekDays(parameterData, fullMonths);
  } else {
    // update the language that will be used to translate the week day
    translateWeekDays(defaultParameters, weekDay);
    translateWeekDays(defaultParameters, fullMonths);
  }

  
}


// suggestion message
function typeAheadMessage(text) {
  // initialize the message
  let message;

  // check to see the text parameter has content
  if (!text) {
    message = `
      <div class="indicatif_title">Suggestions ...</div>
      <div class="indicatif_message">Please, type in a language.</div>`;
  } else {
    message = `<div class="indicatif_message">${text}</div>`;
  }

  // finaly return the message container
  return `
    <div class="text_indicatif">
        ${message}
    </div>
  `;
}


function getWeekDayName (target, timestamp) {
  if (target === 'day')
    return new Date(timestamp).getUTCDay();
  
  if (target === 'month')
    return new Date(timestamp).getUTCMonth();

  if (target === 'year') 
    return new Date(timestamp).getUTCFullYear();
}


function translateWeekDays(defaultParametersObj, dataToTranslateObj) {

    const { language: lang } = defaultParametersObj;
    
    let words = '';

    for (let key in dataToTranslateObj) {
        words += `&text=${dataToTranslateObj[key]}`;
    }
    const link = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20181219T222649Z.bc0bff1e7a956a89.ced4abb02cd023aad687ede450469d919261b8d3${words}&lang=${lang}`;
    fetch(link)
      .then(result => result.json())
        .then(data => {
          words = '';
          updateWeekDay(data.text, dataToTranslateObj);
        })
      .catch();
}

function updateWeekDay(translatedArray, dataObjToUpdate) {

    for (let key of translatedArray) {
        const index = translatedArray.indexOf(key);

        if (key === 'Peut') key = "May"

        index = index + 1;

        dataObjToUpdate[index] = key;
    }

}
// ************* END HELPERS FUNCTIONS *******/////

//******* SHOW DROP ON INPUT OPTIONS ALONG */

// get all inputs
const inputOption = formContainer.querySelectorAll("input");

// loop over inputs and add eventListener
inputOption.forEach(input => {
  // we will apply different eventListener to inputs
  // 1. onfocus : for the language input
  // 2. onkeyup : for the unit and numbers days we will
  if (input.getAttribute("id") === "language") {
    input.addEventListener("input", showInputDropList);
    input.addEventListener("focus", showInputDropList);
  } else {
    input.addEventListener("click", showInputDropList);
    input.addEventListener("keyup", showInputDropList);
    input.addEventListener("focus", showInputDropList);
  }
});

// this function disply the dropdown for the focused input
function showInputDropList() {

  handleHidden(follower);
  // get the id value for the current input
  const currentInputId = this.getAttribute("id");

  // display languages base on the user input
  // only if the current input is the one of languages
  if (currentInputId === "language") {
    // this function will display to the user all match language against the form value
    fillUpLanguages(this.value);
  }

  // open chevron on curent input

  if (currentInputId === "unit" || currentInputId === "days") {

    if (currentInputId === "unit") {
      let input = formContainer.querySelector("input#unit");
      input.classList.add("dropListOpen");
      input.classList.remove("dropListClose");
    } else {
      let input = formContainer.querySelector("input#days");
      input.classList.add("dropListOpen");
      input.classList.remove("dropListClose");
    }
  }

  // close all dropdown that are not equal to the current Tab
  closeDropdown(currentInputId);

  // rotate the chevron on other input 
  closeChevron(this);

  // get the dropdown list that correspond to the current input id
  const dropDown = formContainer.querySelector(`.${currentInputId}`);

  // Display the dropdown
  handleDisplay(dropDown);
}

// Close all tab that are not corresponding to the current focused input.
function closeDropdown(currentElementId) {
  // loop throw all dropdown and hide those are not equal to the current input's ind
  allDropdown.forEach(dropdown => {
    const dropDownId = dropdown.classList.contains(currentElementId);

    // hide dropdown if not equal to the focused input
    if (!dropDownId) {
      handleHidden(dropdown);
    }
  });
}

// close / open the chevron

function closeChevron(element) {
  if (element === 'unit' || element === "days") {

    if (element !== "unit") {

      let input = formContainer.querySelector('input#unit')
      input.classList.remove("dropListOpen");
      input.classList.add("dropListClose");

    } else {

      let input = formContainer.querySelector('input#days')
      input.classList.remove("dropListOpen");
      input.classList.add("dropListClose");

    }

  }
}

// FILL THE OPTIONS INPUTS

// add click event on the dropdown container and display
allDropdown.forEach(dropdown => {
  dropdown.addEventListener("click", fillUpInput);
});

// this function fill up the input with the appropriate value
function fillUpInput(e) {
  // get the clicked element value
  let value = e.target.dataset.value;

  // stop the function executiion if the value is false (null or undefined)
  if (!value) return;

  // get the current dropdown id to help us targeting the appropriate input
  const currentDropdown = this.dataset.role;

  // check if the current value belong to the language dropdown
  // if yes change the language inital to the full word
  if (currentDropdown === "language") {
    value = languagesList
      .map(lang => {
        if (lang.initial === value) {
          // set the fault language to one that the user
          defaultParameters.language = lang.initial;

          // then return the language
          return (value = lang.lang);
        }
      })
      .join("");
  }

  // if the current value belong to the Unit dropdown change the unit inital to the full word
  if (currentDropdown === "unit") {
    // set the default parameter unit to the selected unit by the user
    defaultParameters.unit = value;

    // set the value to the correspondig unit in full word
    value = unit[`${value}`];
  }

  // check if the current dropdown belongs to the days dropdown
  if (currentDropdown === "days") {
    // set days of the default parameters
    defaultParameters.days = value;

  }

  // get the appropriate input that corresponding to the currentDropDown
  const input = formContainer.querySelector(`input#${currentDropdown}`);

  // set the value of the target input
  input.value = value;

  // hide the current dropdown after setting the input value
  handleHidden(this);
}

// hide all tab when click outsite of opened dropdown
window.addEventListener("click", function(e) {
  if (e.target.dataset.main === "main") {
    allDropdown.forEach(dropdown => {
      //close dropdown
      if (!dropdown.classList.contains("hidden")) handleHidden(dropdown);

      // close chevrons
      closeChevron(dropdown.dataset.role);
    });
  }
});

// close the optional panel
closeButton.addEventListener("click", toggleFormContainer);

function toggleFormContainer() {
  handleHidden(mainOptionalContainer);
}

// fill up language on typing

function fillUpLanguages(value) {
  // get the value lenght
  const valueLength = value.length;

  //if the lenght === 0 we display the suggestion text otherwise we do not
  if (valueLength <= 0) {
    languageDropdown.innerHTML = typeAheadMessage();
  } else {
    handleLaguagesFilter(value);
  }
}

// this function filter the language base on what the is typing
function matchLanguages(value) {
  let reg = new RegExp(value, "gi");

  return languagesList.filter(language => {
    return language.initial.match(reg) || language.lang.match(reg);
  });
}
function handleLaguagesFilter(value) {
  // set the user value from
  const inputValue = value.toLowerCase();

  // match all language base on the user input
  let mathcedLanguages = matchLanguages(inputValue);

  // map all mached languages and set the HTML block
  const filteredLanguages = mathcedLanguages
    .map(lang => {
      // inital the expression ton find the maching text in the languages
      const reg = new RegExp(inputValue, "gi");

      // replace the input value by a customize html element
      const newLangue = lang.lang.replace(
        reg,
        `<span data-value="${
          lang.initial
        }" class="highLight">${inputValue}</span>`
      );

      // return and join() all matched languages element
      return `
        <div class="fa initial_languages">
            <div data-value="${
              lang.initial
            }" class="contents language_inital">${lang.initial}</div>
            <span data-value="${
              lang.initial
            }" class="contents language_word">${newLangue}</span>
        </div>
    `;
    })
    .join("");

  // insert all mached language in the languages dropdown.
  languageDropdown.innerHTML =
    filteredLanguages || typeAheadMessage("Nothing was found.");
}






/*************************
/*************************
/*************************
/*************************
/*************************
 * HANDLE FETCH WEATHER DATA
 ***************************/

async function handleFetchWeatherData(obj) {

  // destructure the default parameter object to have individual variable.
  const { language, unit, days } = obj;

  // APIs key
  const weather = "65c4dd5b09024512bce943f3b65b8265";
  const ipStack = "e7aaa4e45f3c7fae3204efd4c3f540a3";

  // base URLs

  const userIpLink = "https://api.ipify.org?format=json";
  const ipStackLink = "https://cors-anywhere.herokuapp.com/http://api.ipstack.com/"; /// e.g : http://api.ipstack.com/YourIpAddress?access_key=YourKey
  const weatherLink = "https://api.weatherbit.io/v2.0/forecast/daily?"; /// e.g : https://api.weatherbit.io/v2.0/forecast/daily?city=Raleigh,NC&key={API_KEY}
  const translateLink = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20181219T222649Z.bc0bff1e7a956a89.ced4abb02cd023aad687ede450469d919261b8d3&text=Today&text=Tomorrow&text=Next 8 Days&text=Open&text=More Details&lang=${language}`;
  // fetch user ip
  const ip = await fetch(userIpLink)
    .then(
      result =>
        result.json()
    )
    .then(json => json)
    .catch(e => {
      loaderContainer.innerHTML = erroMessage();
      return;
    });

  // fetch the user city
    const city = await fetch(`${ipStackLink}${ip.ip}?access_key=${ipStack}`)
  .then(result => result.json())
  .then(data => data)
  .catch(e => {
    loaderContainer.innerHTML = erroMessage();
    return;
  });


  // fetch the weather data

  const endPoint = `${weatherLink}key=${weather}&city=${city.city}&lang=${language}&unit=${unit}&days=${days}`;
  weatherData = await fetchJsonp(endPoint, { jsonpCallback: "callBack" })
    .then(result => result.json())
    .then(data => data)
    .catch(e => {
      loaderContainer.innerHTML = erroMessage();
      return;
    });
  
   

await fetch(translateLink)
  .then(result => result.json())
  .then(translatedText => displayWeatherInfo(weatherData, translatedText, city))
  .catch(e => {
    loaderContainer.innerHTML = erroMessage(e);
    return;
  });
}

//***************DISPLAY WEATHER INFO TO THE USER */

// this function convert a float number to an integer
function converNumber(number) {
    const roundedNum = Math.round(number);
    if (roundedNum > 9)
        return roundedNum;
    else if (roundedNum >= 0 )
        return "0" + roundedNum;
    else if (roundedNum < 0) 
        return roundedNum;;
}


// this function conver number to boolean 
function getHoursFromTimestamp(timestamp) {
    timestamp = timestamp * 1000;
    const hours = new Date(timestamp).getHours();
    return hours > 9 ? hours : "0" + hours;
}

// this function format a given sting date numbers 
function formatDate(date, obj) {
  
  // substruct month number in the date
  let monthNumber = date.substring(5,7)
  const monthArray = monthNumber.split('');

  if (monthArray[0] === "0") {
    monthNumber = monthArray[1];
  }
  // get the day from the date
  const day = date.substring(8, date.length);

  // get the month from the date 
  let month;


  month = obj[monthNumber];

  // get the year from the date
  const year = date.substring(0,4);

  // return the formated date
  return `${day} ${month} ${year}`;
}


// this function crop large string 
function cropString (str) {
  return str.length > 15 ? str.substring(0, 16) + "..." : str;
}


function displayWeatherInfo(data, translatedText, cityObj) {
  // greet the user
  greetTheUser(cityObj, greetContainer);

  // global data object
  const { city_name, country_code } = data;
  moreDetails = translatedText.text[4];

  // forcast data  object
  const daysData = data.data;

  // get fist five days
  const today = daysData[0];

  // get tomorrow data
  const tomorrow = daysData[1];

  // get the third day forcast
  thirdDay = daysData[2];

  // get the fourth day forcast;
  fourthDay = daysData[3];

  // remove first 4 days in the array data
  nextHeightDays = [...daysData].splice(4);

  // set the tanslated text for the next 8 title text
  nextHeightDaysText.innerHTML = translatedText.text[2] + " :";

  // display today weather
  todayPrevisionContainer.innerHTML = `
    <!--start today-provision-->
      <div class="today_title">
          <!--today title-->
              <h1 class="today_title_text">${translatedText.text[0]}</h1>
          <!--end today title-->
      </div>

      <div class="today_temperature">
          <!--today temperature -->
              <div class="today_temperature_number"><p class="today_number">${converNumber(
                today.temp
              )}</p></div>
              <div class="today_temperature_measure">
                  <p class="today_degree_symbol">o</p>
                  <p class="today_degree_character">${
                    defaultParameters.unit
                  }</p>
              </div>
          <!--end today temperature-->
      </div>

      <div class="today_data_and_overcast">
          <!--start date and overcast-->
              <p class="todayDate">${formatDate(today.datetime, months)}, ${
    today.weather.description
  }</p>
          <!-- end date and overcast-->
      </div>

      <div class="today_location_city_country">
          <!--start today location (city and country-->
              <p class="todayCity_country">${city_name} - ${country_code}</p>
          <!--end today location (city and country-->
      </div>

      <div class="today_status_feature">
          <!--start today feature | min-temp | max-temp | Cloud %-->

          <div class="today_max_temp">
              <!--start today min-temp -->
              <div class="today_max_temp_icon"><img src="https://thecreativecloud.co.za/icons/max_temp_on_yellow.svg" alt="iweather"></div>
              <div class="today_max_temp_number"><p>${converNumber(
                today.max_temp
              )}</p></div>
              <div class="today_max_temp_measure_and_title">
                  <div class="today_max_temp_measure_symbol_and_letter">
                      <p class="symbol">o</p>
                      <p class="degree">${defaultParameters.unit}</p>
                  </div>
                  <div class="today_max_temp_title"><p>Max-Temp</p></div>
              </div>
              <!--end today min-temp -->
          </div>

          <div class="today_min_temp">
              <!--start today min-temp -->
              <div class="today_min_temp_icon"><img src="https://thecreativecloud.co.za/icons/min_temp_on_yellow.svg" alt="iweather"></div>
              <div class="today_min_temp_number"><p>${converNumber(
                today.min_temp
              )}</p></div>
              <div class="today_min_temp_measure_and_title">
                  <div class="today_min_temp_measure_symbol_and_letter">
                      <p class="symbol">o</p>
                      <p class="degree">${defaultParameters.unit}</p>
                  </div>
                  <div class="today_min_temp_title"><p>Min-Temp</p></div>
              </div>
              <!--end today min-temp -->
          </div>

          <div class="today_cloud_percent">
              <!--start today min-temp -->
              <div class="today_cloud_percent_icon"><img src="https://thecreativecloud.co.za/icons/cloud_percent_on_yellow.svg" alt="iweather"></div>
              <div class="today_cloud_percent_number"><p>${
                today.clouds
              }</p></div>
              <div class="today_cloud_percent_measure_and_title">
                  <div class="today_measure_symbol_and_letter"><p>%</p></div>
                  <div class="today_min_temp_title"><p>Cloud</p></div>
              </div>
              <!--end today min-temp -->
          </div>

          <!--end today feature | min-temp | max-temp | Cloud %-->
      </div>
  <!--end today provision-->
  `;

  //display tomorrow weather

  tomorrowContainer.innerHTML = `
            <!--start tomorrow block-->
                <div class="tomorrow_left_and_right_section_wrapper">
                    <!--tomorrow left and right section wrapper-->
                    <div class="tomorrow_left_section">
                        <!--start tomorrow left section -->
                        <div class="tomorrow_title">
                            <p>${translatedText.text[1]}</p>
                        </div>
                        <div class="tomorrow_measure">
                            <div class="tomorrow_number">
                                <p>${converNumber(tomorrow.temp)}</p>
                            </div>
                            <div class="tomorrow_symbol_and_degree">
                                <p class="symbol">o</p>
                                <p class="degree">${defaultParameters.unit}</p>
                            </div>
                        </div>
                        <!--end tomorrow left section /-->
                    </div>
                    
                    <div class="tomorrow_right_section">
                        <!--start tomorrow right section -->
                        <div class="tomorrow_max_min_temp_cloud">

                            <div class="tomorrow_max_temp">
                                <div class="tomorrow_max_icon"><img src="https://thecreativecloud.co.za/icons/max_temp_gray.svg" alt=""></div>
                                <div class="tomorrow_max_temp_number"><p>${converNumber(
                                  tomorrow.max_temp
                                )}</p></div>
                                <div class="tomorrow_max_temp_symbol_degree_and_title">
                                    <div class="tomorrow_max_temp_symbol">
                                        <p class="symbol">o</p>
                                        <p class="degree">${
                                          defaultParameters.unit
                                        }</p>
                                    </div>
                                    <div class="tomorrow_max_title"><p>Max-Temp</p></div>
                                </div>
                            </div>

                            <div class="tomorrow_min_temp">
                                <div class="tomorrow_min_icon"><img src="https://thecreativecloud.co.za/icons/min_temp_gray.svg" alt=""></div>
                                <div class="tomorrow_min_temp_number"><p>${converNumber(
                                  tomorrow.min_temp
                                )}</p></div>
                                <div class="tomorrow_min_temp_symbol_degree_and_title">
                                    <div class="tomorrow_min_temp_symbol">
                                        <p class="symbol">o</p>
                                        <p class="degree">${
                                          defaultParameters.unit
                                        }</p>
                                    </div>
                                    <div class="tomorrow_min_title"><p>Min-Temp</p></div>
                                </div>
                            </div>

                            <div class="tomorrow_cloud">
                                <div class="tomorrow_cloud_icon"><img src="https://thecreativecloud.co.za/icons/cloud_gray.svg" alt=""></div>
                                <div class="tomorrow_cloud_number"><p>${
                                  tomorrow.clouds
                                }</p></div>
                                <div class="tomorrow_cloud_symbol_degree_and_title">
                                    <div class="tomorrow_cloud_symbol"><p>%</p></div>
                                    <div class="tomorrow_min_title"><p>Cloud</p></div>
                                </div>
                            </div>

                        </div>
                        <!--end tomorrow right section /-->
                    </div>
                    <!--end tomorrow left and right section wrapper-->
                </div>

                <div class="tomorrow_date_and_overcast">
                    <p>${formatDate(tomorrow.datetime, months)}, ${
    tomorrow.weather.description
  }</p>
                </div>

                <!--end tomorrow block-->
  `;

  nextTwoDaysContainer.innerHTML = `

            <div class="next_two_days_left following">
            <div class="next_two_days_left_overcast_title"><p>${cropString(
              thirdDay.weather.description
            )}</p></div>
            <div class="next_two_days_left_date"><p>${formatDate(
              thirdDay.datetime,
              months
            )}</p></div>
            <div class="next_two_days_left_degree_symbol">
                <div class="next_two_days_left_degree_number"><p>${converNumber(
                  thirdDay.temp
                )}</p></div>
                <div class="next_two_days_left_degree_symbol">
                    <p class="symbol">o</p>
                    <p class="degree">${defaultParameters.unit}</p>
                </div>
            </div>
            <div class="next_two_days_left_open_button"><button class="open_button" data-id="2">${
              translatedText.text[3]
            }</button></div>
        </div>

        <div class="next_two_days_right following">
            <div class="next_two_days_right_overcast_title"><p>${cropString(
              fourthDay.weather.description
            )}</p></div>
            <div class="next_two_days_right_date"><p>${formatDate(
              fourthDay.datetime,
              months
            )}</p></div>
            <div class="next_two_days_right_degree_symbol">
                <div class="next_two_days_right_degree_number"><p>${converNumber(
                  fourthDay.temp
                )}</p></div>
                <div class="next_two_days_right_degree_symbol">
                    <p class="symbol">o</p>
                    <p class="degree">${defaultParameters.unit}</p>
                </div>
            </div>
            <div class="next_two_days_right_open_button"><button class="open_button" data-id="3">${
              translatedText.text[3]
            }</button></div>
        </div>
  
  `;

  // display 8 next days
  nextHeightDaysContainer.innerHTML = nextHeightDays
    .map(day => {
      return `

          <div data-id="${nextHeightDays.indexOf(
            day
          )}" class="next_8days_block following">
              <div class="next_8days_block_title"><p class="top_title">${formatDate(
                day.datetime,
                months
              )}</p></div>
              <div class="next_8days_block_icon"><img src="https://raw.githubusercontent.com/Ephrey/icon/master/${
                day.weather.icon
              }.png" alt=""></div>
              <div class="next_8days_block_temperature_symbol_title">
                  <div class="next_8days_block_temperature_number"><p>${converNumber(
                    day.temp
                  )}</p></div>

                  <div class="next_8days_block_symbol_and_title">
                      <div class="next_8days_block_temperature_symbol">
                          <p class="symbol">o</p>
                          <p class="degree">${defaultParameters.unit}</p>
                      </div>
                      <div class="next_8days_block_title"><p>Temperat.</p></div>
                  </div>
              </div>
          </div>

      `;
    })
    .join("");

  setTimeout(() => {
    handleHidden(authorisationMainContainer);
  }, 1200);

  setTimeout(() => {
    authorisationMainContainer.style.zIndex = -9999999999;

    // select all 8 days blocks
    const allNextDaysBlocks = document.querySelectorAll(".next_8days_block");

    // select all open buttons   weatherData
    const openButtons = document.querySelectorAll(".open_button");

    // add click event to all 8 days blocks container
    allNextDaysBlocks.forEach(block =>
      block.addEventListener("click", displaySingleView)
    );

    // add click event to all open button
    openButtons.forEach(button =>
      button.addEventListener("click", displaySingleView)
    );
  }, 3000);
}

//*****************END DISPLAY WEATHER INFO TO THE USER */






/// ****************DISPLAY SINGLE ELEMENT INFO ************** // STAMFORD HILL 4025

// get 8 days forcast container
// nextHeightDaysContainer.addEventListener('click', displaySingleView);

function displaySingleView() {

  // const get the id or unique identifier of the clicked element 
  const elementClickedId = this.dataset.id;

  // get the object from the 8 days array object that correspond to the cliked element
  let clickedElementData = '';

  if (!this.classList.contains('open_button')) {
      clickedElementData = nextHeightDays[elementClickedId];
  } else if (this.classList.contains('open_button') && this.dataset.id === "2") {
      clickedElementData = thirdDay;
  } else if (this.classList.contains('open_button') && this.dataset.id === "3") {
      clickedElementData = fourthDay
  }

  // get the the single view container 
  const singleViewContainer = document.querySelector('.single_view_panel_conatiner');

  
  //remove the hidden status to the single view container
  singleViewContainer.classList.remove('fadeInSingleContainer');


  // destructure the data to get only parameter we need
    const { ts, datetime, temp, weather, min_temp, max_temp, clouds_hi, clouds_low, snow, snow_depth, vis, rh, precip, pop, wind_dir, wind_spd, sunrise_ts, sunset_ts  } = clickedElementData;
  const { city_name, country_code } = weatherData;

  // build the single view block 
  const singleView = `
       

    <div class="fadeInTheSingle single_view_panel_content">
                <div class="weather_single_close">
                    <img class="closeSingleView" src="https://thecreativecloud.co.za/icons/singleview/close.svg" alt="">
                </div>
                <div class="weather_single_title">
                    <p>${weekDay[getWeekDayName("day", datetime)]}</p>
                </div>
                <div class="weather_single_date">
                    <!--<div class="number_day"><p>20</p></div>
                    <div class="exposant"><p>th</p></div>-->
                    <div class="month_year"><p>${formatDate(datetime, fullMonths)}</p></div>
                </div>

                <div class="weather_single_temperature_number">
                    <div class="weather_single_number">
                        <p>${converNumber(temp)}</p>
                    </div>
                    <div class="weather_single_symbole_degree">
                        <div class="symble"><p>o</p></div>
                        <div class="degree"><p>${defaultParameters.unit}</p></div>
                    </div>
                </div>

                <div class="weather_single_forcast_description"><p>${weather.description}</p></div>
                <div class="weather_single_city_country">
                    <img src="https://thecreativecloud.co.za/icons/singleview/location.svg" alt="">
                    <p>${city_name} - ${country_code}</p>
                </div>
                
                <div class="glide weahter_more_info_arrows_container">
                    <div class="weahter_more_info_arrows">
                        <div class="weather_single_more_option">
                            <p>${moreDetails}</p>
                        </div>
                        <div class="weather_single_arrows glide__arrows" data-glide-el="controls">
                            <img src="https://thecreativecloud.co.za/icons/singleview/arrow_left.svg" class="eLeft glide__arrow glide__arrow--left" data-glide-dir="<">
                            <img src="https://thecreativecloud.co.za/icons/singleview/arrow_right.svg" class="eRight glide__arrow glide__arrow--right" data-glide-dir=">">
                        </div>
                    </div>
                    
                    

                    <div class="weather_slider_block glide__track" data-glide-el="track">
                        <div class="weather_slider_block_content glide__slides">

                            <div class="glide__slide">

                                <div class="more_details_title" style="padding-top: 5px"><p class="more_details_title_text" style="font-size: 18px;">Temperature</p></div>
                                
                                <div class="more_details_numbers">
                                    
                                    <div class="more_details_numbers_left">

                                        <div class="more_details_number">
                                            <p>${converNumber(min_temp)}</p>
                                        </div>

                                        <div class="more_details_degree_symbole_sub_title">

                                            <div class="more_details_degree_symbole">
                                                <div class="symbole"><p>o</p></div>
                                                <div class="degree"><p>C</p></div>
                                            </div>

                                            <div class="measure"><p>min</p></div>
                                        </div>

                                    </div> 


                                    <div class="more_details_numbers_right">
                                    
                                        <div class="right_float">
                                            
                                            <div class="more_details_number">
                                                <p>${converNumber(max_temp)}</p>
                                            </div>
                                            
                                            <div class="more_details_degree_symbole_sub_title">
                                            
                                                <div class="more_details_degree_symbole">
                                                    <div class="symbole">
                                                        <p>o</p>
                                                    </div>
                                                    <div class="degree">
                                                        <p>C</p>
                                                    </div>
                                                </div>
                                            
                                                <div class="measure">
                                                    <p>max</p>
                                                </div>
                                            </div>
                                        </div>
                                    
                                    </div>

                                </div>

                                <div class="weather_single_icon">
                                    <img class="temp" src="https://thecreativecloud.co.za/icons/singleview/thermometer1.svg" alt="">
                                </div>
                            </div>

                            <div class="glide__slide">

                                <div class="more_details_title" style="padding-top: 5px"><p class="more_details_title_text" style="font-size: 18px;">Clouds</p></div>
                                
                                <div class="more_details_numbers">
                                    
                                    <div class="more_details_numbers_left">

                                        <div class="more_details_number">
                                            <p>${converNumber(clouds_low)}</p>
                                        </div>

                                        <div class="more_details_degree_symbole_sub_title">

                                            <div class="more_details_degree_symbole">
                                                <div class="degree"><p>%</p></div>
                                            </div>

                                            <div class="measure"><p>low</p></div>
                                        </div>

                                    </div> 


                                    <div class="more_details_numbers_right">
                                    
                                        <div class="right_float">
                                            
                                            <div class="more_details_number">
                                                <p>${converNumber(clouds_hi)}</p>
                                            </div>
                                            
                                            <div class="more_details_degree_symbole_sub_title">
                                            
                                                <div class="more_details_degree_symbole">
                                                    <div class="degree">
                                                        <p>%</p>
                                                    </div>
                                                </div>
                                            
                                                <div class="measure">
                                                    <p>hig</p>
                                                </div>
                                            </div>
                                        </div>
                                    
                                    </div>

                                </div>

                                <div class="weather_single_icon">
                                    <img class="clouds" src="https://thecreativecloud.co.za/icons/singleview/cloud.svg" alt="">
                                </div>
                            </div>

                            <div class="glide__slide">
                            
                                <div class="more_details_title" style="padding-top: 5px">
                                    <p class="more_details_title_text" style="font-size: 18px;">Snow</p>
                                </div>
                            
                                <div class="more_details_numbers">
                            
                                    <div class="more_details_numbers_left">
                            
                                        <div class="more_details_number">
                                            <p>${converNumber(snow)}</p>
                                        </div>
                            
                                        <div class="more_details_degree_symbole_sub_title">
                            
                                            <div class="more_details_degree_symbole">
                                                <div class="degree">
                                                    <p>mm</p>
                                                </div>
                                            </div>
                            
                                            <div class="measure">
                                                <p>acc.</p>
                                            </div>
                                        </div>
                            
                                    </div>
                            
                            
                                    <div class="more_details_numbers_right">
                            
                                        <div class="right_float">
                            
                                            <div class="more_details_number">
                                                <p>${converNumber(snow_depth)}</p>
                                            </div>
                            
                                            <div class="more_details_degree_symbole_sub_title">
                            
                                                <div class="more_details_degree_symbole">
                                                    <div class="degree">
                                                        <p>mm</p>
                                                    </div>
                                                </div>
                            
                                                <div class="measure">
                                                    <p>dep.</p>
                                                </div>
                                            </div>
                                        </div>
                            
                                    </div>
                            
                                </div>
                            
                                <div class="weather_single_icon">
                                    <img class="snow" src="https://thecreativecloud.co.za/icons/singleview/snowflake(1).svg" alt="">
                                </div>
                            </div>

                            <div class="glide__slide">
                            
                                <div class="more_details_title">
                                    <p class="more_details_title_text">Visibility / Humidity</p>
                                </div>
                            
                                <div class="more_details_numbers">
                            
                                    <div class="more_details_numbers_left">
                            
                                        <div class="more_details_number">
                                            <p>${converNumber(vis)}</p>
                                        </div>
                            
                                        <div class="more_details_degree_symbole_sub_title">
                            
                                            <div class="more_details_degree_symbole">
                                                <div class="degree">
                                                    <p>KM</p>
                                                </div>
                                            </div>
                            
                                            <div class="measure">
                                                <p>vis.</p>
                                            </div>
                                        </div>
                            
                                    </div>
                            
                            
                                    <div class="more_details_numbers_right">
                            
                                        <div class="right_float">
                            
                                            <div class="more_details_number">
                                                <p>${converNumber(rh)}</p>
                                            </div>
                            
                                            <div class="more_details_degree_symbole_sub_title">
                            
                                                <div class="more_details_degree_symbole">
                                                    <div class="degree">
                                                        <p>%</p>
                                                    </div>
                                                </div>
                            
                                                <div class="measure">
                                                    <p>hu.</p>
                                                </div>
                                            </div>
                                        </div>
                            
                                    </div>
                            
                                </div>
                            
                                <div class="weather_single_icon">
                                    <img class="humidity" src="https://thecreativecloud.co.za/icons/singleview/binoculars.svg" alt="">
                                </div>
                            </div>

                            <div class="glide__slide">
                            
                                <div class="more_details_title">
                                    <p class="more_details_title_text">Probability & Equivalent Precipitation</p>
                                </div>
                            
                                <div class="more_details_numbers">
                            
                                    <div class="more_details_numbers_left">
                            
                                        <div class="more_details_number">
                                            <p>${converNumber(pop)}</p>
                                        </div>
                            
                                        <div class="more_details_degree_symbole_sub_title">
                            
                                            <div class="more_details_degree_symbole">
                                                <div class="degree">
                                                    <p>%</p>
                                                </div>
                                            </div>
                            
                                            <div class="measure">
                                                <p>prob.</p>
                                            </div>
                                        </div>
                            
                                    </div>
                            
                            
                                    <div class="more_details_numbers_right">
                            
                                        <div class="right_float">
                            
                                            <div class="more_details_number">
                                                <p>${converNumber(precip)}</p>
                                            </div>
                            
                                            <div class="more_details_degree_symbole_sub_title">
                            
                                                <div class="more_details_degree_symbole">
                                                    <div class="degree">
                                                        <p>mm</p>
                                                    </div>
                                                </div>
                            
                                                <div class="measure">
                                                    <p>equi.</p>
                                                </div>
                                            </div>
                                        </div>
                            
                                    </div>
                            
                                </div>
                            
                                <div class="weather_single_icon">
                                    <img class="precipitation" src="https://thecreativecloud.co.za/icons/singleview/precipitation(1).svg" alt="">
                                </div>
                            </div>

                            
                            <div class="glide__slide">
                            
                                <div class="more_details_title">
                                    <p class="more_details_title_text">Wind <br> Direction / Speed</p>
                                </div>
                            
                                <div class="more_details_numbers">
                            
                                    <div class="more_details_numbers_left">
                            
                                        <div class="more_details_number">
                                            <p>${converNumber(wind_dir)}</p>
                                        </div>
                            
                                        <div class="more_details_degree_symbole_sub_title">
                            
                                            <div class="more_details_degree_symbole">
                                                <div class="degree">
                                                    <p>%</p>
                                                </div>
                                            </div>
                            
                                            <div class="measure">
                                                <p>dir.</p>
                                            </div>
                                        </div>
                            
                                    </div>
                            
                            
                                    <div class="more_details_numbers_right">
                            
                                        <div class="right_float">
                            
                                            <div class="more_details_number">
                                                <p>${converNumber(wind_spd)}</p>
                                            </div>
                            
                                            <div class="more_details_degree_symbole_sub_title">
                            
                                                <div class="more_details_degree_symbole">
                                                    <div class="degree">
                                                        <p>mm</p>
                                                    </div>
                                                </div>
                            
                                                <div class="measure">
                                                    <p>spd.</p>
                                                </div>
                                            </div>
                                        </div>
                            
                                    </div>
                            
                                </div>
                            
                                <div class="weather_single_icon">
                                    <img class="wind" src="https://thecreativecloud.co.za/icons/singleview/wind.svg" alt="">
                                </div>
                            </div>


                            <div class="glide__slide">
                            
                                <div class="more_details_title">
                                    <p class="more_details_title_text">Sun <br>
                                    Rise / Set</p>
                                </div>
                            
                                <div class="more_details_numbers">
                            
                                    <div class="more_details_numbers_left">
                            
                                        <div class="more_details_number">
                                            <p>${getHoursFromTimestamp(sunrise_ts)}</p>
                                        </div>
                            
                                        <div class="more_details_degree_symbole_sub_title">
                            
                                            <div class="more_details_degree_symbole">
                                                <div class="degree">
                                                    <p>h</p>
                                                </div>
                                            </div>
                            
                                            <div class="measure">
                                                <p>am</p>
                                            </div>
                                        </div>
                            
                                    </div>
                            
                            
                                    <div class="more_details_numbers_right">
                            
                                        <div class="right_float">
                            
                                            <div class="more_details_number">
                                                <p>${getHoursFromTimestamp(sunset_ts)}</p>
                                            </div>
                            
                                            <div class="more_details_degree_symbole_sub_title">
                            
                                                <div class="more_details_degree_symbole">
                                                    <div class="degree">
                                                        <p>h</p>
                                                    </div>
                                                </div>
                            
                                                <div class="measure">
                                                    <p>pm</p>
                                                </div>
                                            </div>
                                        </div>
                            
                                    </div>
                            
                                </div>
                            
                                <div class="weather_single_icon">
                                    <img class="sun" src="https://thecreativecloud.co.za/icons/singleview/sunset.svg" alt="">
                                </div>
                            </div>


                            <!-- <div class="glide__slide">
                            
                                <div class="more_details_title">
                                    <p class="more_details_title_text">Probability & Equivalent Precipitation</p>
                                </div>
                            
                                <div class="more_details_numbers">
                            
                                    <div class="more_details_numbers_left">
                            
                                        <div class="more_details_number">
                                            <p>20</p>
                                        </div>
                            
                                        <div class="more_details_degree_symbole_sub_title">
                            
                                            <div class="more_details_degree_symbole">
                                                <div class="symbole">
                                                    <p>o</p>
                                                </div>
                                                <div class="degree">
                                                    <p>C</p>
                                                </div>
                                            </div>
                            
                                            <div class="measure">
                                                <p>min</p>
                                            </div>
                                        </div>
                            
                                    </div>
                            
                            
                                    <div class="more_details_numbers_right">
                            
                                        <div class="right_float">
                            
                                            <div class="more_details_number">
                                                <p>20</p>
                                            </div>
                            
                                            <div class="more_details_degree_symbole_sub_title">
                            
                                                <div class="more_details_degree_symbole">
                                                    <div class="symbole">
                                                        <p>o</p>
                                                    </div>
                                                    <div class="degree">
                                                        <p>C</p>
                                                    </div>
                                                </div>
                            
                                                <div class="measure">
                                                    <p>min</p>
                                                </div>
                                            </div>
                                        </div>
                            
                                    </div>
                            
                                </div>
                            
                                <div class="weather_single_icon">
                                    <img src="https://thecreativecloud.co.za/icons/singleview/binoculars.svg" alt="">
                                </div>
                            </div> -->

                            
                        </div>
                    </div>
                
                    
                </div>



        </div>
  
  `;


    setTimeout(() => {
        singleViewContainer.innerHTML = singleView;
    }, 700);


    setTimeout(() => {

        let singleView = document.querySelector('.single_view_panel_content');

        singleView.classList.remove("fadeInTheSingle");

        document.querySelector('.closeSingleView').addEventListener('click', function (e) {
            singleView.classList.add("fadeInTheSingle");
            setTimeout(() => {
                singleViewContainer.classList.add("fadeInSingleContainer");
            }, 1100);
        });

        new Glide(".glide", {
            type: "carousel",
            perView: 4,
            animationTimingFunc: "bounce",
            hoverpause: false
        }).mount();

    }, 1000);
}



/// ****************DISPLAY SINGLE ELEMENT INFO ************** //










if (handleGetStorageData("userAutho")) { 

    if (handleGetStorageData("userAutho").status) {

        // check if the we have the user default parameters in the local storage 
        setUserDefaultParameter();

        // call the function that fech the data from APIs
        handleFetchWeatherData(defaultParameters);

    } else {
        //display the authorisation panel
        handleDisplay(authorisationMainContainer);
    }
  
} else {
  //display the authorisation panel
  handleDisplay(authorisationMainContainer);
}



