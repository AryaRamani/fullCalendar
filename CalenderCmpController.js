({
	 afterScriptsLoaded: function(cmp,evt,helper){
         
         helper.fetchCalenderEvents(cmp);
        
    },
    
     handleClick : function(component, event, helper){ 
      
         var buttonstate = component.get("v.buttonstate");
         component.set("v.buttonstate",!buttonstate);
         if(!buttonstate){
          $("#listcalendar").show();
         $("#calendar").hide();
         $('#listcalendar').fullCalendar({
        	defaultView: 'listWeek',
             listDayFormat : true,
             events : component.get("v.Objectlist")
		});
        
         }
         else{
              $("#calendar").show();
           $("#listcalendar").hide();   
             helper.fetchCalenderEvents(component);
         }
        
    },

})
