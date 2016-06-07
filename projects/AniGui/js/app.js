$(document).foundation();


// boilerplate
$(document).ready(function() {
    //initialize data on 0 and 100
    var set = $('.keyframe').filter('.perm');
    set.first().data({'left': '0%', 'top': '50%'});
    set.last().data({'left': '70%', 'top': '50%'});

    $('.styleDuration').on('change', function() {
        $(this).next('.display').html($(this).val());
    });

    $('#settingToggle').on('click', function() {
        $('.settingMenu').slideToggle(500);
        $('#sprite').toggleClass('hide');
    });

    $('.settingHeader').on('click', function() {
        $('.settingMenu').slideToggle(500);
        $('#sprite').toggleClass('hide');
    });

    $('#save').on('click', function() {
        var saveString = '';
        if (runState) {
            saveString = $('#animations').html();
        }else{
            saveString = buildAnimationString();
        }
        $('#saveDialog').append( saveString );
    });

});

$(document).on('closed.fndtn.reveal', '#saveDialog', function () {
    var modal = $(this);
    modal.children().last().remove();
});

function getSpriteSetting(inputName){
    return $('.style'+inputName).val();
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
    $('#sprite').css({
        left: ev.clientX+'px',
        top: ev.clientY+'px'
    });
}




// run animation functions
var reloadCounter = 0;
var runState = false;
function runAnimation(ref){
    // if it is not running, start
    // if it is running, stop
    if (runState) {
        runState = false;
        $(ref).html('Run');
        $('#animations').children().remove();
                
    }else{
        runState = true;
        $(ref).html('Stop');

        reloadCounter++;

        $('#animations').children().remove();

        aniString = buildAnimationString();
        
        $('#animations').append(aniString);
    }
}

function getKeyframes(){

    var aS = '';
    $('.keyframe').each(function(index, el) {
        var data = $(el).data();
        var percent = $(el).children().children('span').html();
        aS += percent + '%{left: '+data.left+';top: '+data.top+'}';
    });

    return aS;
}

function buildAnimationString(){
    var fS = '';
        fS += '<style type="text/css"> ';
        fS += '#sprite{';
        fS += 'animation-timing-function: '+getSpriteSetting('Timing')+';';
        fS += 'animation-duration: '+$('#slider').attr('data-slider')+'s;';
        fS += 'animation-iteration-count: '+getSpriteSetting('Iterations')+';';
        fS += 'animation-direction: '+getSpriteSetting('Direction')+';';
        fS += 'animation-name: AniGui'+reloadCounter+';';
        fS += '} ';
        fS += '@keyframes AniGui'+reloadCounter+'{';
        fS += getKeyframes();
        fS += '} ';
        fS += '</style>';
    return fS;
}




// prepare animation functions
function deselectKeyframes(){
    $('.keyframe').removeClass('selected');
}
function selectKeyframe(el){
    el.addClass('selected');
}
function getSelected(){
    return $('.keyframe').filter('.selected');
}

function addKeyframe(){
    var percent = $('#percentInput').val();
    keyframe = $('<li class="keyframe" onclick="modifyKeyframe(this)"><a href="#select" class="medium secondary button" ><span contenteditable="true">'+percent+'</span>%</a></li>');
    $('.keyframe').each(function(index, el) {
        var keyInd = parseInt( $(el).children().children('span').html() );
        if (keyInd < parseInt(percent)) {
            keyframe.insertAfter( $(el) );
            deselectKeyframes();
            selectKeyframe($(el).next());
        };
    });
}

function modifyKeyframe(el){
    deselectKeyframes();
    selectKeyframe($(el));
    var sprite = $('#sprite');
    var data = $(el).data();
    sprite.css({
        left: data.left ,
        top: data.top
    });
}

function setKeyframe(){
    //get sprite x and y
    var left = $('#sprite').css('left');
    var top = $('#sprite').css('top');

    //relative x and y
    left = parseInt(left)/window.innerWidth * 100 + '%';
    top = parseInt(top)/window.innerHeight * 100 + '%';

    //stuff into data on the keyframe li
    getSelected().data({
        'left': left,
        'top': top       
    })

    
}

function removeKeyframe(){
    getSelected().not('.perm').remove();
}
