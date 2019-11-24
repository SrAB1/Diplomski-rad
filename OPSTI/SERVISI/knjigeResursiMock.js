(function () {
    "use strict";

    var app = angular
                .module("knjigeResursiMock",
                        ["ngMockE2E"]);

    app.run(function ($httpBackend) {
        var knjigeNem = [

            {
                "knjigaId": 1,
                "knjigaIme": "Schritte 1",
                "knjigaKod": "GDN-0021",
                "datumIzdavanja": "Maj 12, 2011",
                "opis": "Schritte 1, knjiga za ucenike. Pocetni nivo. ",
                "cena": 24.45,
                "kategorija": "Nemacki jezik",
                "tagovi": ["A1", "pocetni nivo"],
                "knjigaUrl":"http://localhost/Diplomski-rad/IMAGES/knjigeNem/Schritte1.jpg",
                "utisci": [{
                    "stars": 5,
                    "body": "Odlicna knjiga!!",
                    "author": "stanko@gmail.com",
                    "createdOn": 1397490980837
                  }, {
                    "stars": 4,
                    "body": "Knjiga za svaku preporuku!",
                    "author": "marko@tnet.com",
                    "createdOn": 1397490980837
                  }]
                
            },
            {
        
                "knjigaId": 2,
                "knjigaIme": "Schritte 2",
                "knjigaKod": "GDN-0022",
                "datumIzdavanja": "Mart 19, 2012",
                "opis": "Schritte 2, knjiga za ucenike. Pocetni nivo.",
                "cena": 56.98,
                "kategorija": "Nemacki jezik",
                "tagovi": ["A1", "A2"],
                "knjigaUrl": "http://localhost/Diplomski-rad/IMAGES/knjigeNem/Schritte2.jpg",
                "utisci": [{
                    "stars": 2,
                    "body": "Knjiga je solidna ali ne i dobra..",
                    "author": "joe@msn.com",
                    "createdOn": 1397490980837
                  }, {
                    "stars": 5,
                    "body": "Obozavam ovu knjigu!",
                    "author": "ivan@gmail.com",
                    "createdOn": 1397490980837
                  }]
            
        },
        {
            "knjigaId": 3,
            "knjigaIme": "Schritte 3",
            "knjigaKod": "GDN-0023",
            "datumIzdavanja": "Januar 24, 2014",
            "opis": "Schritte 2, knjiga za ucenike. Srednji nivo.",
            "cena": 87.96,
            "kategorija": "Nemacki jezik",
            "tagovi": ["A2", "srednji nivo"],
            "knjigaUrl": "http://localhost/Diplomski-rad/IMAGES/knjigeNem/Schritte3.jpg",
            "utisci": [{
                "stars": 3,
                "body": "Dobra knjiga!",
                "author": "janko@hotmail.com",
                "createdOn": 1397490980837
              }, {
                "stars": 5,
                "body": "I love this book!",
                "author": "joe@thomas.com",
                "createdOn": 1397490980837
              }]
        },
        {
            "knjigaId": 4,
            "knjigaIme": "Schritte International 4",
            "knjigaKod": "GDN-0024",
            "datumIzdavanja": "Avgust 19, 2015",
            "opis": "Schritte International 4, srednji nivo",
            "cena": 192.95,
            "kategorija": "Nemacki jezik",
            "tagovi": ["A2", "B1"],
            "knjigaUrl": "http://localhost/Diplomski-rad/IMAGES/knjigeNem/SchritteInternational4.jpg",
            "utisci": [{
                "stars": 5,
                "body": "Knjiga za svaku preporuku!",
                "author": "milica@thomas.com",
                "createdOn": 1397490980837
              }, {
                "stars": 5,
                "body": "Vrhunska knjiga!",
                "author": "jovana@gmail.com",
                "createdOn": 1397490980837
              }]
        },
        {
            "knjigaId": 5,
            "knjigaIme": "Schritte Plus 2",
            "knjigaKod": "GDN-0025",
            "datumIzdavanja": "Jun 19, 2019",
            "opis": "Schritte Plus 2, Srednje-napredni nivo.",
            "cena": 78.95,
            "kategorija": "Nemacki jezik",
            "tagovi": ["B2", "C1"],
            "knjigaUrl": "http://localhost/Diplomski-rad/IMAGES/knjigeNem/SchrittePlus2.jpg",
            "utisci": [{
                "stars": 2,
                "body": "Jedva prolazna ocijena za ovu knjigu!",
                "author": "marija@gmail.com",
                "createdOn": 1397490980837
              }, {
                "stars": 1,
                "body": "Vrlo losa iskustva u vezi sa ovom knjigom.",
                "author": "tatjana@msn.com",
                "createdOn": 1397490980837
              }]

            }
        ];

                 var knjigeUrl = "/api/knjigeNem"
        
                $httpBackend.whenGET(knjigeUrl).respond(knjigeNem);


                $httpBackend.when('GET', '/api/knjigeEng').respond(getData());

                    function getData() {

                var request = new XMLHttpRequest();
                request.open('GET', 'http://localhost/Diplomski-rad/knjige.json', true);
                request.send(null);
                request.async = true;

                return [request.status, request.response, {}];

}

var editingRegex = new RegExp(knjigeUrl + "/[0-9][0-9]*", '');
$httpBackend.whenGET(editingRegex).respond(function (method, url, data) {
    var knjiga = {"knjigaId": 0};
    var parameters = url.split('/');
    var length = parameters.length;
    var id = parameters[length - 1];

    if (id > 0) {
        for (var i = 0; i < knjigeNem.length; i++) {
            if (knjigeNem[i].knjigaId == id) {
                knjiga = knjigeNem[i];
                break;
            }
        };
    }
    return [200, knjiga, {}];
});

$httpBackend.whenPOST(knjigeUrl).respond(function (method, url, data) {
    var knjiga = angular.fromJson(data);

    if (!knjiga.knjigaId) {
        // new knjiga Id
        knjiga.knjigaId = knjigeNem[knjigeNem.length - 1].knjigaId + 1;
        knjigeNem.push(knjiga);
    }
    else {
        // Updated knjiga
        for (var i = 0; i < knjigeNem.length; i++) {
            if (knjigeNem[i].knjigaId == knjiga.knjigaId) {
                knjigeNem[i] = knjiga;
                break;
            }
        };
    }
    return [200, knjiga, {}];
});
//post metoda za kurseve kad se komunicira sa bazom
$httpBackend.whenPOST('/APP/addremove.php').respond(function(method, url, data, headers){
    console.log(data);
    return [200, data, {}];
});



                // Pass through any requests for application files and knjige.json file in main folder
                $httpBackend.whenGET(/APP/).passThrough();
                $httpBackend.whenGET(/knjige.json/).passThrough();
                $httpBackend.whenPOST(/APP/).passThrough();//za post sa bazom           
                
  

              

                


})
}());
