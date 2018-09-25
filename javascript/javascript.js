//declare initial btn array and empty arrays (for favorites)
var btnArr = ['Trending', 'Cats', 'Dogs', 'Hacking', 'Computers']
var favArrStill = []
var favArrAn = []
var favArrR = []

var pullFav = false

//addBtn function - called after add button is clicked
function addBtn() {
    $('#btnCup').empty()
    for (j = 0; j < btnArr.length; j++) {
        var newBtn = $('<span>' + btnArr[j] + '</span>')
        newBtn.attr('data-value', btnArr[j])
        newBtn.addClass('btnSearch')
        $('#btnCup').append(newBtn)
    }
}

//when anything with the btn class is clicked, callG (the GIPHY API) with the data-value attribute
$(document).on('click', '.btnSearch', function () {
    $('#emptyFav').css('visibility', 'hidden')
    pullFav = false
    $("#lbltxt").text('Showing GIFs related to ' + $(this).attr('data-value') )
    callG($(this).attr('data-value'))

});

//when submit is hit (for adding buttons to the top), push the trimed value to button array, call the addBtn function (refreshes the buttons displayed)
$('#submit').on('click', function (e) {
    e.preventDefault()
    pullFav = false
    var newSearch = $('#txtInput').val().trim()
    btnArr.push(newSearch)
    addBtn()
    $("#lbltxt").text('Showing GIFs related to ' + newSearch)
    callG(newSearch)

});
$('#emptyFav').on('click', function (e) {
    e.preventDefault()
    favArrStill = []
    favArrAn = []
    favArrR = []
    $('#imgCup').empty();
    localStorage.clear();
    location.reload();

});
//When you click the favInd class (the hearts that appear when hovering over a gif), add favSel class, pass data attributes to arrays (for when user clicks the pull favorites button)
$(document).on('click', '.favInd', function () {

    
    //if favorite is already selected, remove selected class
    if ($(this).attr('class') === 'favInd favSel') {
        $(this).removeClass('favSel')

        //determine location in array
        curLo = favArrStill.indexOf($(this).attr('data-still'))
        console.log(curLo)

        //remove at determined location
        favArrStill.splice(curLo, 1)
        favArrAn.splice(curLo, 1)
        storeFav()
        if(pullFav===true){
            pullFavImgs()
        }

        //if there are no more favorite images, reload page (pull up trending content)
        if (favArrStill.length==0){
            $("#pullFavs").css('visibility','hidden') 
        }
        return
    }

    //add selected class
    $(this).addClass('favSel')

    //add to array
    favStill = $(this).attr('data-still')
    favAn = $(this).attr('data-animate')
    rating = $(this).attr('data-rating')
    favArrStill.push(favStill)
    favArrAn.push(favAn)
    favArrR.push(rating)

    //make sure favs button is visible
    $("#pullFavs").css('visibility','visible') 

    //call function to locally store variables
    storeFav()
});

//when you click the pull favorite buttons, empty to image container (that contains all images), loop through the favorites loops, add data elements
$('#pullFavs').on('click', pullFavImgs)

//calls API, adds data elements to them (still and animate), pushes them to array
function callG(q) {
    var url = 'https://api.giphy.com/v1/gifs/search?api_key=XlwqxAzE2xK126PVoeidYW39X9mt4Du6&q=' + q + '&limit=25&offset=0&rating=G&lang=en'
    $.ajax({
        url: url,
        method: 'GET'
    }).then(function (res) {
        $('#imgCup').empty()
        for (i = 0; i < res.data.length; i++) {
            var still = res.data[i].images.downsized_still.url
            var an = res.data[i].images.downsized.url
            var rating = res.data[i].rating.toUpperCase()
            pullImgs(still, an, rating)
        }
    });
};
//function to display images on page
function pullImgs(still, an, rating) {
    var imgBox = $('<div>')
    imgBox.addClass('imgBox')
    var p = $('<div>')
    p.addClass('rating')
    p.text('Rating: ' + rating)
    var newImg = $('<img>')
    newImg.addClass('imgs')
    newImg.attr({
        src: still,
        'data-still': still,
        'data-animate': an,
        'data-state': 'still',
        'data-rating': rating
    })

    var favInd = $('<img>')
    favInd.attr({
        src: 'images/heart.png',
        class: 'favInd',
        'data-still': still,
        'data-animate': an,
        'data-rating': rating
    })
    if (favArrStill.indexOf(still) !== -1) {
        favInd.addClass('favSel')
    }

    imgBox.append(favInd)
    imgBox.append(p)
    imgBox.append(newImg)
    $('#imgCup').append(imgBox)

}
//if image is clicked, change status to and from still and animate
$(document).on('click', '.imgs', function () {
    var state = $(this).attr('data-state')
    console.log(state)
    if (state === 'still') {
        $(this).attr('src', $(this).attr('data-animate'))
        $(this).attr('data-state', 'animate')

    }
    if (state === 'animate') {
        $(this).attr('src', $(this).attr('data-still'))
        $(this).attr('data-state', 'still')
    }


});

function pullFavImgs(){
    $("#lbltxt").text('Favorite Images')
    pullFav = true
    $('#imgCup').empty()
    $('#emptyFav').css('visibility', 'visible')
    for (i = 0; i < favArrStill.length; i++) {
        pullImgs(favArrStill[i], favArrAn[i], favArrR[i])
    }
}
//function for locally storing favorite selections
function storeFav() {
    localStorage.clear()
    localStorage.setItem("favStill", JSON.stringify(favArrStill));
    localStorage.setItem("favAn", JSON.stringify(favArrAn));
    localStorage.setItem("favR", JSON.stringify(favArrR));
}

//on page load grab stored data (as an array)
favArrStill = JSON.parse(localStorage.getItem('favStill'))
favArrAn = JSON.parse(localStorage.getItem('favAn'))
favArrR = JSON.parse(localStorage.getItem('favR'))

//if data is not an array (is null), create empty arrays
if (!Array.isArray(favArrStill)) {
    favArrStill = []
}
if (!Array.isArray(favArrAn)) {
    favArrAn = []
}
if (!Array.isArray(favArrR)) {
    favArrR = []
}
if (favArrStill.length==0){
    $("#pullFavs").css('visibility','hidden')
}
//call button to add default buttons
addBtn()

callG('trending')