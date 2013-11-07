// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";
 
    WinJS.UI.Pages.define("/pages/recipe-photo/pagecontrol.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            var photoButton = document.getElementById("photoButton");

            photoButton.addEventListener("click", function () {
                takepicture();
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

    function takepicture() {
        var captureUI = new Windows.Media.Capture.CameraCaptureUI();
        captureUI.captureFileAsync(Windows.Media.Capture.CameraCaptureUIMode.photo).then(function (capturedItem) {
            if (capturedItem) {

                var photoBlobUrl = URL.createObjectURL(
                      capturedItem,
                      { oneTimeOnly: true });

                var picResult = document.getElementById("result");
                picResult.innerHTML = "";

                var imageElement = document.createElement("img");
                imageElement.setAttribute("src", photoBlobUrl);
                
                picResult.appendChild(imageElement);

                capturedItem.moveAsync(Windows.Storage.KnownFolders.picturesLibrary, "photo.jpg", Windows.Storage.NameCollisionOption.generateUniqueName)
                //document.getElementById("message").innerHTML = "User captured a photo."
            }
            else {
                document.getElementById("message").innerHTML = "User didn't capture a photo."
            }
        });
    }

    //WinJS.Application.addEventListener("activated", function (args) {
    //    if (args.detail.kind === appModel.Activation.ActivationKind.search) {
    //        args.setPromise(ui.processAll().then(function () {
    //            if (!nav.location) {
    //                nav.history.current = { location: Application.navigator.home, initialState: {} };
    //            }

    //            return nav.navigate(searchPageURI, { queryText: args.detail.queryText });
    //        }));
    //    }
    //});

    //appModel.Search.SearchPane.getForCurrentView().onquerysubmitted = function (args) {
    //    nav.navigate(searchPageURI, args);
    //};
   
})();
