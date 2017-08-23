$(function() {

    const apiKeyOWM = "8abbc4193edda9b567addb61e242a0f1";
    const apiKeyFlickr = "59a43f6e832553a1898424001116924f";

    getOWMData();

    ////////////////////////////////////////////////////////////

    //Con esta funcion obtenemos los datos tanto de OpenWeatherMap como de Flickr
    function getOWMData(city) {

        var selectedCity = city || "Sevilla"; // La ciudad por defecto que aparece al cargar la pagina es Sevilla
        var dataW;

        $.ajax({
                method: "GET",
                url: "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + selectedCity + "&units=metric&cnt=5&appid=" + apiKeyOWM
            })
            .done(function(data) {
                dataW = data;
            })
            .fail(function() {
                alert("No se ha encontrado esa ciudad en OpenWeatherMap"); // caso en que falla la captura de datos
            });

        $.ajax({
                method: "GET",
                url: "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + apiKeyFlickr + "&text=" + selectedCity +
                    "&sort=relevance&per_page=5&safe_search=3&format=json&nojsoncallback=1"
            })
            .done(function(dataF) {
                $(".loader").slideUp().fadeOut();
                createCC(dataW, dataF);
            });

    }

    //Creamos las tarjetas que muestran todos los datos solicitados
    function createCC(data, dataF) {

        $(".main-header").html("Tiempo en <span>" + data.city.name + "</span> en los proximos 5 dias");

        $(".city-name").html(data.city.name);
        setPhotos(dataF.photos.photo);
        setDates(data.list);
        setTemps(data.list);
        setIcons(data.list);

        $(".cards").animate({ opacity: 1 }, { queue: false, duration: 'slow' });
    }

    //Introducimos las imagenes obtenidas de Flickr en las tarjetas <-> En caso de no existir aparece [notFound.jpg]
    function setPhotos(dataF) {

        var photo1src, photo2src, photo3src, photo4src, photo5src;

        if (dataF[0] == undefined) {
            photo1src = "img/notFound.jpg";
        } else {
            photo1src = "https://farm" + dataF[0].farm + ".staticflickr.com/" +
                dataF[0].server + "/" + dataF[0].id + "_" + dataF[0].secret + ".jpg";
        }

        if (dataF[1] == undefined) {
            photo2src = "img/notFound.jpg";
        } else {
            photo2src = "https://farm" + dataF[1].farm + ".staticflickr.com/" +
                dataF[1].server + "/" + dataF[1].id + "_" + dataF[1].secret + ".jpg";
        }

        if (dataF[2] == undefined) {
            photo3src = "img/notFound.jpg";
        } else {
            photo3src = "https://farm" + dataF[2].farm + ".staticflickr.com/" +
                dataF[2].server + "/" + dataF[2].id + "_" + dataF[2].secret + ".jpg";
        }

        if (dataF[3] == undefined) {
            photo4src = "img/notFound.jpg";
        } else {
            photo4src = "https://farm" + dataF[3].farm + ".staticflickr.com/" +
                dataF[3].server + "/" + dataF[3].id + "_" + dataF[3].secret + ".jpg";
        }

        if (dataF[4] == undefined) {
            photo5src = "img/notFound.jpg";
        } else {
            photo5src = "https://farm" + dataF[4].farm + ".staticflickr.com/" +
                dataF[4].server + "/" + dataF[4].id + "_" + dataF[4].secret + ".jpg";
        }

        $(".city1 .card-img-top").attr("src", photo1src);
        $(".city2 .card-img-top").attr("src", photo2src);
        $(".city3 .card-img-top").attr("src", photo3src);
        $(".city4 .card-img-top").attr("src", photo4src);
        $(".city5 .card-img-top").attr("src", photo5src);
    }

    //Introducimos las fechas en las tarjetas, conviertiendo los timeStamps en fechas ISO con la funcion [convertToDate]
    function setDates(data) {

        $(".city1 .card-date").html(convertToDate(data[0].dt));
        $(".city2 .card-date").html(convertToDate(data[1].dt));
        $(".city3 .card-date").html(convertToDate(data[2].dt));
        $(".city4 .card-date").html(convertToDate(data[3].dt));
        $(".city5 .card-date").html(convertToDate(data[4].dt));
    }

    //Introducimos las temperaturas en las tarjetas, redondeandolas con [Math.round]
    function setTemps(data) {

        $(".city1 .temp").html(Math.round(data[0].temp.day) + "° C");
        $(".city2 .temp").html(Math.round(data[1].temp.day) + "° C");
        $(".city3 .temp").html(Math.round(data[2].temp.day) + "° C");
        $(".city4 .temp").html(Math.round(data[3].temp.day) + "° C");
        $(".city5 .temp").html(Math.round(data[4].temp.day) + "° C");
    }

    //Introducimos los iconos en las tarjetas
    function setIcons(data) {

        $(".city1 .icon").html("<img src='http://openweathermap.org/img/w/" + data[0].weather[0].icon + ".png'>");
        $(".city2 .icon").html("<img src='http://openweathermap.org/img/w/" + data[1].weather[0].icon + ".png'>");
        $(".city3 .icon").html("<img src='http://openweathermap.org/img/w/" + data[2].weather[0].icon + ".png'>");
        $(".city4 .icon").html("<img src='http://openweathermap.org/img/w/" + data[3].weather[0].icon + ".png'>");
        $(".city5 .icon").html("<img src='http://openweathermap.org/img/w/" + data[4].weather[0].icon + ".png'>");
    }

    //Funcion para cambiar la ciudad de la que obtenemos los datos mediante la busqueda de la parte superior izquierda
    $("#changeCity").submit(function(event) {
        var userCity = $('#userCity').val();
        $('#userCity').val("");
        $(".cards").animate({ opacity: 0 }, { queue: false, duration: 'slow' });
        getOWMData(userCity);
    });

    function convertToDate(date) {
        var conv = new Date(date * 1000);

        var day = conv.getDate();
        var month = conv.getMonth() + 1;
        var year = conv.getFullYear();
        return day + "/" + month + "/" + year;
    }

});