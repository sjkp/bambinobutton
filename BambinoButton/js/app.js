﻿var app = {
    isYoutubePlayerReady: false,
    client: null,
    songs: null,
    audio: null,
    nowPlaying: null,
    animation: true,
    continuesPlay: false,
    initialize: function () {
     
        
        app.client = new WindowsAzure.MobileServiceClient("https://bambinobutton.azure-mobile.net/", "CYLhHjCyzQDkWKvtPhKdqPLUbYWJxl68");
        app.loadSongs(app.language.get());

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

        app.language.init();
        //$(window).on('resize', app.onWindowResize);
    },

    loadSongs: function(lan) {
        app.client.getTable('song').where(function (arr) {
            return this.language in arr;
        },lan).read().done(function (result) {
            app.songs = result;
            var ios = false;
            var p = navigator.platform;
            if (p === 'iPad' || p === 'iPhone' || p === 'iPod') {

                $('#bambinobutton').on('touchstart', app.onPlayClick);
                $('#bambinobutton').on('touchend', app.onPlayRelease);
            }
            else {

                $('#bambinobutton').mousedown(app.onPlayClick);
                $('#bambinobutton').mouseup(app.onPlayRelease);
            }
            $('#loading').hide();
            $('#bambinobutton').show();
            $('#continuesplay').on('click', app.onContinuesPlayClick);
            //app.onWindowResize();

        });
    },

    language: {
 
        get: function () {
            var lan = JSON.parse(localStorage.getItem("language"));
            if (lan == null || lan.length === 0) {
                lan = ["en-GB"];
            }
            return lan;
        },

        init: function () {
            var menu = $('#languagemenu');
            $.ajax({
                url: 'http://localhost:53217/api/Language', accept: "application/json;charset=utf-8", success: function (res) {
                    console.log(res);
                    menu.html(app.languageMenu(res));
                    $.each(app.language.get(), function (i, o) {
                        console.log(o);
                        $('#' + o).addClass('selected');
                    });
                                           
                    $('li', menu).click(function () {
                        var arr = app.language.get();
                        if ($('#'+this.id, menu).hasClass('selected'))
                        {                            
                            for (var i = arr.length - 1; i >= 0; i--)
                            {
                                if (arr[i] === this.id)
                                {
                                    arr.splice(i, 1);
                                }
                            }                         
                        }
                        else
                        {
                            arr.push(this.id);
                            console.log(arr);
                        }
                        localStorage.setItem("language", JSON.stringify(arr));
                        $('#' + this.id, menu).toggleClass('selected');
                        
                        console.log(this.id);
                        
                        app.loadSongs(app.language.get());
                    });
                }
            });
        },

       
    },    

    onContinuesPlayClick: function(event)
    {
        event.preventDefault;
        if (this.checked)
        {
            app.continuesPlay = true;
            setTimeout(app.onCurrentPosition, 1000);
        }
        else
        {
            app.continuesPlay = false;
        }
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
        that.css('margin-top', '40px');
        that.css('margin-bottom', '10px');
    },

    onPlayClick: function(event)
    {
        var that = $(this);
       // event.preventDefault();
        that.css('background-position', '-320px, 0px');
        that.css('margin-top', '50px');
        that.css('margin-bottom', '0px');

        var i = Math.floor((Math.random() * app.songs.length));
        app.nowPlaying = i;
        
        $('#label').html('Loading song');
        setTimeout(function() {
                    app.playAudio(app.songs[i].url);
                   }, 200);
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
            if (app.continuesPlay) {               
                setTimeout(app.onCurrentPosition, 1000);
            }
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
                return;
            }
        }
        app.client.getTable('playbacklog').insert({ songId: app.songs[app.nowPlaying].id, userAgent: navigator.userAgent });
    },

    onCurrentPosition: function()
    {
        if (app.audio != null) {
            if (typeof (app.audio['getCurrentPosition']) === 'function') {
                app.audio.getCurrentPosition(function (position) {
                    
                        if (position >= app.audio.getDuration() && app.continuesPlay || position == -1) {
                            var i = Math.floor((Math.random() * app.songs.length));
                            app.nowPlaying = i;
                            $('#label').html('Loading song');
                            app.playAudio(app.songs[i].url);
                        }
                    
                });
            }
            else {
                if (app.audio.currentTime >= app.audio.duration && app.continuesPlay) {
                    var i = Math.floor((Math.random() * app.songs.length));
                    app.nowPlaying = i;
                    $('#label').html('Loading song');
                    app.playAudio(app.songs[i].url);
                }
            }
        }
        if (app.continuesPlay) {
            /*app.audio.getCurrentPosition(function(position){
                                         $('#label').html(new Date() + ' *' +position );
                                         });*/
            setTimeout(app.onCurrentPosition, 1000);
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

app.languageMenu = Handlebars.compile($("#language-menu-tpl").html());
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