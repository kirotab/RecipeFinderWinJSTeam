/// <reference path="//Microsoft.WinJS.1.0/js/base.js" />
(function () {

    var fridgeProducts = [];
    
    var productsGroups = [];
    var countPerGroup = [];
    
    var allProducs = [];

    var history = [
    new Models.HistoryModel("Recipe 1", Date.now, "#"),
    new Models.HistoryModel("Recipe 2", Date.now, "#"), ];
    var imageFolder;
    var localFolder = Windows.Storage.ApplicationData.current.localFolder;
    localFolder.createFolderAsync("User images", Windows.Storage.CreationCollisionOption.openIfExists).then(function (folder) {
        imageFolder = folder;       
    });
    var getFridgeProducts = function () {
        return fridgeProducts;
    };

    var getAllProducts = function () {
        return allProducs;
    };
    var getAllGroups = function () {
        return productsGroups;
    };
    var addProductToFridge = function (productModel) {
        for (var i = 0; i < fridgeProducts.length; i++) {            
            if (fridgeProducts[i].category === productModel.category &&
                fridgeProducts[i].name === productModel.name) {
                return false;
            }
        }
        fridgeProducts.push(productModel);
        return true;
    };
    var addProduct = function (productModel) {
        var isCategoryNew = true;
        for (var i = 0; i < allProducs.length; i++) {
            var curCategory = allProducs[i].category;          
            var curProduct = allProducs[i].name;
            if (curCategory.toLowerCase() === productModel.category.toLowerCase()) {
                isCategoryNew = false;
                if (curProduct.toLowerCase() === productModel.name.toLowerCase()) {
                    return false;
                }
            }            
        }
        if (isCategoryNew) {
            productsGroups.push(productModel.category);
        }
        if (countPerGroup[productModel.category]==undefined) {
            countPerGroup[productModel.category] = 0;
        }
        countPerGroup[productModel.category]++;
        allProducs.push(productModel);
        return true;
    }
    var removeProductFromFridge = function (category, name) {
        for (var i = 0; i < fridgeProducts.length; i++) {
            if (fridgeProducts[i].category === category &&
                fridgeProducts[i].name === name) {
                fridgeProducts.splice(i, 1);
                return;
            }
        }
    }

    var removeProduct = function (category, name) {        
        for (var i = 0; i < allProducs.length; i++) {
            if (allProducs[i].category === category &&
                allProducs[i].name === name) {
                allProducs.splice(i, 1);
                var imgFileName = category + "-" + name + ".jpg";
                imageFolder.getFileAsync(imgFileName).then(function (file) {
                    file.deleteAsync();
                });
                removeProductFromFridge(category, name);
                countPerGroup[category]--;
                checkForEmptyGroups();
                return;
            }
        }
    };
    var checkForEmptyGroups = function () {
        for (var group in countPerGroup) {
            if (countPerGroup[group]==0) {
                productsGroups = productsGroups.filter(function (value) {
                    return value != group;
                });
                return;
            }
        }
    }
    var getProductsByCategory = function (category) {
        return allProducs.filter(function (product) {
            if (product.category == category) {
                return true;
            }
            else {
                return false;
            }
        });
    }

    var getProductByCategoryAndName = function (category, name) {
        for (var i = 0; i < allProducs.length; i++) {
            if (allProducs[i].category === category && allProducs[i].name === name) {
                return allProducs[i];
            }
        }
    };

    var getRecipesByProducts = function (products, page) {
        return RemoteData.getRecipes(products, page);
    };
    var loadData = function () {
        var storage = Windows.Storage.StorageFile;
        var productsUri;
        
        imageFolder.getFilesAsync().then(function (files) {
            if (files.length != 0) {
                files.forEach(function (file) {
                    var details = file.displayName.split("-");
                    var category = details[0];
                    var name = details[1];
                    var imgUrl = URL.createObjectURL(file);
                    if (countPerGroup[category] === undefined) {
                        countPerGroup[category] = 0;
                    }
                    countPerGroup[category]++;
                    allProducs.push(new Models.ProductModel(name, category, imgUrl));
                })
            }
            else {
                productsUri = new Windows.Foundation.Uri("ms-appx:///productsData/products.txt");
                storage.getFileFromApplicationUriAsync(productsUri).then(function (storageFile) {
                    Windows.Storage.FileIO.readLinesAsync(storageFile).then(function (lines) {
                        lines.forEach(function (line) {
                            var details = line.split(", ");
                            var category = details[0];
                            var name = details[1];
                            var imgUriText = "ms-appx://" + details[2];
                            var imgUri = new Windows.Foundation.Uri(imgUriText);
                            var imgUrl;
                            storage.getFileFromApplicationUriAsync(imgUri).then(function (productImg) {
                                productImg.copyAsync(imageFolder).then(function (copiedImage) {
                                    copiedImage.renameAsync(category + "-" + name + copiedImage.fileType).then(function () {
                                        imgUrl = URL.createObjectURL(copiedImage);
                                        if (countPerGroup[category] === undefined) {
                                            countPerGroup[category] = 0;
                                        }
                                        countPerGroup[category]++;
                                        allProducs.push(new Models.ProductModel(details[1], details[0], imgUrl));
                                    })
                                })
                            });
                        })
                    });
                });
                
            }
            localFolder.getFileAsync("fridgeProducts.txt").then(function (storageFile) {
                Windows.Storage.FileIO.readLinesAsync(storageFile).then(function (lines) {
                    for (var i = 0; i < lines.length; i++) {
                        var details = lines[i].split(", ");
                        var foundProduct = getProductByCategoryAndName(details[0], details[1]);
                        fridgeProducts.push(foundProduct);
                    }
                });
            });
        });

        localFolder.getFileAsync("groups.txt").then(function (storageFile) {
            Windows.Storage.FileIO.readTextAsync(storageFile).then(function (groupsRaw) {
                var groups = Data.getAllGroups();
                var readGroups = groupsRaw.split(", ");
                for (var i = 0; i < readGroups.length; i++) {
                    Data.productsGroups.push(readGroups[i]);
                }
            }, function (innerRrror) {
                var m = 10;
            });
        }, function (error) {
            productsUri = new Windows.Foundation.Uri("ms-appx:///productsData/groups.txt");
            storage.getFileFromApplicationUriAsync(productsUri).then(function (storageFile) {
                Windows.Storage.FileIO.readTextAsync(storageFile).then(function (groupsRaw) {
                    var groups = Data.getAllGroups();
                    var readGroups = groupsRaw.split(", ");
                    for (var i = 0; i < readGroups.length; i++) {
                        Data.productsGroups.push(readGroups[i]);
                    }
                })
            }, function (error) {
                var x = 5;
            });
        });

        
    }

    var saveData = function () {
        var localFolder = Windows.Storage.ApplicationData.current.localFolder;
        localFolder.createFileAsync("groups.txt", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (storageFile) {
            var groups = Data.getAllGroups().join(", ");
            Windows.Storage.FileIO.writeTextAsync(storageFile, groups);
        });
        localFolder.createFileAsync("fridgeProducts.txt", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (storageFile) {
            var fridgeProducts = Data.getFridgeProducts();
            var lines = [];
            for (var i = 0; i < fridgeProducts.length; i++) {
                lines.push(fridgeProducts[i].category + ", " + fridgeProducts[i].name + ", ");
            }
            Windows.Storage.FileIO.writeLinesAsync(storageFile, lines);
        });
    };
    WinJS.Namespace.define("Data", {
        getFridgeProducts: getFridgeProducts,
        getAllProducts: getAllProducts,
        getAllGroups: getAllGroups,
        addProduct: addProduct,
        addProductToFridge: addProductToFridge,
        removeProductFromFridge: removeProductFromFridge,
        removeProduct: removeProduct,
        productsGroups: productsGroups,
        getProductsByCategory: getProductsByCategory,
        getProductByCategoryAndName: getProductByCategoryAndName,
        getRecipesByProducts: getRecipesByProducts,
        loadData: loadData,
        saveData : saveData,
    });
})();