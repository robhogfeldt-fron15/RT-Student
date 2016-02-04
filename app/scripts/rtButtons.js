/* global Firebase */
/* global Firebase */
var rootUrl = 'https://rt-student.firebaseio.com/';
var ref = new Firebase('https://rt-student.firebaseio.com/rtButtons');
var redBtnRef = ref.child('red');


export function redBtn(e) {

    if ($(e).hasClass('active'))
        e.preventDefault();
    //Increment count by 1
    var count = parseInt($('#redBtnCount').text());
    $('#redBtnCount').text(count + 1);
    redBtnRef.set({
        isActive: "true",
        count: count
    });
    $('.card.summary-inline.red').addClass('active');
};





redBtnRef.on('child_changed', function (snapshot) {
    console.log(snapshot.val());
    timer();

});

redBtnRef.once('value', function (snapshot) {
    redBtnRef.set({
        isActive: "false",
        
    });
    $('#redBtnCount').text("0");
});






function timer() {
    setTimeout(disable, 3000);
    function disable() {


        redBtnRef.set({
            isActive: "false",
            count: "0"
        });

        $('#redBtnCount').text("0");
        $('.card.summary-inline.red').removeClass('active');
    };



}

// export { redBtn }