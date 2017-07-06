function initChart(even, name, unit) {
	var mychart = echarts.init(even);
	if(unit != "" && unit != null) name += "(" + unit + ")";
	var option = {
		title: {
			text: name,
		},
		tooltip: {
			trigger: 'item',
			formatter: '{a} {b} {c}',
		},
		toolbox: {
			show: true,
			feature: {
				dataView: {
					readOnly: true
				},
				magicType: {
					type: ['line', 'bar']
				},
				saveAsImage: {}
			}
		},
		legend: {
			data: ''
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: []
		},
		yAxis: {
			type: 'value',
			axisLabel: {
				formatter: '{value}'
			}
		},
		series: [{
			name: '',
			type: 'line',
			data: [],
			markPoint: {
				data: [{
						type: 'max',
						name: '最大值'
					},
					{
						type: 'min',
						name: '最小值'
					}
				]
			},
		}, ]
	};
	mychart.setOption(option);
	return mychart;
}

function getRequestObject(data) {
	return JSON.parse(data);
}

function getPh(obj) {
	var ph = new Array();
	for(var i = 0; i < obj.length; i++) ph[i] = obj[i].ph;
	return ph;
}

function getConductivity(obj) {
	var conductivity = new Array();
	for(var i = 0; i < obj.length; i++) conductivity[i] = obj[i].conductivity;
	return conductivity;
}

function getwaterTemperature(obj) {
	var water_temperature = new Array();
	for(var i = 0; i < obj.length; i++) water_temperature[i] = obj[i].water_temperature;
	return water_temperature;
}

function getAmmoniaNitrogen(obj) {
	var ammonia_nitrogen = new Array();
	for(var i = 0; i < obj.length; i++) ammonia_nitrogen[i] = obj[i].ammonia_nitrogen;
	return ammonia_nitrogen;
}

function getDissolvedOxygen(obj) {
	var dissolved_oxygen = new Array();
	for(var i = 0; i < obj.length; i++) dissolved_oxygen[i] = obj[i].dissolved_oxygen;
	return dissolved_oxygen;
}

function getNTU(obj) {
	var ntu = new Array();
	for(var i = 0; i < obj.length; i++) ntu[i] = obj[i].ntu;
	return ntu;
}

function getP(obj) {
	var P = new Array();
	for(var i = 0; i < obj.length; i++) P[i] = obj[i].P;
	return P;
}

function getDateTime(obj) {
	var date_time = new Array();
	for(var i = 0; i < obj.length; i++) date_time[i] = obj[i].date_time;
	return date_time;
}

function getDataObject(obj) {
	var _do = new Object();
	_do.ph = getPh(obj);
	_do.conductivity = getConductivity(obj);
	_do.water_temperature = getwaterTemperature(obj);
	_do.ammonia_nitrogen = getAmmoniaNitrogen(obj);
	_do.dissolved_oxygen = getDissolvedOxygen(obj);
	_do.ntu = getNTU(obj);
	_do.P = getP(obj);
	_do.date_time = getDateTime(obj);
	return _do;
}

function mysetOption(mychart, _xData, _yData) {
	myoption = mychart.getOption();
	myoption.xAxis[0].data = _xData;
	myoption.series[0].data = _yData;
	// myoption.yAxis[0].axisLabel.formatter = '{value}';
	mychart.setOption(myoption);
	return mychart;
}

function getCartDatas(instrument_id) {
	var obj = new Object();
	$.ajax({
		type: 'GET',
		url: "http://115.236.84.154/limitdatas",
		async: false,
		data: 'instrument_id=' + instrument_id,
		success: function(result) {
			obj = getDataObject(getRequestObject(result));
		}
	});
	return obj;
}

function getinstruments(sctinstrument) {
	var obj = new Array();
	$.ajax({
		type: 'GET',
		url: "http://115.236.84.154/getinstruments",
		async: false,
		success: function(result) {
			obj = getRequestObject(result);
		}
	});
	sctinstrument.html("");
	for(var i = 0; i < obj.length; i++) {
		sctinstrument.append('<option value=' + i + '>' + obj[i].instrument_id + '</option>');
	}
}

function refreshCharts(instrument_id, phchart, water_temperaturechart, conductivitychart,
	ammonia_nitrogenchart, dissolved_oxygenchart, ntuchart, pchart) {
	var obj = getCartDatas(instrument_id);
	mysetOption(phchart, obj.date_time, obj.ph, 'PH', "");
	mysetOption(water_temperaturechart, obj.date_time, obj.water_temperature, 'NUT', "");
	mysetOption(conductivitychart, obj.date_time, obj.conductivity, 'CDT', "us/cm");
	mysetOption(ammonia_nitrogenchart, obj.date_time, obj.ammonia_nitrogen, 'N', "mg/L");
	mysetOption(dissolved_oxygenchart, obj.date_time, obj.dissolved_oxygen, 'DO', "mg/L");
	mysetOption(ntuchart, obj.date_time, obj.ntu, 'NTU', "");
	mysetOption(pchart, obj.date_time, obj.P, 'NTU', "mg/L");
}

function getLimitArticles(ul) {
	ul.html("");
	var obj = new Object();
	$.ajax({
		type: 'GET',
		url: "http://115.236.84.154/limitarticles",
		async: false,
		success: function(result) {
			obj = getRequestObject(result);
		}
	});
	for(var i = 0; i < obj.length; i++) {
		if(obj[i].title.length > 50)
			obj[i].title = obj[i].title.substring(0, 50) + "...";
		ul.append('<li>' +
			'<a style="display: inline-block" href="/' + obj[i].category + '/' + obj[i].id + '.html' + '"><p>' + obj[i].title + '</p></a>' + '<p style="float: right">' + obj[i].updated_at + '</p>' +
			'</li>')
	}
	ul.append('<a style="float: right; margin-bottom: 10px" href="/articles">閺囨潙顦�</a>');
}

function getLimitDocs(ul) {
	ul.html("");
	var obj = new Object();
	$.ajax({
		type: 'GET',
		url: "http://115.236.84.154/limitdocs",
		async: false,
		success: function(result) {
			obj = getRequestObject(result);
		}
	});
	for(var i = 0; i < obj.length; i++) {
		if(obj[i].title.length > 50)
			obj[i].title = obj[i].title.substring(0, 50) + "...";
		ul.append('<li>' +
			'<a style="display: inline-block" href="/' + obj[i].category + '/' + obj[i].id + '.html' + '"><p>' + obj[i].title + '</p></a>' + '<p style="float: right">' + obj[i].updated_at + '</p>' +
			'</li>')
	}
	ul.append('<a style="float: right; margin-bottom: 10px" href="/articles">閺囨潙顦�</a>');
}

function loadselectday(year, month, sctday, theday) {
	var day = sctday.find('option:selected').text();
	if(day == "") day = theday;
	sctday.html("")
	var mm = new Array(0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
	if(month == 2) {
		if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
			mm[2]++
		}
	}
	sctday.html("");
	for(var i = 1; i <= mm[month]; i++) {
		if(i != day)
			sctday.append("<option value=" + i + ">" + i + "</option>");
		else
			sctday.append("<option value='" + i + "' selected='selected'>" + i + "</option>");
	}

}

function loadselectmonth(year, sctmo, themonth) {
	sctmo.html("");
	if(year == '') return;
	var month = sctmo.find('option:selected').text();
	if(month == '') month = themonth;
	for(var i = 1; i <= 12; i++) {
		if(i != month) sctmo.append("<option value=" + i + ">" + i + "</option>");
		else sctmo.append("<option value='" + i + "' selected='selected'>" + i + "</option>");
	}
}

function getDatas_t(instrument_id, year, month, day, phchart, water_temperaturechart, conductivitychart,
	ammonia_nitrogenchart, dissolved_oxygenchart, pchart) {
	var obj = new Object();
	$.ajax({
		type: 'GET',
		url: "http://115.236.84.154/getdatas",
		async: false,
		data: {
			'instrument_id': instrument_id,
			'year': year,
			'month': month,
			'day': day
		},
		success: function(result) {
			obj = getDataObject(getRequestObject(result));
		}
	});
	refreshCharts_t(obj, phchart, water_temperaturechart, conductivitychart,
		ammonia_nitrogenchart, dissolved_oxygenchart, pchart);
}

function refreshCharts_t(obj, phchart, water_temperaturechart, conductivitychart,
	ammonia_nitrogenchart, dissolved_oxygenchart, pchart) {
	mysetOption(phchart, obj.date_time, obj.ph);
	mysetOption(water_temperaturechart, obj.date_time, obj.water_temperature);
	mysetOption(conductivitychart, obj.date_time, obj.conductivity);
	mysetOption(ammonia_nitrogenchart, obj.date_time, obj.ammonia_nitrogen);
	mysetOption(dissolved_oxygenchart, obj.date_time, obj.dissolved_oxygen);
	mysetOption(pchart, obj.date_time, obj.P);
}

function refreshCharts_back(dataarray, phchart, water_temperaturechart, conductivitychart,
	ammonia_nitrogenchart, dissolved_oxygenchart, ntuchart, pchart) {
	var ph_option = phchart.getOption();
	ph_option.series = [];
	var water_temperaturechart_option = water_temperaturechart.getOption();
	water_temperaturechart_option.series = [];
	var conductivitychart_option = conductivitychart.getOption();
	conductivitychart_option.series = [];
	var ammonia_nitrogenchart_option = ammonia_nitrogenchart.getOption();
	ammonia_nitrogenchart_option.series = [];
	var dissolved_oxygenchart_option = dissolved_oxygenchart.getOption();
	dissolved_oxygenchart_option.series = [];
	var ntu_option = ntuchart.getOption();
	ntu_option.series = [];
	var p_option = pchart.getOption();
	p_option.series = [];
	var _Datetime = getDateTime(dataarray[0]);
	ph_option.xAxis[0].data = _Datetime;
	water_temperaturechart_option.xAxis[0].data = _Datetime;
	conductivitychart_option.xAxis[0].data = _Datetime;
	ammonia_nitrogenchart_option.xAxis[0].data = _Datetime;
	dissolved_oxygenchart_option.xAxis[0].data = _Datetime;
	ntu_option.xAxis[0].data = _Datetime;
	p_option.xAxis[0].data = _Datetime;
	for(var i = 0; i < dataarray.length; i++) {
		ph_option = myAddOption(ph_option, getPh(dataarray[i]), dataarray[i][0].instrument_id);
		water_temperaturechart_option = myAddOption(water_temperaturechart_option, getwaterTemperature(dataarray[i]), dataarray[i][0].instrument_id);
		conductivitychart_option = myAddOption(conductivitychart_option, getConductivity(dataarray[i]), dataarray[i][0].instrument_id);
		ammonia_nitrogenchart_option = myAddOption(ammonia_nitrogenchart_option, getAmmoniaNitrogen(dataarray[i]), dataarray[i][0].instrument_id);
		dissolved_oxygenchart_option = myAddOption(dissolved_oxygenchart_option, getDissolvedOxygen(dataarray[i]), dataarray[i][0].instrument_id);
		ntu_option = myAddOption(ntu_option, getNTU(dataarray[i]), dataarray[i][0].instrument_id);
		p_option = myAddOption(p_option, getP(dataarray[i]), dataarray[i][0].instrument_id);

	}

	phchart.setOption(ph_option, true);
	water_temperaturechart.setOption(water_temperaturechart_option, true);
	conductivitychart.setOption(conductivitychart_option, true);
	ammonia_nitrogenchart.setOption(ammonia_nitrogenchart_option, true);
	dissolved_oxygenchart.setOption(dissolved_oxygenchart_option, true);
	ntuchart.setOption(ntu_option, true);
	pchart.setOption(p_option, true);
}