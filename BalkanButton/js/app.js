var app = {
    isYoutubePlayerReady: false,
    client: null,
    songs: null,
    initialize: function () {
        app.setupYoutube();
        $('#play').click(app.onPlayClick)
        app.client = new WindowsAzure.MobileServiceClient("https://balkanbutton.azure-mobile.net/", "eAJkLpuPWURCLbufdwDfoJwKUbngAH81");
        app.client.getTable('song').read().done(function (result) {
            app.songs = result;
        });
    },
    onPlayClick: function(event)
    {
        event.preventDefault();
        if (app.songs == null)
        {
            app.loadVideo('FZZJeMKJV3M');
        }
        else
        {
            var i = Math.floor((Math.random() * app.songs.length));
            $('#label').html(app.songs[i].title);
            app.loadVideo(app.songs[i].ytid, 20, "small");
            $('body').addClass('ani');
        }
    },

    stopVideo: function () {
        if (ytplayer) {
            ytplayer.stopVideo();
            
        }
    },

    loadVideo: function (id) {        
        if (ytplayer && app.isYoutubePlayerReady) {
            ytplayer.loadVideoById(id);
        }

    },


    viewportResizing: function () {
        var obj = $('#ytplayer');
    },

    setupYoutube: function () {
        var tag = document.createElement('script');
        tag.src = "//www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
};

app.initialize();

/* youtube player */
function onYouTubeIframeAPIReady() {
    var height = 300;
    var width = 300;
    ytplayer = new YT.Player('ytplayer', {
        height: height,
        width: width,
        wmode: 'transparent',
        //videoId: videoID,
        playerVars: { 'wmode': 'transparent' },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        }
    });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    app.isYoutubePlayerReady = true;
    //setInterval(updatePlayerInfo, 250);
    //updatePlayerInfo();
    //loadVideo(videoID); auto start playing
}

// This function is called when an error is thrown by the player
function onPlayerError(errorCode) {
    alert("An error occured of type:" + errorCode);
}

// This function is called when the player changes state
function onPlayerStateChange(event) {
    //var elm = $('#playerstate');
    //elm.text('State: ' + event.data);
    //if (ytplayer && (event.data == 0 || (event.data = ! "-1" && ytplayer.getCurrentTime() == ytplayer.getDuration()))) {
    //    //end of video load next in queue
    //    var id = $(getVideoQueue()[nextToPlayFromQueue]).data('ytid');
    //    if (id != null) {
    //        loadVideo(id);
    //        nextToPlayFromQueue = nextToPlayFromQueue + 1;
    //    }
    //}
}