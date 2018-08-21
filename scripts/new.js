"use strict"
const axios = require('axios');
const DescribeWind = (speed, deg, target) => {
    let describeSpeed = "";
    let windangle = "";
    if (speed < 0.3) describeSpeed = "calm"
    if (speed >= 0.3 && speed <= 1.5) describeSpeed = "Light Air"
    if (speed >= 1.6 && speed <= 3.3) describeSpeed = "Light breeze"
    if (speed >= 3.4 && speed < 5.5) describeSpeed = "Gentle Breeze"
    if (speed >= 5.5 && speed <= 7.9) describeSpeed = "Moderate Breeze"
    if (speed >= 8 && speed <= 10.7) describeSpeed = "Fresh Breeze"
    if (speed >= 10.8 && speed <= 13.8) describeSpeed = "Strong Breeze"
    if (speed >= 13.9 && speed <= 17.1) describeSpeed = "Moderate Gale"
    if (speed >= 17.2 && speed <= 20.7) describeSpeed = "Gale"
    if (speed >= 20.8 && speed <= 24.4) describeSpeed = "Strong Gale"
    if (speed >= 24.5 && speed <= 28.4) describeSpeed = "Storm"
    if (speed >= 28.5 && speed <= 32.6) describeSpeed = "Violent Storm"
    if (speed >= 32.7) describeSpeed = "Hurricane"
    return describeSpeed
}
const CloudChecker = (time, percent) => {


    let checker = (time > 5 && time < 18) ? "day" : "night";


    let ValueToBeReturnedWhileChecking = null
    if (checker === "day") ValueToBeReturnedWhileChecking = true
    else if (checker === "night") ValueToBeReturnedWhileChecking = false

    if (percent >= 0 && percent <= 100) {
        if (percent >= 0 && percent <= 10) return ValueToBeReturnedWhileChecking ? "Sunny" : "Clear"
        if (percent > 10 && percent <= 20) return ValueToBeReturnedWhileChecking ? "Partly Sunny" : "Fair"
        if (percent > 20 && percent <= 30) return ValueToBeReturnedWhileChecking ? "Mostly Sunny" : "Mostly Fair"
        if (percent > 30 && percent <= 50) return "Partly Cloudy"
        if (percent > 50 && percent < 75) return "Mostly Cloudy"
        if (percent >= 75 && percent <= 100) return "Cloudy"

    } else throw new Error("Invalid Value Passed")
}

//Farhenit Converter
const converter = (id, value) => {
    switch (id) {
        case "toCelsius":
            value = ((value - 32) * 5 / 9).toFixed(2)
            break

        case "toFahrenheit":
            value = ((value * 9 / 5) + 32).toFixed(2)
            break


    }
    return value
}
//Wikipedia Search
const searchWiki = (cityName) => {
    axios.get("https://en.wikipedia.org/w/api.php?action=query&exintro&explaintext&origin=*", {

        params: {

            titles: cityName,
            exchars: 200,
            exlimit: 200,
            prop: "extracts",
            format: "json"

        }
    }).then(result => {

        let propName = Object.keys(result.data.query.pages)

        let article = result.data.query.pages[propName].extract
        console.log(article)
        let regex = /[.]/i
        let lastIndex = article.match(regex).index;

        $("#article").text(article.substring(0, lastIndex))

    }).catch(error => {
        console.log(error)
    })
}
//Population
const definePopulation = (population) => {
    let newPopulation = population / 1000

    $("#population").text(newPopulation + "k people live here")
}
//Google Search Image
const searchImage = function (cityName) {
    axios.get("https://www.googleapis.com/customsearch/v1?", {
        params: {
            q: `${cityName} skyline during night`.replace(/\s/g, '+'),
            searchType: 'image',
            cx: "011398632660458645263:qplvgzzfvko",
            key: "AIzaSyDICqZ-UdNtD4n5LKjdgYwwfWJi0mFVQG0"
        }
    }).then((result) => {

        let items = result.data.items;

        items.length -= 9;

        items.forEach(element => {
            $(".bg-city").css("background-image", `url(${element.link})`)
        })

    }).catch((error) => {
        console.log(error)
    })


}
//Width Change Add ResponsiveNess
const changeListStyle = (width) => {
    if (width < 768) {
        $("#toolbar").removeClass("toolbar")
        $("#toolbar").first().addClass("list-group")
        $("#listOfWeather").children().addClass("list-group-item")
    } else {
        $("#toolbar").addClass("toolbar")
        $("#toolbar").first().removeClass("list-group")
        $("#listOfWeather").children().removeClass("list-group-item")
    }
}
//Update Weather Icons
const updateIcon = (time, iconCode, target, ifDateText) => {
    let numberToSearchFor = ifDateText ? 11 : 16;

    let timeNow = time.replace(/[- :]/g, " ").charAt(numberToSearchFor) + time.replace(/[- :]/g, " ").charAt(numberToSearchFor + 1);
    timeNow = parseInt(timeNow)
    let iconPrefix = (timeNow > 5 && timeNow < 18) ? "day" : "night";

    $(target).addClass(`wi wi-owm-${iconPrefix}-${iconCode}`)


}
//Add Suffix To the Returned day
const addSuffixToDay = (dateText) => {
    switch (dateText) {
        case "Mon":
        case "Fri":
        case "Sun":
            dateText = dateText + "day"
            break
        case "Tue":
            dateText = dateText + "sday"
            break
        case "Wed":
            dateText = dateText + "nesday"
            break
        case "Thu":
            dateText = dateText + "rsday"
            break
        case "Sat":
            dateText = dateText + "urday"
            break
    }
    return dateText

}
//set ID for dynamically generated or appended divs
const setAttributeId = (selector, variable) => {
    $(selector).attr("id", function (i) {
        return variable + i
    })
}
//SearchWeather For The Day
const SearchWeather = (cityName) => {
    $.getJSON(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&APPID=725c271cefbc3221ab205ee4ecaaefaa`, (result) => {

        $("#flagIcon ").addClass(`flag-icon flag-icon-${result.sys.country}`.toLowerCase());
        $("#cityName").text(result.name);

        let unitsForNow = result.main;
        $("#minTemp").text(unitsForNow.temp_min);
        $("#maxTemp").text(unitsForNow.temp_max);
        $("#temp").text(unitsForNow.temp);
        $("#pressure").text(unitsForNow.pressure + " hPa");
        $("#humidity").text(unitsForNow.humidity + " %");
        let dateString = new Date(result.dt * 1000).toString()
        console.log(dateString)
        result.weather.forEach(element => {

            updateIcon(dateString, element.id, "#iconForCurrent", false)
            $("#Description").text(element.description.toUpperCase());
            let mainMessage = element.message;
        })

        $("#CloudyPercent").text(result.clouds.all + " %")
        $("#CloudDesc").text(CloudChecker(dateString.substring(16, 18), result.clouds.all))

console.log(DescribeWind(result.wind.speed))




        let sunrise = new Date(result.sys.sunrise * 1000).toString();
        let sunset = new Date(result.sys.sunset * 1000).toString();
        let visibility = result.visibility;
        let sunriseTime = sunrise.substring(15, 24)
        let sunsetTime = sunset.substring(15, 24)
        $('#sunriseTime').text(sunriseTime + " IST")
        $('#sunsetTime').text(sunsetTime + " IST")
        console.log(result)
        /*
                let sunriseTime=new Date(sunrise*1000)
                let sunsetTime=new Date(sunset*1000) Convert To GMT by toUTCSTRING */

        $("#Visibility").text(visibility / 1000 + " km");

    })
}
//Search Weather Forecast Hourly


const SearchWeatherForecast = (cityName) => {



    $.getJSON(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&APPID=725c271cefbc3221ab205ee4ecaaefaa`, (result) => {

        let currentWeather = result.list[0];



        let mainMessage = null;

        currentWeather.weather.forEach(element => {

            updateIcon(currentWeather.dt_txt, element.id, "#iconForCurrent", true)
            $("#Description").text(element.description.toUpperCase());
            mainMessage = element.message;
        })

        let currentDate = new Date(currentWeather.dt * 1000)
        console.log(currentDate)

        $("#flagIcon ").addClass(`flag-icon flag-icon-${result.city.country}`.toLowerCase());
        $("#cityName").text(result.city.name);
        definePopulation(result.city.population)
        let unitsForNow = currentWeather.main;
        $("#minTemp").text(unitsForNow.temp_min);
        $("#maxTemp").text(unitsForNow.temp_max);
        $("#temp").text(unitsForNow.temp);
        $("#pressure").text(unitsForNow.grnd_level + " hPa");
        $("#humidity").text(unitsForNow.humidity + " %");

        let showList = []
        for (let i = 2; i < result.list.length; i = i + 7) {
            showList.push(result.list[i])
        }

        showList.forEach((element, i) => {
            $(` #icon${i}`).removeClass()

            let temp = element.main.temp;
            let dateText = new Date(element.dt * 1000).toString()

            let time = dateText.substring(16, 25) + "IST"

            let nameOfWeekDay = addSuffixToDay(dateText.substring(0, 3))
            let iconCode = null
            element.weather.forEach(id => {
                iconCode = id.id
            })

            $("#listOfWeather").append("<li>" + "<div class=card_in_li >" + "<div class=card-body>" + "<h5 class=card-title>" + nameOfWeekDay + "</h5>" + "<h6 class=card-subtitle_in_li >" + `<i class=weather_in_cards>` + "</i>" + "</h6>" + "<h6 class=card-text>" + "<span class=left-span>" + "<h6>" + time + "</h6>" + "<br>" + "<h6 class=left-span>" + temp + "</h6>" + "<i class=cel>" + "</i>" + "</span>" + "</h6>" + "<a class=btn_in_cards >" + "Learn More" + "</a>" + "</div>" + "</div>" + "</li>")
            $(".card_in_li").addClass("card bg-transparent border-left border-right")
            $(".card-subtitle_in_li").addClass("card-subtitle mb-2")
            $(".cel").addClass(" pl-1  wi wi-celsius")
            $(".btn_in_cards").addClass("btn btn-sm btn-dark")
            setAttributeId('#listOfWeather li .weather_in_cards', "icon")

            updateIcon(dateText, iconCode, `#icon${i}`, false)
            setAttributeId("#listOfWeather li .btn_in_cards", "button")



        })
        let modalChecker = false;
        let modalPermannentTemp = null;
        $(".btn_in_cards").click((e) => {
            $("#iconForCurrentModal").removeClass()
            let currentList = showList[e.target.id.charAt(e.target.id.length - 1)]
            console.log(currentList)
            let dateText = new Date(currentList.dt * 1000).toString()
            console.log(dateText)
            let icon = null
            currentList.weather.forEach(element => {
                icon = element.id
                $("#DescriptionInModal").text(element.description.toUpperCase());
            })
            updateIcon(dateText, icon, "#iconForCurrentModal", false)

            $("#minTempInModal").text(currentList.main.temp_min);
            $("#maxTempInModal").text(currentList.main.temp_max);
            $("#tempInModal").text(currentList.main.temp);
            $("#pressureInModal").text(currentList.main.grnd_level + " hPa");
            $("#humidityInModal").text(currentList.main.humidity + " %");

            $(".modal-title").text(`Weather For ${addSuffixToDay(dateText.substring(0,3))}`)
            $('#weatherModal').modal('toggle');
            modalChecker = $('#weatherModal').hasClass('show')
            modalPermannentTemp = $("#tempInModal").text();
        })

        let permannentTemp = $("#temp").text();


        $(".toFahrenheit").bind("click", (e) => {


            let varToPass = modalChecker ? modalPermannentTemp : permannentTemp;
            let selector = modalChecker ? "#tempInModal" : "#temp";
            e.preventDefault();


            $(selector).text(converter("toFahrenheit", varToPass));
        })
        $(".toCelsius").bind("click", (e) => {


            let varToPass = modalChecker ? modalPermannentTemp : permannentTemp;
            let selector = modalChecker ? "#tempInModal" : "#temp";

            e.preventDefault();

            $(selector).text(varToPass)
        })
    })
}

module.exports = $(document).ready(() => {

    $(window).resize(() => {
        changeListStyle(document.body.clientWidth);

    })
    changeListStyle(document.body.clientWidth);

    // searchImage("London");
    //SearchWeatherForecast("London");
    SearchWeather("London")
    searchWiki("London");

    $("#searchButton").bind("click", () => {
        $("#minTemp,#maxTemp,#temp,#pressure,#humidity,#Description,#sunriseTime,#sunsetTime").empty()
        $("#listOfWeather").empty()
        $("#iconForCurrent").removeClass()
        $("#flagIcon ").removeClass();
        //  searchImage($("#cityValue").val());
        SearchWeather($("#cityValue").val());
        searchWiki($("#cityValue").val())
        // SearchWeatherForecast($("#cityValue").val())

    })

})