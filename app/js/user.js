var users = [];

d3.json('/js/data/out3.json', function(error, data) {
    if (error) throw error;
    console.log("this is index");
    // console.log(data.length);
    // console.log(data);
    // d3.select('tbody').datum(data).html(function(d) {return '<th scope="row">'+d.PatientId+'</th><td></td>';});
    d3.select("tbody")
      .selectAll("tr")
      .data(data.slice(0,6))
      .enter()
      .append("tr")
      .html(function(d) {return '<th scope="row"><a href=./user/'
                                +d.PatientId.slice(8)+
                                '/glucose.html>'+
                                   d.PatientId.slice(8)+
                                 '</></th><td>'+d.DisplayName+'</td>';});

    for (var i = 0; i < data.length; i++) {
    // for (var i = 0; i < 6; i++) {
        users.push(data[i].PatientId.slice(8));
    }
});
// console.log(users);
function login() {
    console.log(users);
    console.log(users.includes(""));
    console.log("try to logging");
    console.log($('#username').val());
    if (users.includes($('#username').val())) {
        window.location.href = "/user/"+$('#username').val()+"/glucose.html";
    } else {
        console.log('no user exists');
        alert("User does not exits");
    }
}
