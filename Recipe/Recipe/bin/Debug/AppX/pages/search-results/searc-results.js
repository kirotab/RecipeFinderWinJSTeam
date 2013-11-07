// For an introduction to the Search Contract template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232512

// TODO: Add the following script tag to the start page's head to
// subscribe to search contract events.
//  
// <script src="/pages/search-results/searc-results.js"></script>

(function () {
    "use strict";
    WinJS.Binding.optimizeBindingReferences = true;

    var appModel = Windows.ApplicationModel;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;
    var searchPageURI = "/pages/search-results/searc-results.html";
    var searchPane = appModel.Search.SearchPane.getForCurrentView();
    searchPane.placeholderText = "Search for recipe, by products";

    //searchPane.showOnKeyboardInput = true;

    ui.Pages.define(searchPageURI, {
        _filters: [],
        _lastSearch: "",

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            WinJS.Binding.processAll(element, ViewModels);
            var listView = element.querySelector("#resultslist").winControl;
            ViewModels.submitSearchQuery(options.queryText, options.page);

            var iframeElement = element.querySelector("#frame");
            var nextPageButton = document.getElementById("next-page-button");
            var prevPageButton = document.getElementById("prev-page-button");
            var page = options.page;
            if (!page) {
                page = 1;
            }
            //BASIC PAGING should be made better and removed with the html buttons
            prevPageButton.addEventListener("click", function () {
                page--;
                if (page < 1) {
                    page = 1;
                }
                ViewModels.submitSearchQuery(options.queryText, page);
            });
            nextPageButton.addEventListener("click", function () {
                page++;
                ViewModels.submitSearchQuery(options.queryText, page);
            });


            listView.addEventListener("iteminvoked", function (event, ViewModels) {
                event.detail.itemPromise.then(function (item) {
                    var invokedHyperlink = item.data.href;
                    if (iframeElement.parentNode.style.visibility === "hidden" ||
                            iframeElement.src !== invokedHyperlink) {
                        iframeElement.parentNode.style.visibility = "visible";
                        iframeElement.parentNode.style.backgroundImage = "url('/images/loadingAnim.gif')";
                        iframeElement.style.visibility = "hidden";

                        iframeElement.src = invokedHyperlink;
                    }
                    else {
                        iframeElement.parentNode.style.visibility = "hidden";
                        iframeElement.parentNode.style.backgroundImage = "none";
                        iframeElement.style.visibility = "hidden";
                        iframeElement.src = "#";
                    }
                });
            });

            iframeElement.addEventListener("load", function () {
                iframeElement.style.visibility = "visible";
                iframeElement.parentNode.style.backgroundImage = "none";
                //iframeElement.parentNode.style.visibility = "hidden";
                //iframeElement.style.visibility = "hidden";
            });
        },

        updateLayout: function (element, viewState, lastViewState) {
            var listViewA = element.querySelector(".resultslist").winControl;
            // Respond to changes in viewState.

            // Get the ListView control. 

            // Use a ListLayout if the app is snapped or in full-screen portrait mode. 
            if (viewState === Windows.UI.ViewManagement.ApplicationViewState.snapped ||
                viewState === Windows.UI.ViewManagement.ApplicationViewState.fullScreenPortrait) {

                // If layout.Horizontal is false, the ListView
                // is already using a ListLayout, so we don't
                // have to do anything. We only need to switch
                // layouts when layout.horizontal is true. 
                if (listViewA.layout.horizontal) {
                    listViewA.layout = new WinJS.UI.ListLayout();
                }
            }

                // Use a GridLayout if the app isn't snapped or in full-screen portrait mode. 
            else {
                // Only switch layouts if layout.horizontal is false. 
                if (!listViewA.layout.horizontal) {
                    listViewA.layout = new WinJS.UI.GridLayout();
                }
            }
        },
    });

    WinJS.Application.addEventListener("activated", function (args) {
        if (args.detail.kind === appModel.Activation.ActivationKind.search) {
            args.setPromise(ui.processAll().then(function () {
                if (!nav.location) {
                    nav.history.current = { location: Application.navigator.home, initialState: {} };
                }

                return nav.navigate(searchPageURI, { queryText: args.detail.queryText });
            }));
        }
    });

    appModel.Search.SearchPane.getForCurrentView().onquerysubmitted = function (args) {
        nav.navigate(searchPageURI, args);
    };
})();
