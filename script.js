/*
Student Name:   Hung Ka Hing
Student Number: 3035782750
*/

document.addEventListener("DOMContentLoaded", function () {
	
	// update the date displayed on top
	updateClock();

	// Map IATA code to its full city name and municipality
	var nameList = {};
	var municipalityList = {};
	var previousFlights = [];
	var comingFlights = [];
	
	// find all containers of flight information
	let previousFlightsContainer = document.getElementById("previousFlightsContainer");
	let currentFlightsContainer = document.getElementById("currentFlightsContainer");
	let comingFlightsContainer = document.getElementById("comingFlightsContainer");
	
	// find all buttons
	let loadEarlyFlightButton = document.getElementById('loadEarlyFlightButton');
	let loadMoreFlightButton = document.getElementById('loadMoreFlightButton');
	
	// initialize the name and municipality of airport
	fetch("iata.json")
	.then(response => {
		response.json()
		.then(objects => {
			// build the nameList and municipalityList
			objects.forEach(object => {
				nameList[object.iata_code] = object.name;
				municipalityList[object.iata_code] = object.municipality;
			});
			// detect toggle event only after loading the iata.js
			document.querySelector("input[name=checkbox]").addEventListener("change",function() {
				if (this.checked) {
					document.getElementById("flightModeTitle").innerHTML = "Arrival Information";
					document.getElementById("arrivalLabel").style.textDecoration = "underline";
					document.getElementById("departureLabel").style.textDecoration = "none";
					requestInformation(true);

				}
				else {
					document.getElementById("flightModeTitle").innerHTML = "Departure Information";
					document.getElementById("arrivalLabel").style.textDecoration = "none";
					document.getElementById("departureLabel").style.textDecoration = "underline";
					requestInformation(false);
				}
			});
			// request default information
			requestInformation(false);
		})
		.catch(err => {
			console.log(err);
		});
	})
	.catch(err => {
			console.log(err);
	});
	
	function requestInformation(arrival=true) {
		
		let currentDate = new Date();
		let currentDay = currentDate.getDate();
		let currentMonth = currentDate.getMonth() + 1;
		let currentYear = currentDate.getFullYear();
				
		let requestDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${currentDay}`;
		let request = `flight.php?date=${requestDate}&lang=en&cargo=false&arrival=${arrival?"true":"false"}`;
		console.log(`Debug Information:\nhttps://www.hongkongairport.com/flightinfo-rest/rest/flights/past?date=${requestDate}&lang=en&cargo=false&arrival=${arrival?"true":"false"}`);
								
		fetch(request)
		.then( response => {
			//receive response successfully 
			if (response.status == 200) {
				response.json()
				.then( historicalDataSet => {
					
					let flightNo = "";
					let scheduleTime = "";
					let origin = "";
					let parkingStand = "";
					let hall = "";
					let belt = "";
					let status = "";
					let destination = "";
					let terminal = "";
					let aisle = "";
					let gate = "";
					
					previousFlights = [];
					comingFlights = [];
				
					historicalDataSet.forEach(historicalData => {
						historicalData.list.forEach(historicalDatum => {
							if (arrival) {
								
								flightNo = "";
								for (let flight of historicalDatum.flight) {
									flightNo += flight.no.replace(" ", "&nbsp;") + "&emsp;";
								}
								
								scheduleTime = (requestDate.localeCompare(historicalData.date) == 0) ? historicalDatum.time : historicalData.date + "&nbsp;" + historicalDatum.time;
								
								origin = "";
								for (let iata of historicalDatum.origin) {
									origin += `${municipalityList[iata]} (${nameList[iata]})<br />`;
								}
								
								parkingStand = historicalDatum.stand;
								hall = historicalDatum.hall;
								belt = historicalDatum.baggage;
								status = historicalDatum.status;
											
								var item = 	`<table>
												<tr>
													<td>
														<span class="heading">Flight No.: </span><span class="info">${flightNo}</span>
													</td>
													<td>
														<span class="heading">Schedule Time: </span><span class="info">${scheduleTime}</span>
													</td>
												</tr>
												<tr>
													<td colspan="2">
														<span class="heading">Origin(Airport): </span><br/><span class="info">${origin}</span>
													</td>
												</tr>
												<tr>
													<td>
														<span class="heading">Parking Stand: </span><span class="info">${parkingStand}&emsp;</span>
														<span class="heading">Hall: </span><span class="info">${hall}&emsp;</span>
														<span class="heading">Belt: </span><span class="info">${belt}&emsp;</span>
													</td>
													<td>
														<span class="heading">Status: </span><span class="info">${status}&emsp;</span>
													</td>
												</tr>
											</table>`;
								
								flightDate = new Date(`${historicalData.date}T${historicalDatum.time}:00`);
								
								if (flightDate < currentDate) {
									previousFlights.push(item);
								}
								else {
									comingFlights.push(item);
								}
							}
							else {
								flightNo = "";
								for (let flight of historicalDatum.flight) {
									flightNo += flight.no.replace(" ", "&nbsp;") + "&emsp;";
								}
								
								scheduleTime = (requestDate.localeCompare(historicalData.date) == 0) ? historicalDatum.time : historicalData.date + "&nbsp;" + historicalDatum.time;
								
								destination = "";
								for (let iata of historicalDatum.destination) {
									destination += `${municipalityList[iata]} (${nameList[iata]})<br />`;
								}
								
								terminal = historicalDatum.terminal;
								aisle = historicalDatum.aisle;
								gate = historicalDatum.gate;
								status = historicalDatum.status;
											
								var item =	`<table>
												<tr>
													<td>
														<span class="heading">Flight No.: </span><span class="info">${flightNo}</span>
													</td>
													<td>
														<span class="heading">Schedule Time: </span><span class="info">${scheduleTime}</span>
													</td>
												</tr>
												<tr>
													<td colspan="2">
														<span class="heading">Destination(Airport): </span><br/><span class="info">${destination}</span>
													</td>
												</tr>
												<tr>
													<td>
														<span class="heading">Terminal: </span><span class="info">${terminal}&emsp;</span>
														<span class="heading">Aisle: </span><span class="info">${aisle}&emsp;</span>
														<span class="heading">Gate: </span><span class="info">${gate}&emsp;</span>
													</td>
													<td>
														<span class="heading">Status: </span><span class="info">${status}&emsp;</span>
													</td>
												</tr>
											</table>`;
								
								flightDate = new Date(`${historicalData.date}T${historicalDatum.time}:00`);
								
								if (flightDate < currentDate) {
									previousFlights.push(item);
								}
								else {
									comingFlights.push(item);
								}
							}
						});
					});
					
					// put the output into html
					
					let previousFlightsOutput = "";
					let currentFlightsOutput = "";
					let comingFlightsOutput = "";
					
					for (let i = 0; i < previousFlights.length; i++) {
						previousFlightsOutput += previousFlights[i];
					}
							
					for (let i = 0; i < 10 && i < comingFlights.length; i++) {
						currentFlightsOutput += comingFlights[i];
					}
					
					for (let i = 10; i < comingFlights.length; i++) {
						comingFlightsOutput += comingFlights[i];
					}
					
					previousFlightsContainer.style.display = "none";
					comingFlightsContainer.style.display = "none";
					
					previousFlightsContainer.innerHTML = previousFlightsOutput;
					currentFlightsContainer.innerHTML = currentFlightsOutput;
					comingFlightsContainer.innerHTML = comingFlightsOutput;
					
					// register listener for buttons
					
					loadMoreFlightButton.style.display = "inline-block";
					loadEarlyFlightButton.style.display = "inline-block";

					loadEarlyFlightButton.addEventListener("click", function(){
						previousFlightsContainer.style.display = "block";
						loadEarlyFlightButton.style.display = "none";
					});
					
					loadMoreFlightButton.addEventListener("click", function(){
						comingFlightsContainer.style.display = "block";
						loadMoreFlightButton.style.display = "none";
					});
					
					// enable the toggle after finishing loading the default information
					document.querySelector("input[name=checkbox]").disabled=false;
				});
			}
			// fail to receive the response
			else 
			{
				 console.log("HTTP return status: "+response.status);
			}
		})
		.catch(err => {
			console.log(err);
		});
	}
});

function updateClock() {
		
	/*To set the current calendar date*/
	const date = new Date();
	const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	//let second = date.getSeconds();
	//let minute = date.getMinutes();
	//let hour = date.getHours();
	// - ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}
	
	let day = date.getDate();
	let month = date.getMonth() + 1;
	let year = date.getFullYear();

	let currentCalendarDate = document.getElementById("currentCalendarDate");
	currentCalendarDate.innerHTML = `Date: ${day} ${monthNames[month-1]} ${year}`;
	
	setTimeout(updateClock, 1000);
}




