/// <reference path="//Microsoft.WinJS.1.0/js/base.js" />

(function () {
    var lastQuery = "";
    var fridgeProductsList = new WinJS.Binding.List();
    var groupedProductsList = new WinJS.Binding.List().
        createGrouped(getGroupKey, getGroupData, compareGroups);
    var allProductsList = new WinJS.Binding.List();
    var foundRecipes = new WinJS.Binding.List();
    var userAddedProduct = WinJS.Binding.as(new Models.ProductModel("", "", "/images/mystery-food.jpeg"));

    var loadProducts = function () {
        var productsDTOs = Data.getFridgeProducts();

        var currentCount = fridgeProductsList.dataSource.list.length;
        fridgeProductsList.dataSource.list.splice(0, currentCount);

        for (var i = 0; i < productsDTOs.length; i++) {
            fridgeProductsList.push(productsDTOs[i]);
        }
        //groupedProductsList = fridgeProductsList.createGrouped(getGroupKey, getGroupData, compareGroups);
    }

    var loadAllProducts = function () {
        var productsDTOs = Data.getAllProducts();
        var currentCount = allProductsList.dataSource.list.length;
        allProductsList.dataSource.list.splice(0, currentCount);
        for (var i = 0; i < productsDTOs.length; i++) {
            allProductsList.push(productsDTOs[i]);
        }
    }
    var addProductToFridge = function (category, name) {
        //TODO: Not sure if that is the way
        var productModel = Data.getProductByCategoryAndName(category, name);
        var result = Data.addProductToFridge(productModel);
        return result;
    }
    var addProduct = function (category, name, thumbUrl) {
        Data.addProduct(new Models.ProductModel(name, category, thumbUrl));
    }
    var removeProductFromFridge = function (category, name) {
        Data.removeProductFromFridge(category, name);
        for (var i = 0; i < fridgeProductsList.length; i++) {
            var productModel = fridgeProductsList.getAt(i);
            if (productModel.category === category &&
                productModel.name === name) {
                fridgeProductsList.splice(i, 1);
                return;
            }
        }
    }
    var removeProduct = function (category, name) {
        Data.removeProduct(category, name);
        for (var i = 0; i < allProductsList.length; i++) {
            var productModel = allProductsList.getAt(i);
            if (productModel.category === category &&
                productModel.name === name) {
                allProductsList.splice(i, 1);
                return;
            }
        }
    };
    //a little Dirty maybe it can be reworked later, error handling is not good
    var ProcessSearchResults = function (recipes, queryText) {
        foundRecipes.splice(0, foundRecipes.length);
        if (recipes[Error] !== "Internal Server Error") {
            if (lastQuery != queryText || recipes.length > 0) {
                //lastQuery = queryText;
                recipes.forEach(function (recipe) {
                    foundRecipes.push(new Models.RecipeModel(recipe.title, recipe.thumbnail, recipe.href, recipe.ingredients));
                })
            }
            if (foundRecipes.length < 1) {
                foundRecipes.push(new Models.RecipeModel("No recipes found with these products! ", "#", "#", "Looking for products: " + lastQuery + " and " + queryText));
            }
        }
        else {
            foundRecipes.splice(0, foundRecipes.length);
            foundRecipes.push(new Models.RecipeModel("Could not load this result page!", "#", "#", "Looking for products: " + lastQuery + " and " + queryText));
        }
    }
    var findRecipesByProducts = function (queryText, page) {
        Data.getRecipesByProducts(queryText, page).then(function (recipes) {
            if (recipes.length < 1) {
                var newQuery = splitQueryProducts(queryText);
                lastQuery = queryText;
                queryText = newQuery;
                Data.getRecipesByProducts(queryText, page).then(function (recipes) {
                    ProcessSearchResults(recipes, queryText);
                });
            } else {
                ProcessSearchResults(recipes, queryText);
            }
        });
    }
    //If no results are found this fuction splits the different ingredients
    function splitQueryProducts(args) {
        var splitProducts = "";
        if (typeof args === 'string' || args instanceof String) {
            args = args.replace(/,/g, '');
            args = args.split(" ");
        }
        var lookedUpProducts = [];
        args.forEach(function (prod) {
            if (prod != "") {
                var splitProds = prod.toLowerCase();
                splitProds = splitProds.split(" ");
                splitProds.forEach(function (pr) {
                    if (lookedUpProducts.indexOf(pr) < 0) {
                        lookedUpProducts.push(pr);
                    }
                });
            }
        });

        splitProducts = lookedUpProducts.join(",");
        return splitProducts;
    }

    function compareGroups(leftKey, rightKey) {
        return leftKey.charCodeAt(0) - rightKey.charCodeAt(0);
    }

    function getGroupKey(dataItem) {
        return dataItem.category;
    }

    function getGroupData(dataItem) {
        return {
            title: dataItem.category
        };
    }

    WinJS.Namespace.define("ViewModels", {
        loadProducts: loadProducts,
        loadAllProducts: loadAllProducts,
        products: fridgeProductsList,
        allProducts: allProductsList,
        groupedProducts: groupedProductsList,
        foundRecipes: foundRecipes,
        addProductToFridge: addProductToFridge,
        addProduct: addProduct,
        removeProductFromFridge: removeProductFromFridge,
        removeProduct: removeProduct,
        submitSearchQuery: findRecipesByProducts,
        userAddedProduct: userAddedProduct,
    });
})();