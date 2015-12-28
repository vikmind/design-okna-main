(function () {
	'use strict';
	angular.module('productPageCtrl', ['texturesService', 'productService', 'cartService'])
		.controller('ProductPageCtrl', [
			'$scope',
			'$log',
			'youtubeEmbedUtils',
			'$location',
			'$routeParams',
			'TexturesService',
			'ProductService',
			'CartService',
			'$sce',
			'$timeout',
			productPageCtrl
		]);

	function productPageCtrl($scope, $log, youtubeEmbedUtils, $location, $routeParams, TexturesService, ProductService, CartService, $sce, $timeout) {
		$log.log('product page ctrl');

		$scope.catalogItems = [];
		$scope.reviewsItems = [1, 2];
		$scope.gallery = {};
		$scope.gallery.currentImage = 'img/slide-1.jpg';
		$scope.textureModel = null;
		$scope.rating = 4;

		$scope.init = function () {
			$scope.getProduct();
			$scope.getTextures();
			$scope.getProducts();
		};

		$scope.getProduct = function () {
			ProductService.getProduct({
				category: $routeParams.category,
				subcategory: $routeParams.subcategory,
				slug: $routeParams.product
			}).then(function (data) {
				// Success
				$scope.product = data;
				$scope.product.cornice.text = $sce.trustAsHtml(data.cornice.text);
			}, function (err) {
				// Error
				console.log(err);
			});
		};

		$scope.addToCart = function(){
			CartService.addProduct($scope.product);
		};

		$scope.getTextures = function () {
			TexturesService.getTextures({
				category: $routeParams.category,
				subcategory: $routeParams.subcategory,
				slug: $routeParams.product
			}).then(function (data) {
				// Success
				var category = $routeParams.category,
					subcategory = $routeParams.subcategory,
					product = $routeParams.product,
					texture = $routeParams.texture,
					currentTexture = TexturesService.getTextureByUrl(texture) || {
						id: 1
					},
					currentId = currentTexture.id;

				$scope.textures = data;
				TexturesService.getTextureByUrl(texture);
				$scope.textureModel = currentId;

				$scope.$watch('textureModel', function (newVal, oldVal) {
					if (newVal) {
						$scope.getTextureById(newVal);
						$location.path('product/' + category + '/' + subcategory + '/' + product + '/' + $scope.currentTexture.url, false);
						$scope.gallery.currentImage = $scope.currentTexture.img;
					}
				});
			}, function (err) {
				// Error
				console.log(err);
			});
		};

		$scope.getProducts = function(){
			ProductService.getSeeAlsoList({
				category: $routeParams.category,
				subcategory: $routeParams.subcategory,
				slug: $routeParams.product
			}).then(function(data){
				$scope.catalogItems = data.splice(4, data.length);
			}, function(err){
				console.log(err);
			});
		};

		$scope.getTextureById = function (id) {
			$scope.currentTexture = TexturesService.getTextureById(id);
		};

		$scope.getYoutubeId = function (url) {
			return youtubeEmbedUtils.getIdFromURL(url);
		};

		$scope.priceSlider = {
			min: 100,
			max: 180,
			options: {
				floor: 0,
				ceil: 450
			}
		};

		$scope.init();
	}

})();
