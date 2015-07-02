/*  Created Date: 26 July, 2013
Update Date: 19 Aug, 2013, 23 Aug, 2013, 26 Aug, 2013, 29 Aug, 2013
Author: TCS
Subject: Zip code detection on Mobile Devices 
Description: Get the zip code on mobile devices using Geolocation API and MapQuest API
*/
var ReverseCounter = 5;
// Main function call
function getMobileGeoLoc() {
    // Only for mobile devices only
    if (checkMobileDevices())
    //initiate_geolocation();                // 1. Approach: getCurrentPosition : Only once detect the location coordinates
        initiate_watchlocation();   // 2. Approach: watchPosition : Detect the location coordinates after certain interval of time
}

// 1. Approach: Initiate Geolocation : Only once detect the location coordinates
function initiate_geolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(handle_geolocation_query, handle_errors);
    }
    else {
        yqlgeo.get('visitor', normalize_yql_response);
    }
    return false;
}

// watchPrcess object id
var watchProcess = null;

// 2. Approach: Initiate Watchlocation : Detect the location coordinates after certain interval of time
function initiate_watchlocation() {
    if (watchProcess == null) {
        // only for HTML5 compatible browsers, naviagtor.geolocation is true 
        if (navigator.geolocation) {
            // Ask for permission to share the location 
            // On Allow, it calls handle_geolocation_query() 
            // On Deny, it call handle_errors()
            watchProcess = navigator.geolocation.watchPosition(handle_geolocation_query, handle_errors, {
                enableHighAccuracy: true,
                maximumAge: 10 * 60 * 1000, // [now 10 min]// in ms: time for to cache the location , then next request is made
                timeout: 10 * 1000 // in ms: how long time to wait when trying to obtain a position
            });
        }
        // For specific to blackberry devices
        // Test to see if the blackberry location API is supported
        else if (window.blackberry && blackberry.location.GPSSupported) {
            // It will error on refresh and all javascript processing on the page will stop
            // blackberry.location.onLocationUpdate(locationCB());
            var gps = blackberry.location.GPSSupported;
            // Set to Assisted mode
            blackberry.location.setAidMode(1);
            blackberry.location.refreshLocation();
            setblackberryPosition(blackberry.location.latitude, blackberry.location.longitude);
            // RIGHT: pass a string that calls our method
            blackberry.location.onLocationUpdate(locationCB());
            // Set to Autonomous mode
            blackberry.location.setAidMode(2);
            // Refresh the location
            blackberry.location.refreshLocation();
        }
        else {
            // Yahoo service
            yqlgeo.get('visitor', normalize_yql_response);
        }
    }
}

// To stop the watchPosition if desired
function stop_watchlocation() {
    if (watchProcess != null) {
        navigator.geolocation.clearWatch(watchProcess);
        watchProcess = null;
    }
}

// YQL Geo Library is a dedicated and lightweight library that 
// lets you perform geolocation using good old Yahoo service.
function normalize_yql_response(response) {
    if (response.error) {
        var error = { code: 0 };
        handle_error(error);
        return;
    }
    var position = {
        coords:
                    {
                        latitude: response.place.centroid.latitude,
                        longitude: response.place.centroid.longitude
                    },
        address:
                    {
                        city: response.place.locality2.content,
                        region: response.place.admin1.content,
                        country: response.place.country.content
                    }
    };
    handle_geolocation_query(position);
}

// Handle errors
// We can check for the kind of error that has occurred.
function handle_errors(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED: //alert("You have selected not to share location on your device.");
            break;
        case error.POSITION_UNAVAILABLE: //alert("Could not locate your current position.");
            // start the service again
            watchProcess = navigator.geolocation.watchPosition(handle_geolocation_query, handle_errors, {
                enableHighAccuracy: true,
                maximumAge: 10 * 60 * 1000,
                timeout: 10 * 1000
            });
            break;
        case error.TIMEOUT: //alert("Retrieving position timed out.");
            // start the service again
	    ReverseCounter--;//Decrease counter by 1 to stop continous calls to geolocation api.
	    if (ReverseCounter > 0) {
            watchProcess = navigator.geolocation.watchPosition(handle_geolocation_query, handle_errors, {
                enableHighAccuracy: true,
                maximumAge: 10 * 60 * 1000,
                timeout: 10 * 1000
            });
	    }
            break;
        default: alert("Unknown Error");
            break;
    }
}

// Handle_geolocation_query(position) function to asynchronously get the 
// geolocation data through the position argument.
function handle_geolocation_query(position) {

    // Lat & Long from position
    var lat = position.coords.latitude;
    var long = position.coords.longitude;

    // Ajax Call: To get the zip code from the lat & long provided by Geolocation API, as passed as a parameter to MapQuest API
    jQuery.ajax({
        type: "GET",
        /* Map Quest API */
        url: "http://open.mapquestapi.com/geocoding/v1/reverse?key=Fmjtd%7Cluub2008nl%2C22%3Do5-9ursh0&location=" + lat + "," + long,

        /* Google API - not in use*/
        //url: "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&sensor=true",

        cache: false,
        data: ({ latitude: lat, longitude: long }),
        async: true,
        success: function (data) {

            // Map Quest API result 
            var result = data.results[0].locations[0];

            // detected zip code by MapQuest
            var mobileZipCode = result.postalCode;
            // additional info provided by MapQuest
            var country = result.adminArea1;
            var state = result.adminArea3;
            var county = result.adminArea4;
            var city = result.adminArea5;
            var street = result.street;


            // Map Quest Test - Not a part of code
            // START__________________________________________________________________________________________________________________________
            var dateTime = new Date();
            // date
            var day = dateTime.getDate();
            var month = dateTime.getMonth() + 1;
            var year = dateTime.getFullYear();
            var date = day + "/" + month + "/" + year;
            // time
            var hours = dateTime.getHours();
            var minutes = dateTime.getMinutes();
            if (minutes < 10)
                minutes = "0" + minutes;
            var time = hours + ":" + minutes;

            var zipCodeCookie = "";
            if (jQuery.cookie("UserInfoZip") != null)
                zipCodeCookie = jQuery.cookie("UserInfoZip").split("=")[1];
            var timeStamp = new Date(position.timestamp);

            var log = { dateTime: date + " & " + time, detectedZipCode: mobileZipCode, cookieZipCode: zipCodeCookie, positionTimestamp: timeStamp.toString() };
            var logArray = localStorage.getItem('ZipLog') != null ? JSON.parse(localStorage.getItem('ZipLog')) : new Array();
            logArray.push(log);

            if (typeof (Storage) !== "undefined") {
                // Put the object into storage
                localStorage.setItem('ZipLog', JSON.stringify(logArray));
                // Retrieve the object from storage 
                var retrievedObject = localStorage.getItem('ZipLog');
                //console.log('retrievedObject: ', JSON.parse(retrievedObject));
            }
            else {
            }

            // To test the hits to MapQuest after certain interval of time by URL
            if (location.search == "?showdebug=true") {
                if (typeof (Storage) !== "undefined") {
                    var object = JSON.parse(localStorage.getItem('ZipLog'));
                    if (object.length > 0) {
                        for (var i = 0; i < object.length; i++) {
                            document.write("<br>");
                            document.write("<b>" + i + " Attempt" + "</b><br>");
                            if (object[i].dateTime != null && object[i].detectedZipCode != null && object[i].cookieZipCode != null && object[i].positionTimestamp != null) {
                                document.write("Date & Time: " + object[i].dateTime + "<br>");
                                document.write("Detected ZipCode: " + object[i].detectedZipCode + "<br>");
                                document.write("Cookie ZipCode: " + object[i].cookieZipCode + "<br>");
                                document.write("Position TimeStamp: " + object[i].positionTimestamp + "<br>");
                            }
                        }
                    }
                }
                else {
                    alert("No local storage found.");
                }
            }

            var infoText = "<b>Detected Latitude & Longitude Values</b>" + "<br/>" +
                                       "Latitude: " + lat + "<br/>" +
                                       "Longitude: " + long + "<br/>" +
                                       "Accuracy: " + position.coords.accuracy + "m<br/>" +
                                       "Time: " + new Date(position.timestamp) + "<br/>" +
                                       "Zip Code using Map Quest API: <b>" + mobileZipCode + "</b><br/>" +
                                       "Country: " + country + "<br/>" +
                                       "State: " + state + "<br/>" +
                                       "County: " + county + "<br/>" +
                                       "City: " + city + "<br/>" +
                                       "Street: " + street + "<br/>";
            //jQuery("#infoMapQuest").html(infoText);
            // END_______________________________________________________________________________________________________________________________

            // Logical implementation

            // Check whether the user set the zip code explicitly or not 
            if (jQuery.cookie("UserSetZip") == null || (jQuery.cookie("UserSetZip") != null && jQuery.cookie("UserSetZip") != "Y" && jQuery.cookie("UserSetZip") != "W")) {
                // Check whether the zip code set to default or not
                if (jQuery.cookie("DefaultZipSet") == null || (jQuery.cookie("DefaultZipSet") != null && jQuery.cookie("DefaultZipSet") != "Y")) {

                    // Validate the zip code, if zip from cookie is different from detected zip using MapQuest API
                    var cookieZipcode = "";
                    if (jQuery.cookie("UserInfoZip") != null)
                        cookieZipcode = jQuery.cookie("UserInfoZip").split("=")[1];
                    if (cookieZipcode != mobileZipCode) {

                        // Ajax Call: To check the validity of zip code exist in US or not, the zip provided by MapQuest API
                        jQuery.ajax({
                            type: "GET",
                            url: "/UserControls/RoofingLocatorBox/RoofingZipCodeControl.aspx",
                            cache: false,
                            data: ({ zipCode: mobileZipCode }),
                            async: true,
                            success: function (data) {

                                // zip code is not valid & set it to default headquarter zip code and its geozone
                                if (data != "True") {
                                    jQuery.cookie("UserInfoZip", "ZipCode=43659", {
                                        path: '/'
                                    });
                                    jQuery.cookie("UserInfoGeoZone", "GeoZone=170", {
                                        path: '/'
                                    });

                                    // for Non US region, flag is set (default zip is set to Y) [session cookie]
                                    jQuery.cookie("DefaultZipSet", "Y", {
                                        path: '/'
                                    });
                                }
                                else {
                                    // for US region, flag is set (default zip is set to N) [session cookie]
                                    jQuery.cookie("DefaultZipSet", "N", {
                                        path: '/'
                                    });
                                }

                                // zip code is set either by valid detected zip code or default zip code
                                // so set cookie flag to N because the zip code is not set explicitly [session cookie]
                                jQuery.cookie("UserSetZip", "N", {
                                    path: '/'
                                });

                                // reload the page
                                location.reload();
                            }
                        });
                    }
                }
            }
        }
    });
}

// To check weather the device is mobile or not
function checkMobileDevices() {

    // Get the device agent 
    var deviceAgent = navigator.userAgent.toLowerCase();

    if (deviceAgent.match(/android/i))
        return true;
    else if (deviceAgent.match(/webso/i))
        return true;
    else if (deviceAgent.match(/iphone/i))
        return true;
    else if (deviceAgent.match(/ipod/i))
        return true;
    else if (deviceAgent.match(/blackberry/i))
        return true;
    else if (deviceAgent.match(/tablet/i))
        return true;
    else if (deviceAgent.match(/ipad/i))
        return true;
    else if (deviceAgent.match(/phone/i))
        return true;
    else if (deviceAgent.match(/zunewp7/i))
        return true;
    else if (deviceAgent.match(/xblwp7/i))
        return true;
    else if (deviceAgent.match(/phone/i))
        return true;
    else if (deviceAgent.match(/zunewp7/i))
        return true;
    else if (deviceAgent.match(/xblwp7/i))
        return true;
    else
        return false;
}

// To test the MapQuest API - Not a part of code
function testFunctionMapQuestAPI(lat, long) {

    // Ajax Call: To get the zip code from the lat & long
    jQuery.ajax({
        type: "GET",
        /* Map Quest API */
        url: "http://open.mapquestapi.com/geocoding/v1/reverse?key=Fmjtd%7Cluub2008nl%2C22%3Do5-9ursh0&location=" + lat + "," + long,
        cache: false,
        data: ({ latitude: lat, longitude: long }),
        async: true,
        success: function (data) {

            // Map Quest API result 
            var result = data.results[0].locations[0];

            // detected zip code by MapQuest
            var mobileZipCode = result.postalCode;

            // additional info provided by MapQuest
            var country = result.adminArea1;
            var state = result.adminArea3;
            var county = result.adminArea4;
            var city = result.adminArea5;
            var street = result.street;

            jQuery("#infoMobile").css("display", "none");

            var infoText = "<b>MapQuest API</b>" + "<br/>" +
                           "Latitude: " + lat + "<br/>" +
                           "Longitude: " + long + "<br/>" +
                           "ZipCode by MapQuest API: <b>" + mobileZipCode + "</b><br/>" +
                            "Country: " + country + "<br/>" +
                            "State: " + state + "<br/>" +
                            "County: " + county + "<br/>" +
                            "City: " + city + "<br/>" +
                            "Street: " + street + "<br/>";
            jQuery("#infoMapQuest").html(infoText);
        }
    });
}

// To test the Google API - Not a part of code
function testFunctionGoogleAPI(lat, long) {

    // Ajax Call: To get the zip code from the lat & long
    jQuery.ajax({
        type: "GET",
        /* Google API */
        url: "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&sensor=true",
        cache: false,
        data: ({ latitude: lat, longitude: long }),
        async: true,
        success: function (data) {

            // Google API result 
            var result = data.results[0];

            var mobileZipCode = "";
            var country = "";
            var state = "";
            var county = "";
            var city = "";
            var street = "";

            for (var i = 0; i < result.address_components.length; i++) {

                switch (result.address_components[i].types[0]) {
                    // detected zip code by Google 
                    case "postal_code":
                        mobileZipCode = result.address_components[i].short_name;

                        // additional info provided by Google
                    case "country":
                        country = result.address_components[i].short_name;
                        break;
                    case "administrative_area_level_1":
                        state = result.address_components[i].short_name;
                        break;
                    case "administrative_area_level_2":
                        county = result.address_components[i].short_name;
                        break;
                    case "locality":
                        city = result.address_components[i].short_name;
                        break;
                    case "route":
                        street = result.address_components[i].short_name;
                        break;
                }
            }

            jQuery("#infoMobile").css("display", "none");

            var infoText = "<b>Google API</b>" + "<br/>" +
                           "Latitude: " + lat + "<br/>" +
                           "Longitude: " + long + "<br/>" +
                           "ZipCode by Google API: <b>" + mobileZipCode + "</b><br/>" +
                        "Country: " + country + "<br/>" +
                        "State: " + state + "<br/>" +
                        "County: " + county + "<br/>" +
                        "City: " + city + "<br/>" +
                        "Street: " + street + "<br/>";
            jQuery("#infoGoogle").html(infoText);
        }
    });
}