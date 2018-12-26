export default function greetTheUser(contryDefault, container) {

  const { country_name, region_name, location } = contryDefault;
  const time = new Date().getHours();
  const languages = location.languages
    .map(lang => {
      return `<span class="text_title">${lang.native}</span>`;
    })
    .join("");

  const elementContent = `
    <div class="content_greet">
            <div class="flag_contaienr" style="background: url(${
              location.country_flag
            }) center center no-repeat; background-size: cover;"> 
                <div class="flag_content">
                    <img src="${location.country_flag}">
                </div>
            </div>
            <div class="message_content">
                <p class="greet_text">${greeting(
                  time
                )} Dear from <span>${country_name}</span></p>
                <p class="greet_sub_text_">Hope everything are well in <span>${region_name}</span></p>
                <p class="greet_sub_text">Thank you for visiting <span>eWeather !</span></p>
            </div>
            <div class="local_languages">
                <p class="language_title">Local Languages : </p>
                <div class="language_container">
                    ${languages}
                </div>
            </div>
      </div>
  `;

  container.innerHTML = elementContent;

  setTimeout(() => {
    container.classList.remove("outright");
    removeGreeter(container);
  }, 5000);
}

function removeGreeter(container) {
  setTimeout(() => {
    container.classList.add("outright");
  }, 6000);
}

function greeting(hours) {
  if (hours < 12) return "Good Morning";
  else if (hours < 18) return "Good Afternoon";
  else return "Good Evening";
}
