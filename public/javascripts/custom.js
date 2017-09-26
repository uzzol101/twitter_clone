$(function() {


    var socket = io();

    $("#sendTweet").submit(function() {
        var content = $("#tweet").val();
        socket.emit("tweet", { content: content });
        $("#tweet").val("");
        return false;
    });

    socket.on("incommingTweet", function(data) {
        // console.log(data);

        var template = `
            <p>${data.data.content}</p>
        `;

        $("#realTweet").append(template);
    });


    // follow 

    $(document).on("click", "#follow", ((e) => {
        e.preventDefault();

        var user_id = $("#user_id").val();
        $.ajax({
            type: "POST",
            url: "/users/follow/" + user_id,
            success: function(data) {
                $("#follow").removeClass("btn-info").addClass("btn-danger").html("Following")
                    .attr("id", "unfollow");
            },
            error: function(data) {
                console.log(data);
            }
        })

    }))


    // unfollow

    $(document).on("click", "#unfollow", ((e) => {

        e.preventDefault();
        var user_id = $("#user_id").val();
        $.ajax({
            type: "POST",
            url: "/users/unfollow/" + user_id,
            success: function(data) {
                $("#unfollow").removeClass("btn-danger").addClass("btn-info").html("Follow")
                    .attr("id", "follow");
            },
            error: function(data) {
                console.log(data);
            }
        })


    }))







});