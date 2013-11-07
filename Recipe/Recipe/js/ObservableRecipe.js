(function () {
    var recipe = {
        name: "",
        thumbnailUrl: "",
        link: ""
    };

    var ObservableRecipe = WinJS.Binding.define(recipe);

    WinJS.Namespace.define("Data", {
        getRecipe: function (name, link, thumbnailUrl) {
            return new ObservableRecipe({
                name: name,
                thumbnailUrl: imageUrl,
                link: link,

            });
        }
    });
})();