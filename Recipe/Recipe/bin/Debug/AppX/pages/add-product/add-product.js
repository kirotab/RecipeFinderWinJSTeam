/// <reference path="../../js/data.js" />
/// <reference path="../../js/viewmodels.js" />
// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/add-product/add-product.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var localSettings = Windows.Storage.ApplicationData.current.localSettings;
            WinJS.Binding.processAll();
            var groupDropdown = document.getElementById("productsGroup");
            var productDropdown = document.getElementById("products");
            var addProductButton = document.getElementById("add-product");
            var backToFridgeButton = document.getElementById("back-to-fridge");
            var productsAdded = 0;
            var toogleSwitch = document.getElementById("tooltip-switch").winControl;
            var tooltipContainer = document.getElementById("tooltips-container");
            var showTooltip = localSettings.values["add-product-show-tooltip"];
            if (showTooltip==false) {
                tooltipContainer.style.display = "none";
            }
            toogleSwitch.onchange = function () {
                localSettings.values["add-product-show-tooltip"] = false;
                tooltipContainer.style.display = "none";
            }
            for (var i = 0; i < Data.productsGroups.length; i++) {
                var group = document.createElement("option");
                group.innerText = Data.productsGroups[i];
                groupDropdown.appendChild(group);
            }

            var initalOptions = Data.getProductsByCategory(groupDropdown.value);
            for (var i = 0; i < initalOptions.length; i++) {
                var product = document.createElement("option");
                product.innerText = initalOptions[i].name;
                productDropdown.appendChild(product);
            }

            groupDropdown.addEventListener("change", function (event) {
                productDropdown.innerHTML = "";
                var options = Data.getProductsByCategory(event.target.value);
                for (var i = 0; i < options.length; i++) {
                    var product = document.createElement("option");
                    product.innerText = options[i].name;
                    productDropdown.appendChild(product);
                }
            });
            addProductButton.addEventListener("click", function () {
                var isAdded = ViewModels.addProductToFridge(groupDropdown.value, productDropdown.value);
                if (isAdded) {
                    productsAdded++;
                    if (productsAdded == 1)
                        output.innerText = "Product successfully added";
                    else
                        output.innerText = productsAdded + " product successfully added";
                }
                else {
                    output.innerText = "Product already in";
                }

            });
            backToFridgeButton.addEventListener("click", function () {
                WinJS.Navigation.navigate("/pages/refrigerator/refrigerator.html");
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
