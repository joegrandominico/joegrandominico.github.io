jQuery.extend(jQuery.easing,
{
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	
});
var closeTimer;
$(window).load(function() {

  if(jQuery.cookie('ZipTooltip')=='true')
  {
  $('.zipcode-tooltip').css('display','none');
  }
  if(jQuery.cookie('ZipTooltip')===null)
    {
    jQuery.cookie('ZipTooltip','false',{ path: '/' });
    }
	$('.zipcode').addClass('up');
	
	$('html').on('click', function(e){
 		if(jQuery.cookie('ZipTooltipopen')=='true')
        {
        jQuery.cookie('ZipTooltipopen','false',{ path: '/' });
        closeTip();
        }
     });

	$('input.ziptext').on('focus', function(event){
	if(jQuery.cookie('ZipTooltip')=='false')
    {
	openTip();
    } 
    });
    if(jQuery.cookie('ZipTooltip')=='false')
    {
	openTip();
    } 
    $('.zipcode-tooltip a.zip-confirm').click(function(e)
    {
    e.preventDefault();
    jQuery.cookie('ZipTooltip','true',{ path: '/' });
    });
});

function openTip() {
    jQuery.cookie('ZipTooltipopen','true',{ path: '/' });
	//LET'S MAKE SURE WE'RE NOT IN THE MIDDLE OF SOMETHING...
	if(!$('.zipcode-tooltip').is(':animated')) {
		//CHECK TO SEE IF IT'S CLOSED:
		if(!$( ".zipcode-tooltip" ).hasClass('open')) {

			$( ".zipcode-tooltip" ).show().animate({
				opacity: 1,
				left: "-=70"
			}, 600, 'easeInOutQuad', function(){
				
				//RECOVER
				$(this).animate({
					left: "+=20"
				}, 800, 'easeInOutQuad', function(){
						//ANIMATION COMPLETE:
			
					//SET OPEN FLAG
					$( ".zipcode-tooltip" ).addClass('open');
			
					closeTimer = setTimeout(function(){
						//CLOSE AFTER 6000MS
						closeTip();
					}, 8000);
				});
				
			});
		}
	}
}

function closeTip() {
	//LET'S MAKE SURE WE'RE NOT IN THE MIDDLE OF SOMETHING...
	if(!$('.zipcode-tooltip').is(':animated')) {

		//WE'RE CLOSING EARLY, LET'S REMOVE THE TIMER SO IT DOESN'T ANIMATE AGAIN.
		clearTimeout(closeTimer);

		//CHECK TO SEE IF IT'S OPEN:
		if($( ".zipcode-tooltip" ).hasClass('open')) {
			//SO, LET'S CLOSE IT:
			$( ".zipcode-tooltip" ).animate({
				opacity: 0,
				left: "+=50"
			}, 1000, function(){
				//REMOVE OPEN FLAG:
				$( ".zipcode-tooltip" ).removeClass('open').hide();
			});
		}
	}
}