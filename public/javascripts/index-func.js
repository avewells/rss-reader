/*
    Sorts RSS posts in chronological order of date posted, alphabetical
    order of title or description.
    order: string - "date", "title", "desc"
*/
function sortPosts(order) {
    if (order === "title") {
        $(".card-columns").append($(".card-columns > .card").sort(function(a, b) {
            return $(a).find(".card-title").text().localeCompare($(b).find(".card-title").text());
        }));
    } else if (order === "desc") {
        $(".card-columns").append($(".card-columns > .card").sort(function(a, b) {
            return $(a).find(".card-text").text().localeCompare($(b).find(".card-text").text());
        }));
    } else if (order === "date") {
        $(".card-columns").append($(".card-columns > .card").sort(function(a, b) {
            return Date.parse($(b).find(".card-subtitle").text()) - Date.parse($(a).find(".card-subtitle").text());
        }));
    } else {
        console.log("ERROR: improper sorting argument.");
    }
}

function testStuff(testvar) {
    console.log(testvar);
}