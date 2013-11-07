/// <reference path="../../js/data.js" />
/// <reference path="../../js/models.js" />
(function () {
    "use strict";

    var nav = WinJS.Navigation;
    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            var refrButton = document.getElementById("ref-button");
            var searchButton = document.getElementById("search-products-button");
            var photoButton = document.getElementById("photo");
            var restoreTooltipsButton = document.getElementById("cmdRestoreTooltips");
            var localSettings = Windows.Storage.ApplicationData.current.localSettings;

            restoreTooltipsButton.addEventListener("click", function () {
                localSettings.values["add-product-show-tooltip"] = true;
                localSettings.values["add-new-product-show-tooltip"] = true;
            });
            photoButton.addEventListener("click", function () {
                nav.navigate("/pages/recipe-photo/pagecontrol.html");
            });

            refrButton.addEventListener("click", function () {
                nav.navigate("/pages/refrigerator/refrigerator.html");
            });
            searchButton.addEventListener("click", function () {
                nav.navigate("/pages/search-by-products/search-by-products.html");
            });
        }
    });
})();
