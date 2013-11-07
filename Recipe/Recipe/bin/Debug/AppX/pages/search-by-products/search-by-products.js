/// <reference path="../../js/viewmodels.js" />
/// <reference path="../../js/remoteApiGetter.js" />
// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/search-by-products/search-by-products.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            ViewModels.loadAllProducts();
            var searchButton = document.getElementById("cmdSearch");
            var productsList = document.getElementById("all-products-list").winControl;
            var appBarRemove = document.getElementById("cmdRemove").winControl;
            var appBarAdd = document.getElementById("cmdAdd").winControl;
            var appBarAddSelected = document.getElementById("cmdAddSelected").winControl;
            var appBar = document.getElementById("appbar-id").winControl;

            productsList.addEventListener("selectionchanged", function (event, ViewModels) {
                var selectionCount = productsList.selection.count();
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
                productsList.selection.getItems().then(function (items) {
                    items.forEach(function (product) {
                        ViewModels.removeProduct(product.data.category, product.data.name);
                    });

                });
            });
            appBarAdd.addEventListener("click", function () {
                appBar.hide();
                WinJS.Navigation.navigate("/pages/add-new-product/add-new-product.html");
            });
            //add selected items in search by products pane
            appBarAddSelected.addEventListener("click", function () {
                appBar.hide();
                var selectedProducts = []
                productsList.selection.getItems().then(function (items) {
                    items.forEach(function (product) {
                        selectedProducts.push({name: product.data.name, category: product.data.category});
                    });
                }).then(function () {
                    selectedProducts.forEach(function (selectedProduct) {
                        ViewModels.addProductToFridge(selectedProduct.category, selectedProduct.name);
                    });
                });
               WinJS.Navigation.navigate("/pages/refrigerator/refrigerator.html");
            });
            searchButton.addEventListener("click", function () {
                appBar.hide();
                var searchedProducts = []
                productsList.selection.getItems().then(function (items) {
                    items.forEach(function (product) {
                        searchedProducts.push(product.data.name);
                    });
                });
                WinJS.Navigation.navigate("/pages/search-results/searc-results.html", { queryText: searchedProducts });
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
})();
