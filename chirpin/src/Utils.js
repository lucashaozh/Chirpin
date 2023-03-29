export function timeDifference(time) {
    // time is a string in the format of "2021-05-01 12:00:00"
    let now = new Date();
    let tweetTime = new Date(time);
    let diff = now - tweetTime;
    let diffInSec = diff / 1000;
    let diffInMin = diffInSec / 60;
    let diffInHour = diffInMin / 60;
    let diffInDay = diffInHour / 24;
    let diffInMonth = diffInDay / 30;
    let diffInYear = diffInMonth / 12;
    if (diffInYear >= 1) {
        return Math.floor(diffInYear) + " years ago";
    }
    if (diffInMonth >= 1) {
        return Math.floor(diffInMonth) + " months ago";
    }
    if (diffInDay >= 1) {
        return Math.floor(diffInDay) + " days ago";
    }
    if (diffInHour >= 1) {
        return Math.floor(diffInHour) + " hours ago";
    }
    if (diffInMin >= 1) {
        return Math.floor(diffInMin) + " minutes ago";
    }
    if (diffInSec >= 1) {
        return Math.floor(diffInSec) + " seconds ago";
    }
    return "just now";
}

export function splitList(list, n) {
    let result = [];
    console.log(list.length);
    for (let i = 0; i < list.length; i += n) {
        result.push(list.slice(i, i + n));
    }
    console.log(result);
    return result;
}