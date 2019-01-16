//Global variables

var x_opt = '';
var y_opt = '';

l = [];
lab = [];

var myChart; //echart js canvas

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



//function for submit button

function submitquery(){
	//check whether all the url values are filled
	console.log("values of variables:")
	
	if (x_opt == '' || y_opt == '') {
		$("#subQ").removeClass('btn-primary').addClass('btn-danger');
		//$("#subQ").addClass('btn-danger');

		$("#subQmsg").removeClass('alert-success').addClass('alert-danger');
		$("#subQmsg").html("<strong>Error</strong> : Please make the required 2 selections")
	}
	else {
		$("#subQ").removeClass('btn-danger').addClass('btn-primary');
		$("#subQmsg").removeClass('alert-danger').addClass('alert-success');
		$("#subQmsg").html("<strong>Success</strong> : Query submitted")
		console.log("s: "+x_opt+" "+y_opt);

		//make query:
		var request = new XMLHttpRequest();
		var requestUrl = 'spark?val='+y_opt+'&label='+x_opt;
		request.open('GET', requestUrl, true);
		console.log(request.responseText)
		console.log("Testing console log")

		request.onload = function () {
			// begin accessing JSON data here
			console.log(request.responseText)
			var data = JSON.parse(this.response);
			console.log(data)
			l=[];
			lab = [];
			for (var i = 0; i < data.length; i++) {
				console.log(data[i].dma_code + ' is a ' + data[i].count + '.'); //-------
				l.push(data[i].count);
				lab.push(data[i].dma_code);
			}
			console.log(data);
			console.log('again try');
			console.log(l);
			
			//myChart.update();
			
			createChart();
		}
		
		//****
		request.send();
		console.log("outside");
		console.log(lab);


		//call plot function
		//plotChart2();
	}
}

function createChart(){
	
	//**** chart code
	var ctx = document.getElementById("myChart");
	
	if(myChart){
		myChart.destroy();
	}
	
	myChart = new Chart(ctx, {
	    type: 'bar',
	    data: {
	        labels: lab,
	        datasets: [{
	            label: 'DMA-codes',
	            data: l,
	            backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)'
	            ],
	            borderColor: [
	                'rgba(255,99,132,1)',
	                'rgba(54, 162, 235, 1)',
	                'rgba(255, 206, 86, 1)',
	                'rgba(75, 192, 192, 1)',
	                'rgba(153, 102, 255, 1)',
	                'rgba(255, 159, 64, 1)'
	            ],
	            borderWidth: 1
	        }]
	    },
	    options: {
	        scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero:true
	                }
	            }]
	        }
	    }
	});
}



function plotChart(){
	var ctx = document.getElementById("myChart");
	lab = ['DMA','some','thing','ere'];
	l= [5,3,12,35];
	var myChart = new Chart(ctx, {
	    type: 'bar',
	    data: {
	        labels: lab,
	        datasets: [{
	            label: 'DMA-codes',
	            data: l,
	            backgroundColor: [
	                'rgba(255, 99, 132, 0.7)',
	                'rgba(54, 162, 235, 0.7)',
	                'rgba(255, 206, 86, 0.7)',
	                'rgba(75, 192, 192, 0.7)',
	                'rgba(153, 102, 255, 0.7)',
	                'rgba(255, 159, 64, 0.7)'
	                
	            ],
	            borderColor: [
	                'rgba(255,99,132,1)',
	                'rgba(54, 162, 235, 1)',
	                'rgba(255, 206, 86, 1)',
	                'rgba(75, 192, 192, 1)',
	                'rgba(153, 102, 255, 1)',
	                'rgba(255, 159, 64, 1)'
	            ],
	            borderWidth: 1
	        }]
	    },
	    options: {
	        scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero:true
	                }
	            }]
	        }
	    }
	});
}

//line chart
function plotChart2(){
	var ctx = document.getElementById("myChart");
/*
var speedData = {
  labels: ["0s", "10s", "20s", "30s", "40s", "50s", "60s"],
  datasets: [{
    label: "Car Speed",
    data: [40, 59, 75, 20, 20, 55, 40],
    lineTension: 0,
    fill: false,
    borderColor: 'orange',
    backgroundColor: 'transparent',
    borderDash: [5, 5],
    pointBorderColor: 'orange',
    pointBackgroundColor: 'rgba(255,150,0,0.5)',
    pointRadius: 5,
    pointHoverRadius: 10,
    pointHitRadius: 30,
    pointBorderWidth: 2,
    pointStyle: 'rectRounded'
  }]
};*/

var speedData = {
  labels: ["0s", "10s", "20s", "30s", "40s", "50s", "60s"],
  datasets: [{
    label: "Car Speed",
    data: [40, 59, 75, 20, 20, 55, 40],
    backgroundColor: ['rgba(255,99,132,0.5)'],
    lineTension: 0,
    pointBorderColor: 'red',
    pointBackgroundColor: 'rgba(255,150,0,0.5)'
  }]
};
	var chartOptions = {
	  legend: {
	    display: true,
	    position: 'top',
	    labels: {
	      boxWidth: 80,
	      fontColor: 'black'
	    }
	  },
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero:true
            }
        }]
    }	  
	};

	var myChart = new Chart(ctx, {
    type: 'line',
    data: speedData,
    options: chartOptions
	});


	//myChart.update();

}