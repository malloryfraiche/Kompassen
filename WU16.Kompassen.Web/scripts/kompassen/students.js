$(function () {

    // Variabel för mina post och getanrop

    var urlStudents = "http://localhost:45959/api/students";

    // Funktion som listar alla studenter

    function reloadStudents() {

        // Rensar gamla listor på studenter

        $("#studentListTable tbody").empty();

        /* Getanrop som hämtar alla studenter, skapar en array "studentCourses" som samlar alla kurser som de enskilda
        studenterna är skrivna på samt en variabel studentActive som används för att identifiera om student är aktiv eller
        inte så rätt status och knapp (aktivera eller inaktivera syns på dem) */

        $.get(urlStudents, function (data) {
            $.each(data, function (i, Students) {
                var studentCourses = [];
                var studentActive = 0;
                $.each(Students.courses, function (i, Courses) {
                    studentCourses.push(Courses.name);
                });
                if (Students.active === true) {
                    studentActive = "Aktiv <button type='submit' name='" + Students.id + "'class='btn btn-sm btn-danger'>Inaktivera</button>";
                }
                if (Students.active === false) {
                    studentActive = "Inaktiv <button type='submit' name='" + Students.id + "'class='btn btn-sm btn-success'>Aktivera</button>";
                }
                $("#studentListTable tbody").append("<tr name='" + Students.id + "'><td name='firstname'>" + Students.firstName + "</td><td name='lastname'>" +
                    Students.lastName + "</td><td name='ssn'>" + Students.ssn + "</td><td>" + studentCourses +
                    "</td><td>" + studentActive + "</td></tr>");
            });

            /* Knapptryckning på aktivera/inaktivera knappar gör att det som står på samma rad i listan
            som knappen sparas ner i enskilda variabler som sedan används i Post-anropet längre ner
            som uppdaterar studentens status*/

            $("#studentListTable :button").on("click", function () {
                var buttonStatus = $(this).text();
                var buttonId = $(this).attr("name");
                var tdNameFirstname = $("tr[name='" + buttonId + "'] td[name='firstname']").text();
                var tdLastFirstname = $("tr[name='" + buttonId + "'] td[name='lastname']").text();
                var tdSsn = $("tr[name='" + buttonId + "'] td[name='ssn']").text();

                // Post-anrop för att inaktivera studenter vid knapptryck

                if (buttonStatus === "Inaktivera") {

                    $.ajax({
                        headers: {
                            'Accept': 'application/json; charset=utf-8',
                            'Content-Type': 'application/json; charset=utf-8'
                        },
                        'type': 'POST',
                        'url': urlStudents,
                        'data': '{"id":' + buttonId + ',"active":"false","firstName":"' + tdNameFirstname + '","lastName":"' + tdLastFirstname + '","ssn":"' + tdSsn + '"}',
                        'success': function (data) {
                            $("#success_panel").fadeIn(300).delay(2000).fadeOut();
                            reloadStudents();
                        }
                    });
                }

                // Post-anrop för att aktivera studenter vid knapptryck

                if (buttonStatus === "Aktivera") {

                    $.ajax({
                        headers: {
                            'Accept': 'application/json; charset=utf-8',
                            'Content-Type': 'application/json; charset=utf-8'
                        },
                        'type': 'POST',
                        'url': urlStudents,
                        'data': '{"id":' + buttonId + ',"active":"true","firstName":"' + tdNameFirstname + '","lastName":"' + tdLastFirstname + '","ssn":"' + tdSsn + '"}',
                        'success': function (data) {
                            $("#success_panel").fadeIn(300).delay(2000).fadeOut();
                            reloadStudents();
                        }
                    });
                }
            });
        });
    }

    // Listar alla studenter vid klick på "Studenter" i huvudmenyn

    $(".nav a[href='#students']").on("click", function () {
        reloadStudents();
    });

    // Lägger till nya studenter och kontrollerar så inga fält är tomma

    $("#studentListAddStudentForm").on("submit", function (event) {
        event.preventDefault();
        $.ajax({
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json; charset=utf-8'
            },
            'type': 'POST',
            'url': urlStudents,
            'data': JSON.stringify($("#studentListAddStudentForm").serializeObject()),
            'success': function (data) {
                $("#success_panel").fadeIn(300).delay(2000).fadeOut();
                reloadStudents();
            }
        });
    });

    // Sökfunktionen

    $("#searchStudentForm").on("submit", function (event) {

        event.preventDefault();

        // Rensar gamla sökresultat

        $("#studentListTable tbody").empty();
        var studentSearch = $("#searchStudentForm [name='searchCriteria']").val();
        var urlStudentSearch = "http://localhost:45959/api/searchStudents/" + studentSearch;

        /* Getanrop som hämtar alla träffar på sökordet man uppgivit, visar även ett felmeddelande om
        man inte får några träffar på sitt sökord */

        $.get(urlStudentSearch, function (data) {
            if (data.length === 0) {
                $("#error_body").text("Inga träffar på sökordet \"" + studentSearch + "\"");
                $("#error_panel").fadeIn(300).delay(2000).fadeOut();
            }
            else {
                $.each(data, function (i, Students) {
                    var studentCourses = [];
                    var studentActive = 0;
                    $.each(Students.courses, function (i, Courses) {
                        studentCourses.push(Courses.name);
                    });
                    if (Students.active === true) {
                        studentActive = "Aktiv <button type='submit' name='" + Students.id + "'class='btn btn-danger'>Inaktivera</button>";
                    }
                    if (Students.active === false) {
                        studentActive = "Inaktiv <button type='submit' name='" + Students.id + "'class='btn btn-success'>Aktivera</button>";
                    }
                    $("#studentListTable tbody").append("<tr name='" + Students.id + "'><td name='firstname'>" + Students.firstName + "</td><td name='lastname'>" +
                        Students.lastName + "</td><td name='ssn'>" + Students.ssn + "</td><td>" + studentCourses +
                        "</td><td>" + studentActive + "</td></tr>");
                });

                /* Knapptryckning på aktivera/inaktivera knappar gör att det som står på samma rad i listan
                som knappen sparas ner i enskilda variabler som sedan används i Post-anropet längre ner
                som uppdaterar studentens status*/

                $("#studentListTable :button").on("click", function () {
                    var buttonStatus = $(this).text();
                    var buttonId = $(this).attr("name");
                    var tdNameFirstname = $("tr[name='" + buttonId + "'] td[name='firstname']").text();
                    var tdLastFirstname = $("tr[name='" + buttonId + "'] td[name='lastname']").text();
                    var tdSsn = $("tr[name='" + buttonId + "'] td[name='ssn']").text();
                    if (buttonStatus === "Inaktivera") {
                        $.ajax({
                            headers: {
                                'Accept': 'application/json; charset=utf-8',
                                'Content-Type': 'application/json; charset=utf-8'
                            },
                            'type': 'POST',
                            'url': urlStudents,
                            'data': '{"id":' + buttonId + ',"active":"false","firstName":"' + tdNameFirstname + '","lastName":"' + tdLastFirstname + '","ssn":"' + tdSsn + '"}',
                            'success': function (data) {
                                $("#success_panel").fadeIn(300).delay(2000).fadeOut();
                                reloadStudents();
                            }
                        });
                    }
                    if (buttonStatus === "Aktivera") {
                        $.ajax({
                            headers: {
                                'Accept': 'application/json; charset=utf-8',
                                'Content-Type': 'application/json; charset=utf-8'
                            },
                            'type': 'POST',
                            'url': urlStudents,
                            'data': '{"id":' + buttonId + ',"active":"true","firstName":"' + tdNameFirstname + '","lastName":"' + tdLastFirstname + '","ssn":"' + tdSsn + '"}',
                            'success': function (data) {
                                $("#success_panel").fadeIn(300).delay(2000).fadeOut();
                                reloadStudents();
                            }
                        });
                    }
                });
            }
        });
    });
});