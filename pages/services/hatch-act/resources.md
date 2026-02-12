---
title: Additional Resources for Hatch Act
eleventyNavigation:
  order: 9
---

- Hatch Act: Overview - Video
- Hatch Act: State and Local Employees - Video
- Hatch Act: Official Authority Prohibition - Video
- Hatch Act: Solicitation Prohibition - Video
- Hatch Act On-Duty Prohibition - Video
- Hatch Act Reports
- Hatch Act Posters, Handouts, and Training Materials

## Hatch Act: Overview - Video

## Hatch Act: State and Local Employees - Video

## Hatch Act: Official Authority Prohibition - Video

## Hatch Act: Solicitation Prohibition - Video

## Hatch Act On-Duty Prohibition - Video

## Hatch Act Reports

[Report of Prohibited Political Activity, Carlos Del Toro (HA-24-000104)](<../../~assets/docs/report-of-prohibited-political-activity-carlos-del-toro-ha-24-000104.pdf>)

[Report of Prohibited Political Activity, Rachael Rollins (HA-22-000173)](<../../~assets/docs/report-of-prohibited-political-activity-rachael-rollins-ha-22-000173.pdf>)

[Report of Prohibited Political Activity, Xavier Becerra (HA-22-000223)](<../../~assets/docs/report-of-prohibited-political-activity-xavier-becerra-ha-22-000223.pdf>)

[Investigation of Political Activities by Senior Trump Administration Officials During the 2020 Presidential Election](../../~assets/docs/investigation-of-political-activities-by-senior-trump-administratio-136ab295.pdf)

[Report of Prohibited Political Activity, Carla Sands, HA-20-000091](../../~assets/docs/report-of-prohibited-political-activity-carla-sands-ha-20-000091.pdf)

[Report of Prohibited Political Activity, Dr. Peter Navarro (HA-20-000279)](<../../~assets/docs/report-of-prohibited-political-activity-dr-peter-navarro-ha-20-000279.pdf>)

[Report of Prohibited Political Activity, Kellyanne Conway (HA-19-0631 & HA-19-3395)](../../~assets/docs/report-of-prohibited-political-activity-kellyanne-conway-ha-19-06-a8748ac5.pdf)

[Report of Prohibited Political Activity, Kellyanne Conway (HA-18-0966)](<../../~assets/docs/report-of-prohibited-political-activity-kellyanne-conway-ha-18-0966.pdf>)

[Report of Prohibited Political Activity, Facilitating Labor Union's Political Activity Through Use of Union Official Leave Without Pay (HA-17-0610)](../../~assets/docs/report-of-prohibited-political-activity-facilitating-labor-unions-6535f18d.pdf)

[Report of Prohibited Political Activity, Julián Castro (HA-16-3113)](<../../~assets/docs/report-of-prohibited-political-activity-julian-castro-ha-16-3113.pdf>)

[Response, Julián Castro (HA-16-3113)](<../../~assets/docs/response-julian-castro-ha-16-3113.pdf>)

[Report of Prohibited Political Activity, Kathleen Sebelius (HA-12-1989)](<../../~assets/docs/report-of-prohibited-political-activity-kathleen-sebelius-ha-12-1989.pdf>)

[Response, Kathleen Sebelius (HA-12-1989)](<../../~assets/docs/response-kathleen-sebelius-ha-12-1989.pdf>)

## Hatch Act Posters, Handouts, and Training Materials

[The Hatch Act and Further Restricted Employees Poster](../../~assets/docs/the-hatch-act-and-further-restricted-employees-poster.pdf)

[The Hatch Act and State, D.C., and Local Employees Poster](../../~assets/docs/the-hatch-act-and-state-dc-and-local-employees-poster.pdf)

[Hatch Act Agencies and Social Media FAQs](../../~assets/docs/hatch-act-agencies-and-social-media-faqs.pdf)

[Hatch Act social media handout](../../~assets/docs/hatch-act-social-media-handout.pdf)

[Social Media Quick Guide](../../~assets/docs/social-media-quick-guide.pdf)

[A Guide to the Hatch Act for Federal Employees](../../~assets/docs/a-guide-to-the-hatch-act-for-federal-employees.pdf)

[Hatch Act Social Media Handout](../../~assets/docs/hatch-act-social-media-handout-1.pdf)

[The Hatch Act and Most Federal Employees Poster](../../~assets/docs/the-hatch-act-and-most-federal-employees-poster.pdf)

## Hatch Act: Overview - Video

## Hatch Act: State and Local Employees - Video

## Hatch Act: Official Authority Prohibition - Video

## Hatch Act: Solicitation Prohibition - Video

## Hatch Act On-Duty Prohibition - Video

## Accordion Control

"use strict"; var t = setInterval(function() { if(window.jQuery) { clearInterval(t); (function ($) { $(function(){ //are we in edit mode? if(!$('.ms-SPZoneLabel').length){ //iterate over each web part zone $('div.ms-webpart-zone').each(function(i){ //current web part zone var wpzone = $(this); //check if have tab script data-script-id if(wpzone.find('\[data-script-id="ResponsiveTabs"\]').length){ var ResponsiveTabsScript = wpzone.find('\[data-script-id="ResponsiveTabs"\]'); //if tab script exists in the current zone. if(ResponsiveTabsScript.length){ wpzone.find('div.ms-webpartzone-cell').addClass('tabZone'); var largestWidth = 0; //get tab "titles"; if any LI elements, the tab has been created // skip this tabGroup, hide the title content var tabTitles = wpzone.find('.resp-tabs-list'); if(tabTitles.find('li').length){ return; } //get tabs container and assign ID var tabs = wpzone.find('.tabs'); tabs.attr('id', 'tabGroup' + i) //get tab content container var tabContent = wpzone.find('.resp-tabs-container'); //get all web parts in zone and iterate var wparts = wpzone.find('.ms-webpartzone-cell'); wparts.each(function(i){ //if this is the tab script, skip this zone if($(this).find(ResponsiveTabsScript).length){ $(this).find('h2.ms-webpart-titleText').hide(); return; } //get web part title and content element var title = $(this).find('h2.ms-webpart-titleText').hide().text(); var bodyElement = $(this).find('\[webpartid\]'); $(this).find('.ms-webpart-chrome-title').hide(); largestWidth = bodyElement.width() > largestWidth ? bodyElement.width() : largestWidth; //if title is empty, assign a title if(title == '') title = 'No Title'; //create an LI element for the tab and append the web part content tabTitles.append($('<li>', {text: title})); //tabContent.append(bodyElement); tabContent.append($('<div>', { "class": "webpart-container"}).append(bodyElement)); }); tabs.find('li').each(function(index){ $(this).addClass('list-item-' + index); }); wpzone.prepend(tabs); //instantiate tabs tabs.easyResponsiveTabs({activate: function(){ var tabId = $(this).attr('aria-controls'); var tabContent = tabs.find('div\[aria-labelledby=' + tabId + '\]') if(tabContent.find('.ms-acal-header').length == 1) { var calendar = tabContent.find('.ms-acal-header'); //calendar.hide(); var parent = calendar.parents('\[webpartid\]:first'); var ctxid = parent.attr('id') ctxid = ctxid.substr(ctxid.indexOf('WebPart') + 7); if(parent.find('.ms-acal-month').length){ \_MoveToViewDate(null, 'month', ctxid); } else if(parent.find('.ms-acal-week-top').length){ \_MoveToViewDate(null, 'week', ctxid); } else if(parent.find('.ms-acal-day-top').length){ \_MoveToViewDate(null, 'day', ctxid); } } }}); } } }); $('.tabs').parent().wrapInner('<div class="tabWrap"/>'); $('.tabWrap').parent().css({display: "block"}); //unhide tabs if using #tabs to hide before wrapped $('#tabs').show(); //class on a header for tab groups $('h2.tab-group-header').parents('.ms-webpartzone-cell').addClass('tab-group-header-wrap'); // remove zero width unicode character $('h2.tab-group-header').each(function(){ var $el = $(this); $el.html($el.html().replace(/\\u200B/g,'')) }); // remove zero width unicode character from other elements $('.tabWrap,.tabs,.resp-tabs-container').each(function(){ var $wrap = $(this); $wrap.contents().filter(function(){ return this.nodeType === 3}) .each(function(){ var matches = this.nodeValue.match(/\\u200B/); if(matches && matches.length) { this.nodeValue = ''; } }) }); } }); })(jQuery); } },1);

## Hatch Act Reports

## Hatch Act Posters, Handouts, and Training Materials
