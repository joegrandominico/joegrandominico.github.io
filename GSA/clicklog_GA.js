// Copyright 2007 Google Inc.,  All Rights Reserved
// dspencer@google.com
/**
 * @fileoverview
 *
 * This file is for the clicklogging feature on the GSA.
 *
 * @author dspencer@google.com
 */

/**
 * Function that logs the click to be hit with Google Analytics
 * 
 * Uses all the same parameters as search reporting click logger.
 * 
 * @return {Boolean} true if we think we logged the click.
 */
var cl_analytics_clk = function(url, query, ctype, cdata, rank, start, site, src_id) {
	ctype = ctype.toString();
    switch (ctype) {
	case "load":
		_gaq.push(['_setCustomVar', 2, 'Page Load', query, 2]);
		_gaq.push(['_trackEvent', 'Sending Custom Variable', 'Page Load', query]);
		break;
    case "advanced":
        _gaq.push(['_trackEvent', 'Search Page', 'Advanced Search Link Click', url]);
        break;
    case "advanced_swr":
        _gaq.push(['_trackEvent', 'Search Page', 'Advanced Search for Anchor Text Click', url]);
        break;
    case "c":
        if (rank == 1) {
            _gaq.push(['_setCustomVar', 1, 'Collection', site, 2]);
            _gaq.push(['_trackEvent', 'Results', '1st Search Result Click', url, parseInt((start * 10) + rank)]);
        }
        else {
            _gaq.push(['_setCustomVar', 1, 'Collection', site, 2]);
            _gaq.push(['_trackEvent', 'Results', 'Search Result Click', url, parseInt((start * 10) + rank)]);
        }
        break;
    case "cache":
        _gaq.push(['_trackEvent', 'Results', 'Cached Result Click', url, parseInt((start * 10) + rank)]);
        break;
    case "cluster":
        _gaq.push(['_trackEvent', 'Refinement', 'Cluster Label Click', url]);
        break;
    case "db":
        _gaq.push(['_trackEvent', 'Results', 'Database Results Click', url, parseInt((start * 10) + rank)]);
        break;
    case "desk.groups":
        _gaq.push(['_trackEvent', 'Search Page', 'Google Groups Link Click', url]);
        break;
    case "desk.images":
        _gaq.push(['_trackEvent', 'Search Page', 'Google Images Link click', url]);
        break;
    case "desk.local":
        _gaq.push(['_trackEvent', 'Search Page', 'Google Images Link Click', url]);
        break;
    case "desk.news":
        _gaq.push(['_trackEvent', 'Search Page', 'Google News Link Click', url]);
        break;
    case "desk.web":
        _gaq.push(['_trackEvent', 'Search Page', 'Google Web Search Link Click', url]);
        break;
    case "help":
        _gaq.push(['_trackEvent', 'Search Page', 'Search Tips Link Click', url]);
        break;
    case "keymatch":
        _gaq.push(['_trackEvent', 'Results', 'Keymatch Result Click', query + ': ' + url, parseInt((start * 10) + rank)]);
        break;
    case "logo":
        _gaq.push(['_trackEvent', 'Search Page', 'Hyperlinked Logo Click', url]);
        break;
    case "nav.next":
        _gaq.push(['_trackEvent', 'Navigation', 'Next Results Page Click', url]);
        break;
    case "nav.page":
        _gaq.push(['_trackEvent', 'Navigation', 'Specific Page Number Click', url]);
        break;
    case "nav.prev":
        _gaq.push(['_trackEvent', 'Navigation', 'Previous Results Page Click', url]);
        break;
    case "onebox":
        _gaq.push(['_trackEvent', 'Results', 'OneBox Result Click', url, parseInt((start * 10) + rank)]);
        break;
    case "sitesearch":
        _gaq.push(['_trackEvent', 'Refinement', 'More results from... Link Click', url]);
        break;
    case "sort":
        _gaq.push(['_trackEvent', 'Navigation', 'Sort Link Click', url]);
        break;
    case "spell":
        _gaq.push(['_trackEvent', 'Navigation', 'Sort Link Click', url]);
        break;
    case "synonym":
        _gaq.push(['_trackEvent', 'Refinement', 'Synonym Click', url]);
        break;
    default:
        _gaq.push(['_trackEvent', 'Results', 'Unknown Result Type', url]);
        break;
    }
    return new Boolean(true);
};

/**
 * Create an image tag that causes the URL that logs the click
 * to be hit.
 *
 * @param {String} url target URL the user clicked on
 * @param {String} query users search query
 * @param {String} ctype click type
 * @param {String} cdata optional click data
 * @param {String} rank optional rank, 1 based, usually 1..10
 * @param {String} start optional starting page offset, usually 0
 *                                             on 1st page, 10 on 2nd page etc
 * @param {String} site optional indicates which collection served the page
 * @param {String} src_id optional indicates which GSA the result came from
                                               in federation
 * @return {Boolean} true if we think we logged the click
 */
var cl_clk = function(url, query, ctype, cdata, rank, start, site, src_id) {
    if (!document.images) {
        return new Boolean(false);
    }
    var esc = encodeURIComponent || escape;
    var img = document.createElement('img');

    var src = "/click?" +
    (query ? "&q=" + esc(query) : "") +
    (ctype ? "&ct=" + esc(ctype) : "") +
    (cdata ? "&cd=" + esc(cdata) : "") +
    (url ? "&url=" + esc(url.replace(/#.*/, "")).replace(/\+/g, "%2B") : "");

    if (rank != null && typeof rank != 'undefined') {
        src += "&r=" + esc(rank);
    }
    if (start != null && typeof start != 'undefined') {
        src += "&s=" + esc(start);
    }
    if (site != null && typeof site != 'undefined') {
        src += "&site=" + esc(site);
    }
    if (src_id != null && typeof src_id != 'undefined') {
        src += "&src_id=" + esc(src_id);
    }

    img.src = src;

    return new Boolean(true);
};


/**
 * Log click on a link by picking out appropriate
 * attributes in the element that describe the link.
 * We expect to get called from an onmousedown handler
 * such that 'this' is an &lt;a&gt; tag. We look
 * for attributes named "ctype", "cdata", and "rank".
 *
 * @param {Event} ev optional DOM event
 */
var cl_link_clicked = function(ev) {
    var target = this;
    // When this is called directly from an event handler in FF at least,
    // 'this' is not the <a> element, so we try to detect this and adjust.
    if (!target.getAttribute && ev) {
        if (ev.target) {
            target = ev.target;
        } else if (ev.srcElement) {
            target = ev.srcElement;
        }
        if (target.nodeType == 3) {
            target = target.parentNode;
        }
    }
    var cdata = target.getAttribute("cdata");
    var ctype = target.getAttribute("ctype");
    var rank = target.getAttribute("rank");
    var src_id = target.getAttribute("src_id");
    if (!ctype) {
        ctype = "OTHER";
        // unknown link type
    }
    var url;
    if (target.href) {
        url = target.href;
    } else {
        url = "#";
        // link w/o href
    }

    cl_clk(url, page_query, ctype, cdata, rank, page_start, page_site, src_id);
    // Calls Analytics Event Tracking code
    cl_analytics_clk(url, page_query, ctype, cdata, rank, page_start, page_site, src_id);

    return true;
};

// Attach onmousedown handlers to all links
var ar = document.getElementsByTagName("a");
var arlen = ar.length;
for (var i = 0; i < arlen; i++) {
    var el = ar[i];
    if (!el.onmousedown) {
        el.onmousedown = cl_link_clicked;
    }
}

// Log the load of the page.
cl_clk(null, page_query, new String('load'), null, null, page_start, page_site, null);
cl_analytics_clk(null, page_query, new String('load'), null, null, page_start, page_site, null);