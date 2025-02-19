(function(window, document, $) {

	var dmsCalendar = {
	};
	
	// Months list
	//var allMonths = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
	var allMonths = new Array('01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12');

	var date = new Date();

	dmsCalendar = {
	
		// MiniMonthCalendar
		miniMonthCalendar : function(date) {
			// Delete the calendar content
			$('#miniMonthCalendar').children().remove();
			$('#currentMonth').contents().remove();
			
			date = date || new Date();
			
			var allDays = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
			
			// Obtain the first day of the month
			var firstDayOfMonth = new Date(date.toString()).moveToFirstDayOfMonth();
			var lastDayNumberOfMonth = new Date(date.toString()).moveToLastDayOfMonth().getDate();
			var tmpDay = firstDayOfMonth.clone();
			
			
			$('#currentMonth').append('<em>' + tmpDay.getFullYear() + ' ' + allMonths[tmpDay.getMonth()] + '</em>');
			
			// Table lines creation
			$('#miniMonthCalendar').append(document.createElement('tr'));
			$('#miniMonthCalendar').append(document.createElement('tr'));
			
			// Add the days name & days number for the wanted month
			for (var i = 1; i <= lastDayNumberOfMonth; i++) {
				var dayName = allDays[tmpDay.getDay()].substring(0, 2);
				var dayNumber = tmpDay.getDate();
				
				// Day name
				var dayName_td = document.createElement('td');
				dayName_td.appendChild(document.createTextNode(dayName));
				
				// Day number
				var dayNumber_td = document.createElement('td');
				dayNumber_td.appendChild(document.createTextNode((dayNumber < 10) ? '0' + dayNumber : dayNumber));
				
				$(dayNumber_td).click(function() {
					
					$('#miniMonthCalendar tr').eq(1).children().removeClass('clickDay');
					
					var scheduler = $("#bayScheduler").data("kendoScheduler");
					var searchDt = new Date(date.getFullYear(), date.getMonth(), $(this).text());
					scheduler.date(searchDt);
					
					/* 예약접수 호출 영역 */					
					// 방문예약일자 설정.
					$("#txtSearchDt").data("kendoExtMaskedDatePicker").value(searchDt);
					// 오늘예약고객 리스트.
					setReserveListToday(searchDt);										
					// 푸터처리.
					setRevFooter(searchDt);
					
					/* 예약접수 호출 영역 */
					
					$(this).addClass('clickDay');
					
					//readEvents();
				});
				
				// Add day info to the calendar
				$('#miniMonthCalendar tr').eq(0).append(dayName_td);
				$('#miniMonthCalendar tr').eq(1).append(dayNumber_td);
				
				// Go to the next day
				tmpDay.addDays(1);
				
				
			}
			
			
		},
		
		// Highlight events from the MiniMonthCalendar
		highlightEvents : function(dataList) {
	
	    	if (dataList.length > 0) {
				// Reset highlighted elements
				$('#miniMonthCalendar tr').eq(1).children().removeClass('isEvent');
				
				var year = $('#currentMonth').text().split(' ')[0];
				var month = $('#currentMonth').text().split(' ')[1];
				
				$(allMonths).each(function(i) {
					if (allMonths[i] == month) {
						month = i + 1;
						return false;
					}
				});
				
				$.each(dataList, function(key, value) {
					var srtDt = kendo.toString(value.start, "yyyy/MM/dd");
					$('#miniMonthCalendar tr').eq(1).children().each(function() {
						if (srtDt.split('/')[0] == year && srtDt.split('/')[1] == month) {
							if (srtDt.split('/')[2].substring(0, 2) == $(this).text()) {
								$(this).addClass('isEvent');
								return false;
							}
						}
					});
				});
				
				$('#miniMonthCalendar tr').eq(1).children().each(function() {
					var date = kendo.toString(new Date(), "yyyy/MM/dd");
					var thisYear = date.substring(0,4);
					var thisMonth = date.substring(5,7);
					var thisDay = date.substring(8,10);
					
					if (thisYear == year && thisMonth == month && thisDay == $(this).text()) {
						$(this).addClass('today');
						
						return false;
					}
				});
			}
		}
	}
	
	window.dmsCalendar = dmsCalendar;
	
}(window, document, jQuery));
