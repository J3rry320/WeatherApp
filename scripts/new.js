"use strict"
const axios = require('axios');



//Describe Wind REquored in searchWEather and searchWEatherFOreCast
const DescribeWind = (speed, deg, target) => {

    let describeSpeed = "";
    let windangle = "";
    let iconConstructor = `wi wi-wind towards-${Math.round(deg)}-deg`
    let windSpeedIcon = ""
    //Speed Description
    if (speed < 0.3) describeSpeed = "calm";
    windSpeedIcon = "wi wi-windy"
    if (speed >= 0.3 && speed <= 1.5) {
        describeSpeed = "Light Air";
        windSpeedIcon = "wi wi-windy"
    }
    if (speed >= 1.6 && speed <= 3.3) {
        describeSpeed = "Light breeze";
        windSpeedIcon = "wi wi-windy"
    }
    if (speed >= 3.4 && speed < 5.5) {
        describeSpeed = "Gentle Breeze";
        windSpeedIcon = "wi wi-windy"
    }
    if (speed >= 5.5 && speed <= 7.9) {
        describeSpeed = "Moderate Breeze";
        windSpeedIcon = "wi wi-windy"
    }
    if (speed >= 8 && speed <= 10.7) {
        describeSpeed = "Fresh Breeze";
        windSpeedIcon = "wi wi-windy"
    }
    if (speed >= 10.8 && speed <= 13.8) {
        describeSpeed = "Strong Breeze";
        windSpeedIcon = "wi wi-strong-wind"
    }
    if (speed >= 13.9 && speed <= 17.1) {
        describeSpeed = "Moderate Gale";
        windSpeedIcon = "wi wi-strong-wind"
    }
    if (speed >= 17.2 && speed <= 20.7) {
        describeSpeed = "Gale";
        windSpeedIcon = "wi wi-strong-wind"
    }
    if (speed >= 20.8 && speed <= 24.4) {
        describeSpeed = "Strong Gale";
        windSpeedIcon = "wi wi-strong-wind"
    }

    if (speed >= 24.5 && speed <= 28.4) {
        describeSpeed = "Storm";
        windSpeedIcon = "wi wi-sandstorm"
    }
    if (speed >= 28.5 && speed <= 32.6) {
        describeSpeed = "Violent Storm";
        windSpeedIcon = "wi wi-sandstorm"
    }
    if (speed >= 32.7) {
        describeSpeed = "Hurricane";
        windSpeedIcon = "wi wi-sandstorm"
    }
    //Wind Description
    if (deg >= 348.75 || deg < 11.25) windangle = "North"
    if (deg >= 11.25 && deg < 33.75) windangle = "North-NorthEast"
    if (deg >= 33.75 && deg < 56.25) windangle = "North-East"
    if (deg >= 56.25 && deg < 78.75) windangle = "East-NorthEast"
    if (deg >= 78.75 && deg < 101.25) windangle = "East"
    if (deg >= 101.25 && deg < 123.75) windangle = "East-SouthEast"
    if (deg >= 123.75 && deg < 146.25) windangle = "South-East"
    if (deg >= 146.35 && deg < 168.75) windangle = "South-SouthEast"
    if (deg >= 168.75 && deg < 191.25) windangle = "South"
    if (deg >= 191.25 && deg < 213.75) windangle = "South-SouthWest"
    if (deg >= 213.75 && deg < 236.25) windangle = "South-West"
    if (deg >= 236.25 && deg < 258.75) windangle = "West-SouthWest"
    if (deg >= 258.75 && deg < 281.25) windangle = "West"
    if (deg >= 281.25 && deg < 303.75) windangle = "West-NorthWest"
    if (deg >= 303.75 && deg < 326.25) windangle = "North-West"
    if (deg >= 326.25 && deg < 348.75) windangle = "North-NorthWest"


    $(target[0]).text(speed + "m/s " + describeSpeed)
    $(target[1]).text(deg + "deg " + windangle)
    $(target[2]).addClass(iconConstructor)
    $(target[3]).addClass(windSpeedIcon)
    return [describeSpeed, windangle]
}
//Same as winddescription
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
    var WikiRequest = new Request(`https://en.wikipedia.org/w/api.php?action=query&exintro&explaintext&origin=*&titles=${cityName}&prop=extracts&format=json&exchars=200&exlimit=20`)
    fetch(WikiRequest).then(response => response.json())
        .then(json => {

            let propName = Object.keys(json.query.pages)

            let article = json.query.pages[propName].extract

            let regex = /[.]/i
            let lastIndex = article.match(regex).index;

            $("#article").text(article.substring(0, lastIndex))
            //handle json response
        })
        .catch(error => {
            console.warn(error)
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
//Width Change Add ResponsiveNess reuired in app
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
//Update Weather Icons required in weatherUpdates
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
//set ID for dynamically generated or appended divs searchWEatherForeCast
const setAttributeId = (selector, variable) => {
    $(selector).attr("id", function (i) {
        return variable + i
    })
}
const slickCreator = (container, options) => {
    $(container).slick(options)
}
const searchNews = (query, queryType, date) => {
    let url = ""
    if (queryType === "country") url = `https://newsapi.org/v2/top-headlines?country=${query}&apiKey=1192d8d426224ccba317c5f3a56980e3`;
    if (queryType === "source") url = `https://newsapi.org/v2/top-headlines?sources=${query}&apiKey=1192d8d426224ccba317c5f3a56980e3`
    if (queryType === "query") url = `https://newsapi.org/v2/everything?q=${query}&from=${date}&sortBy=popularity&apiKey=1192d8d426224ccba317c5f3a56980e3`







    var newsReq = new Request(url);
    fetch(newsReq)
        .then(response => response.json())
        .then(json => {
            console.log(json)
            json.articles.forEach((element, i) => {

                $("#NewsApi").append("<div class=media>" + "<center>" + "<img class=imageUrl>" + "</center>" + "<div class=media-body>" + "<h5 class=title>" + element.title + "</h5>" + "<p class=author>" + element.author + "</p>" + "<p class=time>" + element.publishedAt + "</p>" + "<p class=desc>" + element.description + "</p>" + "<p class=src>" + element.source.name + "</p>" + "<a class=url>" + "Read More" + "</a>" + "</div>" + "</div>")
                setAttributeId(".imageUrl", "Images")
                $(".media").addClass("bg-light  text-dark border-bottom")
                $(".imageUrl").addClass("align-self-start   news-images")
                $(`#Images${i}`).attr("src", element.urlToImage)


            })
            slickCreator("#NewsApi", {

                autoplay: true,
                autoplaySpeed: 2500,
                speed: 250,
                infinite: true,
                slidesToShow: 2,
                slidesToScroll: 2,

                responsive: [

                    {
                        breakpoint: 600,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    }

                ],


                focusOnSelect: true,
                mobileFirst: true,
                swipeToSlide: true

            })

        }).catch(error => {
            console.warn(error)
        })
}
//SearchWeather For The Day
const SearchWeather = (cityName) => {
    $.getJSON(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&APPID=725c271cefbc3221ab205ee4ecaaefaa`, (result) => {
        let country = result.sys.country.toLowerCase()
        $("#flagIcon ").addClass(`flag-icon flag-icon-${country}`);
        searchNews(country, "country")
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

        $("#CloudyPercent").text(result.clouds.all + "%")
        $("#CloudDesc").text(CloudChecker(dateString.substring(16, 18), result.clouds.all))

        DescribeWind(result.wind.speed, result.wind.deg, ["#WindValue", "#WindDesc", "#windDegIcon", "#windSpeedIcon"])




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

        $("#minTemp,#NewsApi,#maxTemp,#listOfWeather,#temp,#pressure,#humidity,#Description,#sunriseTime,#sunsetTime").empty()

        $("#iconForCurrent,#flagIcon,#NewsApi ").removeClass()

        //  searchImage($("#cityValue").val());
        SearchWeather($("#cityValue").val());
        searchWiki($("#cityValue").val())
        // SearchWeatherForecast($("#cityValue").val())

    })

})