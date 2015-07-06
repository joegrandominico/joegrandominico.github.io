    var item = 0;
var playlist = {};
var startTracktime = {};
var middleTracktime = {};
var timeupdater = {};
var trackFiftyPercent = {};
var trackBeforeFinish = {}; //new
var beforeFinishTime = {};  //new
var trackVideoStart = {};
var videotime = {};
var videoName = {};
var videoId = {};
var videos = {};
var playingPlayers = new Array();
$(window).load(function () {

    $('.trackVideo').each(function () {
        if ($(this).attr("URL") != undefined) {
            item++;
            var id = 'player' + item;
            var divForVideo = $(this);
            $(divForVideo).attr('id', id);
            $(divForVideo).attr('position', item);
            try {
                loadYouTubePlayer(id, this);
            }
            catch (e) {
            }
        }

    });

});

function updateTime() {
    var idx = 1; // event.target.id;
    jQuery.each(playingPlayers, function (idx) {

        if (playingPlayers[idx] != null) {
            videotime[idx] = playlist[idx].getCurrentTime(); //event.target.getCurrentTime();

            //console.log("Video= " + idx + " time=" + videotime[idx]);

            if (videotime[idx] > 3 && trackVideoStart[idx] == false) {
                trackVideoStart[idx] = true;
                //alert(videoName[idx]);
                trackVieoViews(videoName[idx], "Video Start");
		if ($('.videotrackingProduct').length > 0) {
                   // alert("PrVideoStart");
                    var activity = videoName[idx] + " Video Start";
                    var products = $.trim($('.breadcrumbs li:last').text());
                    trackProductDetails(activity, products);
                }
                // alert('trackin video start after 3 seconds');
            }
            if ((videotime[idx] > middleTracktime[idx]) && trackFiftyPercent[idx] == false) {
                trackFiftyPercent[idx] = true;
                trackVieoViews(videoName[idx], "Video 50%");
                //  alert('tracking 50% of video watch');

            }
            if ((videotime[idx] > beforeFinishTime[idx]) && trackBeforeFinish[idx] == false) {
                trackBeforeFinish[idx] = true;
                trackVieoViews(videoName[idx], "Video Complete");
                //alert('tracking 3 sec before video completes');
		 if ($('.videotrackingProduct').length > 0) {
                    //alert("PrVideoComplete");
                    var activity = videoName[idx] + " Video Complete";
                    var products = $.trim($('.breadcrumbs li:last').text());
                    trackProductDetails(activity, products);
                }

            }
        }


    });
}

function getVideoId(url) {

    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|watch_popup\?v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
        return match[2];
    }


}

loadYouTubePlayer = function (playerId, obj) {
    var idx = jQuery(obj).attr("position");
    // alert("idx=" + idx);
    // alert("Player Id" + playerId);
    startTracktime[idx] = 3000;
    timeupdater[idx] = null;
    trackFiftyPercent[idx] = false;
    trackVideoStart[idx] = false;
    trackBeforeFinish[idx] = false; //new
    videotime[idx] = 0;
    videoName[idx] = $(obj).attr("Title");
    // alert(idx);
    //  alert($(obj).attr("Title"));
    // alert($(obj).attr("URL"));



    videoId[idx] = getVideoId($(obj).attr("URL"));
    //alert(videoId[idx]);


    playlist[idx] = new YT.Player(playerId, {
        height: '260',
        width: '100%',
        videoId: videoId[idx],
        playerVars: { 'rel': 0, 'showinfo': 0, 'wmode': 'transparent' },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
    // alert(playlist[idx]);


}
function onPlayerReady(event) {
}
// when video ends
function onPlayerStateChange(event) {
    //alert("event id=" + event.target.id);
    //alert("idx"+event.target.a.attributes["position"].value);
if(typeof event.target.a !='undefined')
    var idx = event.target.a.attributes["position"].value;
else
var idx=1;
    // alert("onPlayerStateChange= " + idx);
    if (event.data === 1) {
        // alert('Video Playing');
        middleTracktime[idx] = playlist[idx].getDuration() / 2; //event.target.getDuration() / 2;
        //  alert("middle time:"+middleTracktime[idx]);
        //
        beforeFinishTime[idx] = playlist[idx].getDuration() - 3;  //new
        //   alert("time before 3 sec:" + beforeFinishTime[idx]);
        timeupdater[idx] = setInterval(updateTime, 100);
        playingPlayers[idx] = playlist[idx];
    }


    else if (event.data === 0) {
        //  alert('Video Ended');
        //                  trackVieoViews(videoName[idx], "Video Complete");
        playingPlayers[idx] = null; ;
        //alert('tracking video End');
    }
}


   
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       