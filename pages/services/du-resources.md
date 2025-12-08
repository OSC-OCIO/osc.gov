---
title: Additional Resources for Disclosure of Wrongdoing
permalink: /servicesdu-resources/
---

- Disclosures of Wrongdoing - Video
- DU Posters, Handouts, & Training Materials
- Other Disclosure of Wrongdoing Resources

## Disclosures of Wrongdoing - Video

## DU Posters, Handouts, & Training Materials

[Agency Monitoring Policies and Whistleblower Disclosures, February 1, 2018](../../~assets/documents/Agency-Monitoring-Policies-and-Whistleblower-Disclosures,-February-1,-2018.pdf)

[OSC Monetary Policy re Whistleblowers 5.20.25](../../~assets/documents/OSC-Monetary-Policy-re-Whistleblowers-5.20.25.pdf)

[1213(c) Appendix May 2025](<../../~assets/documents/1213(c)-Appendix-May-2025.pdf>)

## Other Disclosure of Wrongdoing Resources

[Agency Monitoring Policies and Whistleblower Disclosures, February 1, 2018](../../~assets/documents/Agency-Monitoring-Policies-and-Whistleblower-Disclosures,-February-1,-2018.pdf)

[OSC Monetary Policy re Whistleblowers 5.20.25](../../~assets/documents/OSC-Monetary-Policy-re-Whistleblowers-5.20.25.pdf)

[1213(c) Appendix May 2025](<../../~assets/documents/1213(c)-Appendix-May-2025.pdf>)

## Accordion Control

"use strict"; var t = setInterval(function() { if(window.jQuery) { clearInterval(t); (function ($) { $(function(){ //are we in edit mode? if(!$('.ms-SPZoneLabel').length){ //iterate over each web part zone $('div.ms-webpart-zone').each(function(i){ //current web part zone var wpzone = $(this); //check if have tab script data-script-id if(wpzone.find('\[data-script-id="ResponsiveTabs"\]').length){ var ResponsiveTabsScript = wpzone.find('\[data-script-id="ResponsiveTabs"\]'); //if tab script exists in the current zone. if(ResponsiveTabsScript.length){ wpzone.find('div.ms-webpartzone-cell').addClass('tabZone'); var largestWidth = 0; //get tab "titles"; if any LI elements, the tab has been created // skip this tabGroup, hide the title content var tabTitles = wpzone.find('.resp-tabs-list'); if(tabTitles.find('li').length){ return; } //get tabs container and assign ID var tabs = wpzone.find('.tabs'); tabs.attr('id', 'tabGroup' + i) //get tab content container var tabContent = wpzone.find('.resp-tabs-container'); //get all web parts in zone and iterate var wparts = wpzone.find('.ms-webpartzone-cell'); wparts.each(function(i){ //if this is the tab script, skip this zone if($(this).find(ResponsiveTabsScript).length){ $(this).find('h2.ms-webpart-titleText').hide(); return; } //get web part title and content element var title = $(this).find('h2.ms-webpart-titleText').hide().text(); var bodyElement = $(this).find('\[webpartid\]'); $(this).find('.ms-webpart-chrome-title').hide(); largestWidth = bodyElement.width() > largestWidth ? bodyElement.width() : largestWidth; //if title is empty, assign a title if(title == '') title = 'No Title'; //create an LI element for the tab and append the web part content tabTitles.append($('<li>', {text: title})); //tabContent.append(bodyElement); tabContent.append($('<div>', { "class": "webpart-container"}).append(bodyElement)); }); tabs.find('li').each(function(index){ $(this).addClass('list-item-' + index); }); wpzone.prepend(tabs); //instantiate tabs tabs.easyResponsiveTabs({activate: function(){ var tabId = $(this).attr('aria-controls'); var tabContent = tabs.find('div\[aria-labelledby=' + tabId + '\]') if(tabContent.find('.ms-acal-header').length == 1) { var calendar = tabContent.find('.ms-acal-header'); //calendar.hide(); var parent = calendar.parents('\[webpartid\]:first'); var ctxid = parent.attr('id') ctxid = ctxid.substr(ctxid.indexOf('WebPart') + 7); if(parent.find('.ms-acal-month').length){ \_MoveToViewDate(null, 'month', ctxid); } else if(parent.find('.ms-acal-week-top').length){ \_MoveToViewDate(null, 'week', ctxid); } else if(parent.find('.ms-acal-day-top').length){ \_MoveToViewDate(null, 'day', ctxid); } } }}); } } }); $('.tabs').parent().wrapInner('<div class="tabWrap"/>'); $('.tabWrap').parent().css({display: "block"}); //unhide tabs if using #tabs to hide before wrapped $('#tabs').show(); //class on a header for tab groups $('h2.tab-group-header').parents('.ms-webpartzone-cell').addClass('tab-group-header-wrap'); // remove zero width unicode character $('h2.tab-group-header').each(function(){ var $el = $(this); $el.html($el.html().replace(/\\u200B/g,'')) }); // remove zero width unicode character from other elements $('.tabWrap,.tabs,.resp-tabs-container').each(function(){ var $wrap = $(this); $wrap.contents().filter(function(){ return this.nodeType === 3}) .each(function(){ var matches = this.nodeValue.match(/\\u200B/); if(matches && matches.length) { this.nodeValue = ''; } }) }); } }); })(jQuery); } },1);

## Disclosures of Wrongdoing - Video

## DU Posters, Handouts, & Training Materials

## Other Disclosure of Wrongdoing Resources
