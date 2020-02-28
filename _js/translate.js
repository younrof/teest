function translateFunction(selectedlanguage, lang){
    var $frame = $('.goog-te-menu-frame:first');
    $('header .header_right .lang ul li a.selected').removeClass('selected');
    $('.' + selectedlanguage + '').addClass('selected');
    $frame.contents().find('.goog-te-menu2-item span.text:contains(' + lang + ')').click();
    window.location.hash = 'googtrans(' + selectedlanguage.toUpperCase() + ')';
}

window.googleTranslateElementInit = function(){
    new google.translate.TranslateElement({pageLanguage: window.googleTranslateElementInitParams.lang, layout: google.translate.TranslateElement.InlineLayout.SIMPLE, multilanguagePage: true}, 'google_translate_element');
    $("#google_translate_element").hide();
    var _googleTransTimerCnt=0;
    var _googleTransTimerOut=10;
    var _googleTransTimer = setInterval(function(){
        var $frame = $('.goog-te-menu-frame:first');
        if($frame.contents().find('.goog-te-menu2-item span.text:contains(' + window.googleTranslateElementInitParams.lang + ')').length){
            translateFunction(window.googleTranslateElementInitParams.selectedlanguage, window.googleTranslateElementInitParams.lang);
            clearInterval(_googleTransTimer);
        }else if(_googleTransTimerCnt > _googleTransTimerOut){
            clearInterval(_googleTransTimer);
        }
        _googleTransTimerCnt++;
    }, 400);
};

window.loadGoogleTranslate = function(selectedlanguage, lang){
    if ($('#google_translate_element').children().length == 0) {
        window.googleTranslateElementInitParams={selectedlanguage:selectedlanguage, lang:lang};
        var googleTranslateScript = document.createElement('script');
        googleTranslateScript.type = 'text/javascript';
        googleTranslateScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        googleTranslateScript.async = true;
        (document.getElementsByTagName('body')[0] || document.getElementsByTagName('head')[0]).appendChild(googleTranslateScript);
    } else {
        $("#google_translate_element").hide();
        translateFunction(selectedlanguage, lang);
    }
};