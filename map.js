function filterMarkers(filteredItem) {
  document.body.classList.remove("filter-food");
  document.body.classList.remove("filter-none");
  document.body.classList.remove("filter-medicine");
  document.body.classList.remove("filter-accommodation");
  document.body.classList.add("filter-" + filteredItem);
}

function setDroppingLocationPin() {
  if (sessionStorage.getItem("isDroppingLocationPin") === "true") {
    sessionStorage.setItem("isDroppingLocationPin", "false");
    document.body.classList.remove("is-placing-marker");
    document.getElementById("add-location-button").classList.remove("is-scary");
    document.getElementById("location-saver-prompt").style.display = "none";
    document.getElementById("save-location-instructions").style.display =
      "block";
    document.getElementById("add-location-button").innerHTML =
      "Add your location";
  } else {
    sessionStorage.setItem("isDroppingLocationPin", "true");
    document.body.classList.add("is-placing-marker");
    document.getElementById("add-location-button").innerHTML = "Cancel";
    document.getElementById("location-saver-prompt").style.display = "block";
    document.getElementById("save-location-instructions").style.display =
      "block";
    document.getElementById("add-location-button").classList.add("is-scary");
  }
}
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    var response = JSON.parse(this.responseText);
    interpretApiResponse(response);
  }
};
// Note: API is protected - it cannot be abused.
xmlhttp.open(
  "GET",
  "https://sheets.googleapis.com/v4/spreadsheets/1kddtV4319qnJiTy0Ok-nKhHFqJaC9bj1AmSFjwM2eQA/values/Sheet1!A2:E9999?&key=AIzaSyBAHWoa7hJLZXiSKy11Woq4iM8dizlTRCI",
  true
);
xmlhttp.send();

function interpretApiResponse(arr) {
  var apiResponseString = arr.values[0] + "";
  var apiResponse = apiResponseString.split(/,+/);

  for (i = 0; i < arr.values.length; i++) {
    var apiResponseString = arr.values[i] + "";
    var apiResponse = apiResponseString.split(/,+/);
    console.log([
      apiResponse[apiResponse.length - 5].trim(),
      apiResponse[apiResponse.length - 4].trim(),
    ]);

    var apiCoordinates = [
      apiResponse[apiResponse.length - 5].trim(),
      apiResponse[apiResponse.length - 4].trim(),
    ];
    var popup = new mapboxgl.Popup({ offset: 25 }).setText(
      "Details: " +
        apiResponse[apiResponse.length - 3] +
        " \nEmail: " +
        apiResponse[apiResponse.length - 2]
    );

    var el = document.createElement("div");
    el.id = "marker";
    el.classList.add(apiResponse[apiResponse.length - 1]);

    new mapboxgl.Marker(el)
      .setLngLat(apiCoordinates)
      .setPopup(popup)
      .addTo(map);
  }
}

// Note: API key is protected and cannot be abused.
mapboxgl.accessToken =
  "pk.eyJ1IjoiYXVyb3J1bSIsImEiOiJja2FwYW5pMHQwMjdoMnF0NXh0bjI5MTE5In0.jvEYRg6sciPf0mWv7OKCVw";
var bounds = [
  [-7.57216793459, 49.959999905],
  [1.68153079591, 58.6350001085],
];
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  maxBounds: bounds,
  zoom: 5,
});

map.on("click", function (e) {
  if (sessionStorage.getItem("isDroppingLocationPin") === "true") {
    sessionStorage.setItem("langlat", JSON.stringify(e.lngLat.wrap()));
    var storedCoordinates = sessionStorage.getItem("langlat");

    if (document.getElementById("temporary-marker")) {
      var element = document.getElementById("temporary-marker");
      element.parentNode.removeChild(element);
    }

    var el = document.createElement("div");
    el.id = "temporary-marker";

    new mapboxgl.Marker(el)
      .setLngLat([
        storedCoordinates
          .substring(0, storedCoordinates.indexOf(',"'))
          .replace('{"lng":', ""),
        storedCoordinates.split(":").pop().replace("}", ""),
      ])
      .addTo(map);
    document.getElementById("add-location-info").style.display = "block";
    document.getElementById("location-saver-prompt").style.display = "none";
    document.getElementById("save-location-instructions").style.display =
      "none";
    document.getElementById("add-location-button").classList.remove("is-scary");
    document.body.classList.remove("is-placing-marker");
    document.getElementById("add-location-button").innerHTML =
      "Change location";
  }
  sessionStorage.setItem("isDroppingLocationPin", "false");
});

map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    countries: "gb",
    mapboxgl: mapboxgl,
  })
);

sessionStorage.setItem("isDroppingLocationPin", "false");

window.onload = function () {
  setTimeout(function () {
    document.getElementById("loading").style.display = "none";
  }, 1800);

  var request = new XMLHttpRequest();
  request.open(
    "POST",
    "https://discord.com/api/webhooks/714793504152485918/cSyzSsQEFHr5zfk2hfND8D7YdUrqXqr6Ouur7SeF5o2TNWoHtg5Xzv8cfXOHROCPqIvr"
  );

  request.setRequestHeader("Content-type", "application/json");

  var params = {
    content:
      "**Statistics: Loaded map " +
      "** at " +
      new Date() +
      " with data of " +
      navigator.userAgent,
  };

  request.send(JSON.stringify(params));
};

function emailValidation(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function fireInformation() {
  if (
    document.getElementById("add-location-textarea").value === "" ||
    document.getElementById("email").value === ""
  ) {
    document.getElementById("missing-info-error").innerHTML =
      "Error: all fields are required.";
    document.getElementById("missing-info-error").style.display = "block";
  } else if (!emailValidation(document.getElementById("email").value)) {
    document.getElementById("missing-info-error").innerHTML =
      "Error: please enter a valid email address.";
    document.getElementById("missing-info-error").style.display = "block";
  } else {
    var request = new XMLHttpRequest();
    request.open(
      "POST",
      "https://discord.com/api/webhooks/712379660293505064/kI_Z-cQ9gWgZ6gERJ9NKBV1JatPjOZLsPIbmJzSsY6Z97XotP6eFHFT1JFsf0ZDTlr7b"
    );

    request.setRequestHeader("Content-type", "application/json");

    var params = {
      content:
        "**Location**:" +
        sessionStorage.getItem("langlat") +
        "\n**Type:** " +
        document.getElementById("help-type").value +
        "\n**Info**: " +
        document.getElementById("add-location-textarea").value +
        "\n**Email**: " +
        document.getElementById("email").value +
        "\n<@291254759460044800>",
    };

    request.send(JSON.stringify(params));
    document.getElementById("save-location-form").innerHTML =
      "Thank you for making the world a better place - we've received your details and will contact you soon!";
    document
      .getElementById("save-location-form")
      .classList.add("submission-sent");
  }
}
