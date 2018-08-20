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
const updateIcon = (time, iconCode, target,ifDateText) => {
    let timeNow = time.replace(/[- :]/g, " ").charAt(16) + time.replace(/[- :]/g, " ").charAt(17);

    let iconPrefix = (timeNow > 05 && timeNow < 18) ? "day" : "night";
    $(target).addClass(`wi wi-owm-${iconPrefix}-${iconCode}`)

}
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
        $("#population").text(result.city.population + " people live here")
        console.log($("#cityName").text())



        let unitsForNow = currentWeather.main;
        $("#minTemp").text(unitsForNow.temp_min);
        $("#maxTemp").text(unitsForNow.temp_max);
        $("#temp").text(unitsForNow.temp);
        $("#pressure").text(unitsForNow.grnd_level + " hPa");
        $("#humidity").text(unitsForNow.humidity + " %");

        let showList = []
        for (let i = 2; i < result.list.length; i = i + 8) {
            showList.push(result.list[i])
        }

        showList.forEach(element => {


            let temp = element.main.temp;
            let dateText = new Date(element.dt * 1000).toString()

            let time = dateText.substring(16, 25) + "IST"

            let nameOfWeekDay = addSuffixToDay(dateText.substring(0, 3))
            let iconCode = null
            element.weather.forEach(id => {
                iconCode = id.id
            })
            console.log(iconCode)
            let icon = updateIcon(dateText, iconCode, ".weather_in_cards")

            $("#listOfWeather").append("<li class=pl-4>" + "<div class=card_in_li >" + "<div class=card-body>" + "<h5 class=card-title>" + nameOfWeekDay + "</h5>" + "<h6 class=card-subtitle_in_li >" + `<i class=weather_in_cards>` + "</i>" + "</h6>" + "<h6 class=card-text>" + "<span class=left-span>" + "<h6>" + time + "</h6>" + "<h6>" + temp + "</h6>" + "</span>" + "</h6>" + "<a class=btn_in_cards >" + "Learn More" + "</a>" + "</div>" + "</div>" + "</li>")
            $(".card_in_li").addClass("card bg-transparent border-left border-right")
            $(".card-subtitle_in_li").addClass("card-subtitle mb-2")

            $(".btn_in_cards").addClass("btn btn-sm btn-dark")

        })
    })
}
module.exports = $(document).ready(() => {
    $(window).resize(() => {
        changeListStyle(document.body.clientWidth);

    })
    changeListStyle(document.body.clientWidth);

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