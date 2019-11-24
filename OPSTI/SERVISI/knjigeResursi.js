(function () {
    "use strict";

    angular
        .module("opsti.servisi")
        .factory("knjigeResursi",
                ["$resource",
                 knjigeResursi]);

    function knjigeResursi($resource) {
        return $resource("/api/knjigeNem/:knjigaId")
    }

}());
