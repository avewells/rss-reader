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

/*
    Functions to be called when DOM is ready
    Mostly dashboard calculations
*/
$(function() {
    // article count
    $("#article-count").text(localdata.length);

    // img count
    var imgCount = 0;
    for (post in localdata) {
        if (localdata[post].img != '') {
            imgCount++;
        }
    }
    $("#img-count").text(imgCount);

    // newest and oldest post
    chronoSorted = localdata.sort(function(a, b) {
        return Date.parse(b.pubDate) - Date.parse(a.pubDate);
    });
    $("#newest-post").text(moment(chronoSorted[0].pubDate).format("MM/DD/YYYY HH:mm"));
    $("#oldest-post").text(moment(chronoSorted[chronoSorted.length-1].pubDate).format("MM/DD/YYYY HH:mm"));

    // go ahead and sort by date for default
    sortPosts('date');
});