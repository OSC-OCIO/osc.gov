---
title: FOIA Reports
permalink: /pages/foia-reports-08/


---

*   Annual Reports
*   Quarterly Reports
*   Chief FOIA Officer Reports

## Annual Reports

42 results

[Annual FOIA Report Fiscal Year 2006](../~assets/documents/Annual-FOIA-Report-Fiscal-Year-2006.pdf)

[Annual FOIA Report Fiscal Year 2007](../~assets/documents/Annual-FOIA-Report-Fiscal-Year-2007.pdf)

## Quarterly Reports

35 results

[OSC-2017-Q1](../~assets/documents/OSC-2017-Q1.zip)

[OSC-2016-Q4](../~assets/documents/OSC-2016-Q4.zip)

[OSC-2016-Q3](../~assets/documents/OSC-2016-Q3.zip)

[OSC-2016-Q2](../~assets/documents/OSC-2016-Q2.zip)

[OSC-2016-Q1](../~assets/documents/OSC-2016-Q1.zip)

## Chief FOIA Officer Reports

About 18 results

[Chief FOIA Officer Report Fiscal Year 2025](../~assets/documents/Chief-FOIA-Officer-Report-Fiscal-Year-2025.pdf)

[Chief FOIA Officer Report Fiscal Year 2023](../~assets/documents/Chief-FOIA-Officer-Report-Fiscal-Year-2023.pdf)

[Chief FOIA Officer Report Fiscal Year 2022](../~assets/documents/Chief-FOIA-Officer-Report-Fiscal-Year-2022.pdf)

[Chief FOIA Officer Report Fiscal Year 2021](../~assets/documents/Chief-FOIA-Officer-Report-Fiscal-Year-2021.pdf)

[Chief FOIA Officer Report Fiscal Year 2020](../~assets/documents/Chief-FOIA-Officer-Report-Fiscal-Year-2020.pdf)

[Chief FOIA Officer Report Fiscal Year 2010](../~assets/documents/Chief-FOIA-Officer-Report-Fiscal-Year-2010.pdf)

[Chief FOIA Officer Report Fiscal Year 2011](../~assets/documents/Chief-FOIA-Officer-Report-Fiscal-Year-2011.pdf)

[Chief FOIA Officer Report Fiscal Year 2012](../~assets/documents/Chief-FOIA-Officer-Report-Fiscal-Year-2012.pdf)

[Chief FOIA Officer Report Fiscal Year 2013](../~assets/documents/Chief-FOIA-Officer-Report-Fiscal-Year-2013.pdf)

[Chief FOIA Officer Report Fiscal Year 2014](../~assets/documents/Chief-FOIA-Officer-Report-Fiscal-Year-2014.pdf)

## Accordion Control

"use strict"; var t = setInterval(function() { if(window.jQuery) { clearInterval(t); (function ($) { $(function(){ //are we in edit mode? if(!$('.ms-SPZoneLabel').length){ //iterate over each web part zone $('div.ms-webpart-zone').each(function(i){ //current web part zone var wpzone = $(this); //check if have tab script data-script-id if(wpzone.find('\[data-script-id="ResponsiveTabs"\]').length){ var ResponsiveTabsScript = wpzone.find('\[data-script-id="ResponsiveTabs"\]'); //if tab script exists in the current zone. if(ResponsiveTabsScript.length){ wpzone.find('div.ms-webpartzone-cell').addClass('tabZone'); var largestWidth = 0; //get tab "titles"; if any LI elements, the tab has been created // skip this tabGroup, hide the title content var tabTitles = wpzone.find('.resp-tabs-list'); if(tabTitles.find('li').length){ return; } //get tabs container and assign ID var tabs = wpzone.find('.tabs'); tabs.attr('id', 'tabGroup' + i) //get tab content container var tabContent = wpzone.find('.resp-tabs-container'); //get all web parts in zone and iterate var wparts = wpzone.find('.ms-webpartzone-cell'); wparts.each(function(i){ //if this is the tab script, skip this zone if($(this).find(ResponsiveTabsScript).length){ $(this).find('h2.ms-webpart-titleText').hide(); return; } //get web part title and content element var title = $(this).find('h2.ms-webpart-titleText').hide().text(); var bodyElement = $(this).find('\[webpartid\]'); $(this).find('.ms-webpart-chrome-title').hide(); largestWidth = bodyElement.width() > largestWidth ? bodyElement.width() : largestWidth; //if title is empty, assign a title if(title == '') title = 'No Title'; //create an LI element for the tab and append the web part content tabTitles.append($('<li>', {text: title})); //tabContent.append(bodyElement); tabContent.append($('<div>', { "class": "webpart-container"}).append(bodyElement)); }); tabs.find('li').each(function(index){ $(this).addClass('list-item-' + index); }); wpzone.prepend(tabs); //instantiate tabs tabs.easyResponsiveTabs({activate: function(){ var tabId = $(this).attr('aria-controls'); var tabContent = tabs.find('div\[aria-labelledby=' + tabId + '\]') if(tabContent.find('.ms-acal-header').length == 1) { var calendar = tabContent.find('.ms-acal-header'); //calendar.hide(); var parent = calendar.parents('\[webpartid\]:first'); var ctxid = parent.attr('id') ctxid = ctxid.substr(ctxid.indexOf('WebPart') + 7); if(parent.find('.ms-acal-month').length){ \_MoveToViewDate(null, 'month', ctxid); } else if(parent.find('.ms-acal-week-top').length){ \_MoveToViewDate(null, 'week', ctxid); } else if(parent.find('.ms-acal-day-top').length){ \_MoveToViewDate(null, 'day', ctxid); } } }}); } } }); $('.tabs').parent().wrapInner('<div class="tabWrap"/>'); $('.tabWrap').parent().css({display: "block"}); //unhide tabs if using #tabs to hide before wrapped $('#tabs').show(); //class on a header for tab groups $('h2.tab-group-header').parents('.ms-webpartzone-cell').addClass('tab-group-header-wrap'); // remove zero width unicode character $('h2.tab-group-header').each(function(){ var $el = $(this); $el.html($el.html().replace(/\\u200B/g,'')) }); // remove zero width unicode character from other elements $('.tabWrap,.tabs,.resp-tabs-container').each(function(){ var $wrap = $(this); $wrap.contents().filter(function(){ return this.nodeType === 3}) .each(function(){ var matches = this.nodeValue.match(/\\u200B/); if(matches && matches.length) { this.nodeValue = ''; } }) }); } }); })(jQuery); } },1);

## Annual Reports

## Quarterly Reports

## Chief FOIA Officer Reports