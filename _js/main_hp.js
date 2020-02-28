  // Script page d'accueil
  
$(window).load(function() {
  $('.flexslider').flexslider({
    animation: "slide",
    controlNav: false,
    controlsContainer: $(".custom-controls-container"),
    customDirectionNav: $(".custom-navigation a")
  });
});

$('.sec-4 .container .owl-carousel').owlCarousel({
  loop:true,
  margin:10,
  responsiveClass:true,
  responsive:{
      0:{
          items:1,
          nav:true
      },
      600:{
          items:1,
          nav:false
      },
      1000:{
          items:1,
          nav:true,
          loop:false
      }
  }
});

$('.container #owl-slide-1').owlCarousel({
  loop:true,
  margin:43,
  
  nav:true,
  responsive:{
      0:{
          items:1
      },
      600:{
          items:2
      },
      1000:{
          items:3
      }
  }
});

$('.sec-3 #owl1').owlCarousel({
  loop:true,
  margin:10,
  nav:false,
  center:true,
  responsive:{
      0:{
          items:1
      },
      600:{
          items:3
      },
      1000:{
          items:4
      }
  }
});

$('.sec-7 .container #owl-c2').owlCarousel({
  loop:true,
  margin:40,
  nav:true,
  responsive:{
      0:{
          items:1
      },
      600:{
          items:2
      },
      1000:{
          items:3
      }
  }
});

$(function(){
    $("#monBouton").click(function(){
        $("html, body").animate({scrollTop: 0},"slow");
    });
   
  });

  var btn = document.querySelector(".sec-btn");
  btn.style.display = "none";
  document.querySelector('body').onscroll = function(){
    if (window.scrollY > 1500)
    {
      btn.style.display = "block";
    }
    else {
      btn.style.display = "none";
    }
  };