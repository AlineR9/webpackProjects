
jQuery(document).ready(function () {
    $('body').bind('cut copy p contextmenu ondragstart', function (e) {e.preventDefault();});
    $('body').append('<style>@media print {body {display:none !important;}} body{-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;}</style>');
    //$(window).bind('keydown', 'ctrl+s', function () {return false;});
    $(document).on('keydown', function(e){
        if(e.ctrlKey && e.which === 83){
            e.preventDefault();
            return false;
        }
    });
    $('body img').attr('draggable', false);
    document.addEventListener('dragstart', function (e) {
        e.preventDefault();
    });
})
