const axios = require('axios');
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
const SearchWeather = (cityName) => {
    $.getJSON(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&APPID=725c271cefbc3221ab205ee4ecaaefaa`, (result) => {



        let sunrise = new Date(result.sys.sunrise * 1000).toString();
        let sunset = new Date(result.sys.sunset * 1000).toString();
        let visibility = result.visibility;
        let sunriseTime = sunrise.substring(15, 24)
        let sunsetTime = sunset.substring(15, 24)
        $('#sunriseTime').text(sunriseTime + " IST")
        $('#sunsetTime').text(sunsetTime + " IST")
        /*
                let sunriseTime=new Date(sunrise*1000)
                let sunsetTime=new Date(sunset*1000) Convert To GMT by toUTCSTRING */
        let regex = /[ ]/g
        $("#Visibility").text(visibility / 1000 + " km")
    })
}
const SearchWeatherForecast = (cityName) => {
    let dayTime = 18.00;
    let nightTime = 18.01;


    $.getJSON(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&APPID=725c271cefbc3221ab205ee4ecaaefaa`, (result) => {
        console.log(result)
        let currentWeather = result.list[0];
        let time = currentWeather.dt_txt.replace(/[- :]/g, " ").charAt(11) + currentWeather.dt_txt.replace(/[- :]/g, " ").charAt(12);

        let iconPrefix = (time > 05 && time < 18) ? "day" : "night";
        let iconCode = null
        currentWeather.weather.forEach(element => {
            iconCode = element.id
        })

        $("#iconForCurrent").addClass(`wi wi-owm-${iconPrefix}-${iconCode}`)
        $("#flagIcon ").addClass(`flag-icon flag-icon-${result.city.country}`.toLowerCase());
        $("#cityName").text(result.city.name);
        console.log($("#cityName").text())



        let unitsForNow = currentWeather.main;
        $("#minTemp").text(unitsForNow.temp_min);
        $("#maxTemp").text(unitsForNow.temp_max);
        $("#temp").text(unitsForNow.temp);
        $("#pressure").text(unitsForNow.grnd_level + " hPa");
        $("#humidity").text(unitsForNow.humidity + " %");

        result.list.forEach((element, i) => {

            /*    $("#listOfWeather").append("<li>" + "<span class=left-span>" + `<i class=wl wl-owm` + "" + "</span>" + "<span class=left-span>" + "<h5 class=temp-row-header>" +
                    element.main.temp + "</h5>" + "</span>" +
                    "<span class=left-span>" + element.main.temp_min + element.main.temp_max + "</span>" + "</li>")*/
        })
    })
}
module.exports = $(document).ready(() => {


    searchImage("London");
    SearchWeatherForecast("London");
    SearchWeather("London")
    searchWiki("London");


    $("#searchButton").bind("click", () => {

        $("#iconForCurrent").removeClass()
        $("#flagIcon ").removeClass();
        searchImage($("#cityValue").val());
        SearchWeather($("#cityValue").val());
        searchWiki($("#cityValue").val())
        SearchWeatherForecast($("#cityValue").val())

    })



})

document.querySelector("#cityValue").setAttribute("type", "text");