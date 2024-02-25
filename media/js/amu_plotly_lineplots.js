document.addEventListener('DOMContentLoaded', function() {
    // The script will be executed after the DOM has been fully loaded, ensuring that the chart is created properly.

	// Retrieve the options set for "mod_amu_plotly_lineplots"
	var options = Joomla.getOptions('mod_amu_plotly_lineplots');
	//console.log('1= lineplots.js ==');
	//console.log(options);

	//Check if any options available
	if (options.length !== 0) {
	  //console.log('2= lineplots.js ==');
	  //console.log(options.length);
	  //console.log('options array not empty');
	  for (i in options) {
		// Access individual options
		let visualisation_data_url = options[i].visualisation_data_url;
		let graph_title_text = options[i].graph_title_text;
		let graph_subtitle_text = options[i].graph_subtitle_text;
		let module_id_name = options[i].module_id_name;
		let API_key = options[i].api_key;

		//console.log('3= lineplots.js ==');
		//console.log(visualisation_data_url);
		//console.log(graph_title_text);
		//console.log(graph_subtitle_text);
		//console.log(module_id_name);
		//console.log('4= lineplots.js ==');

		// get the data asynchronous
        // url to test: https://tst-web.nl/media/mod_amu_plotly_lineplots/tst-data/dataset_correct.json  
		async function getData() {
			const response = await fetch(
				visualisation_data_url,
				{
					method: 'GET',
                    headers: {
						'Content-Type': 'application/json',
						'x-api-key': API_key
					}
				}	
			);
			return response.json();
		};
		
		getData().then(json_data => {
			//console.log(json_data);

			// get unique values from the json_data for the uniek_id's text
			// inspiration: https://stackoverflow.com/questions/11688692/how-to-create-a-list-of-unique-items-in-javascript
			const unique = (arr) => [...new Set(arr)];
			locations = unique(json_data.map(item => item.uniek_id)); 
			// console.log(locations)
			
			// Initialize an empty array to store dataseries
			const dataseries = [];

			// Loop through the keys and assign values
			// Create an array with placeholders per location 
			locations.forEach(a_location => {
				console.log(a_location);
				dataseries.push({ 'name': a_location, 'type': 'scatter' });
			});

			// console.log(dataseries);    

			// Prepare the dataset
			const getData = a_location => {
				console.log(a_location)
				
				const temp_x = [];
				const temp_y = [];
				// Loopt over downloaded data and create data arrays		
				json_data.forEach(elm => {
					//console.log(elm)
					
					if (elm.uniek_id === a_location) {

						//console.log('tekst');
						//console.log(category_list);
						//console.log(elm.uniek_id);
						//console.log(category_list.indexOf(elm.uniek_id));
						
						temp_x.push(elm.date_time_dt);  // create an array with the x values for a_location
						temp_y.push(elm.actual_value);  // create an array with the y values for a_location
						
					}
				});
				// output x and y array
				return [temp_x, temp_y];
			};
			
			dataseries.forEach(s => {
				//  get x and y array values
				[s.x, s.y] = getData(s.name);
			});
			
			// console.log(dataseries);
			
			// Create layout settings
			var layout = {
				title: graph_title_text,
				
				// https://plotly.com/javascript/reference/layout/xaxis/
				xaxis: {
					title: 'Date',
					type: 'date'
				},
				
				// https://plotly.com/javascript/reference/layout/yaxis/
				yaxis: {
					title: 'Power (kWh)'
				}
			};

			// https://plotly.com/javascript/time-series/#time-series-with-rangeslider

			// Finally create the Plotly line chart
			/* Inspiration 	https://plotly.com/javascript/line-charts/
			 *              https://stackoverflow.com/questions/762011/what-is-the-difference-between-let-and-var
			 * 
			 * Using let to define unique value; with each iteration you get a new variable (see Loops with closures in inspiration) 
			 */	
			
			let linechart = Plotly.newPlot(module_id_name, dataseries, layout);
			/* module_id_name = id of div where to place the graph
             * dataseries     = dataset to use
             * layout         = layout to use			 
             */
		});
	};
  };
});	