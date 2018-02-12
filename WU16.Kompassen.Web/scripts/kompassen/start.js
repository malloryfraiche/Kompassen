$(function () {
    var coursesApi = "http://localhost:45959/api/courses";
    function reloadStart() {
        $("#defaultPlaceholder").empty();

        // Gets the JSON API

        $.get(coursesApi, function (data) {

            // Looping throught the course array

            $.each(data, function (i, course) {

                // Matching every 3rd course

                if (i % 3 == 0) {
                    $("#defaultPlaceholder").append("<div class='row'></div>");
                }

                // Render the courses to the document

                $("#defaultPlaceholder").append("<div class='list-group-" + i + " col-lg-4' style='margin-top:20px;'>" +
                    "<a href='#' class='list-group-item active'>" + course.name + " - " + course.term + " " + course.year + "<span class='glyphicon glyphicon-chevron-right pull-right' aria-hidden=" + true + "></span></a>" +
                    "<div class='list-group-item'><strong>" + course.students.length + "</strong> Registrerade studenter <span class='status pull-right' style='color:green;'></span></div>" +
                    "<div class='students-" + i + "'style='display:none;'></div>" +
                    "</div> ");
                if (course.active === false) {
                    $(".list-group-" + i).find("a").attr("class", "active").addClass("list-group-item inactive").css({ "background-color": "#d9534f", "border": "#d43f3a" });
                }
                var countActive = 0;
                // Slide effect for the courses
                $(".list-group-" + i).find("a").on("click", function (event) {
                    event.preventDefault();
                    if (countActive > 0) {
                        $(".list-group-" + i).find(".students-" + i).slideToggle();
                        $(".list-group-" + i).find("a").children("span").toggleClass("glyphicon-chevron-down");
                    }
                });

                // Looping through the student array

                $.each(course.students, function (j, student) {

                    // Check if student is active

                    if (student.active === true) {
                        countActive++;
                        $("#defaultPlaceholder").find(".students-" + i).append("<div class='list-group-item'>" + student.firstName + " " + student.lastName + "</div>");
                        if (countActive < 2) {
                            $(".list-group-" + i).find(".status").text(countActive + " Aktiv");
                        } else {
                            $(".list-group-" + i).find(".status").text(countActive + " Aktiva");
                        }
                    }
                });
            });
        });
    }
    reloadStart();
    $(".nav a[href='#start']").on("click", function () {
        reloadStart();
    });
});