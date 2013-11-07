/// <reference path="//Microsoft.WinJS.1.0/js/ui.js" />
/// <reference path="//Microsoft.WinJS.1.0/js/base.js" />
(function () {
    var ProductModel = WinJS.Class.define(function (name, category, thumbUrl) {
        this.name = name;
        this.category = category;
        this.thumbUrl = thumbUrl;
    }, {
        name: "",
        category: "",
        thumbUrl: ""
    });
    var RecipeModel = WinJS.Class.define(function (name, thumbUrl, href, ingredients) {
        this.name = name;
        this.thumbUrl = thumbUrl;
        this.href = href;
        this.ingredients = ingredients;
    }, {
        name: "",
        thumbUrl: "",
        href: "",
        ingredients: "",
    });

    var HistoryModel = WinJS.Class.define(function (recipeName, dateTime, resultImageSrc) {
        this.recipeName = recipeName;
        this.dateTime = dateTime;
        this.resultImageSrc = resultImageSrc;
    }, {
        recipeName: "",
        dateTime: "",
        resultImageSrc: "",
    });
    WinJS.Namespace.define("Models", {
        ProductModel: ProductModel,
        RecipeModel: RecipeModel,
        HistoryModel: HistoryModel,
    });
})();