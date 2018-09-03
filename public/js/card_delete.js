//alert("Hello! I am an alert box!!");
$(document).ready(function(){
    var c1, c2;
    var selected = false;
    /*
    $("#card01").click(function(){
        if ( c1 ) {
            animate("#card02", "slideInUp");
            animate("#card03", "slideInUp");
            setTimeout(function(){
                c1.appendTo( "#div02" );
                c2.appendTo( "#div02" );
                c1 = null;
                c2 = null;
            }, 1000);
        } else {
            animate("#card02", "slideOutDown");
            animate("#card03", "slideOutDown");
            setTimeout(function(){
                c1 = $( "#card02" ).detach();
                c2 = $( "#card03" ).detach();
            }, 1500);
        }
    });
    $("#card02").click(function(){
        if ( c1 ) {
            c1.appendTo( "#div02" );
            c2.appendTo( "#div02" );
            c1 = null;
            c2 = null;
        } else {
            animate("#card01", "slideOutDown");
            animate("#card03", "slideOutDown");
            setTimeout(function(){
                c1 = $( "#card01" ).detach();
                c2 = $( "#card03" ).detach();
            }, 1000);
        }
    });
    $("#card03").click(function(){
        if ( c1 ) {
            c1.appendTo( "#div02" );
            c2.appendTo( "#div02" );
            c1 = null;
            c2 = null;
        } else {
            animate("#card01", "slideOutDown");
            animate("#card02", "slideOutDown");
            setTimeout(function(){
                c1 = $( "#card01" ).detach();
                c2 = $( "#card02" ).detach();
            }, 1000);
        }
    });*/
    
   $("#card01").click(function(){
        $("#card01").addClass('selected');
        $("#card01").css('opacity', 1.0);
        $("#card02").css('opacity', 0.3);
        $("#card03").css('opacity', 0.3);
        $("#candidateId").val("card01");
    });
    $("#card02").click(function(){
        $("#card02").addClass('selected');
        $("#card02").css('opacity', 1.0);
        $("#card01").css('opacity', 0.3);
        $("#card03").css('opacity', 0.3);
        $("#candidateId").val("card02");
    });
    $("#card03").click(function(){
        $("#card03").addClass('selected');
        $("#card03").css('opacity', 1.0);
        $("#card01").css('opacity', 0.3);
        $("#card02").css('opacity', 0.3);
        $("#candidateId").val("card03");
    });
    $("#card101").click(function(){
        $("#card101").addClass('selected');
        $("#card101").css('opacity', 1.0);
        $("#card102").css('opacity', 0.3);
        $("#card103").css('opacity', 0.3);
        $("#partyId").val("card101");
    });
    $("#card102").click(function(){
        $("#card102").addClass('selected');
        $("#card102").css('opacity', 1.0);
        $("#card101").css('opacity', 0.3);
        $("#card103").css('opacity', 0.3);
        $("#partyId").val("card102");
    });
    $("#card103").click(function(){
        $("#card103").addClass('selected');
        $("#card103").css('opacity', 1.0);
        $("#card101").css('opacity', 0.3);
        $("#card102").css('opacity', 0.3);
        $("#partyId").val("card103");
    });
    // Animate
    function animate(element, animation){
        $(element).addClass('animated '+animation);
        var wait = setTimeout(function(){
          $(element).removeClass('animated '+animation);
        }, 1000);
      }

    
});