$(document).ready(function() {
  var ticking = false;
  var isFirefox = (/Firefox/i.test(navigator.userAgent));
  var isIe = (/MSIE/i.test(navigator.userAgent)) || (/Trident.*rv\:11\./i.test(navigator.userAgent));
  var scrollSensitivitySetting = 30; //Increase/decrease this number to change sensitivity to trackpad gestures (up = less sensitive; down = more sensitive)
  var slideDurationSetting = 600; //Amount of time for which slide is "locked"
  var currentSlideNumber = 0;
  var totalSlideNumber = $(".page").length;

  function parallaxScroll(evt) {
    if (isFirefox) {
      delta = evt.detail * (-120);
    } else if (isIe) {
      delta = -evt.deltaY;
    } else {
      delta = evt.wheelDelta;
    }

    if (ticking != true) {
      if (delta <= -scrollSensitivitySetting) {
        ticking = true;
        if (currentSlideNumber !== totalSlideNumber - 1) {
          currentSlideNumber++;
          nextItem();
        }
        slideDurationTimeout(slideDurationSetting);
      }
      if (delta >= scrollSensitivitySetting) {
        ticking = true;
        if (currentSlideNumber !== 0) {
          currentSlideNumber--;
        }
        previousItem();
        slideDurationTimeout(slideDurationSetting);
      }
    }
  }

  function slideDurationTimeout(slideDuration) {
    setTimeout(function() {
      ticking = false;
    }, slideDuration);
  }

  function nextItem() {
    var $previousSlide = $(".page").eq(currentSlideNumber - 1);
    $currentSlide = $(".page").removeClass("current").eq(currentSlideNumber).addClass("current");
    $previousSlide.removeClass("up-scroll").addClass("down-scroll");
    $(".indicate-dots li, .main-menu li").removeClass("current");
    $(".indicate-dots li [href='#"+$(".page").eq(currentSlideNumber).attr("id")+"'], .main-menu [href='#"+$(".page").eq(currentSlideNumber).attr("id")+"']").parent().addClass("current");
  }

  function previousItem() {
    var $currentSlide = $(".page").eq(currentSlideNumber);
    $currentSlide = $(".page").removeClass("current").eq(currentSlideNumber).addClass("current");
    $currentSlide.removeClass("down-scroll").addClass("up-scroll");
    $(".indicate-dots li, .main-menu li").removeClass("current");
    $(".indicate-dots li [href='#"+$(".page").eq(currentSlideNumber).attr("id")+"'], .main-menu [href='#"+$(".page").eq(currentSlideNumber).attr("id")+"']").parent().addClass("current");
  }


  $(".menu-trigger").click(function() {
    $("body").toggleClass("active-menu")
  });


  $(".cats a").click(function() {
    $(".gallery-cat").removeClass("active");
    $(".gallery " + $(this).attr("href")).addClass("active");
    $(".cats li").removeClass("current");
    $(this).parent().addClass("current");
    return false;
  });

  $("form").submit(function() {
    var form = $(this);
    form.find(".btn").remove();
    $.ajax({
      type: "POST",
      url: form.attr("action"),
      data: form.serialize(),
      success: function(data) {
        form.text(data).addClass("sent")
      }
    });
    return false;
  });

  var loadEffets = false;
  if ($(window).width() > 1023 && $(window).height() > 720) {
    if (!isIe) {
      loadEffets = true;
    }
  }

  function resize() {

    if (loadEffets) {

      $("body").addClass("load-onescroll");

      var mousewheelEvent = isFirefox ? "DOMMouseScroll" : "wheel";
      window.addEventListener(mousewheelEvent, _.throttle(parallaxScroll, 60), false);

      $(".indicate-dots li a, .btn[href*='#'], .main-menu a:not(.external)").click(function() {
        currentSlideNumber = $($(this).attr('href')).index();
        $(".page").removeClass("current");
        $($(this).attr('href')).removeClass("down-scroll up-scroll").addClass("current");
        $(".indicate-dots li, .main-menu li").removeClass("current");
        $(".indicate-dots li [href='"+$(this).attr('href')+"'], .main-menu [href='"+$(this).attr('href')+"']").parent().addClass("current");
        $(".page.current").prevAll(".page").removeClass("up-scroll").addClass("down-scroll");
        $(".page.current").nextAll(".page").removeClass("down-scroll up-scroll");
        return false;
      });

    } else {

      $("body").addClass("load-withoutscroll");
      $(".btn[href*='#'], .main-menu a:not(.external)").click(function() {
        $("body").removeClass("active-menu");
        var extra = 0;
        if ($(window).width() < 768) {
          extra = 79;
        }
        var $anchor = $(this);
        $('html, body').stop().animate({
          scrollTop: $($anchor.attr('href')).offset().top - extra
        }, 750);
        return false;
      });
      $('.indicate-dots').onePageNav({
        scrollChange: function($currentListItem) {
          $(".main-menu li").removeClass("current").find('[href="' + $currentListItem.find("a").attr("href") + '"]').parent().addClass("current");
        },
        changeHash: true,
        filter: ':not(.external)'
      });
    }

  }

  $(window).resize(function() {
    loadEffets = false;
    if ($(window).width() > 1023 && $(window).height() > 720) {
      if (!isIe) {
        loadEffets = true;
      }
    }
    resize();
  });
  resize();

  $('.menu-slider').slick({
    dots: false,
    infinite: false,
    speed: 400,
    slidesToShow: 2,
    slidesToScroll: 2,
    nextArrow: '<button type="button" class="slick-next"><i class="fa fa-chevron-right" aria-hidden="true"></i></button>',
    prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-chevron-left" aria-hidden="true"></i></button>',
    responsive: [{
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    }]
  });

  $('.reviews-slider').slick({
    dots: false,
    infinite: true,
    centerMode: true,
    variableWidth: true,
    adaptiveHeight: true,
    speed: 400,
    nextArrow: '<button type="button" class="slick-next"><i class="fa fa-chevron-right" aria-hidden="true"></button>',
    prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-chevron-left" aria-hidden="true"></button>',
  });

  $('.chef-slider').slick({
    dots: false,
    infinite: false,
    speed: 400,
    slidesToShow: 2,
    slidesToScroll: 2,
    nextArrow: '<button type="button" class="slick-next"><i class="fa fa-chevron-right" aria-hidden="true"></button>',
    prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-chevron-left" aria-hidden="true"></button>',
    responsive: [{
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }]
  });

  $('.gallery-cat ul').slick({
    dots: false,
    infinite: false,
    speed: 400,
    rows: 2,
    slidesToShow: 3,
    slidesToScroll: 3,
    nextArrow: '<button type="button" class="slick-next"><i class="fa fa-chevron-right" aria-hidden="true"></button>',
    prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-chevron-left" aria-hidden="true"></button>',
    responsive: [{
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });

  $("[data-fancybox]").fancybox({
    buttons: [
      'close'
    ],
    hash: false,
    arrows : true,
    btnTpl: {
      arrowLeft: '<button data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}"><i class="fa fa-chevron-left" aria-hidden="true"></i></button>',
      arrowRight: '<button data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}"><i class="fa fa-chevron-right" aria-hidden="true"></i></button>'
    },
  });
if(window.location.hash) {

  $("[href='"+window.location.hash+"']").trigger("click");
}
});
