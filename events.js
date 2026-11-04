/* Put Tools In Schools: upcoming events and the next-event countdown.
   To update the calendar, edit the EVENTS list below. Times are Charlotte local time
   (-05:00 in winter, -04:00 in summer). Past events hide themselves automatically. */
(function () {
  "use strict";

  var EVENTS_PAGE = "https://www.puttoolsinschools.org/events";
  var BASE = "https://www.puttoolsinschools.org/event-details/";

  var EVENTS = [
    { title: "Olympic High School Military and Career Fair", start: "2026-11-05T09:00:00-05:00", end: "2026-11-05T10:20:00-05:00", place: "Olympic High School", address: "4301 Sandy Porter Rd, Charlotte, NC 28273", note: "", link: BASE + "olympic-high-school-military-and-career-fair" },
    { title: "Coulwood Middle School Trade Career Day", start: "2026-11-05T10:00:00-05:00", end: "2026-11-05T13:00:00-05:00", place: "Coulwood Middle School", address: "500 Kentberry Dr, Charlotte, NC 28214", note: "Hands-on time with tools", link: BASE + "coulwood-middle-school-trade-career-day" },
    { title: "Warlick Academy Trades Career Day", start: "2026-11-12T09:00:00-05:00", end: "2026-11-12T14:00:00-05:00", place: "Warlick Academy", address: "1316 Spencer Mountain Rd, Gastonia, NC 28052", note: "About 100 middle and high school students in Gaston County", link: BASE + "warlick-academy-trades-career-day" },
    { title: "Cato Ridge Middle School College & Career Fair", start: "2026-11-13T13:30:00-05:00", end: "2026-11-13T15:20:00-05:00", place: "Cato Ridge Middle School", address: "5410 Camp Verde Ln, Charlotte, NC 28277", note: "Trade careers as an alternative to college", link: BASE + "cato-ridge-middle-school-college-career-fair" },
    { title: "Olympic High School STEMFEST", start: "2026-11-14T10:00:00-05:00", end: "2026-11-14T13:00:00-05:00", place: "Olympic High School", address: "4301 Sandy Porter Rd, Charlotte, NC 28273", note: "Explore, invent, and create", link: BASE + "olympic-high-school-stemfest" },
    { title: "East Mecklenburg High School Trades Career Day", start: "2026-11-18T07:30:00-05:00", end: "2026-11-18T11:30:00-05:00", place: "East Mecklenburg High School", address: "6800 Monroe Rd, Charlotte, NC 28212", note: "", link: EVENTS_PAGE },
    { title: "Northridge Middle School Career Day", start: "2026-11-18T09:30:00-05:00", end: "2026-11-18T15:30:00-05:00", place: "Northridge Middle School", address: "7601 The Plaza, Charlotte, NC 28215", note: "Showing students what tools can do", link: BASE + "northridge-middle-school-career-day" },
    { title: "Rocky River High School Job and Career Fair", start: "2026-11-19T09:00:00-05:00", end: "2026-11-19T12:30:00-05:00", place: "Rocky River High School", address: "10505 Clear Creek Commerce Dr, Mint Hill, NC 28227", note: "About 1,200 students", link: BASE + "rocky-river-high-school-job-and-career-fair" },
    { title: "Ballantyne Ridge High School", start: "2026-11-19T10:00:00-05:00", end: "2026-11-19T12:50:00-05:00", place: "Ballantyne Ridge High School", address: "4004 Toringdon Way, Charlotte, NC 28277", note: "Career pathways for about 1,400 students", link: BASE + "ballantyne-ridge-high-school" },
    { title: "Palisades High School Career Fair", start: "2026-11-23T09:00:00-05:00", end: "2026-11-23T12:30:00-05:00", place: "Palisades High School", address: "15221 York Rd, Charlotte, NC 28278", note: "", link: BASE + "palisades-high-school-career-fair" },
    { title: "McClintock Middle School Trade Career Day", start: "2026-12-09T08:00:00-05:00", end: "2026-12-09T12:00:00-05:00", place: "McClintock Middle School", address: "1925 Rama Rd, Charlotte, NC 28212", note: "Engaging students with the trades", link: BASE + "mcclintock-middle-school-trade-career-day" },
    { title: "Union Preparatory School College & Career Day", start: "2027-03-24T08:00:00-04:00", end: "2027-03-24T11:30:00-04:00", place: "Union Preparatory Academy at Indian Trail", address: "2324 Younts Rd, Indian Trail, NC 28079", note: "", link: BASE + "union-preparatory-school-college-career-day" }
  ];

  var TZ = "America/New_York";

  function fmt(d, opts) {
    var o = { timeZone: TZ };
    for (var k in opts) o[k] = opts[k];
    return new Intl.DateTimeFormat("en-US", o).format(d);
  }

  function timeRange(s, e) {
    return fmt(s, { hour: "numeric", minute: "2-digit" }) + " to " + fmt(e, { hour: "numeric", minute: "2-digit" });
  }

  function esc(t) {
    return String(t).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function upcoming(now) {
    return EVENTS.map(function (e) { return { e: e, s: new Date(e.start), en: new Date(e.end) }; })
      .filter(function (x) { return x.en > now; })
      .sort(function (a, b) { return a.s - b.s; });
  }

  /* ---------- Event lists ---------- */
  document.querySelectorAll("[data-events]").forEach(function (box) {
    var limit = parseInt(box.getAttribute("data-limit") || "0", 10);
    var list = upcoming(new Date());
    if (limit) list = list.slice(0, limit);
    if (!list.length) {
      box.innerHTML = '<p class="events-empty">No upcoming events are listed right now. <a href="' + EVENTS_PAGE + '">See the full calendar</a>.</p>';
      return;
    }
    var thisYear = fmt(new Date(), { year: "numeric" });
    var html = '<ul class="event-list">';
    list.forEach(function (x) {
      var e = x.e;
      var yr = fmt(x.s, { year: "numeric" });
      html += '<li class="event-row">' +
        '<div class="date-tile"><span class="m">' + fmt(x.s, { month: "short" }) + '</span><span class="d">' + fmt(x.s, { day: "numeric" }) + '</span><span class="w">' + fmt(x.s, { weekday: "short" }) + (yr !== thisYear ? " " + yr : "") + '</span></div>' +
        '<div><h3>' + esc(e.title) + '</h3>' +
        '<p class="meta">' + timeRange(x.s, x.en) + ' &middot; ' + esc(e.place) + '</p>' +
        '<p>' + esc(e.address) + (e.note ? ' &middot; ' + esc(e.note) : '') + '</p></div>' +
        '<a class="btn btn-ghost" href="' + esc(e.link) + '">Details &amp; RSVP</a>' +
        '</li>';
    });
    box.innerHTML = html + '</ul>';
  });

  /* ---------- Countdown to the next event ---------- */
  function pad(n) { return (n < 10 ? "0" : "") + n; }

  document.querySelectorAll("[data-countdown]").forEach(function (box) {
    var list = upcoming(new Date());
    if (!list.length) { box.hidden = true; return; }
    var next = list[0];
    var e = next.e;
    var q = function (sel) { return box.querySelector(sel); };

    q("[data-cd-title]").textContent = e.title;
    q("[data-cd-when]").textContent = fmt(next.s, { weekday: "long", month: "long", day: "numeric" }) + ", " + timeRange(next.s, next.en);
    q("[data-cd-where]").textContent = e.place + ", " + e.address;
    var link = q("[data-cd-link]");
    if (link) link.href = e.link;

    var label = q("[data-cd-label]");
    var dEl = q("[data-cd-d]"), hEl = q("[data-cd-h]"), mEl = q("[data-cd-m]"), sEl = q("[data-cd-s]");

    function tick() {
      var ms = next.s - new Date();
      if (ms <= 0) {
        ms = 0;
        if (label) label.textContent = "Happening now";
      }
      var sec = Math.floor(ms / 1000);
      dEl.textContent = Math.floor(sec / 86400);
      hEl.textContent = pad(Math.floor((sec % 86400) / 3600));
      mEl.textContent = pad(Math.floor((sec % 3600) / 60));
      sEl.textContent = pad(sec % 60);
    }
    tick();
    setInterval(tick, 1000);
  });
})();
