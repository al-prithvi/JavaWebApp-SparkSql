//Global variables

var x_opt = '';
var y_opt = '';

l = [];
lab = [];

var tab_opt = '';
var col_opt = '';

var myChart; //echart js canvas

var obj_month = JSON.parse('\
	[{"column":"oct16"},\
	 {"column":"nov16"},\
	 {"column":"dec16"},\
	 {"column":"jan17"},\
	 {"column":"feb17"},\
	 {"column":"mar17"},\
	 {"column":"apr17"},\
	 {"column":"may17"},\
	 {"column":"jun17"},\
	 {"column":"jul17"},\
	 {"column":"aug17"},\
	 {"column":"sep17"},\
	 {"column":"oct17"},\
	 {"column":"nov17"},\
	 {"column":"dec17"},\
	 {"column":"jan18"},\
	 {"column":"feb18"},\
	 {"column":"mar18"}\
	]');


 $(function(){

    $(".menu1 a").click(function(){

      $("#dropdownMenuButton:first-child").text($(this).text());
      $("#dropdownMenuButton:first-child").val($(this).text());
      x_opt = $(this).text();
      console.log(x_opt);

   });
    
    $(".menu2 a").click(function(){

      $("#dropdownMenuButton2:first-child").text($(this).text());
      $("#dropdownMenuButton2:first-child").val($(this).text());
      y_opt = $(this).text();
      console.log(y_opt);

   });


});


function removeHash () { 
    history.pushState("", document.title, window.location.pathname
                                                       + window.location.search);
}			
//function for submit button

function submitquery(){
	//check whether all the url values are filled
	console.log("values of variables:")
	
	if(myChart){
		lab=[];
		l = [];
		createChart();
	}
	
	if (x_opt == '' || col_opt == '') {
		$("#subQ").removeClass('btn-primary').addClass('btn-danger');
		//$("#subQ").addClass('btn-danger');

		$("#subQmsg").removeClass('alert-success').addClass('alert-danger');
		$("#subQmsg").html("<strong>Error</strong> : Please make the 2 selections")
	}
	else {
		$("#subQ").removeClass('btn-danger').addClass('btn-primary');
		$("#subQmsg").removeClass('alert-danger').addClass('alert-success');
		$("#subQmsg").html("<strong>Success</strong> : Query submitted")
		console.log("s: "+x_opt+" "+col_opt);

		//make query:
		var request = new XMLHttpRequest();
		var requestUrl = 'spark?val='+col_opt+'&label='+x_opt;
		request.open('GET', requestUrl, true);
		console.log(request.responseText)
		console.log("Testing console log")

		request.onload = function () {
			// begin accessing JSON data here
			console.log(request.responseText)
			var data = JSON.parse(this.response);
			//var data = this.response;
			console.log(data)
			//l = data;
			l = [];
			var i;
			for (i=0; i<data.length-2; i++) { //Gini and Theil index last two
				l.push(data[i]);
			}
			//data[i] has the gini index now
			console.log(data[i]);
			lab = [];
			/*for (var i = 0; i < data.length; i++) {
				console.log(data[i].dma_code + ' is a ' + data[i].count + '.'); //-------
				l.push(data[i].count);
				lab.push(data[i].dma_code);
			}*/
			console.log(data);
			console.log('again try');
			console.log(l);
			
			//myChart.update();
			document.getElementById('graph').style.display = "block";
			document.getElementById('dwn').style.display = "block";
			
			createChart();
			var div = document.getElementById('ixMsg');
			div.innerHTML = '<strong>Gini Index : </strong>'+data[i].y.toPrecision(3)+'<br><strong>Theil Index : </strong>'+data[i+1].y.toPrecision(3);
			
			//theil index 
			console.log('Theil index display: ',data[i+1].y.toPrecision(3));
			
			window.localStorage.setItem("gini", data[i].y.toPrecision(3)  );
			window.localStorage.setItem("theil", data[i+1].y.toPrecision(3)  );
			window.location.hash = '#myChart';
			removeHash();
		}
		
		//****
		request.send();
		console.log("outside");
		console.log(lab);


	}
}


var ctx;
var l2 = [{
                "x": 0,
                "y": 0
            }, {
                "x": 100,
                "y": 100
            }];
function createChart(){
	
	//**** chart code
	ctx = document.getElementById("myChart");
	ctx.style.backgroundColor = 'white';
	
	if(myChart){
		myChart.destroy();
	}
	
	myChart = new Chart(ctx, {
	    type: 'scatter',
	    data: {
	        datasets: [{
	            label: 'consumption inequity',
	            data: l,
				borderColor: "blue",
	            borderWidth: 3,
				showLine: true,
				fill:false
	        },{
	            label: 'ideal',
	            data: l2,
				borderColor: "#3cba9f",
	            borderWidth: 3,
				showLine: true,
				fill:false
	        }]
	    },
	    options: {
			title : {
				display: true,
				text: 'Lorenz Curve (consumption)'
			},
	        scales: {
				yAxes: [{
					scaleLabel: {
	                	display:true,
	                	labelString: "cumulative consumption percentile"
					}
				}],
	            xAxes: [{
					scaleLabel: {
						display:true,
						labelString: "cumulative population percentile"
					},
	                type: 'linear',
					position: 'bottom'
	            }]
	        },
			responsive: true
	    }
	});
}




function track_click_element(clicked_id){
	tab_opt = clicked_id;
	console.log("button pressed : "+tab_opt);

	//change color of clicked button (table)
	/*
	
	if (tab_opt == 'lorenz'){
		$("#thiel").removeClass('btn-primary').addClass('btn-success');
	}
	else {
		$("#lorenz").removeClass('btn-primary').addClass('btn-success');
	}
	*/
	$("#"+tab_opt).removeClass('btn-success').addClass('btn-primary');

	if(myChart){
		lab=[];
		l = [];
		createChart();
	}
	
	x_opt = 'lorenz';
	y_opt = '';
	//$("#"+tab_opt).removeClass('alert-danger').addClass('alert-success');

}


function plotLorenz(){

	var table = document.getElementById("month_table");
	table.innerHTML = '<tr></tr>';

	employee_data = '';
	//refresh selected options
	
    employee_data +='<tr>';
    //employee_data +='<th>Name</th>';
    //employee_data +='<th>Address</th>';
    employee_data +='</tr>';

	//obj.forEach(process_fill)
	generate_cells(obj_month);
	$('#month_table').append(employee_data)

    //var table = document.getElementById("employee_table");
    //called function for this
    record_clicks_for_cells(table);
    //clear both data for next click
    employee_data = '';
   	
}

//generate cells after table is clicked
function generate_cells(objd){
	console.log(objd.length);
	var i = 0;
	employee_data += '<tr>';
	objd.forEach(function(r){
		if (i<8){ i++; 		
				employee_data += '<td id="colcell">'+r.column+'</td>';
		}
		else { i=1; 
				employee_data += '</tr>';
				employee_data += '<tr>';
				employee_data += '<td id="colcell">'+r.column+'</td>';
		}
		console.log(i);
		console.log(r.column);
	});
	employee_data += '</tr>';

}

function record_clicks_for_cells(table_name){

    var rows = table_name.getElementsByTagName("tr");
    console.log(table_name.id)

    //get which element is clicked from 'selected table'
    for (i = 1; i < rows.length; i++) {
        row = table_name.rows[i];
        for (j = 0; j < row.cells.length; j++){
        	cell = row.cells[j];
        	// *****ONCLICK FUNCTION FOR each cell
        	cell.onclick = function(){
                          var cell2 = this;//.getElementsByTagName("td");
                          var id = cell2.innerHTML;
                          var tabid = '#'+ table_name.id +' tr td';
						  if ($(this).hasClass('highlight')) {
							  console.log("trying t oremove ");
							  col_opt = '';
							  agg_opt = '';
							  key_opt = '';
							  $(this).removeClass('highlight');
							  return;
						  }
						  
                          $(tabid).removeClass('highlight');
                          $(this).addClass('highlight')
                          if(this.id == 'colcell'){
                          	col_opt = id;
                          }
                          console.log(id);
            };
        }

    }
}


var popCounter = 0;
function popUp(){
	
	window.localStorage.setItem("l2", JSON.stringify(l2));
	
	window.localStorage.setItem("l", JSON.stringify(l));

	var winName = 'myPopupSpec'+(++popCounter);
	
	 window.open('popupSpec.html', winName,'width=800,height=800,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,copyhistory=no,resizable=yes');
	 return false;
}