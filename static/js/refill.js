// $(window).resize(function() {
// 	var more = document.getElementById("js-navigation-more");
// 	if ($(more).length > 0) {
// 		var windowWidth = $(window).width();
// 		var moreLeftSideToPageLeftSide = $(more).offset().left;
// 		var moreLeftSideToPageRightSide = windowWidth - moreLeftSideToPageLeftSide;
//
// 		if (moreLeftSideToPageRightSide < 330) {
// 			$("#js-navigation-more .submenu .submenu").removeClass("fly-out-right");
// 			$("#js-navigation-more .submenu .submenu").addClass("fly-out-left");
// 		}
//
// 		if (moreLeftSideToPageRightSide > 330) {
// 			$("#js-navigation-more .submenu .submenu").removeClass("fly-out-left");
// 			$("#js-navigation-more .submenu .submenu").addClass("fly-out-right");
// 		}
// 	}
// });
//
// $(document).ready(function() {
// 	var menuToggle = $("#js-mobile-menu").unbind();
// 	$("#js-navigation-menu").removeClass("show");
//
// 	menuToggle.on("click", function(e) {
// 		e.preventDefault();
// 		$("#js-navigation-menu").slideToggle(function() {
// 			if ($("#js-navigation-menu").is(":hidden")) {
// 				$("#js-navigation-menu").removeAttr("style");
// 			}
// 		});
// 	});
// });

$(window).on("load resize",function(e) {
	var more = document.getElementById("js-navigation-more");

	if ($(more).length > 0) {
		var windowWidth = $(window).width();
		var moreLeftSideToPageLeftSide = $(more).offset().left;
		var moreLeftSideToPageRightSide = windowWidth - moreLeftSideToPageLeftSide;

		if (moreLeftSideToPageRightSide < 330) {
			$("#js-navigation-more .submenu .submenu").removeClass("fly-out-right");
			$("#js-navigation-more .submenu .submenu").addClass("fly-out-left");
		}

		if (moreLeftSideToPageRightSide > 330) {
			$("#js-navigation-more .submenu .submenu").removeClass("fly-out-left");
			$("#js-navigation-more .submenu .submenu").addClass("fly-out-right");
		}
	}

	var menuToggle = $("#js-mobile-menu").unbind();
	$("#js-navigation-menu").removeClass("show");

	menuToggle.on("click", function(e) {
		e.preventDefault();
		$("#js-navigation-menu").slideToggle(function(){
			if($("#js-navigation-menu").is(":hidden")) {
				$("#js-navigation-menu").removeAttr("style");
			}
		});
	});
});

$(document).ready(function() {
	$(".dropdown-button").click(function() {
		var $button, $menu;
		$button = $(this);
		// $button = $button.append('<span class="dropdown-button-arrow pull-right"><i class="fa fa-chevron-down"></i></span>');
		$menu = $button.siblings(".dropdown-menu");
		$('li .dropdown-button-arrow').remove();
		$menu.toggleClass("show-menu");

		$menu.children("li").click(function() {
			$menu.removeClass("show-menu");
			$button.html($(this).html());
			$('.dropdown-button .dropdown-button-arrow').remove();
			$('.dropdown-button').append('<span class="dropdown-button-arrow pull-right"><i class="fa fa-chevron-down"></i></span>');
		});
	});
});