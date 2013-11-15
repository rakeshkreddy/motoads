'use strict';

motoAdsApp.controller('NavbarController', function NavbarController($scope, $location) {

  $scope.routeIs = function(routeName) {
    return $location.path() === routeName;
  };

});

motoAdsApp.controller('AdvertsController', ['$scope', 'Brand', 'Country', 'Advert',
  function($scope, Brand, Country, Advert) {
    $scope.oneAtATime = true;

    $scope.brands = Brand.query();

    $scope.countries = Country.query();

    $scope.sortByCols = [{
        "key": "year",
        "name": "Year"
      }, {
        "key": "price",
        "name": "Price"
      }];

    $scope.adverts = [];
    var allAdverts = Advert.query(filterAdverts);

    $scope.filter = {
      brandName: null,
      modelName: null,
      country: null,
      region: null,
      yearFrom: null,
      yearTo: null
    };

    $scope.isAnyFilter = function() {
      var f = $scope.filter;
      if (f.brandName || f.modelName || f.country || f.region || f.yearFrom || f.yearTo) {
        return true;
      }
      return false;
    };

    $scope.removeAllFilter = function() {
      $scope.filter = {
        brandName: null,
        modelName: null,
        country: null,
        region: null,
        yearFrom: null,
        yearTo: null
      };
    };

    $scope.addBrandModelFilter = function(brand, model) {
      $scope.filter.brandName = brand.name;
      $scope.filter.modelName = model.name;
    };

    $scope.$watch('filter', filterAdverts, true);

    function filterAdverts() {
      $scope.adverts = [];
      angular.forEach(allAdverts, function(row) {
        if (!$scope.filter.country) {
          $scope.filter.region = null;
        }
        if ($scope.filter.brandName && $scope.filter.brandName !== row.brandName) {
          return;
        }
        if ($scope.filter.modelName && $scope.filter.modelName !== row.modelName) {
          return;
        }
        if ($scope.filter.country && $scope.filter.country.name !== row.countryName) {
          return;
        }
        if ($scope.filter.region && $scope.filter.region.name !== row.regionName) {
          return;
        }
        if ($scope.filter.yearFrom && $scope.filter.yearFrom > row.year) {
          return;
        }
        if ($scope.filter.yearTo && $scope.filter.yearTo < row.year) {
          return;
        }
        $scope.adverts.push(row);
      });
    }
    ;

  }]);

motoAdsApp.controller('AddAdvertController', ['$scope', 'Brand', 'Country', 'Advert',
  function($scope, Brand, Country, Advert) {
    $scope.brands = Brand.query();

    $scope.countries = Country.query();

    $scope.emptyAdvert = {
      brand: null,
      model: null,
      year: 2010,
      price: 10000,
      imageUrl: "img/audi_a1_1.jpg",
      country: null,
      region: null
    };

    $scope.add = function() {
      var newAdvert = {
        brandName: $scope.newAdvert.brand.name,
        modelName: $scope.newAdvert.model.name,
        year: $scope.newAdvert.year,
        price: $scope.newAdvert.price,
        imageUrl: $scope.newAdvert.imageUrl,
        countryName: $scope.newAdvert.country.name,
        regionName: $scope.newAdvert.region.name
      };

      Advert.save(newAdvert);
      alert('New advert added!');
      $scope.reset();
    };

    $scope.reset = function() {
      $scope.newAdvert = angular.copy($scope.emptyAdvert);
      if ($scope.advertForm) {
        // TODO Uncomment in angular 1.1.1 or higher
        //$scope.advertForm.$setPristne();
      }
    };

    $scope.isUnchanged = function() {
      return angular.equals($scope.newAdvert, $scope.emptyAdvert);
    };

    $scope.reset();
  }]);