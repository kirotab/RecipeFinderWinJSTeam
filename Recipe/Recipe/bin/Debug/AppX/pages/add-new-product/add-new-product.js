/// <reference path="../../js/viewmodels.js" />
// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/add-new-product/add-new-product.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            var addNewProductContainer = document.getElementById("add-new-product-container");
            WinJS.Binding.processAll(addNewProductContainer, ViewModels.userAddedProduct);
            var localFolder = Windows.Storage.ApplicationData.current.localFolder;
            var imageFolder;
            localFolder.createFolderAsync("User images", Windows.Storage.CreationCollisionOption.openIfExists).then(function (folder) {
                imageFolder = folder;
            });

            var localSettings = Windows.Storage.ApplicationData.current.localSettings;
            var toogleSwitch = document.getElementById("tooltip-switch").winControl;
            var tooltipContainer = document.getElementById("tooltips-container");
            var showTooltip = localSettings.values["add-new-product-show-tooltip"];
            if (showTooltip == false) {
                tooltipContainer.style.display = "none";
            }
            toogleSwitch.onchange = function () {
                localSettings.values["add-new-product-show-tooltip"] = false;
                tooltipContainer.style.display = "none";
            }


            var addNewProductImage = document.getElementById("add-new-product-image");
            var thumbPath = "";
            var imgNameHolder = document.getElementById("new-product-image");

            var pickedImage;
            addNewProductImage.addEventListener("click", function () {
                var openFilePicker = Windows.Storage.Pickers.FileOpenPicker();
                openFilePicker.fileTypeFilter.replaceAll([".jpg", ".png", ".bmp", ".jpeg"]);
                openFilePicker.suggestedStartLocation = Windows.Storage.KnownFolders.picturesLibrary.path;
                openFilePicker.pickSingleFileAsync().then(function (storageFile) {
                    pickedImage = storageFile;
                    thumbPath = URL.createObjectURL(storageFile)
                    ViewModels.userAddedProduct.thumbUrl = thumbPath;
                });
            });

            var addToListButton = document.getElementById("addToList");
            var addToListFridgeButton = document.getElementById("addToListFridge");
            var newProductGroupInput = document.getElementById("new-product-group-input");
            var newProductNameInput = document.getElementById("new-product-name-input");
            var output = document.getElementById("output");
            var backToProductsButton = document.getElementById("back-to-all-products");

            backToProductsButton.addEventListener("click", function () {
                WinJS.Navigation.navigate("/pages/search-by-products/search-by-products.html");
            });

            addToListButton.addEventListener("click", function () {
                var isInputValidValue = isInputValid();
                if (isInputValidValue == false) {
                    return;
                }

                pickedImage.copyAsync(imageFolder).then(function (copiedFile) {
                    var newName = newProductGroupInput.value + "-" + newProductNameInput.value + copiedFile.fileType
                    copiedFile.renameAsync(newName).then(function (renamedImg) {
                        //imgNameHolder.innerText = copiedFile.name;
                        thumbPath = URL.createObjectURL(copiedFile);
                        ViewModels.userAddedProduct.thumbUrl = thumbPath;
                        ViewModels.addProduct(newProductGroupInput.value, newProductNameInput.value, thumbPath);
                        output.innerText = "Product successfully added"
                    })
                }, function (error) {
                    output.innerText = error;
                })

            });
            addToListFridgeButton.addEventListener("click", function () {
                var isInputValidValue = isInputValid();
                if (isInputValidValue == false) {
                    return;
                }
                pickedImage.copyAsync(imageFolder).then(function (copiedFile) {
                    var newName = newProductGroupInput.value + "-" + newProductNameInput.value + copiedFile.fileType
                    copiedFile.renameAsync(newName).then(function (renamedImg) {
                        //imgNameHolder.innerText = copiedFile.name;
                        thumbPath = URL.createObjectURL(copiedFile);
                        ViewModels.userAddedProduct.thumbUrl = thumbPath;
                        ViewModels.addProduct(newProductGroupInput.value, newProductNameInput.value, thumbPath);
                        ViewModels.addProductToFridge(newProductGroupInput.value, newProductNameInput.value);
                        output.innerText = "Product successfully added"
                    })
                }, function (error) {
                    output.innerText = error;
                })

            });

            function isInputValid() {
                if (newProductGroupInput.value === "") {
                    output.innerText = "Enter food category!";
                    return false;
                }
                if (newProductNameInput.value === "") {
                    output.innerText = "Enter food name!";
                    return false;
                }
                if (thumbPath === "") {
                    output.innerText = "Pick image first!";
                    return false;
                }
                return true;
            }
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
