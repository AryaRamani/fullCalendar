({
	loadDataToCalendar :function(component,data){  
        //Find Current date for default date
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate();
        var currentDate = d.getFullYear() + '/' +
            (month<10 ? '0' : '') + month + '/' +
            (day<10 ? '0' : '') + day;
         
        var self = this;
        $('#calendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,basicWeek,basicDay'
            },
            selectable : true,
            defaultDate: currentDate,
            editable: true,
            eventLimit: true,
            events:data,
            dragScroll : true,
             droppable: true,
            weekNumbers : true,
  eventDrop: function(event, delta, revertFunc) {

    alert(event.title + " was dropped on " + event.start.format());

    if (!confirm("Are you sure about this change?")) {
      revertFunc();
    }
      else{
          var eventid = event.id;
          var eventdate = event.start.format();
          self.editEvent(component,eventid,eventdate);
      }

  },
            eventClick: function(event, jsEvent, view) {
             console.log(event.id);
              var editRecordEvent = $A.get("e.force:editRecord");
              editRecordEvent.setParams({
              "recordId": event.id
           });
           editRecordEvent.fire();
          },
            dayClick :function(date, jsEvent, view) {
                console.log(date.format());
                var datelist = date.format().toString().split('-');
                console.log(datelist[0]);
                console.log(parseInt(datelist[1])-1);
              var datetime = new Date(datelist[0],parseInt(datelist[1])-1,parseInt(datelist[2])+1,0,0,0,0);
                console.log(datetime);
             var createRecordEvent = $A.get("e.force:createRecord");
    createRecordEvent.setParams({
        "entityApiName": "Event",
        "defaultFieldValues": {
        'StartDateTime' :  datetime
        
    }
    });
    createRecordEvent.fire();
          },
            
            eventMouseover : function(event, jsEvent, view) {
            
          }
    });
    },
       
    
    formatFullCalendarData : function(component,events) {
        var josnDataArray = [];
        for(var i = 0;i < events.length;i++){
            var startdate = $A.localizationService.formatDate(events[i].StartDateTime);
            var enddate = $A.localizationService.formatDate(events[i].EndDateTime);
            josnDataArray.push({
                'title':events[i].Subject,
                'start':startdate,
                'end':enddate,
                'id':events[i].Id
            });
        }
        console.log('josnDataArray'+josnDataArray);
        return josnDataArray;
    },
     
    fetchCalenderEvents : function(component) {
         var action=component.get("c.getAllEvents");
       
         action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var data= response.getReturnValue();
                console.log(JSON.stringify(data));
                 var josnArr = this.formatFullCalendarData(component,response.getReturnValue());
                this.loadDataToCalendar(component,josnArr);
                component.set("v.Objectlist",josnArr);
           
            } else if (state === "ERROR") {
                                 
            }
        });
        
        $A.enqueueAction(action);
       
    }, 
    
    editEvent : function(component,eventid,eventdate){
         var action=component.get("c.updateEvent");
        console.log(eventdate);
         action.setParams({ eventid : eventid ,
                           eventdate : eventdate});

         action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
               console.log('updated');
           
            } else if (state === "ERROR") {
                                 
            }
        });
        
        $A.enqueueAction(action);

    }
})