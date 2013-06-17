UMC.register("addon.location.geo", function($) {
    return function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                return {
                    lat : position.coords.latitude,
                    lng : position.coords.longitude
                };
            }, function(error) {
                $.log("The geo info is err");
            });
        } else {
            return false;
        }
    };
});