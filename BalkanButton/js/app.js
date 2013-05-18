﻿var app = {
    isYoutubePlayerReady: false,
    client: null,
    songs: null,
    audio: null,
    nowPlaying: null,
    animation: true,
    initialize: function () {
     
        
        app.client = new WindowsAzure.MobileServiceClient("https://balkanbutton.azure-mobile.net/", "eAJkLpuPWURCLbufdwDfoJwKUbngAH81");
        app.client.getTable('song').read().done(function (result) {
            app.songs = result;
            if (Modernizr.touch) {
                $('#button').on('touchstart', app.onPlayClick);
                $('#button').on('touchend', app.onPlayRelease);
            }
            else {
                $('#button').mousedown(app.onPlayClick);
                $('#button').mouseup(app.onPlayRelease);
            }
            $('#loading').hide();
            $('#button').show();
            app.onWindowResize();

        });

        $('#animation').click(function () {
            var that = $(that);
            if (this.checked)
            {
                app.animation = true;
                $('body').addClass('ani');
            }
            else
            {
                app.animation = false;
                $('body').removeClass('ani');
            }
        });

        
        $(window).on('resize', app.onWindowResize);
    },

    onWindowResize: function()
    {
        var wrapper = $('#wrapper');

        var h = $(window).height() - wrapper.height();
        wrapper.css('margin-top', h / 2 + 'px');
    },

    onPlayRelease: function(event)
    {
        var that = $(this);
        event.preventDefault();
        that.css('background-position', '0px, 0px');
        that.css('margin-top', '80px');
        that.css('margin-bottom', '10px');
    },

    onPlayClick: function(event)
    {
        var that = $(this);
        event.preventDefault();
        that.css('background-position', '-355px, 0px');
        that.css('margin-top', '90px');
        that.css('margin-bottom', '0px');

        var i = Math.floor((Math.random() * app.songs.length));
        app.nowPlaying = i;
        $('#label').html('Loading song');
        app.playAudio(app.songs[i].url);
        //console.log('starting');

    },

    playAudio: function(url)
    {
        $('body').removeClass('ani');
        if (app.audio != null)
        {
            if (typeof(app.audio["stop"]) === 'function')
            {
                app.audio.stop();
            }
            else if (typeof(app.audio['pause']) === 'function')
            {
                app.audio.pause();
                app.audio = null;
            }
        }
        if (typeof (Media) != 'undefined')
        {
            app.audio = new Media(url, app.onAudioSuccess, app.onAudioError, app.onAudioStatus);
            app.audio.play();
        }
        else
        {
            var a = document.createElement('audio');
            if (!!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''))) {
                app.audio = new Audio(url);
                //.onplaying(app.setPlayingLabel);
                app.audio.play();
                $(app.audio).on('playing', app.setPlayingLabel);
            }
            else
            {
                //not support for mp3 playback.
                $('#label').text('Your browser does not support mp3 audio, try Chrome or Internet Explorer');
            }
        }
    },

    onAudioSuccess: function()
    {
        //console.log('audio success');
    },

    onAudioStatus: function(mediaStatus)
    {
        //console.log(mediaStatus);
        if (Media.MEDIA_RUNNING == mediaStatus)
        {
            app.setPlayingLabel();
        }
        
    },

    setPlayingLabel: function()
    {
        var i = app.nowPlaying;
        $('#label').html(app.songs[i].title);
        if (app.animation) {
            $('body').addClass('ani');
        }
    },

    onAudioError: function(error)
    {
        //console.log(error);
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
    //console.log("An error occured of type:" + errorCode);
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