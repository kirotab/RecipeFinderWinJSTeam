/// <reference path="../../js/viewmodels.js" />
// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511

//test commit
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/refrigerator/refrigerator.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            ViewModels.loadProducts();
            var backToHome = document.getElementById("backToHome");
            var appBarAdd = document.getElementById("cmdAdd").winControl;
            var appBarSearch = document.getElementById("cmdSearch").winControl;
            var fridgeProducts = document.getElementById("refrigerator-list").winControl;
            var appBarRemove = document.getElementById("cmdRemove").winControl;
            var appBar = document.getElementById("appbar-id").winControl;
            fridgeProducts.addEventListener("selectionchanged", function (event, ViewModels) {
                var selectionCount = fridgeProducts.selection.count();
                if (selectionCount > 0) {
                    appBar.show();
                    appBar.sticky = true;
                }
                else {
                    appBar.sticky = false;
                    appBar.hide();
                }
            });
            appBarRemove.addEventListener("click", function () {
                fridgeProducts.selection.getItems().then(function (items) {
                    items.forEach(function (product) {
                        ViewModels.removeProductFromFridge(product.data.category,product.data.name);
                    });

                });
            });
            appBarAdd.addEventListener("click", function () {
                appBar.hide();
                WinJS.Navigation.navigate("/pages/add-product/add-product.html");
            });
            appBarSearch.addEventListener("click", function () {
                appBar.hide();
                var searchedProducts = []
                fridgeProducts.selection.getItems().then(function (items) {
                    items.forEach(function (product) {
                        searchedProducts.push(product.data.name);
                    });
                });
                WinJS.Navigation.navigate("/pages/search-results/searc-results.html", { queryText: searchedProducts });
            });
            backToHome.addEventListener("click", function () {
                WinJS.Navigation.navigate("/pages/home/home.html");
            });
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        }
    });
    //WinJS.Namespace.define("MyConverters", {
    //    cssUrl: WinJS.Binding.converter(function (url) {
    //        return "url('" + url + "')";
    //    }),
    //});
})();
