
function storeValue(name, value, cookiePath) {
    var cookieEnabled = (navigator.cookieEnabled) ? true : false;
   // alert(cookieEnabled);
    if (cookieEnabled) {
        
        var val = jQuery.cookie(name);
        if (val == null) val = "";
       // alert(val.indexOf(value));
        if (val.indexOf(value) < 0) 
        {
            if (val.length > 0) {
                if (val.charAt(val.length - 1) != ',') {
                    val = val + "," + value + ","
                }
                else {
                    val = val + value + ","
                };
            }
            else {
                val = value + ",";
            }
            jQuery.cookie(name, val, {
                path: '/'
                //(default: path of page that created the cookie).
            });
        }
    }
    else {
        //Added to handle IE 9 ajax cache issue
        var rnd = Math.random() * 100;
        jQuery.ajax({
            type: "GET",
            url: "/setSession.aspx?v=" + rnd,
            cache: false,
            data: ({ name: name, value: value }),
            async: false,
            success: function (data) {
                remote = data;
                //alert(remote);
            }
        });
    }
}
function removeValue(name, value, cookiePath) {
    var cookieEnabled = (navigator.cookieEnabled) ? true : false;
    if (cookieEnabled) {
        var val = jQuery.cookie(name);
        var indexofVal = val.indexOf(value);
        if (indexofVal > -1) {
            val = val.replace(value + ",", "");
        }
        jQuery.cookie(name, val, {
            path: '/'
            //(default: path of page that created the cookie).
        });
    }
    else {
        //Added to handle IE 9 ajax cache issue
        var rnd = Math.random() * 100;
        jQuery.ajax({
            type: "GET",
            url: "/setSession.aspx?v=" + rnd,
            cache: false,
            data: ({ name: name, value: value }),
            async: false,
            success: function (data) {
                remote = data;
                //alert(remote);
            }
        });
    }
}

function RedirectFromProductDetails(url, shingleId) {
    storeValue("ShingleId", shingleId, "/");
    document.location = url;
}
//Category cookie will be use to identify menu option selected by the user
function navigateToURLChangePersona(userPersona) {
    jQuery.cookie("category", null, { path: '/' });
    jQuery.cookie("category", userPersona, { expires: 7, path: '/' });
    jQuery.cookie("categorySwitch", null, { path: '/' });
    jQuery.cookie("categorySwitch", window.location.href, { expires: 7, path: '/' });
    location.reload(true);
}
function navigateToURL(url, name) {
    jQuery.cookie("category", name, { path: '/' });
    document.location = url;
}
function navigateTo(url) {
    //alert(url);
    document.location = url;
}

//Following function will work for all: used in showing the specified tab with # in URL.
$(window).load(function () {
    var hash = window.location.hash;
    var arr = ["#product-details", "#technical-docs", "#applicable-standards"];
    if (jQuery.inArray(hash, arr) > -1) {
        for (var i = 0; i < arr.length; i++) {
            $(arr[i]).css("display", "none");
            if ($('a[href="' + arr[i] + '"]').hasClass("current")) {
                $('a[href="' + arr[i] + '"]').removeClass("current");
            }
        }
        $('a[href="' + hash + '"]').addClass("current");
        $(hash).css("display", "block");
    }
});
   $(document).ready(function () {

var shingle = $(".shingle-item");

var windowheight = $(window).height();

var windowwidth = $(window).width();

jQuery.each(shingle, function (i, val) {

if (parseInt(windowheight) > 600 && parseInt(windowwidth)>600)

$(this).children().find(".product-shot img").css('max-height', parseInt($(this).height()) - 

35);

});

});

