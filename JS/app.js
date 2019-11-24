// trenutno aktivan menu item 
var current_item = 0;

// jQuery stuff
jQuery(document).ready(function($) {

	// Switch section
	$("a", '.glavniMeni').click(function() 
	{
		if( ! $(this).hasClass('active') ) { 
			current_item = this;
			
		}
		return false;
	});		
});
