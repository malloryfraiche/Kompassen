$(function () {
    
    // Adding Html code to Index file

    $("#courseListTable thead tr").append("<th>Termin</th>");
    $("#courseListTable thead tr").append("<th>År</th>");
    $("#courseListTable thead tr").append("<th>Status</th>");
    $("#courseListTable thead tr").append("<th>Redigera</th>");
    var detailFormYearSelectList = "<option value='2018'>2018</option>" +
        "<option value='2019'>2019</option>" +
        "<option value='2020'>2020</option>" +
        "<option value='2021'>2021</option>";
    $("#courseDetailsForm [name='year']").append(detailFormYearSelectList);

    // Replace input text box with drop-down list

    var addCourseFormYearList = "<select class='form-control' name='year'><option value='2015'>2015</option>" +
        "<option value='2016'>2016</option>" +
        "<option value='2017'>2017</option>" +
        "<option value='2018'>2018</option>" +
        "<option value='2019'>2019</option>" +
        "<option value='2020'>2020</option>" +
        "<option value='2021'>2021</option></select>";
    $("#courseListAddCourseForm [name='year']").replaceWith(addCourseFormYearList);
    var termSelectList = "<select class='form-control' name='term'><option value='HT'>HT</option>" +
        "<option value='VT'>VT</option></select>";
    $("#courseListAddCourseForm [name='term']").replaceWith(termSelectList);
    $("#courseDetailsForm [name='term']").replaceWith(termSelectList);
    var coursesApi = "http://localhost:45959/api/courses";
    var studentsApi = "http://localhost:45959/api/students";

    // To POST a new course in database

    $("#courseListAddCourseForm").submit(function (event) {
        event.preventDefault();
        $.ajax({
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json; charset=utf-8'
            },
            'type': 'POST',
            'url': coursesApi,
            'data': JSON.stringify($("#courseListAddCourseForm").serializeObject()),
            'success': function (data) {
                $("#success_panel").fadeIn(300).delay(2000).fadeOut();
                $("#courseListAddCourseForm").trigger("reset");
                LoadCoursesPage();
            }
        });
    });

    // Function that loads all of the information for the "Kurser" menu 

    function LoadCoursesPage() {
        $("#courseListTable tbody").empty();

        // GET all of the course information to show in the tbody

        $.get(coursesApi, function (data) {
            $.each(data, function (i, course) {

                // Save how many students are registered active in each course

                var activeStudentCounter = 0;

                // Each loop to get the number of students that are active in each of the courses

                $.each(course.students, function (y, student) {
                    if (student.active == true) {
                        activeStudentCounter++;
                        return activeStudentCounter;
                    }
                });
                var nameChange = course.active;
                if (nameChange == true) {
                    nameChange = "Aktiv";
                }
                if (nameChange == false) {
                    nameChange = "Inaktiv";
                }
                $("#courseListTable tbody").append("<tr><td>" + course.name +
                    "</td><td>" + course.credits +
                    "</td><td>" + activeStudentCounter +
                    "</td><td>" + course.term +
                    "</td><td>" + course.year +
                    "</td><td>" + nameChange +
                    "</td><td><button type='submit' name='" + course.id +
                    "' class='btn btn-sm btn-primary'>Redigera</button></td></tr>");
                
                // To edit a course by clicking the "Redigera" button

                $("#courseListTable :button").on("click", function () {
                    $("#courseListPlaceholder").hide();
                    $("#courseDetailsForm").show();
                    var courseAttrName = $(this).attr("name");

                    // To GET the properties to be pre-filled in the courseDetailsForm

                    if (courseAttrName == course.id) {
                        $("#courseDetailsStudentListPlaceholder").empty();
                        $("#courseDetailsStudentSelectList").empty();
                        $("#courseDetailsStudentSelectList").append("<option>Välj Student</option>");
                        $("#courseDetailsPlaceholder").show();
                        $("#courseDetailsForm [name='id']").val(courseAttrName);
                        $("#courseDetailsForm [placeholder='Namn']").val(course.name);
                        $("#courseDetailsForm [placeholder='Poäng']").val(course.credits);
                        $("#courseDetailsForm [name='year']").val(course.year);
                        $("#courseDetailsForm [name='term']").val(course.term);
                        if (course.active == true) {
                            $("#courseDetailsForm [type='checkbox']").prop('checked', true).val('true');
                        }
                        else {
                            $("#courseDetailsForm [type='checkbox']").prop('checked', false).val('false');
                        }
                        $("#courseDetailsForm [type='checkbox']").on("click", function () {
                            if ($("#courseDetailsForm [type='checkbox']").is(":checked")) {
                                $(this).val('true');
                            } else {
                                $(this).val('false');
                            }
                        });
                        
                        // If student is active in that SPECIFIC course

                        $.each(course.students, function (d, student) {
                            if (student.active == true) {
                                $("#courseDetailsStudentListPlaceholder").append("<p>" + student.firstName + " " + student.lastName + " " + "<button type='button' value='" + student.id + "' class='btn btn-danger btn-xs'>Avregistrera</button></p >");
                            }
                        });
                        
                        // GET information from studentAPI

                        $.get(studentsApi, function (data) {
                            $.each(data, function (w, student) {

                                //adds all ACTIVE students to select-drop-down list

                                if (student.active == true) {
                                    $("#courseDetailsStudentSelectList").append("<option value='" + student.id + "'>" + student.firstName + " " + student.lastName + "</option>");
                                }
                                
                                /* ***use this exact code block two times - 1(2)***
                                to Avregistrera a student from a course... to bring students name back up to select-drop-down list */

                                $("#courseDetailsStudentListPlaceholder :button").on("click", function () {
                                    var buttonValue = $(this).val();
                                    if (buttonValue == student.id) {
                                        $(this).parent().remove();
                                        $("#courseDetailsStudentSelectList").append("<option value='" + student.id + "'>" + student.firstName + " " + student.lastName + "</option>");
                                    }
                                });
                                

                                /* Compares each student in the "student-list-placeholder" div...
                                ...removes the students from the drop-down list that are not active in the course (already in the "student-list-placeholder" div) */

                                $("#courseDetailsStudentListPlaceholder :button").each(function () {
                                    var avregistreraButton = $(this).val();
                                    if (avregistreraButton == student.id) {
                                        $("#courseDetailsStudentSelectList").children("[value='" + student.id + "']").remove();
                                    }
                                });
                                
                                // To Registrera a student... to bring a students name down to the "courseDetailsStudentListPlaceholder" div

                                $("#registerSelectedStudentButton").on("click", function () {
                                    var val = $("#courseDetailsStudentSelectList").val();
                                    if (val == student.id) {
                                        $("#courseDetailsStudentListPlaceholder").append("<p>" + student.firstName + " " + student.lastName + " " + "<button type='button' value='" + student.id + "' class='btn btn-danger btn-xs'>Avregistrera</button></p >");
                                        $("#courseDetailsStudentSelectList [value='" + student.id + "']").remove();

                                        /* ***use this exact code block two times - 2(2)***
                                        to Avregistrera a student from a course... to bring students name back up to select-drop-down list */

                                        $("#courseDetailsStudentListPlaceholder :button").on("click", function () {
                                            var buttonValue = $(this).val();
                                            if (buttonValue == student.id) {
                                                $(this).parent().remove();
                                                $("#courseDetailsStudentSelectList").append("<option value='" + student.id + "'>" + student.firstName + " " + student.lastName + "</option>");
                                            }
                                        });
                                    }
                                });
                            });
                        });
                    }
                });
            });
        });
    }
    
    LoadCoursesPage();
    
    // To hide the #courseDetailsForm when you click "Stäng" button

    $("#courseDetailsCancelButton").on("click", function () {
        LoadCoursesPage();
        $("#courseListPlaceholder").show();
        $("#courseDetailsForm").hide();
    });

    // To UPDATE the courses in database after they have been edited in the #courseDetailsForm

    $("#courseDetailsForm").submit(function (event) {
        event.preventDefault();
        $("#courseListPlaceholder").show();
        var saveData = $("#courseDetailsForm").serializeObject();
        saveData.students = [];
        $("#courseDetailsStudentListPlaceholder button").each(function (f) {
            var student_id = $(this).attr("value");
            var student_item = { Id: student_id };
            saveData.students.push(student_item);
        });
        $.ajax({
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json; charset=utf-8'
            },
            'type': 'POST',
            'url': coursesApi,
            'data': JSON.stringify(saveData),
            'success': function (data) {
                $("#success_panel").fadeIn(300).delay(2000).fadeOut();
                LoadCoursesPage();
                $("#courseDetailsForm").hide();
            }
        });
    });

    // Loads the courses page when clicking "Kurser" in the menu 

    $(".nav a[href='#courses']").on("click", function () {
        LoadCoursesPage();
    });
});