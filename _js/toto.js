/* ------ jQuery Plugin: Scroll to Top ------ */
$(function(){
  $.fn.scrollToTop=function(options){
    if(options.speed){var  speed=options.speed;}else{var speed="slow";}
    if(options.ease){var  ease=options.ease;}else{var ease="jswing";}
    if(options.start){var  start=options.start;}else{var start="0";}
    var  scrollDiv=$(this);$(this).hide().removeAttr("href");
    if($(window).scrollTop()>start){
      $(this).fadeIn("slow");}
      $(window).scroll(function(){
        if($(window).scrollTop()>start){
          $(scrollDiv).fadeIn("slow");
        } else{
          $(scrollDiv).fadeOut("slow");
        }
     });
     $(this).click(function(event){
       $("html,  body").animate({scrollTop:"0px"},speed,ease);
   });
  }
});

$(document).ready(function(){
  $("#IDdubouton").scrollToTop({
    speed:1800,
    ease:"easeOutBounce",
    start:250});
})