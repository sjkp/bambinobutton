﻿var app = {
    isYoutubePlayerReady: false,
    baseUrl: 'https://bambinobutton.azurewebsites.net',
    client: null,
    songs: null,
    audio: null,
    products: [],
    nowPlaying: null,
    animation: false,
    continuesPlay: true,
    initialize: function () {
     
        app.initMenu();

        app.client = new WindowsAzure.MobileServiceClient("https://bambinobutton.azure-mobile.net/", "CYLhHjCyzQDkWKvtPhKdqPLUbYWJxl68").withFilter(function (request, next, callback) {
            request.headers.ProductKeys = JSON.stringify(app.products);
            next(request, callback);
        });
                
        $(window).on('hashchange', $.proxy(this.route, this));
        app.route();
        app.language.init();
        

        $('#handler-left').change(function () {
                
        });
        //$(window).on('resize', app.onWindowResize);
        if (typeof (inappbilling) != 'undefined') {
            inappbilling.init(function (success) {
                inappbilling.getPurchases(function (products) {
                    app.products = products;
                    app.loadSongs(app.language.get());
                }, function (err) {
                    alert('purchases' + JSON.stringify(err));
                    app.loadSongs(app.language.get());
                });
                },
                function (error) {
                    alert('inappbilling error' + JSON.stringify(error));
                    app.loadSongs(app.language.get());
                });
        }
        else
        {
            app.loadSongs(app.language.get());
        }
    },

    initMenu: function()
    {
        $('#right').click(function () {
            //$('#handler-right').prop('checked', !$('#handler-right').prop('checked'));
            $('#wrapper').toggleClass('right');
            $('#content').toggleClass('menuopen');
            $('#settings').toggleClass('menuopen');
        });
        $('#left').click(function () {
            //var that = $('#handler-left');
            //that.prop('checked', !that.prop('checked'));
            if ($('#menu').hasClass('menuopen')) {
                
                setTimeout(function () {
                    $('#settings').show();
                }, 500);
            }
            else {
                $('#settings').hide();
            }
            $('#wrapper').toggleClass('left');
            $('#content').toggleClass('menuopen');
            $('#menu').toggleClass('menuopen');
            
        });
        $('#settings a').click(function () {
            $('#wrapper').toggleClass('right');
            $('#content').toggleClass('menuopen');
            $('#settings').toggleClass('menuopen');
        });
        $(document).ready(function () {
            $('#settings').swipe({
                swipeRight: function (event, direction, distance, duration, fingerCount) {
                    
                    $('#wrapper').toggleClass('right');
                    $('#content').toggleClass('menuopen');
                    $('#settings').toggleClass('menuopen');
                },
                threshold: 25
            });
            $('#menu').swipe({
                swipeLeft: function (event, direction, distance, duration, fingerCount) {
                    if ($('#menu').hasClass('menuopen')) {

                        setTimeout(function () {
                            $('#settings').show();
                        }, 500);
                    }
                    else {
                        $('#settings').hide();
                    }
                    $('#wrapper').toggleClass('left');
                    $('#content').toggleClass('menuopen');
                    $('#menu').toggleClass('menuopen');
                },
                threshold: 25
            });
        });
    },

    route: function()
    {
        var hash = window.location.hash
           , main = $('#page-1')
           , viewname = hash.replace('#', '').split('?')[0];
        if (viewname == '')
        {
            viewname = "Index";
        }
        viewname = viewname + 'View';
        if (typeof (window[viewname]) != 'undefined') {
            if (app.currentView != null && typeof (app.currentView['unload']) != 'undefined') {
                app.currentView.unload(function () {
                    app.currentView = new window[viewname]();
                    main.html(app.currentView.render());
                });
            }
            else {
                app.currentView = new window[viewname]();
                main.html(app.currentView.render());
            }
            if (app.currentView != null && typeof (app.currentView['afterload']) != 'undefined')
            {
                app.currentView.afterload();
            }
        }       
    },

    loadSongs: function (lan) {
        if (lan.length == 0) {
            $('#nolanguage').show();
            $('#loading').hide();
            $('#bambinobutton').hide();
        }
        else {
            app.client.invokeApi('song', { method: 'POST', body: lan }).done(function (res) {
                app.songs = JSON.parse(res.response);
                $('#loading').hide();
                $('#nolanguage').hide();
                $('#bambinobutton').show();
                //app.onWindowResize();

            });
        }
    },

    language: {
 
        get: function () {
            var lan = JSON.parse(localStorage.getItem("language"));
            if (lan == null || lan.length === 0) {
                lan = [];
            }
            return lan;
        },

        init: function () {
            var menu = $('#languagemenu');
            //$.ajax({
            //    url: app.baseUrl + '/api/Language', accept: "application/json;charset=utf-8", success:
            app.client.getTable('languages').orderBy("languagelocal").read().done(function (res) {
            
                    menu.html(app.languageMenu(res));
                    $.each(app.language.get(), function (i, o) {
                        $('#' + o).addClass('selected');                       
                    });
                                           
                    $('li', menu).click(function () {
                        if (this.id == 'allsongs')
                        {
                            if ($('#' + this.id).hasClass('selected') == true)
                            {
                                //deselect all
                                $('li', menu).each(function (i, o) {
                                    var that = $(o);
                                    that.removeClass('selected');
                                    
                                });
                                localStorage.setItem("language", JSON.stringify([]));
                            }
                            else
                            {
                                //select all 
                                var arr = [];
                                $('li', menu).each(function (i, o) {
                                    var that = $(o);
                                    that.addClass('selected');
                                    if (o.id != 'allsongs') {
                                        arr.push(o.id);
                                    }
                                });
                                localStorage.setItem("language", JSON.stringify(arr));
                            }
                        }
                        else
                        {
                            var arr = app.language.get();
                            if ($('#' + this.id, menu).hasClass('selected')) {
                                for (var i = arr.length - 1; i >= 0; i--) {
                                    if (arr[i] === this.id) {
                                        arr.splice(i, 1);
                                    }
                                }
                            }
                            else {
                                arr.push(this.id);
                            }
                            localStorage.setItem("language", JSON.stringify(arr));
                            $('#' + this.id, menu).toggleClass('selected');
                        }

                        app.loadSongs(app.language.get());
                    });
                }
            );
        },

       
    },    

    onContinuesPlayClick: function(event)
    {
        event.preventDefault;
        if (this.checked)
        {
            app.continuesPlay = true;
            clearInterval(app.interval);
            app.interval = setInterval(app.onCurrentPosition, 1000);
        }
        else
        {
            app.continuesPlay = false;
            clearInterval(app.interval);            
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
        that.css('background-position', '-300px, 0px');
        that.css('margin-top', '48px');
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
        $('#page-1').removeClass('ani');
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
            clearInterval(app.interval);
            
        }
        else
        {
            var a = document.createElement('audio');
            if (!!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''))) {
                app.audio = new Audio(url);
                //.onplaying(app.setPlayingLabel);
                app.audio.play();
                $(app.audio).on('playing', app.setPlayingLabel);
                if (app.continuesPlay) {
                    //setTimeout(app.onCurrentPosition, 1000);
                    clearInterval(app.interval);
                    app.interval = setInterval(app.onCurrentPosition, 1000);
                }
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
                    
                    if ((position >= app.audio.getDuration() || position < 0) && app.continuesPlay) { //
                            var i = Math.floor((Math.random() * app.songs.length));
                            app.nowPlaying = i;
                            $('#label').html('Loading song');
                            clearInterval(app.interval);
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
            //app.audio.getCurrentPosition(function(position){
            //                             $('#label').html(new Date() + ' *' +position );
            //                             });
            //setTimeout(app.onCurrentPosition, 1000);
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
            if (app.continuesPlay) {

                app.interval = setInterval(app.onCurrentPosition, 1000);
            }
        }
        
    },

    setPlayingLabel: function()
    {
        var i = app.nowPlaying;
        $('#label').html(app.songs[i].title);
        if (app.animation) {
            $('#page-1').addClass('ani');
        }
    },

    onAudioError: function(error)
    {
        //console.log(error);
    },

    isMobile: function ()
    {
        return navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/);
    }
};

app.languageMenu = Handlebars.compile($("#language-menu-tpl").html());


if (app.isMobile()) {
    document.addEventListener('deviceready', function () {
        console.log('initialize in device ready');
        app.initialize();
    });
} else {
    app.initialize(); //this is the browser
}