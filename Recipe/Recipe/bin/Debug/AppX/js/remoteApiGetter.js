//Remote data from Recipe Puppy is fetched here
(function () {

    ///Function is async 
    //How to use it
    //EXAMPLE:
    //var testIng = [];
    //testIng.push("bread");
    //testIng.push("eggs");
    //var tt;
    //RemoteData.getRecipes(testIng).then(function (result) {
    //    tt = result;
    //});

    WinJS.Namespace.define("RemoteData", {
        getRecipes: function (arguments, page) {
            if (!page) {
                page = 1;
            }
            page = parseInt(page);

            var ingredientsString = "";
            if (typeof arguments === 'string' || arguments instanceof String) {
                ingredientsString = arguments;
            }
            else {
                ingredientsString = arguments.join(",");
            }

            var apiUrl = "http://www.recipepuppy.com/api/?i=";
            var returnPage = "&p=" + page;
            var url = apiUrl + ingredientsString + returnPage
            url = url.toLowerCase();
            //ASYNC
            var allRecipes = [];
            return new WinJS.Promise(function (comp, err) {
                try {

                    WinJS.xhr({
                        url: url,
                        type: "GET"
                    }).then(function (request) {


                        var parse = JSON.parse(request.response);
                        parse.results.forEach(function (data) {

                            //Checking if thumbnail is miising and adding the default one
                            if (data.thumbnail == "") {
                                data.thumbnail = "../../images/mystery-food.jpeg";
                            }
                            allRecipes.push(data);
                        });
                        comp(allRecipes);
                    },
                    function (request) {
                        //if (request.statusText === "Internal Server Error");
                        allRecipes[Error] = request.statusText;
                        comp(allRecipes)
                    });

                }

                catch (e) {
                    //TODO error handling
                }
            })
        }
    });

})();