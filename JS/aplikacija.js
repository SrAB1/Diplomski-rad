(function () {

    "use strict";

    var app = angular.module("cambridgeCentarBileca",
        ["opsti.servisi", "ui.router", "knjigeResursiMock", "ngMessages", "ui.mask", "ui.bootstrap", "ngMap"]);


    app.config(["$stateProvider",
        "$urlRouterProvider",
        function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/home");

            $stateProvider
                .state("home", {
                    url: "/home",
                    templateUrl: "APP/welcomeView.html"
                })

                .state("knjigeEng", {
                    url: "/knjigeEng",
                    templateUrl: "APP/knjigeEng/knjigeLista.html",
                    controller: "knjigeListaCtrl"
                })
                .state("knjigeNem", {
                    url: "/knjigeNem",
                    templateUrl: "APP/knjigeNem/knjigeListaNem.html",
                    controller: "knjigeListaNemCtrl as vm"
                })
                .state("kontakt", {
                    url: "/kontakt",
                    templateUrl: "APP/KontaktStrana.html",
                    controller: "kontaktCtrl"
                })


                .state("kursevi", {
                    url: "/kursevi",
                    templateUrl: "APP/AktuelniKursevi.html",
                    controller: "kurseviCtrl"
                })

                .state("knjigeNemEdit", {
                    abstract: true,
                    url: "/knjigeNem/:knjigaId",
                    templateUrl: "APP/knjigeNem/knjigaEditView.html",
                    controller: "knjigaEditCtrl as vm",
                    resolve: {
                        knjigeResursi: "knjigeResursi",

                        knjiga: function (knjigeResursi, $stateParams) {
                            var knjigaId = $stateParams.knjigaId;
                            return knjigeResursi.get({
                                knjigaId: knjigaId
                            }).$promise;
                        }
                    }
                })
                .state("knjigeNemEdit.info", {
                    url: "/info",
                    templateUrl: "APP/knjigeNem/knjigaEditInfoView.html"
                })

                .state("knjigaDetalji", {
                    url: "/knjigeNem/:knjigaId",
                    templateUrl: "APP/knjigeNem/knjigaDetaljiView.html",
                    controller: "knjigaDetaljiCtrl as vm",
                    resolve: {
                        knjigeResursi: "knjigeResursi",

                        knjiga: function (knjigeResursi, $stateParams) {
                            var knjigaId = $stateParams.knjigaId;
                            return knjigeResursi.get({
                                knjigaId: knjigaId
                            }).$promise;
                        }
                    }
                })

        }
    ]);
    //eng knjige kontroler
    app.controller("knjigeListaCtrl",
        ["$scope", "$http", function ($scope, $http) {

           
            $http.get("knjige.json").then(function (response) {
                $scope.knjige = response.data;
            });

            $scope.priceInfo = {
                min: 0,
                max: 1000000
            }

//dugme i funcija za dodavanje knjiga za eng
            $scope.knjiga = {};  

            $scope.dodajKnjigu = function(knjiga){
                

                
                if(knjiga && $scope.formadodaj.$valid ){
                knjiga.knjigaUrl="/Diplomski-rad/IMAGES/KNJIGE/default-book.png"
                $scope.knjige.push(knjiga);
           toastr.success("Uspesno ste dodali knjigu!");
           $scope.knjiga = {};
           $scope.addListing= false;
            }
            else{
                if(knjiga && $scope.formadodaj.$invalid){
                    toastr.warning("Niste dobro popunili formu! Molimo Vas probajte opet.")};
            }
            
                
            
        }

        $scope.Close = function(){
            $scope.showDetails = false;
            $scope.editListing = false;
            $scope.postojecaKnjiga = {};

        }

            $scope.editKnjiga = function(knjiga){
             //jquery fokusiranje na gore novootvorenu formu ya edit kad se klikne na izmeni dugme
                $("#fokusid").focus(); 

                $scope.editListing = true;
                $scope.postojecaKnjiga = knjiga;
              
            }
//sacuvaj dugme zapravo nista ne znaci sem sto 
//ocisti formu i zatvori edit sekciju(ne treba nista cuvati zbog auto updatea, two waz binding automatski updateuje)
            $scope.sacuvajEditKnjigu = function(){
if($scope.izmenaForma.$invalid){
    toastr.warning("Niste dobro popunili formu! Molimo Vas probajte opet.")
}
else{
                toastr.success("Uspjesno ste izmenili knjigu!");

                $scope.postojecaKnjiga = {};
                $scope.editListing = false;
            }
        }
//brisanje knjige

            $scope.izbrisiPostojecuKnjigu = function(postojecaKnjiga){
                if($scope.izmenaForma.$invalid){
                    toastr.warning("Vrednosti na formi su promenjene i knjiga ne može biti izbrisana!.")
                }
                else{

                var index = $scope.knjige.indexOf(postojecaKnjiga);
                $scope.knjige.splice(index, 1);
                toastr.success("Uspesno ste izbrisali knjigu!");

                $scope.postojecaKnjiga = {};
                $scope.editListing = false;
            

            }
        }


        }]);



    app.controller("knjigeListaNemCtrl",
        ["knjigeResursi",
            knjigeListaNemCtrl
        ]);

    function knjigeListaNemCtrl(knjigeResursi) {
        var vm = this;

        knjigeResursi.query(function (data) {
            vm.knjigeNem = data;
        });
    }

    app.controller("knjigaDetaljiCtrl",
        ["knjiga",
            knjigaDetaljiCtrl
        ]);

    function knjigaDetaljiCtrl(knjiga) {
        var vm = this;

        vm.knjiga = knjiga;

        vm.title = "Detaljno o knjizi: " + vm.knjiga.knjigaIme;
    
        vm.utisak={};
        
        vm.knjiga.utisci.addUtisak = function (utisak) {
            vm.utisak.createdOn = Date.now();
          vm.knjiga.utisci.push(vm.utisak);
            vm.utisak={};
            toastr.success("Uspjesno ste dodali rejting i utisak! Hvala Vam");

        };

    }

    app.controller("knjigaEditCtrl",
        ["knjiga", "$state",
            knjigaEditCtrl
        ]);

    function knjigaEditCtrl(knjiga, $state) {
        var vm = this;

        vm.knjiga = knjiga;

        if (vm.knjiga && vm.knjiga.knjigaId) {

            vm.title = "Edit: " + vm.knjiga.knjigaIme;

        } else {
            vm.title = "Nova knjiga"
        }

        vm.open = function ($event) {

            $event.preventDefault();
            $event.stopPropagation();

            vm.opened = !vm.opened;
        };

        vm.submit = function () {

            vm.knjiga.$save(function (data) {
                toastr.success("Uspijesno ste sacuvali knjigu!");
                $state.go('knjigeNem');
            });

        }

        vm.cancel = function () {

            $state.go('knjigeNem');
        }

    }

//filter 

    app.filter("knjigeEngFilter", function () {


        return function (listings, priceInfo) {

            var filtered = [];

            var min = priceInfo.min;
            var max = priceInfo.max;

            angular.forEach(listings, function (listings) {

                if (listings.cena >= min && listings.cena <= max) {

                    filtered.push(listings);
                }
            });

            return filtered;
          

        }
    })
    //kontakt kontroler

    app.controller("kontaktCtrl", function ($scope) {
        $scope.fname = "";
        $scope.lname = "";
        $scope.email = "";
        $scope.kontakt = "";
        $scope.getvalues = function () {
            if($scope.kontaktForm.$invalid){

                toastr.warning("Niste ispravno popunili sva polja forme! Molimo Vas probajte ponovo!");
             
            }
else{
            $scope.name = $scope.fname + " " + $scope.lname;
            $scope.Email = $scope.email;
            $scope.Kontakt = $scope.kontakt;

            toastr.success("Uspjesno ste poslali Vas upit!");

            console.log("Ime i prezime:" + " " + $scope.name + " " + " " + "Email:" + " " + $scope.Email + " " + "Text:" + " " + $scope.kontakt);
            $scope.fname = "";
            $scope.lname = "";
            $scope.email = "";
            $scope.kontakt = "";

        }
        $scope.reset = function () {
            $scope.fname = "";
            $scope.lname = "";
            $scope.email = "";
            $scope.kontakt = "";
        }
    }
    })

    //kursevi komunikacija sa bazom prijava korisnika

    app.controller('kurseviCtrl', ['$scope', '$http', function ($scope, $http) {

        // Daj sve rekorde iz baze
        $http({
            method: 'post',
            url: 'APP/addremove.php',
            data: {
                request_type: 1
            },

        }).then(function successCallback(response) {
            $scope.users = response.data;
        });

        // Dodaj novi rekord
        $scope.add = function () {
            if($scope.prijavaForm.$invalid){

                toastr.warning("Niste ispravno popunili sva polja forme! Molimo Vas probajte ponovo!");
             
            }
    else{
            var len = $scope.users.length;
            $http({
                method: 'post',
                url: 'APP/addremove.php',
                data: {
                    fname: $scope.fname,
                    lname: $scope.lname,
                    uname: $scope.uname,
                    kursevi: $scope.kursevi,
                    email: $scope.email,
                    request_type: 2,
                    len: len
                },
            }).then(function successCallback(response) {
                $scope.users.push(response.data[0]);
            });
            toastr.success("Uspesno ste se prijavili za zeljeni kurs!");

            //resetovanje forme nakon submita na kursevima
            $scope.fname = "";
            $scope.lname = "";
            $scope.uname = "";
            $scope.kursevi = "";
            $scope.email = "";

        }
    }

        // Brisi rekord
        $scope.remove = function (index, userid) {

            $http({
                method: 'post',
                url: 'APP/addremove.php',
                data: {
                    userid: userid,
                    request_type: 3
                },
            }).then(function successCallback(response) {
                $scope.users.splice(index, 1);
            });

            toastr.warning("Izbrisali ste vasu prijavu iz nase baze podataka!");
        }
        //za filter na kursevima
        $scope.query = {}
        $scope.queryBy = '$'
        $scope.kursevii = [


            {
                "ime": "Engleski jezik(Starter)",
                "straniJezik": "Engleski jezik",
                "kategorija": "Starter",
                "trajanje": "4 mjeseca",
                "cena": 300,
                "imgUrl": "/Diplomski-rad/IMAGES/slike-kursevi-diplomski/pet.jpg"
            },
            {
                "ime": "Engleski jezik(FCE)",
                "straniJezik": "Engleski jezik",
                "kategorija": "Srednje teski",
                "trajanje": "6 mjeseci",
                "cena": 500,
                "imgUrl": "/Diplomski-rad/IMAGES/slike-kursevi-diplomski/fce.jpg"

            },
            {
                "ime": "Engleski jezik(CAE)",
                "straniJezik": "Engleski jezik",
                "kategorija": "Teski",
                "trajanje": "8 mjeseci",
                "cena": 600,
                "imgUrl": "/Diplomski-rad/IMAGES/slike-kursevi-diplomski/cae.jpg"

            },
            {
                "ime": "Engleski jezik(CPE)",
                "straniJezik": "Engleski jezik",
                "kategorija": "Napredni",
                "trajanje": "12 mjeseci",
                "cena": 860,
                "imgUrl": "/Diplomski-rad/IMAGES/slike-kursevi-diplomski/CPE.jpg"

            },
            {
                "ime": "Nemacki jezik(Starter)",
                "straniJezik": "Njemacki jezik",
                "kategorija": "Starter",
                "trajanje": "3 mjeseca",
                "cena": 320,
                "imgUrl": "/Diplomski-rad/IMAGES/knjigeNem/A1GermanBasic.jpg"

            },

            {
                "ime": "Nemacki jezik(Napredni)",
                "straniJezik": "Njemacki jezik",
                "kategorija": "Napredni",
                "trajanje": "12 mjeseci",
                "cena": 900,
                "imgUrl": "/Diplomski-rad/IMAGES/knjigeNem/B1German.jpg"

            }
            
        ];
       
        //prikazi/zatvori prijavu na kurseve(ui bootstrap toogle animacija, ovo i datepicker odatle iz ui bootstrapa)
        $scope.isCollapsed = true;
        //poslozi kurseve po
        $scope.orderProp = "ime";
        //za resetovanje filtera na kursevima kad se promjeni bilo sta u select meniju, ng-change dio u htmlu, 
        $scope.funkcija = function () {
            $scope.query = {}
        
        }
        $scope.prijaviSe = function(){
//kad klikne na prijavu preusmeri na prijava formu
            $("#txt_fname").focus();
        }

    }])





}());
