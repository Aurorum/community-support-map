window.onload = function () {
  collectStatistics("Loaded homepage");
};

function queryPostcode() {
  collectStatistics(
    "MP search made - " + document.getElementById("postcode").value
  );
  if (document.getElementById("postcode").value !== "") {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var apiResponse = JSON.parse(this.responseText);
        interpretPostcodeApiResponse(
          apiResponse.result.parliamentary_constituency
        );
      } else if (this.readyState == 4 && this.status == 404) {
        document.getElementById("mp-email").innerHTML = "Invalid postcode";
      } else {
        document.getElementById("mp-email").innerHTML =
          "Checking, please wait...";
      }
    };
    xhttp.open(
      "GET",
      "https://api.postcodes.io/postcodes/" +
        document.getElementById("postcode").value,
      true
    );
    xhttp.send();
  } else {
    document.getElementById("mp-email").innerHTML =
      "Please enter a postcode below first";
  }
}

function interpretPostcodeApiResponse(constituency) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      queryMpEmail(this);
    }
  };
  xmlhttp.open(
    "GET",
    "https://data.parliament.uk/membersdataplatform/services/mnis/members/query/constituency=" +
      constituency.replace(/ /g, "+") +
      "/Addresses/",
    true
  );
  xmlhttp.send();
}

function queryMpEmail(xml) {
  displayName = xml.responseXML
    .getElementsByTagName("Member")[0]
    .getElementsByTagName("DisplayAs")[0].childNodes[0].nodeValue;
  var emailData = xml.responseXML
    .querySelectorAll('Address[Type_Id="1"]')[0]
    .getElementsByTagName("Email")[0].childNodes[0].nodeValue;
  if (emailData !== null && emailData.length) {
    document.getElementById("mp-email").innerHTML =
      'Click <a href="mailto:' +
      emailData +
      '?subject=Creating a better constituency after coronavirus"">here</a> to send an email to your local MP, ' +
      displayName +
      ".";
    collectStatistics("MP search successful - " + displayName);
  } else {
    document.getElementById("mp-email").innerHTML =
      "There was an error - sorry!";
  }
}

function exploreMapButton() {
  collectStatistics("Explore map button clicked");
  window.location.href = "./map";
}

function collectStatistics(data) {
  // Fires stats mainly for debugging with issues that arise with specific postcodes.
  if (data === undefined) {
    data = "unknown source";
  }

  var request = new XMLHttpRequest();
  request.open(
    "POST",
    "https://discord.com/api/webhooks/714793504152485918/cSyzSsQEFHr5zfk2hfND8D7YdUrqXqr6Ouur7SeF5o2TNWoHtg5Xzv8cfXOHROCPqIvr"
  );

  request.setRequestHeader("Content-type", "application/json");

  var params = {
    content:
      "**Statistics: " +
      data +
      "** at " +
      new Date() +
      " with data of " +
      navigator.userAgent,
  };

  request.send(JSON.stringify(params));
}
