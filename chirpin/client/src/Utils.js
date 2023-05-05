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
    if (diffInYear >= 2) {
      return Math.floor(diffInYear) + " years ago";
    } else { return "1 year ago"; }
  }
  if (diffInMonth >= 1) {
    if (diffInMonth >= 2) {
      return Math.floor(diffInMonth) + " months ago";
    } else { return "1 month ago"; }
  }
  if (diffInDay >= 1) {
    if (diffInDay >= 2) {
      return Math.floor(diffInDay) + " days ago";
    } else { return "1 day ago"; }
  }
  if (diffInHour >= 1) {
    if (diffInHour >= 2) {
      return Math.floor(diffInHour) + " hours ago";
    } else { return "1 hour ago"; }
  }
  if (diffInMin >= 1) {
    if (diffInMin >= 2) {
      return Math.floor(diffInMin) + " minutes ago";
    } else { return "1 minute ago"; }
  }
  if (diffInSec >= 1) {
    if (diffInMin >= 2) {
      return Math.floor(diffInSec) + " seconds ago";
    } else { return "1 second ago"; }
  }
  return "just now";
}

export function splitList(list, n) {
  let result = [];
  for (let i = 0; i < list.length; i += n) {
    result.push(list.slice(i, i + n));
  }
  return result;
}

export function randomSelect(list, n) {
  // shuffle the list
  let shuffledList = list.sort(() => Math.random() - 0.5);
  // select the first n elements
  let selectedList = shuffledList.slice(0, n);
  return selectedList;
}