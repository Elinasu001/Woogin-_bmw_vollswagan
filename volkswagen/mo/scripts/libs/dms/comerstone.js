
function processDate(d, a, f) {
    var date = kendo.parseDate(d, f);
    var end = a.length - 1;
    var flag = a.charAt(end).toUpperCase();
    var add = kendo.parseInt(a.substring(0, end));

    if(flag == "D") {
        date.setDate(date.getDate() + add);
    } else if(flag == "M") {
        date.setMonth(date.getMonth() + add);
    }

    return kendo.toString(date, f);
}
