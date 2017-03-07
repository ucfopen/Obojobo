/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "build/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(194);


/***/ },

/***/ 194:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var APIUtil, Dispatcher, _debounce, ie, json, legacyJson, moduleData, onBlur, onFocus, render, showDocument;

	APIUtil = window.Viewer.util.APIUtil;

	_debounce = function debounce(ms, cb) {
	  clearTimeout(_debounce.id);
	  return _debounce.id = setTimeout(cb, ms);
	};

	_debounce.id = null;

	Dispatcher = window.ObojoboDraft.Common.flux.Dispatcher;

	onFocus = function onFocus() {
	  document.body.className = 'is-focused-window';
	  return Dispatcher.trigger('window:focus');
	};

	onBlur = function onBlur() {
	  document.body.className = 'is-blured-window';
	  return Dispatcher.trigger('window:blur');
	};

	ie = false;

	//@cc_on ie = true;

	if (ie) {
	  document.onfocusin = onFocus;
	  document.onfocusout = onBlur;
	} else {
	  window.onfocus = onFocus;
	  window.onblur = onBlur;
	}

	moduleData = {
	  model: null,
	  navState: null,
	  scoreState: null,
	  questionState: null,
	  assessmentState: null,
	  modalState: null
	};

	render = function (_this) {
	  return function (json) {
	    console.log('RENDER');
	    return ReactDOM.render(React.createElement(
	      'div',
	      { className: 'root' },
	      React.createElement(window.Viewer.components.ViewerApp, { json: json })
	    ), document.getElementById('viewer-app'));
	  };
	}(undefined);

	showDocument = function (_this) {
	  return function (json) {
	    return render(json);
	  };
	}(undefined);

	if (window.location.hash.indexOf('legacy') > -1) {
	  legacyJson = __webpack_require__(234);
	  moduleData.model = window.ObojoboDraft.Common.models.Legacy.createModuleFromObo2ModuleJSON(legacyJson);
	  NavStore.init(moduleData.model);
	  render();
	} else if (window.location.hash.indexOf('file') > -1) {
	  json = __webpack_require__(235);
	  showDocument(json);
	} else {
	  APIUtil.fetchDraft('sample').then(function (_this) {
	    return function (res) {
	      return showDocument(res.value);
	    };
	  }(undefined));
	}

/***/ },

/***/ 234:
/***/ function(module, exports) {

	module.exports = {
		"loID": 23735,
		"title": "Citing Sources Using MLA Style",
		"languageID": 1,
		"notesID": 0,
		"notes": "",
		"objID": 0,
		"objective": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"1\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"1\">Given examples of the following sources, students will be able to accurately demonstrate how to use works cited entries and parenthetical citations based on styles found in the MLA Handbook for Writers of Research Papers, 7th Edition (2009):</FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><LI><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><LI><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"1\">books,<FONT KERNING=\"0\"></FONT></FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><LI><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"1\">articles from print journals,<FONT KERNING=\"0\"></FONT></FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><LI><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"1\">articles from electronic journals, and<FONT KERNING=\"0\"></FONT></FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><LI><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"1\">information found on web pages.<FONT KERNING=\"0\"></FONT></FONT></LI></TEXTFORMAT>",
		"learnTime": 30,
		"version": 6,
		"subVersion": 0,
		"rootID": 23735,
		"parentID": 20144,
		"createTime": 1356103014,
		"copyright": "",
		"pages": [
			{
				"pageID": "22620",
				"title": "Citing Sources",
				"userID": 0,
				"layoutID": 1,
				"createTime": "1272378343",
				"items": [
					{
						"pageItemID": 0,
						"component": "TextArea",
						"data": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"35\" RIGHTMARGIN=\"35\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#990000\" LETTERSPACING=\"0\" KERNING=\"0\"><B>Citing to Avoid Plagiarism</B></FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"1\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"1\">Citing sources is the way that you identify any outside information you use in your writing. Anytime you use someone else&apos;s text or ideas, you must acknowledge the original source to avoid plagiarism. Academic work often builds on information written by other authors, and to properly use someone else&apos;s words or ideas it is required that you cite the source. When you cite, you are clearly identifying the outside sources you use in your work and you are giving credit to the original author(s). Citing also provides readers with the details they need to locate a source. Therefore, whenever you are quoting, paraphrasing or synthesizing someone else&apos;s ideas alongside your own, you must cite the source of those ideas. If you use your own ideas, opinions or conclusions, you do not need to cite them. You also do not need to cite information that is considered common knowledge such as facts or dates. For example, if you write that Canada borders the United States and this is a well-known fact to your audience, you aren&apos;t required to cite that information.</FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"35\" RIGHTMARGIN=\"35\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#990000\" LETTERSPACING=\"0\" KERNING=\"0\"><B>Citation Styles</B></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">There are several citation styles you can use to cite sources and each is associated with an academic discipline. Check with your professors to find out which style is required for a course. Once you know the style, follow the rules and examples given in the specific style manual for the type of source you are citing. Some frequently used style manuals are listed below. Copies of these and other style manuals are available in the reference area of the library and online.</FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"5\"><LI><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">AMA Manual of Style: A Guide for Authors and Editors (American Medical Assoc.)</FONT></LI></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"5\"><LI><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">APA Publication Manual of the American Psychological Association</FONT></LI></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"5\"><LI><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">CMS Chicago Manual of Style</FONT></LI></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"5\"><LI><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">MLA Handbook for Writers of Research Papers (Modern Language Assoc.)</FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">           </FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"><I>              </I></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">            </FONT></P></TEXTFORMAT>",
						"media": [],
						"advancedEdit": 0,
						"options": null,
						"_explicitType": "obo\\lo\\PageItem"
					}
				],
				"questionID": -1,
				"_explicitType": "obo\\lo\\Page"
			},
			{
				"pageID": "22670",
				"title": "About MLA Style",
				"userID": 0,
				"layoutID": 4,
				"createTime": "1272460320",
				"items": [
					{
						"pageItemID": 0,
						"component": "TextArea",
						"data": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"5\" RIGHTMARGIN=\"5\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#990000\" LETTERSPACING=\"0\" KERNING=\"0\"><B>MLA Handbook</B></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"15\" RIGHTMARGIN=\"15\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">This module uses MLA style guidelines published in the <B><I>MLA Handbook for Writers of Research Papers,</I></B><B> 7</B><B><I>th Edition </I></B>(also called the <B>MLA Handbook</B>). The MLA Handbook includes instructions on how to prepare research papers and detailed examples on how to create works cited entries and parenthetical citations for various types of sources.</FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"15\" RIGHTMARGIN=\"15\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"5\" RIGHTMARGIN=\"5\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#990000\" LETTERSPACING=\"0\" KERNING=\"0\"><B>Formatting Citations</B></FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"15\" RIGHTMARGIN=\"15\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"15\" RIGHTMARGIN=\"15\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"1\">Examples in this module illustrate how to use works cited entries and parenthetical citations to cite basic sources that include books, journal articles in both print and electronic (online) versions, and web pages. It is recommended that you consult a copy of the MLA Handbook to apply specific guidelines to the many other types of sources you may need to cite such as dissertations, conference proceedings, interviews, blogs, etc.</FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"15\" RIGHTMARGIN=\"15\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"1\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"15\" RIGHTMARGIN=\"15\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT>",
						"media": [],
						"advancedEdit": 0,
						"options": null,
						"_explicitType": "obo\\lo\\PageItem"
					},
					{
						"pageItemID": 0,
						"component": "MediaView",
						"data": "",
						"media": [
							{
								"mediaID": 3485,
								"auth": "710",
								"title": "MLA handbook-2",
								"itemType": "pic",
								"descText": "CSMLA Handbook update 2012",
								"createTime": 1355510848,
								"copyright": "Public domain.",
								"thumb": "0",
								"url": "MLA_handbook-2.gif",
								"size": "49819",
								"length": null,
								"perms": null,
								"height": 373,
								"width": 250,
								"meta": 0,
								"attribution": 0,
								"_explicitType": "obo\\lo\\Media"
							}
						],
						"advancedEdit": 0,
						"options": null,
						"_explicitType": "obo\\lo\\PageItem"
					}
				],
				"questionID": -1,
				"_explicitType": "obo\\lo\\Page"
			},
			{
				"pageID": "22631",
				"title": "MLA Citations Step 1",
				"userID": 0,
				"layoutID": 1,
				"createTime": "",
				"items": [
					{
						"pageItemID": 0,
						"component": "TextArea",
						"data": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"1\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"1\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#993300\" LETTERSPACING=\"0\" KERNING=\"1\"><B>Creating MLA citations is a two-step process.</B></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#993300\" LETTERSPACING=\"0\" KERNING=\"0\"><B>Step 1</B><FONT COLOR=\"#000000\"> -- <FONT COLOR=\"#393939\"> Start by creating a new page titled <B>Works Cited</B>. Center the title at the top of the page, include a one-inch top margin and place the page at the end of your paper. On this page, create a list of entries that includes each source you used to write your paper. (Some citation styles title this page References or Bibliography.)<FONT COLOR=\"#993300\"></FONT></FONT></FONT></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">Entries on the Works Cited page are listed alphabetically by the first author&apos;s last name. For works with no author listed, entries usually begin with the title of the book or title of the article. Each MLA works cited entry should be double-spaced. The first line of each entry should begin at the left margin and all subsequent lines should be indented 5 spaces or 1/2 inch - this is called a hanging indent. The information included in each works cited entry provides your readers with the details they need to locate the source.</FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#993300\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">The example below shows a works cited entry for a book. This example includes the basic information required for a works cited entry. For other types of sources, such as journal articles or web pages, additional information is usually required. The basic information for an entry should include: author&apos;s name(s), title of work, city of publication, the publisher&apos;s name, the publication date, and the medium of publication. Notice that entries include a combination of <FONT KERNING=\"1\">upper and lower case text and also use </FONT>italicized text depending on the type of source you are citing.</FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#993300\" LETTERSPACING=\"0\" KERNING=\"1\">Example</FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><LI><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><LI><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">Ely, Christine and Ian Scott. <I>Essential Study Skills</I>. Edinburgh: Mosby-Elsevier, 2007. Print.</FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"><I>Note: Examples in this module may not show the exact alignment and spacing required for works cited entries and parenthetical citations due to varying screen dimensions.</I></FONT></P></TEXTFORMAT>",
						"media": [],
						"advancedEdit": 0,
						"options": null,
						"_explicitType": "obo\\lo\\PageItem"
					}
				],
				"questionID": -1,
				"_explicitType": "obo\\lo\\Page"
			},
			{
				"pageID": "22645",
				"title": "MLA Citations Step 2",
				"userID": 0,
				"layoutID": 1,
				"createTime": "",
				"items": [
					{
						"pageItemID": 0,
						"component": "TextArea",
						"data": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#993300\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#993300\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#993300\" LETTERSPACING=\"0\" KERNING=\"1\"><B>The next step is creating MLA parenthetical citations.</B></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#993300\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#993300\" LETTERSPACING=\"0\" KERNING=\"0\"><B>Step 2 </B><FONT COLOR=\"#000000\">-- <FONT COLOR=\"#393939\">Each source listed on your <B>Works Cited</B> page should have a corresponding <B>parenthetical citation</B> within the text of your paper. Parenthetical citations should be added whenever you include a quote and paraphrased or summarized text or ideas to point your readers to the details listed on the Works Cited page. Sometimes parenthetical citations are called in-text citations or parenthetical documentation.<FONT COLOR=\"#993300\"></FONT></FONT></FONT></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">The examples below show formats for basic MLA parenthetical citations. Parenthetical citations are often placed at the end of a sentence and are added before the closing punctuation. They usually include the author&apos;s last name and a page number. A parenthetical citation after a quote should follow the closing quotation. Keep in mind that the information required in a parenthetical citation will depend on the type of source you are citing – or the medium (print or web) and if the entry on your Works Cited page is listed by author or by title. Parenthetical citations may also be added within the text of a paper near to where a source is discussed.</FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#993300\" LETTERSPACING=\"0\" KERNING=\"1\">Examples of basic formats.</FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><LI><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><LI><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">Using interactive media in online learning offers many benefits (Howard 136). </FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><LI><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><LI><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">A style guide provides useful information to help in preparing research papers and other nonfiction writing (MLA Handbook for Writers of Research Papers 5). </FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><LI><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><LI><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">The authors note that “the big question with regard to effects of information overload is whether and how it impacts decision accuracy, decision time, and general performance” (Eppler and Mengis 331).</FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT>",
						"media": [],
						"advancedEdit": 0,
						"options": null,
						"_explicitType": "obo\\lo\\PageItem"
					}
				],
				"questionID": -1,
				"_explicitType": "obo\\lo\\Page"
			},
			{
				"pageID": "22635",
				"title": "Integrating Sources & Citing",
				"userID": 0,
				"layoutID": 1,
				"createTime": "",
				"items": [
					{
						"pageItemID": 0,
						"component": "TextArea",
						"data": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#993300\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#993300\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#993300\" LETTERSPACING=\"0\" KERNING=\"0\"><B>Guidelines for Integrating Sources</B></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">How you integrate paraphrased material into your writing is an important consideration when citing sources. <FONT KERNING=\"1\">In some cases, you will apply the basic styles shown on the previous page where you discuss an individual source and then add the parenthetical citation.</FONT> However, in other cases you may want to discuss a group of sources that relate to a specific point you are discussing. When you synthesize ideas from multiple sources, you can include each of the source citations in one set of parentheses, as shown in the following example.</FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#993300\" LETTERSPACING=\"0\" KERNING=\"1\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#993300\" LETTERSPACING=\"0\" KERNING=\"1\">Example</FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><LI><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><LI><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">Research about the concept of information overload spans topics linked to sensory overload, communication overload, and knowledge overload (Eppler and Mengis 325-344; Hunt and Newman 70-75; Meier 521-544).</FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">Another consideration relates to the information included in a parenthetical citation, and this often depends on whether or not you include the author&apos;s name(s) as part of an introductory sentence for the source. The example below illustrates a parenthetical citation that includes only the page number because the author&apos;s names are included as part of an introductory sentence. If you do not include the author&apos;s name(s), you would simply use the basic parenthetical citation format shown on the previous page. </FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#993300\" LETTERSPACING=\"0\" KERNING=\"1\">Example</FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><LI><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><LI><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">In a discussion of information overload, Eppler and Mengis investigated four business-related fields. Their conclusions suggest that an interdisciplinary research approach may be beneficial since it may help us better understand the effect of prolonged information overload on employees and organizations (341).</FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">Integrating quotes into your writing is also an important consideration. Relevant quotes should support your interpretation of a topic or a specific point, and they should provide an example of your analysis for the reader. <FONT KERNING=\"1\">First, include an introductory sentence to connect the quote to the point you are making. Then add the quote in quotations and provide a follow up sentence or two that gives your analysis of the quote and how it pertains to your point. </FONT>This structure should clearly convey the relevance of the quote and also demonstrate what you derived from it. The following example illustrates how these elements might be structured. </FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#993300\" LETTERSPACING=\"0\" KERNING=\"1\">Example</FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><LI><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><LI><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">In a discussion of information overload, Eppler and Mengis investigated four business-related fields. The authors note that “the big question with regard to effects of information overload is whether and how it impacts decision accuracy, decision time, and general performance” (331). Future research to investigate the potential impact of these areas on performance is needed. However, the impact may be offset by providing individuals with the right tools to improve their time and information management. The authors suggest that an interdisciplinary research approach may be beneficial since it may help us better understand the effect of prolonged information overload on employees and organizations.</FONT></LI></TEXTFORMAT>",
						"media": [],
						"advancedEdit": 0,
						"options": null,
						"_explicitType": "obo\\lo\\PageItem"
					}
				],
				"questionID": -1,
				"_explicitType": "obo\\lo\\Page"
			},
			{
				"pageID": "22603",
				"title": "Works Cited Entry -- Book",
				"userID": 0,
				"layoutID": 1,
				"createTime": "1271771171",
				"items": [
					{
						"pageItemID": 0,
						"component": "TextArea",
						"data": "<TEXTFORMAT LEADING=\"2\"><LI><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><LI><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></LI></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"5\" RIGHTMARGIN=\"35\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"1\">So far we have been discussing how to format works cited entries and parenthetical citations. For the rest of the module, you will see examples and practice constructing works cited entries for books, journal articles and web pages.</FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"35\" RIGHTMARGIN=\"35\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#990000\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"35\" RIGHTMARGIN=\"35\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#990000\" LETTERSPACING=\"0\" KERNING=\"0\"><B>Identifying and Formatting Book Entries</B></FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">A basic works cited entry for a print book is formatted as follows and includes:</FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">Author&apos;s Last name, First name. <I>Title of Book</I>. Publication City: Publisher&apos;s Name, Publication Year. Medium.</FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"1\"><I>(</I><B><I>Note</I></B><I>: The example above does not show the exact alignment and spacing of an MLA works cited entry. The first line of each entry should be flush with the left margin, and all subsequent lines should be indented 5 spaces or 1/2 inch. MLA works cited entries are also double-spaced.)</I></FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">     </FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">If the book you are citing has<FONT KERNING=\"1\"> more than one edition, include the edition number. The edition number should be added after the title.</FONT></FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#993300\" LETTERSPACING=\"0\" KERNING=\"1\">Example</FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"2\"><LI><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"1\"></FONT></LI></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"2\"><LI><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"1\">Strunk, William, E. B. White, and Roger Angell. <I>The Elements of Style.</I> 4th ed. Boston: Allyn and Bacon, 1999. Print.<FONT KERNING=\"0\"></FONT></FONT></LI></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"1\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"1\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"1\">The new <I>Medium</I> element in the citation refers to how a source is accessed, such as print or web. This element was added in the current MLA Handbook (7th Edition) and is now required for all works cited entries.</FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">On the next screen, you will practice identifying and then formatting the elements required for a works cited entry for a print book. It is a two-part practice. First, you will drag and drop all the required elements from the graphic to the bottom of the screen. Next, you will format the elements correctly.</FONT></P></TEXTFORMAT>",
						"media": [],
						"advancedEdit": 0,
						"options": null,
						"_explicitType": "obo\\lo\\PageItem"
					}
				],
				"questionID": -1,
				"_explicitType": "obo\\lo\\Page"
			},
			{
				"pageID": "11600",
				"title": "Basic Book Entry ",
				"userID": "0",
				"layoutID": "7",
				"createTime": "1271771171",
				"items": [
					{
						"pageItemID": "17438",
						"component": "MediaView",
						"data": "",
						"media": [
							{
								"mediaID": "1744",
								"auth": "710",
								"title": "MLA C book rev2",
								"itemType": "swf",
								"descText": "MLA_C_book_rev2",
								"createTime": "1271431408",
								"copyright": "Copyright 2010 Corinne J. Bishop.",
								"thumb": "0",
								"url": "MLA_C_book_rev2.swf",
								"size": "116836",
								"length": "1",
								"perms": null,
								"height": "510",
								"width": "780",
								"meta": {
									"version": 9,
									"asVersion": 3
								},
								"attribution": "0",
								"_explicitType": "obo\\lo\\Media"
							}
						],
						"advancedEdit": "0",
						"options": false,
						"_explicitType": "obo\\lo\\PageItem"
					}
				],
				"questionID": -1,
				"_explicitType": "obo\\lo\\Page"
			},
			{
				"pageID": "19132",
				"title": "Works Cited Entry -- Scholarly Journal (Print)",
				"userID": 0,
				"layoutID": 1,
				"createTime": "1271771171",
				"items": [
					{
						"pageItemID": 0,
						"component": "TextArea",
						"data": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#990000\" LETTERSPACING=\"0\" KERNING=\"0\"><B>     Identifying and Formatting Scholarly Journal Entries (Print)</B></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">     A works cited entry for a scholarly journal article in print is formatted as follows and includes:</FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">     Author&apos;s Last name, First name. &quot;Title of Article.&quot; <I>Journal Title</I> Volume Number. Issue Number </FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">         (Publication Year): Pages. Medium.</FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">     <I>(Note: The example does not show the exact alignment and spacing for an MLA works cited entry. The first line of each entry should be flush with the left margin, and all subsequent lines should be indented 5 spaces or 1/2 inch. MLA works cited entries are also double-spaced.)</I></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">     On the next screen, you will practice identifying and formatting the elements required for a works cited entry for a scholarly journal article in print format. </FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">     This is a two-part practice. First, you will drag and drop all the required elements from the graphic to the bottom of the screen. Next, you will format the elements correctly.</FONT></P></TEXTFORMAT>",
						"media": [],
						"advancedEdit": 0,
						"options": null,
						"_explicitType": "obo\\lo\\PageItem"
					}
				],
				"questionID": -1,
				"_explicitType": "obo\\lo\\Page"
			},
			{
				"pageID": "11602",
				"title": "Scholarly Journal Entry (Print) ",
				"userID": "0",
				"layoutID": "7",
				"createTime": "1271771171",
				"items": [
					{
						"pageItemID": "17440",
						"component": "MediaView",
						"data": "",
						"media": [
							{
								"mediaID": "1745",
								"auth": "710",
								"title": "MLA C journal print rev2",
								"itemType": "swf",
								"descText": "MLA_C_journal_print_rev2",
								"createTime": "1271431591",
								"copyright": "Copyright 2010 Corinne J. Bishop.",
								"thumb": "0",
								"url": "MLA_C_journal_print_rev2.swf",
								"size": "93619",
								"length": "1",
								"perms": null,
								"height": "510",
								"width": "780",
								"meta": {
									"version": 9,
									"asVersion": 3
								},
								"attribution": "0",
								"_explicitType": "obo\\lo\\Media"
							}
						],
						"advancedEdit": "0",
						"options": false,
						"_explicitType": "obo\\lo\\PageItem"
					}
				],
				"questionID": -1,
				"_explicitType": "obo\\lo\\Page"
			},
			{
				"pageID": "16319",
				"title": "Works Cited Entry -- Scholarly Journal (Electronic) ",
				"userID": 0,
				"layoutID": 1,
				"createTime": "1271771171",
				"items": [
					{
						"pageItemID": 0,
						"component": "TextArea",
						"data": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"35\" RIGHTMARGIN=\"35\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#990000\" LETTERSPACING=\"0\" KERNING=\"0\"><B>Identifying and Formatting Scholarly Journal Entries (accessed through a library database)</B></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">A works cited entry for a scholarly journal article retrieved from an online database is formatted as follows and includes:</FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">Author&apos;s Last name, First name. &quot;Title of Article.&quot; <I>Journal Title</I> Volume Number. Issue Number (Publication Year): Pages. </FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"><I>     Database Name</I>. Medium. Day Month Year accessed.</FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"><I>(</I><B><I>Note</I></B><I>: The example does not show the exact alignment and spacing for an MLA works cited entry. The first line of each entry should be flush with the left margin, and all subsequent lines should be indented 5 spaces or 1/2 inch. MLA works cited entries are also double-spaced.)</I></FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">On the next screen, you will practice identifying and formatting the elements required for a works cited entry for a scholarly journal article retrieved from a database. This is a two-part practice. First, you will drag and drop all the required elements from the graphic to the bottom of the screen. Next, you will format the elements correctly.</FONT></P></TEXTFORMAT>",
						"media": [],
						"advancedEdit": 0,
						"options": null,
						"_explicitType": "obo\\lo\\PageItem"
					}
				],
				"questionID": -1,
				"_explicitType": "obo\\lo\\Page"
			},
			{
				"pageID": "11604",
				"title": "Scholarly Journal Entry (Database) ",
				"userID": "0",
				"layoutID": "7",
				"createTime": "1271771202",
				"items": [
					{
						"pageItemID": "17442",
						"component": "MediaView",
						"data": "",
						"media": [
							{
								"mediaID": "1779",
								"auth": "710",
								"title": "MLA C journal electronic rev3",
								"itemType": "swf",
								"descText": "MLA_C_journal_electronic_rev3",
								"createTime": "1271704636",
								"copyright": "Copyright 2010 Corinne J. Bishop.",
								"thumb": "0",
								"url": "MLA_C_journal_electronic_rev3.swf",
								"size": "76282",
								"length": "1",
								"perms": null,
								"height": "510",
								"width": "780",
								"meta": {
									"version": 9,
									"asVersion": 3
								},
								"attribution": "0",
								"_explicitType": "obo\\lo\\Media"
							}
						],
						"advancedEdit": "0",
						"options": false,
						"_explicitType": "obo\\lo\\PageItem"
					}
				],
				"questionID": -1,
				"_explicitType": "obo\\lo\\Page"
			},
			{
				"pageID": "22404",
				"title": "Works Cited Entry -- Web Page",
				"userID": 0,
				"layoutID": 1,
				"createTime": "1271768450",
				"items": [
					{
						"pageItemID": 0,
						"component": "TextArea",
						"data": "<TEXTFORMAT LEFTMARGIN=\"35\" RIGHTMARGIN=\"35\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#990000\" LETTERSPACING=\"0\" KERNING=\"0\"><B>Identifying and Formatting Web Page Entries</B></FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">A works cited entry for a web page is formatted as follows and includes:</FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"1\">Author&apos;s Last name, First name.  &quot;Title of Work.&quot; <I>Title of Overall Site</I>. Publisher or Sponsor of the site, <FONT KERNING=\"0\">Day Month Year page was published or last updated. Medium. Day Month Year accessed. </FONT></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">(<B><I>Note</I></B><I>: The example does not show the exact alignment and spacing for an MLA works cited entry. The first line of each entry should be flush with the left margin, and all subsequent lines should be indented 5 spaces or 1/2 inch. MLA works cited entries are also double-spaced.</I>)</FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"1\">Often, web pages do not include all of the information shown above. In some cases, you may need to substitute a corporate author for an individual author. Guidelines in the MLA Handbook, 7th ed. also state that &quot;you should include a URL as supplementary information only when the reader probably cannot locate the source without it <B>or when your instructor requires it</B>&quot; (182). If a web page does not include all of the desired information, follow the basic citation format and include as much information as possible about the source to ensure that your readers will be able to locate it. </FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEFTMARGIN=\"45\" RIGHTMARGIN=\"45\" LEADING=\"5\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">On the next screen, you will practice identifying and formatting the elements required for a works cited entry for a web site. This is a two-part practice. First, you will drag and drop all the required elements from the graphic to the bottom of the screen. Next, you will format the elements correctly.</FONT></P></TEXTFORMAT>",
						"media": [],
						"advancedEdit": 0,
						"options": null,
						"_explicitType": "obo\\lo\\PageItem"
					}
				],
				"questionID": -1,
				"_explicitType": "obo\\lo\\Page"
			},
			{
				"pageID": "12841",
				"title": "Web Page Entry ",
				"userID": "0",
				"layoutID": "7",
				"createTime": "1272460320",
				"items": [
					{
						"pageItemID": "19070",
						"component": "MediaView",
						"data": "",
						"media": [
							{
								"mediaID": "1747",
								"auth": "710",
								"title": "MLA C web rev2",
								"itemType": "swf",
								"descText": "MLA_C_web_rev2",
								"createTime": "1271431841",
								"copyright": "Copyright 2010 Corinne J. Bishop.",
								"thumb": "0",
								"url": "MLA_C_web_rev2.swf",
								"size": "184282",
								"length": "1",
								"perms": null,
								"height": "510",
								"width": "780",
								"meta": {
									"version": 9,
									"asVersion": 3
								},
								"attribution": "0",
								"_explicitType": "obo\\lo\\Media"
							}
						],
						"advancedEdit": "0",
						"options": false,
						"_explicitType": "obo\\lo\\PageItem"
					}
				],
				"questionID": -1,
				"_explicitType": "obo\\lo\\Page"
			},
			{
				"pageID": "22611",
				"title": "Getting Help",
				"userID": 0,
				"layoutID": 3,
				"createTime": "",
				"items": [
					{
						"pageItemID": 0,
						"component": "MediaView",
						"data": "",
						"media": [
							{
								"mediaID": 2931,
								"auth": "710",
								"title": "newAAL",
								"itemType": "pic",
								"descText": "SA C newAAL",
								"createTime": 1325878587,
								"copyright": "Public domain.",
								"thumb": "0",
								"url": "newAAL.jpg",
								"size": "65249",
								"length": "0",
								"perms": null,
								"height": 360,
								"width": 920,
								"meta": 0,
								"attribution": 0,
								"_explicitType": "obo\\lo\\Media"
							}
						],
						"advancedEdit": 0,
						"options": null,
						"_explicitType": "obo\\lo\\PageItem"
					},
					{
						"pageItemID": 0,
						"component": "TextArea",
						"data": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"1\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"1\">This module is designed to provide an overview of MLA works cited entries and parenthetical citations for citing books, print and online journal articles and web pages. Creating works cited entries and parenthetical citations is important to avoid plagiarism and to accurately document any outside ideas and quotes that you include in your writing. Since there are many types of sources you may need to cite, it is essential that you consult the MLA Handbook, 7th ed. (2009) for detailed instructions about specific formatting guidelines and to see specific examples. </FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"1\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"1\">If you have questions about using MLA styles, identifying and locating sources or using research tools, please contact the library for assistance. Library hours are posted on the library web site (http://library.ucf.edu).</FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"1\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"1\">To get assistance at the library, you can also:</FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><LI><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"1\">Consult library Research Guides – guides list suggested resources by subject areas (http://guides.ucf.edu)</FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><LI><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"1\">Stop by the Research &amp; Information Desk – librarians provide in-person assistance in the Knowledge Commons at the main library </FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><LI><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"1\">Schedule a research consultation – one-hour appointments can be scheduled with a librarian to answers research questions (http://library.ucf.edu/Reference/ResearchConsultations/Default.php)</FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><LI><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"1\">Contact the Ask A Librarian service – ask questions via chat, text, email or by phone (http://library.ucf.edu/Ask)</FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"1\"></FONT></P></TEXTFORMAT>",
						"media": [],
						"advancedEdit": 0,
						"options": null,
						"_explicitType": "obo\\lo\\PageItem"
					}
				],
				"questionID": -1,
				"_explicitType": "obo\\lo\\Page"
			},
			{
				"pageID": "22682",
				"title": "Works Consulted",
				"userID": 0,
				"layoutID": 1,
				"createTime": "",
				"items": [
					{
						"pageItemID": 0,
						"component": "TextArea",
						"data": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">The Modern Language Association of America. MLA Handbook for Writers of Research Papers. 7th ed. New York: The Modern Language Association, 2009. Print.</FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#393939\" LETTERSPACING=\"0\" KERNING=\"0\">Universal Orlando Foundation Library. “MLA Citation Style.” Citation Style Guides. 2008. Web. 2 April 2010.</FONT></P></TEXTFORMAT>",
						"media": [],
						"advancedEdit": 0,
						"options": null,
						"_explicitType": "obo\\lo\\PageItem"
					}
				],
				"questionID": -1,
				"_explicitType": "obo\\lo\\Page"
			}
		],
		"pGroup": {
			"qGroupID": "12624",
			"userID": "710",
			"rand": "0",
			"allowAlts": "0",
			"altMethod": "r",
			"kids": [
				{
					"questionID": "14100",
					"userID": 710,
					"itemType": "MC",
					"answers": [
						{
							"answerID": "95890093250d226c819a8d0.64297317",
							"userID": 91,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">To properly cite sources, you apply guidelines given in a specific style manual. (&quot;Burns 5&quot;)</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Incorrect. MLA parenthetical citations are not placed within quotation marks. </FONT></P></TEXTFORMAT>",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "25311713950d226c819a993.24362366",
							"userID": 91,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">To properly cite sources, you apply guidelines given in a specific style manual Burns 5.</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Incorrect. MLA parenthetical citations are always placed within parentheses. </FONT></P></TEXTFORMAT>",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "33543876950d226c819a9e0.69521544",
							"userID": 710,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">To properly cite sources, you apply guidelines given in a specific style manual (Burns 5).</FONT></P></TEXTFORMAT>",
							"weight": 100,
							"feedback": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Correct. MLA parenthetical citations are added inside parentheses. They are often included at the end of a sentence and should be placed before the final punctuation.</FONT></P></TEXTFORMAT>",
							"_explicitType": "obo\\lo\\Answer"
						}
					],
					"perms": 0,
					"items": [
						{
							"pageItemID": 8349,
							"component": "TextArea",
							"data": "\rChoose the answer that shows the correct way to include an MLA parenthetical citation in your work.",
							"media": [],
							"advancedEdit": 0,
							"options": null,
							"_explicitType": "obo\\lo\\PageItem"
						}
					],
					"questionIndex": null,
					"feedback": {
						"incorrect": "",
						"correct": ""
					},
					"_explicitType": "obo\\lo\\Question"
				},
				{
					"questionID": "10674",
					"userID": 710,
					"itemType": "MC",
					"answers": [
						{
							"answerID": "9034526704db99f0d87fba3.93336849",
							"userID": 710,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">author, title, publisher information and medium</FONT></P></TEXTFORMAT>",
							"weight": 100,
							"feedback": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Correct. These are the four types of information required for a works cited entry for a book.</FONT></P></TEXTFORMAT>",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "11323572754db99f0d87fee0.13529358",
							"userID": 710,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">author, title, publisher information, access date and medium</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Incorrect. Works cited entries for books do not include access dates. Access dates are often used when you cite online sources. </FONT></P></TEXTFORMAT>",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "14240356934db99f0d8800d8.59192538",
							"userID": 710,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">author, title, publisher information, volume number and medium</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Incorrect. Works cited entries for books do not include volume numbers. However, book entries may include edition numbers. Volume and issue numbers should be used when you cite journal articles. </FONT></P></TEXTFORMAT>",
							"_explicitType": "obo\\lo\\Answer"
						}
					],
					"perms": 0,
					"items": [
						{
							"pageItemID": 17446,
							"component": "TextArea",
							"data": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\">Choose the answer that includes the required information for an MLA works cited entry for a print copy of a book.</FONT></P></TEXTFORMAT>",
							"media": [],
							"advancedEdit": 0,
							"options": null,
							"_explicitType": "obo\\lo\\PageItem"
						}
					],
					"questionIndex": null,
					"feedback": {
						"correct": "",
						"incorrect": ""
					},
					"_explicitType": "obo\\lo\\Question"
				},
				{
					"questionID": "7585",
					"userID": "710",
					"itemType": "Media",
					"answers": [
						{
							"answerID": "2036",
							"userID": "91",
							"answer": "",
							"weight": "100",
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						}
					],
					"perms": 0,
					"items": [
						{
							"pageItemID": "16969",
							"component": "MediaView",
							"data": "",
							"advancedEdit": "0",
							"options": null,
							"media": [
								{
									"mediaID": "1721",
									"auth": "710",
									"title": "MLA P book rev",
									"itemType": "swf",
									"descText": "MLA_P_book_rev",
									"createTime": "1271275989",
									"copyright": "Copyright 2010 Corinne J. Bishop.",
									"thumb": "0",
									"url": "MLA_P_book_rev.swf",
									"size": "74387",
									"length": "1",
									"perms": null,
									"height": "510",
									"width": "780",
									"meta": {
										"version": 9,
										"asVersion": 3
									},
									"attribution": "0",
									"_explicitType": "obo\\lo\\Media"
								}
							]
						}
					],
					"questionIndex": null,
					"feedback": {
						"correct": "",
						"incorrect": ""
					},
					"_explicitType": "obo\\lo\\Question"
				},
				{
					"questionID": "10675",
					"userID": 710,
					"itemType": "MC",
					"answers": [
						{
							"answerID": "18770796374db99f0d88cb93.03503701",
							"userID": 710,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">author, article title, journal title, year, pages, medium</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Incorrect. The volume number and issue number (if available) are key pieces of information and are also required.</FONT></P></TEXTFORMAT>",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "16116108704db99f0d88cf07.90307733",
							"userID": 710,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">author, article title, journal title, volume, issue, year, pages, medium</FONT></P></TEXTFORMAT>",
							"weight": 100,
							"feedback": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Correct. A works cited entry for a print copy of a journal article includes all of the information shown.</FONT></P></TEXTFORMAT>",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "169511864db99f0d88d109.87563291",
							"userID": 710,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">author, article title, journal title, volume, issue, year, pages, library information</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Incorrect. Library information is not required for this type of works cited entry, but the medium or format of the source should be included.</FONT></P></TEXTFORMAT>",
							"_explicitType": "obo\\lo\\Answer"
						}
					],
					"perms": 0,
					"items": [
						{
							"pageItemID": 17372,
							"component": "TextArea",
							"data": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\">Choose the answer that includes the required elements for a works cited entry for a print copy of a journal article.</FONT></P></TEXTFORMAT>",
							"media": [],
							"advancedEdit": 0,
							"options": null,
							"_explicitType": "obo\\lo\\PageItem"
						}
					],
					"questionIndex": null,
					"feedback": {
						"correct": "",
						"incorrect": ""
					},
					"_explicitType": "obo\\lo\\Question"
				},
				{
					"questionID": "7615",
					"userID": "710",
					"itemType": "Media",
					"answers": [
						{
							"answerID": "2042",
							"userID": "63",
							"answer": "",
							"weight": "100",
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						}
					],
					"perms": 0,
					"items": [
						{
							"pageItemID": "17121",
							"component": "MediaView",
							"data": "",
							"advancedEdit": "0",
							"options": null,
							"media": [
								{
									"mediaID": "1748",
									"auth": "710",
									"title": "MLA P journal print rev2",
									"itemType": "swf",
									"descText": "MLA_P_journal_print_rev2",
									"createTime": "1271432029",
									"copyright": "Copyright 2010 Corinne J. Bishop.",
									"thumb": "0",
									"url": "MLA_P_journal_print_rev2.swf",
									"size": "62974",
									"length": "1",
									"perms": null,
									"height": "510",
									"width": "780",
									"meta": {
										"version": 9,
										"asVersion": 3
									},
									"attribution": "0",
									"_explicitType": "obo\\lo\\Media"
								}
							]
						}
					],
					"questionIndex": null,
					"feedback": {
						"correct": "",
						"incorrect": ""
					},
					"_explicitType": "obo\\lo\\Question"
				},
				{
					"questionID": "10676",
					"userID": 710,
					"itemType": "MC",
					"answers": [
						{
							"answerID": "2180010474db99f0d8991a1.94143438",
							"userID": 710,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">author, article title, journal title, volume, issue, year of publication, pages, medium and access date</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Incorrect. The database name is also required.</FONT></P></TEXTFORMAT>",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "2141126024db99f0d899426.86454804",
							"userID": 710,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">author, article title, journal title, volume, issue, year of publication, pages, database name</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Incorrect. The medium (Web) and access date are also required for the citation.</FONT></P></TEXTFORMAT>",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "18635395054db99f0d8995e3.95029195",
							"userID": 710,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">author, article title, journal title, volume, issue, year of publication, pages, database name, medium and access date</FONT></P></TEXTFORMAT>",
							"weight": 100,
							"feedback": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Correct. A<FONT KERNING=\"1\">ll of this information is required to cite s</FONT>cholarly journals accessed from library databases. </FONT></P></TEXTFORMAT>",
							"_explicitType": "obo\\lo\\Answer"
						}
					],
					"perms": 0,
					"items": [
						{
							"pageItemID": 17377,
							"component": "TextArea",
							"data": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\">Choose the answer that includes the required elements for a works cited entry for an electronic version of a journal article retrieved from a database.</FONT></P></TEXTFORMAT>",
							"media": [],
							"advancedEdit": 0,
							"options": null,
							"_explicitType": "obo\\lo\\PageItem"
						}
					],
					"questionIndex": null,
					"feedback": {
						"correct": "",
						"incorrect": ""
					},
					"_explicitType": "obo\\lo\\Question"
				},
				{
					"questionID": "7616",
					"userID": "710",
					"itemType": "Media",
					"answers": [
						{
							"answerID": "2043",
							"userID": "63",
							"answer": "",
							"weight": "100",
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						}
					],
					"perms": 0,
					"items": [
						{
							"pageItemID": "17122",
							"component": "MediaView",
							"data": "",
							"advancedEdit": "0",
							"options": null,
							"media": [
								{
									"mediaID": "1749",
									"auth": "710",
									"title": "MLA P journal electronic rev2",
									"itemType": "swf",
									"descText": "MLA_P_journal_electronic_rev2",
									"createTime": "1271432139",
									"copyright": "Copyright 2010 Corinne J. Bishop.",
									"thumb": "0",
									"url": "MLA_P_journal_electronic_rev2.swf",
									"size": "80529",
									"length": "1",
									"perms": null,
									"height": "510",
									"width": "780",
									"meta": {
										"version": 9,
										"asVersion": 3
									},
									"attribution": "0",
									"_explicitType": "obo\\lo\\Media"
								}
							]
						}
					],
					"questionIndex": null,
					"feedback": {
						"correct": "",
						"incorrect": ""
					},
					"_explicitType": "obo\\lo\\Question"
				},
				{
					"questionID": "14014",
					"userID": 710,
					"itemType": "MC",
					"answers": [
						{
							"answerID": "77510524350bf93a5a372b4.80800934",
							"userID": 710,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">author, title of work, title of overall site, name of publisher/sponsor, date published and medium</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Incorrect. Since Web page or web documents change or are updated frequently, an access date should be included.</FONT></P></TEXTFORMAT>",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "36914505450bf93a5a37399.50912834",
							"userID": 710,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"1\">author, <FONT KERNING=\"0\">title of work, title of overall site, name of publisher or sponsoring organization, </FONT>date published,<FONT KERNING=\"0\"> medium, and access date</FONT></FONT></P></TEXTFORMAT>",
							"weight": 100,
							"feedback": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Correct. All of this information is required to cite a web page.</FONT></P></TEXTFORMAT>",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "44806136550bf93a5a373d0.10440274",
							"userID": 710,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">author, title of work, title of overall site, date published and medium </FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Incorrect. The name of the publisher and date the page was accessed should also be included.</FONT></P></TEXTFORMAT>",
							"_explicitType": "obo\\lo\\Answer"
						}
					],
					"perms": 0,
					"items": [
						{
							"pageItemID": 0,
							"component": "TextArea",
							"data": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\">Choose the answer that includes the information required for a works cited entry for a web page.</FONT></P></TEXTFORMAT>",
							"media": [],
							"advancedEdit": 0,
							"options": null,
							"_explicitType": "obo\\lo\\PageItem"
						}
					],
					"questionIndex": null,
					"feedback": {
						"correct": "",
						"incorrect": ""
					},
					"_explicitType": "obo\\lo\\Question"
				},
				{
					"questionID": "8129",
					"userID": "710",
					"itemType": "Media",
					"answers": [
						{
							"answerID": "2046",
							"userID": "63",
							"answer": "",
							"weight": "100",
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						}
					],
					"perms": 0,
					"items": [
						{
							"pageItemID": "19878",
							"component": "MediaView",
							"data": "",
							"advancedEdit": "0",
							"options": null,
							"media": [
								{
									"mediaID": "1967",
									"auth": "710",
									"title": "MLA P web rev3",
									"itemType": "swf",
									"descText": "MLA_P_web_rev3",
									"createTime": "1272639502",
									"copyright": "Copyright 2010 Corinne J. Bishop.",
									"thumb": "0",
									"url": "MLA_P_web_rev3.swf",
									"size": "96522",
									"length": "1",
									"perms": null,
									"height": "510",
									"width": "780",
									"meta": {
										"version": 9,
										"asVersion": 3
									},
									"attribution": "0",
									"_explicitType": "obo\\lo\\Media"
								}
							]
						}
					],
					"questionIndex": null,
					"feedback": {
						"correct": "",
						"incorrect": ""
					},
					"_explicitType": "obo\\lo\\Question"
				},
				{
					"questionID": "10986",
					"userID": 710,
					"itemType": "MC",
					"answers": [
						{
							"answerID": "82011934dc16646625742.25430095",
							"userID": 710,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">cite information about each source at the end of a paper and within the text</FONT></P></TEXTFORMAT>",
							"weight": 100,
							"feedback": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Correct. Citing sources is a two-step process that involves adding information within the text and also at the end of a paper.</FONT></P></TEXTFORMAT>",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "21054000744dc16646625971.28619008",
							"userID": 710,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">cite information about each source at the end of a paper</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Incorrect. Information provided in parenthetical citations is also required and leads readers to the details in the works cited entry.</FONT></P></TEXTFORMAT>",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "2581429484dc16646625b23.77882236",
							"userID": 710,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">cite information about each source at the end of a paper and within the text for online sources</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Incorrect. Citations are required for all types of sources you use to write a paper whether they are accessed in print or online.</FONT></P></TEXTFORMAT>",
							"_explicitType": "obo\\lo\\Answer"
						}
					],
					"perms": 0,
					"items": [
						{
							"pageItemID": 8346,
							"component": "TextArea",
							"data": "\rChoose the answer that correctly identifies how you acknowledge sources in your writing using MLA Style.\r",
							"media": [],
							"advancedEdit": 0,
							"options": null,
							"_explicitType": "obo\\lo\\PageItem"
						}
					],
					"questionIndex": null,
					"feedback": {
						"correct": "",
						"incorrect": ""
					},
					"_explicitType": "obo\\lo\\Question"
				},
				{
					"questionID": "10793",
					"userID": 13797,
					"itemType": "MC",
					"answers": [
						{
							"answerID": "3783407844dbad0c5ac61b1.95882359",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">true</FONT></P></TEXTFORMAT>",
							"weight": 100,
							"feedback": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Correct. The MLA Handbook is designed to help you prepare research papers and includes detailed examples about how to prepare works cited entries and parenthetical citations for many different types of sources.</FONT></P></TEXTFORMAT>",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "6873024954dbad0c5ac65a1.48092521",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">false</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Incorrect. The MLA Handbook has detailed examples on how to prepare works cited entries and parenthetical citations for various types of sources.</FONT></P></TEXTFORMAT>",
							"_explicitType": "obo\\lo\\Answer"
						}
					],
					"perms": 0,
					"items": [
						{
							"pageItemID": 0,
							"component": "TextArea",
							"data": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#3A3A3A\" LETTERSPACING=\"0\" KERNING=\"1\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#3A3A3A\" LETTERSPACING=\"0\" KERNING=\"1\">The MLA Handbook provides formatting rules for works cited entries and parenthetical citations for many different types of sources.</FONT></P></TEXTFORMAT>",
							"media": [],
							"advancedEdit": 0,
							"options": null,
							"_explicitType": "obo\\lo\\PageItem"
						}
					],
					"questionIndex": null,
					"feedback": {
						"correct": "",
						"incorrect": ""
					},
					"_explicitType": "obo\\lo\\Question"
				},
				{
					"questionID": "10673",
					"userID": 710,
					"itemType": "MC",
					"answers": [
						{
							"answerID": "16804941604db99e6b6a6f24.69115006",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">your own ideas, opinions or conclusions</FONT></P></TEXTFORMAT>",
							"weight": 100,
							"feedback": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Correct. When you use your own ideas, opinions or conclusions, you do not need to cite them.</FONT></P></TEXTFORMAT>",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "13747660084db99e6b6a7233.10913808",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">text from an article or book</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Incorrect. Anytime you use someone else&apos;s text or ideas, you must acknowledge the original source to avoid plagiarism.</FONT></P></TEXTFORMAT>",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "9086404364db99e6b6a73f2.90548893",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">ideas found on a web site</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Incorrect: Anytime you use someone else&apos;s text or ideas, you must acknowledge the original source to avoid plagiarismIn, including information found on the web.</FONT></P></TEXTFORMAT>",
							"_explicitType": "obo\\lo\\Answer"
						}
					],
					"perms": 0,
					"items": [
						{
							"pageItemID": 0,
							"component": "TextArea",
							"data": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#3A3A3A\" LETTERSPACING=\"0\" KERNING=\"1\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#3A3A3A\" LETTERSPACING=\"0\" KERNING=\"1\">Which of the following should <B>not</B> include a parenthetical citation?<FONT FACE=\"Courier New\" SIZE=\"12\"></FONT></FONT></P></TEXTFORMAT>",
							"media": [],
							"advancedEdit": 0,
							"options": null,
							"_explicitType": "obo\\lo\\PageItem"
						}
					],
					"questionIndex": null,
					"feedback": {
						"correct": "",
						"incorrect": ""
					},
					"_explicitType": "obo\\lo\\Question"
				},
				{
					"questionID": "14128",
					"userID": 710,
					"itemType": "MC",
					"answers": [
						{
							"answerID": "108073575650d33e83686208.32471020",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">She did not use the parenthetical citation correctly because it should include the authors’ last names in the parentheses.</FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"1\">Incorrect. When you include an author&apos;s name as part of an introductory sentence about the source, it is not included as part of the parenthetical citation.</FONT></P></TEXTFORMAT>",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "51552658550d33e83686312.39215709",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">She did not use the parenthetical citation correctly because only the authors’ names should be in the parentheses.</FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"1\">Incorrect. When you do not include the author&apos;s name in an introductory sentence, you must include it as part of the parenthetical citation.</FONT></P></TEXTFORMAT>",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "187256670550d33e83686366.91504960",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">The parenthetical citation is used correctly because the sentence includes the authors’ last names.</FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT>",
							"weight": 100,
							"feedback": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"1\">Correct. When an author&apos;s last name is included as part of an introductory sentence about the source it is not included in the parenthetical citation.</FONT></P></TEXTFORMAT>",
							"_explicitType": "obo\\lo\\Answer"
						}
					],
					"perms": 0,
					"items": [
						{
							"pageItemID": 0,
							"component": "TextArea",
							"data": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\">Erin is using the following paraphrased sentence in a research paper:</FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\">According to Kirszner and Mandell thinking critically as you read involves assessing a writer&apos;s credibility and evaluating the ideas you encounter (131).</FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\">Did she use parenthetical citations correctly?</FONT></P></TEXTFORMAT>",
							"media": [],
							"advancedEdit": 0,
							"options": null,
							"_explicitType": "obo\\lo\\PageItem"
						}
					],
					"questionIndex": null,
					"feedback": {
						"incorrect": "",
						"correct": ""
					},
					"_explicitType": "obo\\lo\\Question"
				}
			],
			"quizSize": 13,
			"_explicitType": "obo\\lo\\QuestionGroup"
		},
		"aGroup": {
			"qGroupID": "12651",
			"userID": "710",
			"rand": "0",
			"allowAlts": "1",
			"altMethod": "r",
			"kids": [
				{
					"questionID": "14046",
					"userID": 710,
					"itemType": "MC",
					"answers": [
						{
							"answerID": "22472633750cb97c7bb08e5.14774474",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"1\">You do not need to cite a source when you summarize an idea from an author of a book.</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "169894591850cb97c7bb0a41.58775174",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"1\">You do not need to cite a source when you are conveying your own ideas about a topic.</FONT></P></TEXTFORMAT>",
							"weight": 100,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "65922180950cb97c7bb0a90.11315264",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"1\">You do not need to cite a source when you paraphrase text that you found in a journal article.</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						}
					],
					"perms": 0,
					"items": [
						{
							"pageItemID": 0,
							"component": "TextArea",
							"data": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"1\">Which answer describes when you do <B>not</B> need to cite a source in your writing?</FONT></P></TEXTFORMAT>",
							"media": [],
							"advancedEdit": 0,
							"options": null,
							"_explicitType": "obo\\lo\\PageItem"
						}
					],
					"questionIndex": null,
					"feedback": {
						"incorrect": "",
						"correct": ""
					},
					"_explicitType": "obo\\lo\\Question"
				},
				{
					"questionID": "14047",
					"userID": 710,
					"itemType": "MC",
					"answers": [
						{
							"answerID": "81402515850cb9a8b7b53c0.76934640",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Citing the source is required whenever Julian uses direct quotes or paraphrases information from scholarly journals.</FONT></P></TEXTFORMAT>",
							"weight": 100,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "11903712450cb9a8b7b54b7.30619829",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Citing the source is required only when Julian paraphrases the information he found from the scholarly journals in his paper.</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "191911163850cb9a8b7b5517.13095705",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Citing the source is required only when Julian uses direct quotes from the scholarly journals in his paper. </FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						}
					],
					"perms": 0,
					"items": [
						{
							"pageItemID": 0,
							"component": "TextArea",
							"data": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\">Julian used information in his research paper from scholarly journals. Which of the following is a true statement about academic writing using the MLA format?</FONT></P></TEXTFORMAT>",
							"media": [],
							"advancedEdit": 0,
							"options": null,
							"_explicitType": "obo\\lo\\PageItem"
						}
					],
					"questionIndex": null,
					"feedback": {
						"incorrect": "",
						"correct": ""
					},
					"_explicitType": "obo\\lo\\Question"
				},
				{
					"questionID": "10218",
					"userID": 710,
					"itemType": "Media",
					"answers": [
						{
							"answerID": "19209755784dade7ec54f954.77555258",
							"userID": 91,
							"answer": "",
							"weight": 100,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						}
					],
					"perms": 0,
					"items": [
						{
							"pageItemID": 16837,
							"component": "MediaView",
							"data": "",
							"media": [
								{
									"mediaID": "1696",
									"auth": "710",
									"title": "MLA A book rev",
									"itemType": "swf",
									"descText": "MLA_A_book_rev",
									"createTime": "1271165739",
									"copyright": "Copyright 2010 Corinne J. Bishop.",
									"thumb": "0",
									"url": "MLA_A_book_rev.swf",
									"size": "752123",
									"length": "37",
									"perms": null,
									"height": "510",
									"width": "780",
									"meta": {
										"version": 8,
										"asVersion": 2
									},
									"attribution": "0",
									"_explicitType": "obo\\lo\\Media"
								}
							],
							"advancedEdit": 0,
							"options": null,
							"_explicitType": "obo\\lo\\PageItem"
						}
					],
					"questionIndex": null,
					"feedback": {
						"correct": "",
						"incorrect": ""
					},
					"_explicitType": "obo\\lo\\Question"
				},
				{
					"questionID": "10988",
					"userID": 710,
					"itemType": "MC",
					"answers": [
						{
							"answerID": "2649850194dc166d658ae87.51301010",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Todd <FONT KERNING=\"1\">Burpo</FONT>. <I>Heaven is for real</I>. Nashville, Tennessee: <I>Thomas Nelson Inc</I>., 2010. Print. </FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "12592852764dc166d658b0b9.86773811",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Burpo, Todd. <I>Heaven is for real</I>. Nashville: Thomas Nelson Inc., 2010. Print. </FONT></P></TEXTFORMAT>",
							"weight": 100,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "6856893134dc166d658b263.64412302",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"1\">Burpo T. 2010. &quot;Heaven is for real.&quot; Nashville: Thomas Nelson Inc. Print. </FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						}
					],
					"perms": 0,
					"items": [
						{
							"pageItemID": 0,
							"component": "TextArea",
							"data": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\">Vanessa used a direct quote from the book shown on the right. Which of the following is the correct way to cite the source using MLA?</FONT></P></TEXTFORMAT>",
							"media": [],
							"advancedEdit": 0,
							"options": null,
							"_explicitType": "obo\\lo\\PageItem"
						},
						{
							"pageItemID": 0,
							"component": "MediaView",
							"data": "",
							"media": [
								{
									"mediaID": 2348,
									"auth": "710",
									"title": "MLA A book q2 2011",
									"itemType": "pic",
									"descText": "Book 2011",
									"createTime": 1303232768,
									"copyright": "Public domain.",
									"thumb": "0",
									"url": "MLA_A_book_q2_2011.jpg",
									"size": "54518",
									"length": "0",
									"perms": null,
									"height": 360,
									"width": 235,
									"meta": null,
									"attribution": null,
									"_explicitType": "obo\\lo\\Media"
								}
							],
							"advancedEdit": 0,
							"options": null,
							"_explicitType": "obo\\lo\\PageItem"
						}
					],
					"questionIndex": null,
					"feedback": {
						"correct": "",
						"incorrect": ""
					},
					"_explicitType": "obo\\lo\\Question"
				},
				{
					"questionID": "14013",
					"userID": 710,
					"itemType": "MC",
					"answers": [
						{
							"answerID": "135316920350bf83c709cb66.37769425",
							"userID": 91,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">alphabetically by the title</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "175854612750bf83c709d206.40682961",
							"userID": 91,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">chronologically by publication date</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "105920754550bf83c709d252.81895925",
							"userID": 91,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">sequentially as they appear in the paper</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "184118144950bf83c709d2a1.75956766",
							"userID": 91,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">alphabetically by author&apos;s last name</FONT></P></TEXTFORMAT>",
							"weight": 100,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						}
					],
					"perms": 0,
					"items": [
						{
							"pageItemID": 18853,
							"component": "TextArea",
							"data": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\">Choose the answer that describes how entries for books and articles are arranged on a Works Cited page.</FONT></P></TEXTFORMAT>",
							"media": [],
							"advancedEdit": 0,
							"options": null,
							"_explicitType": "obo\\lo\\PageItem"
						}
					],
					"questionIndex": null,
					"feedback": {
						"correct": "",
						"incorrect": ""
					},
					"_explicitType": "obo\\lo\\Question"
				},
				{
					"questionID": "14051",
					"userID": 710,
					"itemType": "MC",
					"answers": [
						{
							"answerID": "142977523550d0a012cbe984.46163532",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">She should list the sources in the order they were used in her research paper.</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "10852162150d0a012cbea86.87811162",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">She should list the sources in order of the year they were published.</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "97885660450d0a012cbeac3.29700057",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">She should list the sources alphabetically by the author&apos;s last name.</FONT></P></TEXTFORMAT>",
							"weight": 100,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						}
					],
					"perms": 0,
					"items": [
						{
							"pageItemID": 0,
							"component": "TextArea",
							"data": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\">Cynthia used the following sources in her research paper:</FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\">Hanssens, Dominique M., Roland T. Rust, and Rajendra K. Srivastava. &quot;Marketing strategy and wall street: Nailing down marketing&apos;s impact.&quot;Journal of Marketing 73.6 (2009): 115-118. PsycINFO. Web. 14 Apr. 2011.</FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\">Varadarajan, Rajan. &quot;Strategic marketing and marketing strategy: Domain, definition, fundamental issues and foundational premises.&quot; Journal of the Academy of Marketing Science 38.2 (2010): 119-140. PsycINFO. Web. 14 Apr. 2011.</FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\">Ernst, Holger, Wayne D. Hoyer, and Carsten rubsaamen. &quot;Sales, marketing, and research-and-development cooperation across new product development stages: Implications for success.&quot; Journal of Marketing 74.5 (2010): 80-92. PsycINFO. Web. 14 Apr. 2011.</FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\">How should Cynthia list the articles on her Works Cited page?</FONT></P></TEXTFORMAT>",
							"media": [],
							"advancedEdit": 0,
							"options": null,
							"_explicitType": "obo\\lo\\PageItem"
						}
					],
					"questionIndex": null,
					"feedback": {
						"incorrect": "",
						"correct": ""
					},
					"_explicitType": "obo\\lo\\Question"
				},
				{
					"questionID": "14147",
					"userID": 710,
					"itemType": "MC",
					"answers": [
						{
							"answerID": "148905740650d46d9fe028e1.43072294",
							"userID": 91,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">English and Humanities disciplines use MLA style to document sources Jones, 15.</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "112732797850d46d9fe02a18.85330341",
							"userID": 91,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">English and Humanities disciplines use MLA style to document sources (Jones 15).</FONT></P></TEXTFORMAT>",
							"weight": 100,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "108974524850d46d9fe02a66.42973352",
							"userID": 91,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">English and Humanities disciplines use MLA style to document sources (Jones, 15.)</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "101794786050d46d9fe02aa3.09512489",
							"userID": 91,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">English and Humanities disciplines use MLA style to document sources &quot;Jones 15&quot;.</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						}
					],
					"perms": 0,
					"items": [
						{
							"pageItemID": 17435,
							"component": "TextArea",
							"data": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\">Choose the example that shows the correct format for an MLA parenthetical citation.</FONT></P></TEXTFORMAT>",
							"media": [],
							"advancedEdit": 0,
							"options": null,
							"_explicitType": "obo\\lo\\PageItem"
						}
					],
					"questionIndex": null,
					"feedback": {
						"correct": "",
						"incorrect": ""
					},
					"_explicitType": "obo\\lo\\Question"
				},
				{
					"questionID": "14157",
					"userID": 710,
					"itemType": "MC",
					"answers": [
						{
							"answerID": "204833869350d477aa522be7.45087963",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Sometimes parenthetical citations are called in-text citations or parenthetical documentation Bishop, 23.</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "197263142850d477aa522cc5.30463459",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"1\">Sometimes parenthetical citations are called in-text citations or parenthetical documentation <FONT KERNING=\"0\">(Bishop 23). </FONT></FONT></P></TEXTFORMAT>",
							"weight": 100,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "63574241150d477aa522d14.43626109",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"1\">Sometimes parenthetical citations are called in-text citations or parenthetical documentation <FONT KERNING=\"0\">(Bishop, 23.)</FONT></FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "130110980450d477aa522d61.42225879",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Sometimes parenthetical citations are called in-text citations or parenthetical documentation “Bishop, 23”.</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						}
					],
					"perms": 0,
					"items": [
						{
							"pageItemID": 0,
							"component": "TextArea",
							"data": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\">Jordon needs to include citations in his research paper. Which of the following is the correct format for an MLA parenthetical citation?  </FONT></P></TEXTFORMAT>",
							"media": [],
							"advancedEdit": 0,
							"options": null,
							"_explicitType": "obo\\lo\\PageItem"
						}
					],
					"questionIndex": null,
					"feedback": {
						"correct": "",
						"incorrect": ""
					},
					"_explicitType": "obo\\lo\\Question"
				},
				{
					"questionID": "10197",
					"userID": 710,
					"itemType": "Media",
					"answers": [],
					"perms": 0,
					"items": [
						{
							"pageItemID": 17074,
							"component": "MediaView",
							"data": "",
							"media": [
								{
									"mediaID": "1737",
									"auth": "710",
									"title": "MLA A journalPrint rev2",
									"itemType": "swf",
									"descText": "MLA_A_journalPrint_rev2",
									"createTime": "1271365035",
									"copyright": "Copyright 2010 Corinne J. Bishop.",
									"thumb": "0",
									"url": "MLA_A_journalPrint_rev2.swf",
									"size": "373290",
									"length": "37",
									"perms": null,
									"height": "440",
									"width": "774",
									"meta": {
										"version": 8,
										"asVersion": 2
									},
									"attribution": "0",
									"_explicitType": "obo\\lo\\Media"
								}
							],
							"advancedEdit": 0,
							"options": null,
							"_explicitType": "obo\\lo\\PageItem"
						}
					],
					"questionIndex": null,
					"feedback": {
						"correct": "",
						"incorrect": ""
					},
					"_explicitType": "obo\\lo\\Question"
				},
				{
					"questionID": "10209",
					"userID": 710,
					"itemType": "MC",
					"answers": [
						{
							"answerID": "6919781554dade63b331710.32941045",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Kidd, David G., and William J. Horrey. &quot;Distracted Driving: Do Drivers&apos; Perceptions of Distractions Become More Accurate Over Time?&quot; <I>Professional Safety</I> 55.1 (2010): 40-45. Print. </FONT></P></TEXTFORMAT>",
							"weight": 100,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "9470915574dade63b3319e5.79906641",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Kidd, D and Horrey. W. &quot;Distracted Driving: Do drivers&apos; perceptions of distractions become more accurate over time?&quot; <I>Professional Safety</I> (2010):40-45. Print. Accessed on April 14, 2011.</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "1500948684dade63b331bb0.75613252",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Kidd, David G, and William J. Horrey (2010). Distracted Driving: Do drivers&apos; perceptions of distractions become more accurate over time? <I>Professional Safety</I> (2010):55.1, 40-45. Print.</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						}
					],
					"perms": 0,
					"items": [
						{
							"pageItemID": 0,
							"component": "MediaView",
							"data": "",
							"media": [
								{
									"mediaID": 2349,
									"auth": "710",
									"title": "MLA A journalPrint q2 2011",
									"itemType": "pic",
									"descText": "Professional Safety Journal",
									"createTime": 1303235457,
									"copyright": "Public domain.",
									"thumb": "0",
									"url": "MLA_A_journalPrint_q2_2011.jpg",
									"size": "238133",
									"length": "0",
									"perms": null,
									"height": 360,
									"width": 920,
									"meta": null,
									"attribution": null,
									"_explicitType": "obo\\lo\\Media"
								}
							],
							"advancedEdit": 0,
							"options": null,
							"_explicitType": "obo\\lo\\PageItem"
						}
					],
					"questionIndex": null,
					"feedback": {
						"correct": "",
						"incorrect": ""
					},
					"_explicitType": "obo\\lo\\Question"
				},
				{
					"questionID": "10795",
					"userID": 13797,
					"itemType": "MC",
					"answers": [
						{
							"answerID": "1513352854dbad0f42c4329.24641334",
							"userID": 91,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">true</FONT></P></TEXTFORMAT>",
							"weight": 100,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "16242252414dbad0f42c46f1.57821269",
							"userID": 91,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">false</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						}
					],
					"perms": 0,
					"items": [
						{
							"pageItemID": 18854,
							"component": "TextArea",
							"data": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\">The required information for a MLA works cited entry depends on the type of source you are citing.</FONT></P></TEXTFORMAT>",
							"media": [],
							"advancedEdit": 0,
							"options": null,
							"_explicitType": "obo\\lo\\PageItem"
						}
					],
					"questionIndex": null,
					"feedback": {
						"correct": "",
						"incorrect": ""
					},
					"_explicitType": "obo\\lo\\Question"
				},
				{
					"questionID": "10669",
					"userID": 710,
					"itemType": "MC",
					"answers": [
						{
							"answerID": "5150866774db99e368fb263.08741139",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">All the citations will be the same, it does not matter that the information comes from different sources.</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "4899956014db99e368fb686.75408728",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">All the citations will be different depending on the type of source used. </FONT></P></TEXTFORMAT>",
							"weight": 100,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "3114333634db99e368fb840.00128923",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">The difference will only be found in the way he cites the YouTube videos. </FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						}
					],
					"perms": 0,
					"items": [
						{
							"pageItemID": 0,
							"component": "TextArea",
							"data": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\">Drake is using several types of sources in his paper. He is using Internet articles, scholarly journal articles, YouTube videos, and books. Will all of Drake&apos;s citations look the same on his reference page if he uses the MLA format for each of his sources?</FONT></P></TEXTFORMAT>",
							"media": [],
							"advancedEdit": 0,
							"options": null,
							"_explicitType": "obo\\lo\\PageItem"
						}
					],
					"questionIndex": null,
					"feedback": {
						"correct": "",
						"incorrect": ""
					},
					"_explicitType": "obo\\lo\\Question"
				},
				{
					"questionID": "14049",
					"userID": 710,
					"itemType": "MC",
					"answers": [
						{
							"answerID": "128072464850cb9a8b8375e5.61502841",
							"userID": 710,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">the medium and access date</FONT></P></TEXTFORMAT>",
							"weight": 100,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "29132252150cb9a8b837707.92573594",
							"userID": 710,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">the database name and medium</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "40394065050cb9a8b837759.07583119",
							"userID": 710,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">the medium and the edition</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						}
					],
					"perms": 0,
					"items": [
						{
							"pageItemID": 0,
							"component": "TextArea",
							"data": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\">Which answer includes two elements required in a works cited entry for a web page using MLA style?</FONT></P></TEXTFORMAT>",
							"media": [],
							"advancedEdit": 0,
							"options": null,
							"_explicitType": "obo\\lo\\PageItem"
						}
					],
					"questionIndex": null,
					"feedback": {
						"incorrect": "",
						"correct": ""
					},
					"_explicitType": "obo\\lo\\Question"
				},
				{
					"questionID": "14050",
					"userID": 710,
					"itemType": "MC",
					"answers": [
						{
							"answerID": "106420703750cb9a8b8427c3.11922342",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">access date </FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "44496020250cb9a8b842849.19651350",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">publication date</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "38048849250cb9a8b842896.99013615",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">volume number </FONT></P></TEXTFORMAT>",
							"weight": 100,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						}
					],
					"perms": 0,
					"items": [
						{
							"pageItemID": 0,
							"component": "TextArea",
							"data": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\"> </FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\">Victor is struggling to complete his Works Cited page. He cannot remember which elements are included in the MLA format when citing web pages. Which of the following is not included when citing web pages in MLA format?</FONT></P></TEXTFORMAT>",
							"media": [],
							"advancedEdit": 0,
							"options": null,
							"_explicitType": "obo\\lo\\PageItem"
						}
					],
					"questionIndex": null,
					"feedback": {
						"incorrect": "",
						"correct": ""
					},
					"_explicitType": "obo\\lo\\Question"
				},
				{
					"questionID": "10199",
					"userID": 710,
					"itemType": "Media",
					"answers": [
						{
							"answerID": "11793512574daddb743bc941.90323572",
							"userID": 63,
							"answer": "",
							"weight": 100,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						}
					],
					"perms": 0,
					"items": [
						{
							"pageItemID": 18865,
							"component": "MediaView",
							"data": "",
							"media": [
								{
									"mediaID": "1888",
									"auth": "710",
									"title": "MLA A journalElectronic rev4",
									"itemType": "swf",
									"descText": "MLA_A_journalElectronic_rev4",
									"createTime": "1272381846",
									"copyright": "Copyright 2010 Corinne J. Bishop.",
									"thumb": "0",
									"url": "MLA_A_journalElectronic_rev4.swf",
									"size": "314807",
									"length": "37",
									"perms": null,
									"height": "440",
									"width": "774",
									"meta": {
										"version": 8,
										"asVersion": 2
									},
									"attribution": "0",
									"_explicitType": "obo\\lo\\Media"
								}
							],
							"advancedEdit": 0,
							"options": null,
							"_explicitType": "obo\\lo\\PageItem"
						}
					],
					"questionIndex": null,
					"feedback": {
						"correct": "",
						"incorrect": ""
					},
					"_explicitType": "obo\\lo\\Question"
				},
				{
					"questionID": "10204",
					"userID": 710,
					"itemType": "MC",
					"answers": [
						{
							"answerID": "16787053414daddd4945e5d1.16182532",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Shih-Ming, P. Jirapa S. &quot;The perceived risks of online shopping in Taiwan.&quot; <I>Social Behavior &amp; Personality: An International Journal</I> 39.2 (2011): 275-286. Academic Search Premier. Print 14 Apr. 2011.</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "15771826974daddd4945e8d3.76751648",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Shih-Ming, Pi, and Jirapa Sangruang. &quot;The Perceived Risks of Online Shopping in Taiwan.&quot; <I>Social Behavior &amp; Personality: An International Journal</I> 39.2 (2011): 275-86. <I>Academic Search Premier</I>. Web. 14 Apr. 2011.</FONT></P></TEXTFORMAT>",
							"weight": 100,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "4951735144daddd4945eab0.44734405",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Shih-Ming, P., &amp; Sangruang, J. (2011). &quot;The perceived risks of online shopping in Taiwan.&quot; Social Behavior &amp; Personality: An International Journal, 39(2), 275-286.12p. Web. 14 Apr. 2011. </FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						}
					],
					"perms": 0,
					"items": [
						{
							"pageItemID": 0,
							"component": "MediaView",
							"data": "",
							"media": [
								{
									"mediaID": 2350,
									"auth": "710",
									"title": "MLA A journalElectronic q2 2011",
									"itemType": "pic",
									"descText": "Social Behavior Journal",
									"createTime": 1303239530,
									"copyright": "Public domain.",
									"thumb": "0",
									"url": "MLA_A_journalElectronic_q2_2011.jpg",
									"size": "212104",
									"length": "0",
									"perms": null,
									"height": 360,
									"width": 920,
									"meta": null,
									"attribution": null,
									"_explicitType": "obo\\lo\\Media"
								}
							],
							"advancedEdit": 0,
							"options": null,
							"_explicitType": "obo\\lo\\PageItem"
						}
					],
					"questionIndex": null,
					"feedback": {
						"correct": "",
						"incorrect": ""
					},
					"_explicitType": "obo\\lo\\Question"
				},
				{
					"questionID": "10797",
					"userID": 13797,
					"itemType": "MC",
					"answers": [
						{
							"answerID": "16039490434dbad12a2ca382.58534924",
							"userID": 91,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">true</FONT></P></TEXTFORMAT>",
							"weight": 100,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "1474749294dbad12a2ca684.22555279",
							"userID": 91,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">false</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						}
					],
					"perms": 0,
					"items": [
						{
							"pageItemID": 17445,
							"component": "TextArea",
							"data": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\">Works cited entries and parenthetical citations are two required elements used to cite sources in MLA style. </FONT></P></TEXTFORMAT>",
							"media": [],
							"advancedEdit": 0,
							"options": null,
							"_explicitType": "obo\\lo\\PageItem"
						}
					],
					"questionIndex": null,
					"feedback": {
						"correct": "",
						"incorrect": ""
					},
					"_explicitType": "obo\\lo\\Question"
				},
				{
					"questionID": "10991",
					"userID": 710,
					"itemType": "MC",
					"answers": [
						{
							"answerID": "2109638374dc166d65d1384.65951050",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">creating a page called Works Cited</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "9789462494dc166d65d15c0.39322299",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">adding parenthetical citations</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "8919313094dc166d65d1785.62060807",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">adding footnotes titled Parenthetical Citation</FONT></P></TEXTFORMAT>",
							"weight": 100,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						}
					],
					"perms": 0,
					"items": [
						{
							"pageItemID": 0,
							"component": "TextArea",
							"data": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\">When creating MLA citations in your paper, which of the following is not included in the process? </FONT></P></TEXTFORMAT>",
							"media": [],
							"advancedEdit": 0,
							"options": null,
							"_explicitType": "obo\\lo\\PageItem"
						}
					],
					"questionIndex": null,
					"feedback": {
						"correct": "",
						"incorrect": ""
					},
					"_explicitType": "obo\\lo\\Question"
				},
				{
					"questionID": "10205",
					"userID": 710,
					"itemType": "Media",
					"answers": [
						{
							"answerID": "18063261754dade2ac5e5da6.78882496",
							"userID": 91,
							"answer": "",
							"weight": 100,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						}
					],
					"perms": 0,
					"items": [
						{
							"pageItemID": 18871,
							"component": "MediaView",
							"data": "",
							"media": [
								{
									"mediaID": "1889",
									"auth": "710",
									"title": "MLA A Webpage rev4",
									"itemType": "swf",
									"descText": "MLA_A_Webpage_rev4",
									"createTime": "1272382147",
									"copyright": "Copyright 2010 Corinne J. Bishop.",
									"thumb": "0",
									"url": "MLA_A_Webpage_rev4.swf",
									"size": "307971",
									"length": "37",
									"perms": null,
									"height": "440",
									"width": "774",
									"meta": {
										"version": 8,
										"asVersion": 2
									},
									"attribution": "0",
									"_explicitType": "obo\\lo\\Media"
								}
							],
							"advancedEdit": 0,
							"options": null,
							"_explicitType": "obo\\lo\\PageItem"
						}
					],
					"questionIndex": null,
					"feedback": {
						"correct": "",
						"incorrect": ""
					},
					"_explicitType": "obo\\lo\\Question"
				},
				{
					"questionID": "10451",
					"userID": 126,
					"itemType": "MC",
					"answers": [
						{
							"answerID": "5988564754db6ca056d2525.25298287",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Zakaria, Fareed. &quot;Obama Deficit Speech Reveals His Core Belief.&quot; <I>Washingtonpost.com.</I> The Washington Post, 13 Apr. 2011. Web. 14 Apr. 2011.  </FONT></P></TEXTFORMAT>",
							"weight": 100,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "9957960374db6ca056d2811.40893194",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Zakaria, F. (2011) &quot;Obama deficit speech reveals his core belief&quot;. Washingtonpost.com Retrieved April 13 2011. Web</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "972176364db6ca056d29f5.03920169",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">Zakaria Fareed. &quot;Obama deficit speech reveals his core belief&quot;. Washingtonpost.com. The Washington Post, 13 Apr. 2011. 14 Apr. 2011. </FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						}
					],
					"perms": 0,
					"items": [
						{
							"pageItemID": 0,
							"component": "MediaView",
							"data": "",
							"media": [
								{
									"mediaID": 2351,
									"auth": "710",
									"title": "MLA A web q2 2011",
									"itemType": "pic",
									"descText": "Washington Post 2011",
									"createTime": 1303241333,
									"copyright": "Public domain.",
									"thumb": "0",
									"url": "MLA_A_web_q2_2011.jpg",
									"size": "177929",
									"length": "0",
									"perms": null,
									"height": 360,
									"width": 920,
									"meta": null,
									"attribution": null,
									"_explicitType": "obo\\lo\\Media"
								}
							],
							"advancedEdit": 0,
							"options": null,
							"_explicitType": "obo\\lo\\PageItem"
						}
					],
					"questionIndex": null,
					"feedback": {
						"correct": "",
						"incorrect": ""
					},
					"_explicitType": "obo\\lo\\Question"
				},
				{
					"questionID": "14130",
					"userID": 710,
					"itemType": "MC",
					"answers": [
						{
							"answerID": "130143155850d34088e1dac9.09547253",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">She did not use parenthetical citations correctly because it should include the author&apos;s last name in the parentheses.</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "88318254550d34088e1dbb4.47385795",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">She used the parenthetical citation correctly because the page number is always put in parentheses without the author&apos;s last name.</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "9343244250d34088e1dbf0.89920386",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">She used the parenthetical citation correctly because the sentence includes the author&apos;s last name and for that reason only the page number is put in parentheses.</FONT></P></TEXTFORMAT>",
							"weight": 100,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						}
					],
					"perms": 0,
					"items": [
						{
							"pageItemID": 0,
							"component": "TextArea",
							"data": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\">Libby wants to include the following text in her research paper.</FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\">As discussed by Jones, academic articles include a list of reliable sources that are helpful to investigate related information about a topic (15).</FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\">Did she use parenthetical citations correctly?</FONT></P></TEXTFORMAT>",
							"media": [],
							"advancedEdit": 0,
							"options": null,
							"_explicitType": "obo\\lo\\PageItem"
						}
					],
					"questionIndex": null,
					"feedback": {
						"incorrect": "",
						"correct": ""
					},
					"_explicitType": "obo\\lo\\Question"
				},
				{
					"questionID": "14140",
					"userID": 710,
					"itemType": "MC",
					"answers": [
						{
							"answerID": "37011079950d344a31a8b25.25301058",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">The information should include the author&apos;s last name and the page number.</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "199548698850d344a31a8c07.29850239",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">The information should include the author&apos;s first and last name and the page number.</FONT></P></TEXTFORMAT>",
							"weight": 0,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						},
						{
							"answerID": "151811537950d344a31a8c56.80700512",
							"userID": 0,
							"answer": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#313131\" LETTERSPACING=\"0\" KERNING=\"0\">The information should include the page number.</FONT></P></TEXTFORMAT>",
							"weight": 100,
							"feedback": "",
							"_explicitType": "obo\\lo\\Answer"
						}
					],
					"perms": 0,
					"items": [
						{
							"pageItemID": 0,
							"component": "TextArea",
							"data": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#383838\" LETTERSPACING=\"0\" KERNING=\"0\">Choose the answer that correctly describes what to include in a parenthetical citation when you use the author&apos;s name in an introductory sentence.</FONT></P></TEXTFORMAT>",
							"media": [],
							"advancedEdit": 0,
							"options": null,
							"_explicitType": "obo\\lo\\PageItem"
						}
					],
					"questionIndex": null,
					"feedback": {
						"incorrect": "",
						"correct": ""
					},
					"_explicitType": "obo\\lo\\Question"
				}
			],
			"quizSize": 11,
			"_explicitType": "obo\\lo\\QuestionGroup"
		},
		"keywords": [
			"mla",
			"citing",
			"cite",
			"document",
			"documenting",
			"source",
			"sources",
			"style"
		],
		"perms": {
			"userID": 0,
			"read": 1,
			"write": 1,
			"copy": 1,
			"publish": 1,
			"giveRead": 1,
			"giveWrite": 1,
			"giveCopy": 1,
			"givePublish": 1,
			"giveGlobal": 1,
			"_explicitType": "obo\\perms\\Permissions"
		},
		"summary": {
			"contentSize": "15",
			"practiceSize": "13",
			"assessmentSize": "11"
		},
		"isMaster": true,
		"_explicitType": "obo\\lo\\LO"
	};

/***/ },

/***/ 235:
/***/ function(module, exports) {

	module.exports = {
		"_id": "d650ae2d0318172f42ea132926000c38",
		"_rev": "9-fc44e9eef35bcc6ae36778ab2286a689",
		"id": "68016af1-bbb7-4038-81a9-70df6022ed35",
		"content": {
			"title": "Physics 2D"
		},
		"metadata": {},
		"index": 0,
		"type": "ObojoboDraft.Modules.Module",
		"children": [
			{
				"id": "the-content",
				"metadata": {},
				"index": 0,
				"type": "ObojoboDraft.Sections.Content",
				"children": [
					{
						"id": "page-1",
						"content": {
							"title": "Projectile Motion"
						},
						"metadata": {},
						"index": 0,
						"type": "ObojoboDraft.Pages.Page",
						"children": [
							{
								"id": "d8c9a638-7d10-40af-ba48-613bedefc297",
								"content": {
									"headingLevel": 1,
									"textGroup": [
										{
											"text": {
												"value": "Projectile Motion",
												"styleList": null
											},
											"data": {
												"indent": 0
											}
										}
									]
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.Heading",
								"children": null
							},
							{
								"id": "asdf2",
								"content": {
									"html": "<p>html<b>now</b></p>"
								},
								"type": "ObojoboDraft.Chunks.HTML"
							},
							{
								"id": "61bcd6c5-9fa6-4c3a-b743-5c6d0bef21a5",
								"content": {
									"headingLevel": 2,
									"textGroup": [
										{
											"text": {
												"value": "The initial velocity",
												"styleList": null
											},
											"data": {
												"indent": 0
											}
										}
									]
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.Heading",
								"children": null
							},
							{
								"id": "f8916b2c-f0fc-4cfe-9c80-863c165806fd",
								"content": {
									"textGroup": [
										{
											"text": {
												"value": "Let the projectile be launched with an initial velocity v_0 which can be expressed as the sum of horizontal and vertical components as follows:",
												"styleList": [
													{
														"type": "_latex",
														"start": 56,
														"end": 59,
														"data": {}
													}
												]
											},
											"data": {
												"indent": 0
											}
										}
									]
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.Text",
								"children": null
							},
							{
								"id": "356c5bfe-9fc9-4b10-bae0-e4585586d241",
								"content": {
									"latex": "v_0=v_{0_x}i+v_{0_y}j",
									"align": "center"
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.MathEquation",
								"children": null
							},
							{
								"id": "08d3d642-a1b4-4d76-98e1-771f7efa6bf5",
								"content": {
									"textGroup": [
										{
											"text": {
												"value": "The components x_{0_x} and v_{0_y} can be found if the initial launch angle, \\theta, is known:",
												"styleList": [
													{
														"type": "_latex",
														"start": 15,
														"end": 22,
														"data": {}
													},
													{
														"type": "_latex",
														"start": 27,
														"end": 34,
														"data": {}
													},
													{
														"type": "_latex",
														"start": 77,
														"end": 83,
														"data": {}
													}
												]
											},
											"data": {
												"indent": 0
											}
										}
									]
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.Text",
								"children": null
							},
							{
								"id": "5d4cba29-9d55-4570-bf6c-7bce75b816f0",
								"content": {
									"listStyles": {
										"type": "unordered",
										"indents": {}
									},
									"textGroup": [
										{
											"text": {
												"value": "v_{0_x} = v_0 \\cos \\theta",
												"styleList": [
													{
														"type": "_latex",
														"start": 0,
														"end": 27,
														"data": {}
													}
												]
											},
											"data": {
												"indent": 0
											}
										},
										{
											"text": {
												"value": "v_{0_t} = v_0 \\sin \\theta",
												"styleList": [
													{
														"type": "_latex",
														"start": 0,
														"end": 27,
														"data": {}
													}
												]
											},
											"data": {
												"indent": 0
											}
										}
									]
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.List",
								"children": null
							},
							{
								"id": "0f14275e-bda6-4f70-bac1-f3d3481c00f0",
								"content": {
									"textGroup": [
										{
											"text": {
												"value": "See also the section Parabolic equation for information on finding the initial velocity.",
												"styleList": null
											},
											"data": {
												"indent": 0
											}
										}
									]
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.Text",
								"children": null
							},
							{
								"id": "c66c7a0a-5007-40f5-a7c6-4ecad9b52764",
								"content": {
									"headingLevel": 2,
									"textGroup": [
										{
											"text": {
												"value": "Kinematic quantities of projectile motion",
												"styleList": null
											},
											"data": {
												"indent": 0
											}
										}
									]
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.Heading",
								"children": null
							},
							{
								"id": "9207dc95-0c94-4fae-acbf-bc41d3500e91",
								"content": {
									"textGroup": [
										{
											"text": {
												"value": "In projectile motion, the horizontal motion and the vertical motion are independent of each other; that is, neither motion affects the other. This is the principle of compound motion established by Galileo in 1638.",
												"styleList": null
											},
											"data": {
												"indent": 0
											}
										}
									]
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.Text",
								"children": null
							},
							{
								"id": "0b145fca-28bc-43f1-877e-0149dd56e168",
								"content": {},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.Break",
								"children": null
							},
							{
								"id": "ed19ec8e-c4c8-428d-adcd-5c9c59ceddfe",
								"content": {
									"headingLevel": 2,
									"textGroup": [
										{
											"text": {
												"value": "More examples",
												"styleList": null
											},
											"data": {
												"indent": 0
											}
										}
									]
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.Heading",
								"children": null
							},
							{
								"id": "bfed61fa-d226-4acb-b037-2c294608627a",
								"content": {
									"textGroup": [
										{
											"text": {
												"value": "// Computer code example:",
												"styleList": null
											},
											"data": {
												"indent": 0
											}
										},
										{
											"text": {
												"value": "int Fibonacci(int n)",
												"styleList": null
											},
											"data": {
												"indent": 0
											}
										},
										{
											"text": {
												"value": "if( n == 0 || n == 1) return n",
												"styleList": null
											},
											"data": {
												"indent": 1
											}
										},
										{
											"text": {
												"value": "return Fibonacci(n - 1) + Fibonacci(n - 2)",
												"styleList": null
											},
											"data": {
												"indent": 1
											}
										}
									]
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.Code",
								"children": null
							},
							{
								"id": "4220837d-5255-450e-8c8b-5f5232f786ef",
								"content": {
									"textGroup": [
										{
											"text": {
												"value": "Here is an image with a caption",
												"styleList": null
											},
											"data": {
												"indent": 0
											}
										}
									],
									"url": "http://lorempixel.com/640/480/sports/",
									"size": "small"
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.Figure",
								"children": null
							},
							{
								"id": "6455f650-129f-46e6-8e12-0952ce931a69",
								"content": {
									"textGroup": [
										{
											"text": {
												"value": "Here is a medium image",
												"styleList": null
											},
											"data": {
												"indent": 0
											}
										}
									],
									"url": "http://lorempixel.com/640/480/city",
									"size": "medium"
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.Figure",
								"children": null
							},
							{
								"id": "d1fc6d67-e0ce-4bc1-8e38-f7f8109b2431",
								"content": {
									"textGroup": [
										{
											"text": {
												"value": "And here is a large image",
												"styleList": null
											},
											"data": {
												"indent": 0
											}
										}
									],
									"url": "http://lorempixel.com/1080/720/nature",
									"size": "large"
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.Figure",
								"children": null
							},
							{
								"id": "570741b3-539e-4515-bd41-9f101ca968b3",
								"content": {
									"textGroup": [
										{
											"text": {
												"value": "A table is shown below:",
												"styleList": null
											},
											"data": {
												"indent": 0
											}
										}
									]
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.Text",
								"children": null
							},
							{
								"id": "66378edf-5dad-47c4-af8f-87708d3782be",
								"content": {
									"textGroup": {
										"textGroup": [
											{
												"text": {
													"value": "First column",
													"styleList": null
												},
												"data": {
													"indent": 0
												}
											},
											{
												"text": {
													"value": "Second column",
													"styleList": null
												},
												"data": {
													"indent": 0
												}
											},
											{
												"text": {
													"value": "Item 1",
													"styleList": null
												},
												"data": {
													"indent": 0
												}
											},
											{
												"text": {
													"value": "Item 2",
													"styleList": null
												},
												"data": {
													"indent": 0
												}
											}
										],
										"numRows": 2,
										"numCols": 2
									},
									"rows": 2,
									"cols": 2,
									"header": true
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.Table",
								"children": null
							},
							{
								"id": "9a430517-0a5e-48eb-81ab-d0f5f1184661",
								"content": {
									"textGroup": [
										{
											"text": {
												"value": "YouTube Video:",
												"styleList": null
											},
											"data": {
												"indent": 0
											}
										}
									]
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.Text",
								"children": null
							},
							{
								"id": "62c98671-ef5f-41bd-9439-833009e97ebc",
								"content": {
									"videoId": "zJb-Q49vD3A"
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.YouTube",
								"children": null
							},
							{
								"id": "0f4eb0c7-775d-4080-a170-0cee11b6eb00",
								"content": {
									"textGroup": [
										{
											"text": {
												"value": "Here is a practice question with math and custom feedback",
												"styleList": null
											},
											"data": {
												"indent": 0
											}
										}
									]
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.Text",
								"children": null
							},
							{
								"id": "a75581c6-b936-4ba0-8b51-e66c04d6285f",
								"content": {
									"shuffle": true,
									"type": "practice",
									"solution": {
										"id": "solution-pg",
										"content": {
											"title": "Equation Examples"
										},
										"metadata": {},
										"index": 0,
										"type": "ObojoboDraft.Pages.Page",
										"children": [
											{
												"id": "asdf",
												"content": {
													"html": "<p>html<b>now</b></p>"
												},
												"type": "ObojoboDraft.Chunks.HTML"
											},
											{
												"id": "2-0f392890-4ab8-4f40-ac12-83483c6714cf",
												"content": {
													"textGroup": [
														{
															"text": {
																"value": "Let the projectile be launched with an initial velocity v_0 which can be expressed as the sum of horizontal and vertical components as follows:",
																"styleList": [
																	{
																		"type": "_latex",
																		"start": 56,
																		"end": 59,
																		"data": {}
																	}
																]
															},
															"data": {
																"indent": 0
															}
														}
													]
												},
												"metadata": {},
												"index": 0,
												"type": "ObojoboDraft.Chunks.Text",
												"children": null
											},
											{
												"id": "2-85db9cde-daa3-4303-84a2-23c9e28d3996",
												"content": {
													"latex": "v_0=v_{0_x}i+v_{0_y}j",
													"align": "center"
												},
												"metadata": {},
												"index": 0,
												"type": "ObojoboDraft.Chunks.MathEquation",
												"children": null
											},
											{
												"id": "2-376cddfc-1076-49dd-9f6e-1e6ff6adab76",
												"content": {
													"textGroup": [
														{
															"text": {
																"value": "The components x_{0_x} and v_{0_y} can be found if the initial launch angle, \\theta, is known:",
																"styleList": [
																	{
																		"type": "_latex",
																		"start": 15,
																		"end": 22,
																		"data": {}
																	},
																	{
																		"type": "_latex",
																		"start": 27,
																		"end": 34,
																		"data": {}
																	},
																	{
																		"type": "_latex",
																		"start": 77,
																		"end": 83,
																		"data": {}
																	}
																]
															},
															"data": {
																"indent": 0
															}
														}
													]
												},
												"metadata": {},
												"index": 0,
												"type": "ObojoboDraft.Chunks.Text",
												"children": null
											},
											{
												"id": "2-294386f1-0dd7-43f5-be48-9f9da5a9c472",
												"content": {
													"listStyles": {
														"type": "unordered",
														"indents": {}
													},
													"textGroup": [
														{
															"text": {
																"value": "v_{0_x} = v_0 \\cos \\theta",
																"styleList": [
																	{
																		"type": "_latex",
																		"start": 0,
																		"end": 27,
																		"data": {}
																	}
																]
															},
															"data": {
																"indent": 0
															}
														},
														{
															"text": {
																"value": "v_{0_t} = v_0 \\sin \\theta",
																"styleList": [
																	{
																		"type": "_latex",
																		"start": 0,
																		"end": 27,
																		"data": {}
																	}
																]
															},
															"data": {
																"indent": 0
															}
														}
													]
												},
												"metadata": {},
												"index": 0,
												"type": "ObojoboDraft.Chunks.List",
												"children": null
											},
											{
												"id": "2-436f3bd4-6b63-49ed-b348-907424e3a939",
												"content": {
													"textGroup": [
														{
															"text": {
																"value": "See also the section Parabolic equation for information on finding the initial velocity.",
																"styleList": null
															},
															"data": {
																"indent": 0
															}
														}
													]
												},
												"metadata": {},
												"index": 0,
												"type": "ObojoboDraft.Chunks.Text",
												"children": null
											}
										]
									}
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.Question",
								"children": [
									{
										"id": "2-8022fb0b-b035-431d-a8db-4741ee536c16",
										"content": {
											"headingLevel": 1,
											"textGroup": [
												{
													"text": {
														"value": "Which equation describes horizontal displacement of projectile motion?",
														"styleList": null
													},
													"data": {
														"indent": 0
													}
												}
											]
										},
										"metadata": {},
										"index": 0,
										"type": "ObojoboDraft.Chunks.Heading",
										"children": null
									},
									{
										"id": "dfe52410-8339-4234-962d-9c296fc2ac37",
										"content": {
											"responseType": "pick-one-multiple-correct"
										},
										"metadata": {},
										"index": 0,
										"type": "ObojoboDraft.Chunks.MCAssessment",
										"children": [
											{
												"id": "fbe0c55b-3120-429e-9a50-0d05a4ecad3a",
												"content": {
													"score": 100
												},
												"metadata": {},
												"index": 0,
												"type": "ObojoboDraft.Chunks.MCAssessment.MCChoice",
												"children": [
													{
														"id": "0df68133-65ed-4a94-824f-4859251faa8e",
														"content": {},
														"metadata": {},
														"index": 0,
														"type": "ObojoboDraft.Chunks.MCAssessment.MCAnswer",
														"children": [
															{
																"id": "1c133fa3-054b-46e5-935e-7b0fb16f3ef0",
																"content": {
																	"latex": "x=v_xt",
																	"align": "left"
																},
																"metadata": {},
																"index": 0,
																"type": "ObojoboDraft.Chunks.MathEquation",
																"children": null
															}
														]
													}
												]
											},
											{
												"id": "67c1e284-4c58-4c14-b134-db70ec039205",
												"content": {
													"score": 100
												},
												"metadata": {},
												"index": 0,
												"type": "ObojoboDraft.Chunks.MCAssessment.MCChoice",
												"children": [
													{
														"id": "61d226e6-3b26-4a32-9584-4d1f709f79b6",
														"content": {},
														"metadata": {},
														"index": 0,
														"type": "ObojoboDraft.Chunks.MCAssessment.MCAnswer",
														"children": [
															{
																"id": "c2083070-984c-4ae8-a240-f4afecf3b71a",
																"content": {
																	"latex": "x=v_{ix}t + \\frac{1}{2} a_x t^2",
																	"align": "left"
																},
																"metadata": {},
																"index": 0,
																"type": "ObojoboDraft.Chunks.MathEquation",
																"children": null
															}
														]
													},
													{
														"id": "21d08d0b-1022-418d-996e-bc12b1b3bf2d",
														"content": {},
														"metadata": {},
														"index": 0,
														"type": "ObojoboDraft.Chunks.MCAssessment.MCFeedback",
														"children": [
															{
																"id": "3a64cd7c-6bb5-4010-866d-e77bff787cf5",
																"content": {
																	"textGroup": [
																		{
																			"text": {
																				"value": "Correct, however horizontal acceleration is zero so you can simplify this equation into the form below:",
																				"styleList": null
																			},
																			"data": {
																				"indent": 0
																			}
																		}
																	]
																},
																"metadata": {},
																"index": 0,
																"type": "ObojoboDraft.Chunks.Text",
																"children": null
															},
															{
																"id": "4e206527-876a-404e-a606-9fbb937173a6",
																"content": {
																	"latex": "x=v_xt",
																	"align": "left"
																},
																"metadata": {},
																"index": 0,
																"type": "ObojoboDraft.Chunks.MathEquation",
																"children": null
															}
														]
													}
												]
											},
											{
												"id": "a4b7cc1c-ce4f-4d23-9873-a8a658e62360",
												"content": {
													"score": 0
												},
												"metadata": {},
												"index": 0,
												"type": "ObojoboDraft.Chunks.MCAssessment.MCChoice",
												"children": [
													{
														"id": "12aacc31-005e-44eb-9106-24cf57bffb91",
														"content": {},
														"metadata": {},
														"index": 0,
														"type": "ObojoboDraft.Chunks.MCAssessment.MCAnswer",
														"children": [
															{
																"id": "491f57fe-413b-4c1c-bbb0-5c9ebad74eb7",
																"content": {
																	"latex": "x=\\frac{1}{2} a_x t^2",
																	"align": "left"
																},
																"metadata": {},
																"index": 0,
																"type": "ObojoboDraft.Chunks.MathEquation",
																"children": null
															}
														]
													},
													{
														"id": "30f99da7-7043-4123-9bdb-801da1c19584",
														"content": {},
														"metadata": {},
														"index": 0,
														"type": "ObojoboDraft.Chunks.MCAssessment.MCFeedback",
														"children": [
															{
																"id": "cc9e2d07-3e50-4637-96cf-1b4eeeaaa3d9",
																"content": {
																	"textGroup": [
																		{
																			"text": {
																				"value": "The a_x term representing horizontal acceleration is always 0 so this equation is simply x = 0.",
																				"styleList": [
																					{
																						"type": "_latex",
																						"start": 5,
																						"end": 8,
																						"data": {}
																					}
																				]
																			},
																			"data": {
																				"indent": 0
																			}
																		}
																	]
																},
																"metadata": {},
																"index": 0,
																"type": "ObojoboDraft.Chunks.Text",
																"children": null
															}
														]
													}
												]
											}
										]
									}
								]
							},
							{
								"id": "6cc83fef-5f54-4a19-9a01-689df35e9020",
								"content": {
									"textGroup": [
										{
											"text": {
												"value": "Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. Finally this is a question bank containing two sets of two questions each, randomly selected. ",
												"styleList": null
											},
											"data": {
												"indent": 0
											}
										}
									]
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.Text",
								"children": null
							},
							{
								"id": "41e5c29d-9465-44d4-a885-bc5b5268a255",
								"content": {},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.QuestionBank",
								"children": [
									{
										"id": "e10b0fe3-f6e9-472e-82cf-72a244ee20fe",
										"content": {},
										"metadata": {},
										"index": 0,
										"type": "ObojoboDraft.Group",
										"children": [
											{
												"id": "a1adf27d-f878-4c39-91f4-51c7a5472f53",
												"content": {
													"shuffle": true,
													"type": "practice"
												},
												"metadata": {},
												"index": 0,
												"type": "ObojoboDraft.Chunks.Question",
												"children": [
													{
														"id": "1df1f1a7-777f-4562-928e-7358b1f63de6",
														"content": {
															"headingLevel": 1,
															"textGroup": [
																{
																	"text": {
																		"value": "Here is a question with only one right answer",
																		"styleList": null
																	},
																	"data": {
																		"indent": 0
																	}
																}
															]
														},
														"metadata": {},
														"index": 0,
														"type": "ObojoboDraft.Chunks.Heading",
														"children": null
													},
													{
														"id": "fba69c97-98fd-4e60-a69f-740464f57fdb",
														"content": {
															"responseType": "pick-all"
														},
														"metadata": {},
														"index": 0,
														"type": "ObojoboDraft.Chunks.MCAssessment",
														"children": [
															{
																"id": "ad7f08a9-7f64-4ff8-8312-179ecbdc06c6",
																"content": {
																	"score": 100
																},
																"metadata": {},
																"index": 0,
																"type": "ObojoboDraft.Chunks.MCAssessment.MCChoice",
																"children": [
																	{
																		"id": "918b3ffd-e79f-4a38-98c4-205104e434e2",
																		"content": {},
																		"metadata": {},
																		"index": 0,
																		"type": "ObojoboDraft.Chunks.MCAssessment.MCAnswer",
																		"children": [
																			{
																				"id": "9e62f4c7-112a-41e5-8c50-fdb223902d69",
																				"content": {
																					"textGroup": [
																						{
																							"text": {
																								"value": "This is the correct answer",
																								"styleList": null
																							},
																							"data": {
																								"indent": 0
																							}
																						}
																					]
																				},
																				"metadata": {},
																				"index": 0,
																				"type": "ObojoboDraft.Chunks.Text",
																				"children": null
																			}
																		]
																	}
																]
															},
															{
																"id": "45741cef-b80e-4f79-a87c-f53677c59109",
																"content": {
																	"score": 100
																},
																"metadata": {},
																"index": 0,
																"type": "ObojoboDraft.Chunks.MCAssessment.MCChoice",
																"children": [
																	{
																		"id": "3ac57285-a214-4aa1-908f-fb79bdb20590",
																		"content": {},
																		"metadata": {},
																		"index": 0,
																		"type": "ObojoboDraft.Chunks.MCAssessment.MCAnswer",
																		"children": [
																			{
																				"id": "1064bc5e-fa09-4497-bc33-cf3b2b6e39f3",
																				"content": {
																					"textGroup": [
																						{
																							"text": {
																								"value": "This is the correct answer too",
																								"styleList": null
																							},
																							"data": {
																								"indent": 0
																							}
																						}
																					]
																				},
																				"metadata": {},
																				"index": 0,
																				"type": "ObojoboDraft.Chunks.Text",
																				"children": null
																			}
																		]
																	}
																]
															}
														]
													}
												]
											},
											{
												"id": "3c9de28a-afa8-4536-9dc8-a8d9782e72c8",
												"content": {
													"shuffle": true,
													"type": "practice"
												},
												"metadata": {},
												"index": 0,
												"type": "ObojoboDraft.Chunks.Question",
												"children": [
													{
														"id": "68abc099-456a-495e-8d86-c084f8138796",
														"content": {
															"headingLevel": 1,
															"textGroup": [
																{
																	"text": {
																		"value": "Here is a question with multiple correct answers",
																		"styleList": null
																	},
																	"data": {
																		"indent": 0
																	}
																}
															]
														},
														"metadata": {},
														"index": 0,
														"type": "ObojoboDraft.Chunks.Heading",
														"children": null
													},
													{
														"id": "61aecf18-6718-4a31-afc2-707e2a9e7e82",
														"content": {
															"responseType": "pick-one-multiple-correct"
														},
														"metadata": {},
														"index": 0,
														"type": "ObojoboDraft.Chunks.MCAssessment",
														"children": [
															{
																"id": "b53e2563-09e8-4ac7-9c1c-f0d8923e2b56",
																"content": {
																	"score": 100
																},
																"metadata": {},
																"index": 0,
																"type": "ObojoboDraft.Chunks.MCAssessment.MCChoice",
																"children": [
																	{
																		"id": "477a9e76-ac6d-4d94-a5db-2bfeb463a71e",
																		"content": {},
																		"metadata": {},
																		"index": 0,
																		"type": "ObojoboDraft.Chunks.MCAssessment.MCAnswer",
																		"children": [
																			{
																				"id": "21213ae1-7cac-4884-b305-b5f28745b5bb",
																				"content": {
																					"textGroup": [
																						{
																							"text": {
																								"value": "This is a correct answer",
																								"styleList": null
																							},
																							"data": {
																								"indent": 0
																							}
																						}
																					]
																				},
																				"metadata": {},
																				"index": 0,
																				"type": "ObojoboDraft.Chunks.Text",
																				"children": null
																			}
																		]
																	}
																]
															},
															{
																"id": "e842f775-57eb-4086-a789-95c9cdd752b9",
																"content": {
																	"score": 100
																},
																"metadata": {},
																"index": 0,
																"type": "ObojoboDraft.Chunks.MCAssessment.MCChoice",
																"children": [
																	{
																		"id": "b0ce6d8d-4312-4c97-8b2d-c847476cb3ab",
																		"content": {},
																		"metadata": {},
																		"index": 0,
																		"type": "ObojoboDraft.Chunks.MCAssessment.MCAnswer",
																		"children": [
																			{
																				"id": "d0fe65f1-2c47-4442-b7e5-2708f4cb9027",
																				"content": {
																					"textGroup": [
																						{
																							"text": {
																								"value": "This is a correct answer",
																								"styleList": null
																							},
																							"data": {
																								"indent": 0
																							}
																						}
																					]
																				},
																				"metadata": {},
																				"index": 0,
																				"type": "ObojoboDraft.Chunks.Text",
																				"children": null
																			}
																		]
																	}
																]
															},
															{
																"id": "65105c93-3555-4583-87ae-49284344703f",
																"content": {
																	"score": 0
																},
																"metadata": {},
																"index": 0,
																"type": "ObojoboDraft.Chunks.MCAssessment.MCChoice",
																"children": [
																	{
																		"id": "fb506aaa-b72f-475b-b9ae-de723746b019",
																		"content": {},
																		"metadata": {},
																		"index": 0,
																		"type": "ObojoboDraft.Chunks.MCAssessment.MCAnswer",
																		"children": [
																			{
																				"id": "e20d8915-2094-4920-9e47-68020db88e0c",
																				"content": {
																					"textGroup": [
																						{
																							"text": {
																								"value": "This is an incorrect answer",
																								"styleList": null
																							},
																							"data": {
																								"indent": 0
																							}
																						}
																					]
																				},
																				"metadata": {},
																				"index": 0,
																				"type": "ObojoboDraft.Chunks.Text",
																				"children": null
																			}
																		]
																	}
																]
															}
														]
													}
												]
											}
										]
									},
									{
										"id": "37a70f3f-8bb4-4bda-9c79-85f82e693af7",
										"content": {},
										"metadata": {},
										"index": 0,
										"type": "ObojoboDraft.Group",
										"children": [
											{
												"id": "208807c1-00c5-42f9-a3fa-ad8e0e467ebd",
												"content": {
													"shuffle": true,
													"type": "practice"
												},
												"metadata": {},
												"index": 0,
												"type": "ObojoboDraft.Chunks.Question",
												"children": [
													{
														"id": "850ae011-2a35-4c62-8f4a-cb821492ca44",
														"content": {
															"headingLevel": 1,
															"textGroup": [
																{
																	"text": {
																		"value": "Here is a question with multiple correct answers but only one needs to be chosen",
																		"styleList": null
																	},
																	"data": {
																		"indent": 0
																	}
																}
															]
														},
														"metadata": {},
														"index": 0,
														"type": "ObojoboDraft.Chunks.Heading",
														"children": null
													},
													{
														"id": "a5cb92d5-cc2a-4a7a-bd61-a6af0cf8723c",
														"content": {
															"responseType": "pick-one-multiple-correct"
														},
														"metadata": {},
														"index": 0,
														"type": "ObojoboDraft.Chunks.MCAssessment",
														"children": [
															{
																"id": "0af247c9-b1d6-416c-8c2e-b47fac737100",
																"content": {
																	"score": 100
																},
																"metadata": {},
																"index": 0,
																"type": "ObojoboDraft.Chunks.MCAssessment.MCChoice",
																"children": [
																	{
																		"id": "078c055c-b394-4173-8774-89e316b1b0cd",
																		"content": {},
																		"metadata": {},
																		"index": 0,
																		"type": "ObojoboDraft.Chunks.MCAssessment.MCAnswer",
																		"children": [
																			{
																				"id": "06e77e84-78b7-4f53-b277-e1c347291c0f",
																				"content": {
																					"textGroup": [
																						{
																							"text": {
																								"value": "This is a correct answer",
																								"styleList": null
																							},
																							"data": {
																								"indent": 0
																							}
																						}
																					]
																				},
																				"metadata": {},
																				"index": 0,
																				"type": "ObojoboDraft.Chunks.Text",
																				"children": null
																			}
																		]
																	}
																]
															},
															{
																"id": "b770c2be-5001-4815-84b4-a3278bc63b7b",
																"content": {
																	"score": 100
																},
																"metadata": {},
																"index": 0,
																"type": "ObojoboDraft.Chunks.MCAssessment.MCChoice",
																"children": [
																	{
																		"id": "f7d476f0-9185-4dc7-a8c3-6fd7823f13aa",
																		"content": {},
																		"metadata": {},
																		"index": 0,
																		"type": "ObojoboDraft.Chunks.MCAssessment.MCAnswer",
																		"children": [
																			{
																				"id": "e8886502-1320-4f3d-a287-100616ab7bdc",
																				"content": {
																					"textGroup": [
																						{
																							"text": {
																								"value": "This is a correct answer",
																								"styleList": null
																							},
																							"data": {
																								"indent": 0
																							}
																						}
																					]
																				},
																				"metadata": {},
																				"index": 0,
																				"type": "ObojoboDraft.Chunks.Text",
																				"children": null
																			}
																		]
																	}
																]
															},
															{
																"id": "545ecbee-157f-4ac6-bb10-24c2f04cb33d",
																"content": {
																	"score": 0
																},
																"metadata": {},
																"index": 0,
																"type": "ObojoboDraft.Chunks.MCAssessment.MCChoice",
																"children": [
																	{
																		"id": "78886943-ed41-42f4-b0fe-9db3c2cc5834",
																		"content": {},
																		"metadata": {},
																		"index": 0,
																		"type": "ObojoboDraft.Chunks.MCAssessment.MCAnswer",
																		"children": [
																			{
																				"id": "aa1a4eb2-07fb-4090-80c8-856543be12a2",
																				"content": {
																					"textGroup": [
																						{
																							"text": {
																								"value": "This is an incorrect answer",
																								"styleList": null
																							},
																							"data": {
																								"indent": 0
																							}
																						}
																					]
																				},
																				"metadata": {},
																				"index": 0,
																				"type": "ObojoboDraft.Chunks.Text",
																				"children": null
																			}
																		]
																	}
																]
															}
														]
													}
												]
											},
											{
												"id": "d48d0f41-e242-425c-ae88-5657bdb83e08",
												"content": {
													"shuffle": true,
													"type": "practice"
												},
												"metadata": {},
												"index": 0,
												"type": "ObojoboDraft.Chunks.Question",
												"children": [
													{
														"id": "e5a71a7a-a834-46aa-a028-b48589096065",
														"content": {
															"headingLevel": 1,
															"textGroup": [
																{
																	"text": {
																		"value": "Here is a question which contains multiple types of content in the question",
																		"styleList": null
																	},
																	"data": {
																		"indent": 0
																	}
																}
															]
														},
														"metadata": {},
														"index": 0,
														"type": "ObojoboDraft.Chunks.Heading",
														"children": null
													},
													{
														"id": "17d946fd-e085-4202-8f98-9b9985377e12",
														"content": {
															"listStyles": {
																"type": "ordered",
																"indents": {}
															},
															"textGroup": [
																{
																	"text": {
																		"value": "For example, this ordered list",
																		"styleList": null
																	},
																	"data": {
																		"indent": 0
																	}
																},
																{
																	"text": {
																		"value": "With a YouTube video below...",
																		"styleList": null
																	},
																	"data": {
																		"indent": 1
																	}
																}
															]
														},
														"metadata": {},
														"index": 0,
														"type": "ObojoboDraft.Chunks.List",
														"children": null
													},
													{
														"id": "8bef17a4-896d-4b68-a019-9196e0a4b368",
														"content": {
															"videoId": "zJb-Q49vD3A"
														},
														"metadata": {},
														"index": 0,
														"type": "ObojoboDraft.Chunks.YouTube",
														"children": null
													},
													{
														"id": "f41ceb9f-8d02-4498-aab0-e253bc2cfa94",
														"content": {
															"responseType": "pick-one"
														},
														"metadata": {},
														"index": 0,
														"type": "ObojoboDraft.Chunks.MCAssessment",
														"children": [
															{
																"id": "0213d006-2a76-4fe8-90ab-c6e54f06c047",
																"content": {
																	"score": 100
																},
																"metadata": {},
																"index": 0,
																"type": "ObojoboDraft.Chunks.MCAssessment.MCChoice",
																"children": [
																	{
																		"id": "7db2aca2-f1c7-47f8-88b1-4e73877bb6ae",
																		"content": {},
																		"metadata": {},
																		"index": 0,
																		"type": "ObojoboDraft.Chunks.MCAssessment.MCAnswer",
																		"children": [
																			{
																				"id": "40ba209a-134e-476e-88bd-33a4ebf597ef",
																				"content": {
																					"textGroup": [
																						{
																							"text": {
																								"value": "This is the correct answer",
																								"styleList": null
																							},
																							"data": {
																								"indent": 0
																							}
																						}
																					]
																				},
																				"metadata": {},
																				"index": 0,
																				"type": "ObojoboDraft.Chunks.Text",
																				"children": null
																			}
																		]
																	}
																]
															},
															{
																"id": "98fbf006-4561-449d-bdc0-2f26496b1aff",
																"content": {
																	"score": 0
																},
																"metadata": {},
																"index": 0,
																"type": "ObojoboDraft.Chunks.MCAssessment.MCChoice",
																"children": [
																	{
																		"id": "0a107f30-9841-406b-a472-a9c5434f9bc1",
																		"content": {},
																		"metadata": {},
																		"index": 0,
																		"type": "ObojoboDraft.Chunks.MCAssessment.MCAnswer",
																		"children": [
																			{
																				"id": "d766e16a-c171-4b0c-b9ac-77f9e86daa51",
																				"content": {
																					"textGroup": [
																						{
																							"text": {
																								"value": "This is the incorrect answer",
																								"styleList": null
																							},
																							"data": {
																								"indent": 0
																							}
																						}
																					]
																				},
																				"metadata": {},
																				"index": 0,
																				"type": "ObojoboDraft.Chunks.Text",
																				"children": null
																			}
																		]
																	}
																]
															}
														]
													}
												]
											}
										]
									}
								]
							}
						]
					},
					{
						"id": "page-2",
						"content": {
							"title": "Equation Examples"
						},
						"metadata": {},
						"index": 0,
						"type": "ObojoboDraft.Pages.Page",
						"children": [
							{
								"id": "3c1d6f82-998b-42df-aa73-449f5eca1a43",
								"content": {
									"headingLevel": 1,
									"textGroup": [
										{
											"text": {
												"value": "Equation Examples",
												"styleList": null
											},
											"data": {
												"indent": 0
											}
										}
									]
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.Heading",
								"children": null
							},
							{
								"id": "6f58403f-a1df-4927-80a3-d394cf73be08",
								"content": {
									"headingLevel": 2,
									"textGroup": [
										{
											"text": {
												"value": "The initial velocity",
												"styleList": null
											},
											"data": {
												"indent": 0
											}
										}
									]
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.Heading",
								"children": null
							},
							{
								"id": "0f392890-4ab8-4f40-ac12-83483c6714cf",
								"content": {
									"textGroup": [
										{
											"text": {
												"value": "Let the projectile be launched with an initial velocity v_0 which can be expressed as the sum of horizontal and vertical components as follows:",
												"styleList": [
													{
														"type": "_latex",
														"start": 56,
														"end": 59,
														"data": {}
													}
												]
											},
											"data": {
												"indent": 0
											}
										}
									]
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.Text",
								"children": null
							},
							{
								"id": "85db9cde-daa3-4303-84a2-23c9e28d3996",
								"content": {
									"latex": "v_0=v_{0_x}i+v_{0_y}j",
									"align": "center"
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.MathEquation",
								"children": null
							},
							{
								"id": "376cddfc-1076-49dd-9f6e-1e6ff6adab76",
								"content": {
									"textGroup": [
										{
											"text": {
												"value": "The components x_{0_x} and v_{0_y} can be found if the initial launch angle, \\theta, is known:",
												"styleList": [
													{
														"type": "_latex",
														"start": 15,
														"end": 22,
														"data": {}
													},
													{
														"type": "_latex",
														"start": 27,
														"end": 34,
														"data": {}
													},
													{
														"type": "_latex",
														"start": 77,
														"end": 83,
														"data": {}
													}
												]
											},
											"data": {
												"indent": 0
											}
										}
									]
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.Text",
								"children": null
							},
							{
								"id": "294386f1-0dd7-43f5-be48-9f9da5a9c472",
								"content": {
									"listStyles": {
										"type": "unordered",
										"indents": {}
									},
									"textGroup": [
										{
											"text": {
												"value": "v_{0_x} = v_0 \\cos \\theta",
												"styleList": [
													{
														"type": "_latex",
														"start": 0,
														"end": 27,
														"data": {}
													}
												]
											},
											"data": {
												"indent": 0
											}
										},
										{
											"text": {
												"value": "v_{0_t} = v_0 \\sin \\theta",
												"styleList": [
													{
														"type": "_latex",
														"start": 0,
														"end": 27,
														"data": {}
													}
												]
											},
											"data": {
												"indent": 0
											}
										}
									]
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.List",
								"children": null
							},
							{
								"id": "436f3bd4-6b63-49ed-b348-907424e3a939",
								"content": {
									"textGroup": [
										{
											"text": {
												"value": "See also the section Parabolic equation for information on finding the initial velocity.",
												"styleList": null
											},
											"data": {
												"indent": 0
											}
										}
									]
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.Text",
								"children": null
							}
						]
					},
					{
						"id": "pg-3",
						"content": {
							"title": "Page 3"
						},
						"metadata": {},
						"index": 0,
						"type": "ObojoboDraft.Pages.Page",
						"children": [
							{
								"id": "a42fb1c2-31a3-4be3-aaac-482ccfdf34ae",
								"content": {
									"headingLevel": 1,
									"textGroup": [
										{
											"text": {
												"value": "Page 3",
												"styleList": null
											},
											"data": {
												"indent": 0
											}
										}
									]
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.Heading",
								"children": null
							},
							{
								"id": "8c692f45-3825-430a-8fda-e7aa95ddf10e",
								"content": {
									"headingLevel": 2,
									"textGroup": [
										{
											"text": {
												"value": "The initial velocity",
												"styleList": null
											},
											"data": {
												"indent": 0
											}
										}
									]
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.Heading",
								"children": null
							},
							{
								"id": "9268ea97-4d4f-4dae-9bd9-790fa99a32e6",
								"content": {
									"textGroup": [
										{
											"text": {
												"value": "Let the projectile be launched with an initial velocity v_0 which can be expressed as the sum of horizontal and vertical components as follows:",
												"styleList": [
													{
														"type": "_latex",
														"start": 56,
														"end": 59,
														"data": {}
													}
												]
											},
											"data": {
												"indent": 0
											}
										}
									]
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.Text",
								"children": null
							},
							{
								"id": "94ea1a07-a232-4255-b24e-d26170f942a7",
								"content": {
									"latex": "v_0=v_{0_x}i+v_{0_y}j",
									"align": "center"
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.MathEquation",
								"children": null
							},
							{
								"id": "107dd8fa-e257-41f6-9473-1b3a5811fb03",
								"content": {
									"textGroup": [
										{
											"text": {
												"value": "The components x_{0_x} and v_{0_y} can be found if the initial launch angle, \\theta, is known:",
												"styleList": [
													{
														"type": "_latex",
														"start": 15,
														"end": 22,
														"data": {}
													},
													{
														"type": "_latex",
														"start": 27,
														"end": 34,
														"data": {}
													},
													{
														"type": "_latex",
														"start": 77,
														"end": 83,
														"data": {}
													}
												]
											},
											"data": {
												"indent": 0
											}
										}
									]
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.Text",
								"children": null
							},
							{
								"id": "ebb68b9d-f0cc-4485-b57e-0b263233def8",
								"content": {
									"listStyles": {
										"type": "unordered",
										"indents": {}
									},
									"textGroup": [
										{
											"text": {
												"value": "v_{0_x} = v_0 \\cos \\theta",
												"styleList": [
													{
														"type": "_latex",
														"start": 0,
														"end": 27,
														"data": {}
													}
												]
											},
											"data": {
												"indent": 0
											}
										},
										{
											"text": {
												"value": "v_{0_t} = v_0 \\sin \\theta",
												"styleList": [
													{
														"type": "_latex",
														"start": 0,
														"end": 27,
														"data": {}
													}
												]
											},
											"data": {
												"indent": 0
											}
										}
									]
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.List",
								"children": null
							},
							{
								"id": "df024343-69a7-4274-920d-9e98398b863e",
								"content": {
									"textGroup": [
										{
											"text": {
												"value": "See also the section Parabolic equation for information on finding the initial velocity.",
												"styleList": null
											},
											"data": {
												"indent": 0
											}
										}
									]
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.Text",
								"children": null
							}
						]
					}
				]
			},
			{
				"id": "assessment",
				"content": {
					"title": "Custom Assessment Title",
					"triggers": [
						{
							"type": "onNavEnter",
							"run": "once",
							"actions": [
								{
									"type": "nav:lock"
								},
								{
									"type": "_viewer:alert",
									"value": {
										"title": "Title",
										"message": "First lets start with a pre-test. This will let you see how familar you are with the content."
									}
								}
							]
						},
						{
							"type": "onStartAttempt",
							"actions": [
								{
									"type": "nav:lock"
								}
							]
						},
						{
							"type": "onEndAttempt",
							"actions": [
								{
									"type": "nav:unlock"
								}
							]
						}
					],
					"attempts": null,
					"scoreActions": [
						{
							"from": 0,
							"to": 99,
							"page": {
								"type": "ObojoboDraft.Pages.Page",
								"id": "fail-page",
								"children": [
									{
										"type": "ObojoboDraft.Chunks.Text",
										"content": {
											"textGroup": [
												{
													"text": {
														"value": "You need a 100% to complete this assignment. Click Review Content to study the content and return to this assessment to retake it.",
														"styleList": [
															{
																"start": "11",
																"end": "15",
																"type": "b"
															},
															{
																"start": "51",
																"end": "65",
																"type": "i"
															}
														]
													}
												}
											]
										}
									},
									{
										"type": "ObojoboDraft.Chunks.ActionButton",
										"content": {
											"label": "Review Content",
											"triggers": [
												{
													"type": "onClick",
													"actions": [
														{
															"type": "nav:goto",
															"value": {
																"id": "page-1"
															}
														}
													]
												}
											]
										}
									},
									{
										"type": "ObojoboDraft.Chunks.Break"
									},
									{
										"type": "ObojoboDraft.Chunks.ActionButton",
										"content": {
											"label": "Take Assessment",
											"triggers": [
												{
													"type": "onClick",
													"actions": [
														{
															"type": "assessment:startAttempt",
															"value": {
																"id": "assessment"
															}
														}
													]
												}
											]
										}
									}
								]
							}
						},
						{
							"from": 100,
							"to": 100,
							"page": {
								"type": "ObojoboDraft.Pages.Page",
								"id": "fail-page",
								"children": [
									{
										"type": "ObojoboDraft.Chunks.Text",
										"content": {
											"textGroup": [
												{
													"text": {
														"value": "Congratulations!"
													}
												}
											]
										}
									},
									{
										"type": "ObojoboDraft.Chunks.ActionButton",
										"content": {
											"label": "Go to next module",
											"triggers": [
												{
													"type": "_onClick",
													"actions": [
														{
															"type": "_js",
															"value": "window.location = 'http://www.google.com/'"
														}
													]
												},
												{
													"type": "onClick",
													"actions": [
														{
															"type": "nav:openExternalLink",
															"value": {
																"url": "http://www.google.com/"
															}
														}
													]
												}
											]
										}
									}
								]
							}
						}
					]
				},
				"metadata": {},
				"index": 0,
				"type": "ObojoboDraft.Sections.Assessment",
				"children": [
					{
						"id": "3a35ccef-7248-4b84-ae22-70d9a369e64b",
						"content": {},
						"metadata": {},
						"index": 0,
						"type": "ObojoboDraft.Pages.Page",
						"children": [
							{
								"id": "header",
								"content": {
									"headingLevel": 1,
									"textGroup": [
										{
											"text": {
												"value": "Assessment",
												"styleList": null
											},
											"data": {
												"indent": 0
											}
										}
									]
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.Heading",
								"children": null
							},
							{
								"id": "91634999-7601-4b78-86ae-a25925729be6",
								"content": {
									"textGroup": [
										{
											"text": {
												"value": "Click Begin below to attempt the assessment. Scoring a 100% will move you to the next module, otherwise you will have a chance to review the content and re-take the assessment with different questions.",
												"styleList": null
											},
											"data": {
												"indent": 0
											}
										}
									]
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.Text",
								"children": null
							},
							{
								"type": "ObojoboDraft.Chunks.ActionButton",
								"content": {
									"label": "Begin",
									"triggers": [
										{
											"type": "onClick",
											"actions": [
												{
													"type": "assessment:startAttempt",
													"value": {
														"id": "assessment"
													}
												}
											]
										}
									]
								}
							}
						]
					},
					{
						"id": "assessment-qb",
						"content": {},
						"metadata": {},
						"index": 0,
						"type": "ObojoboDraft.Chunks.QuestionBank",
						"children": [
							{
								"id": "58846784-efc2-44bb-bf2e-a11a4081fe52",
								"content": {
									"shuffle": true
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.Question",
								"children": [
									{
										"id": "27211386-d637-4a48-8d35-fd3c86689d1e",
										"content": {
											"headingLevel": 1,
											"textGroup": [
												{
													"text": {
														"value": "Here is a question with only one right answer",
														"styleList": null
													},
													"data": {
														"indent": 0
													}
												}
											]
										},
										"metadata": {},
										"index": 0,
										"type": "ObojoboDraft.Chunks.Heading",
										"children": null
									},
									{
										"id": "295fd487-e3ee-494f-b93d-b66c63c97fbc",
										"content": {
											"responseType": "pick-all"
										},
										"metadata": {},
										"index": 0,
										"type": "ObojoboDraft.Chunks.MCAssessment",
										"children": [
											{
												"id": "fab9c27c-c0e1-40bf-a2b3-c0daa896fd26",
												"content": {
													"score": 100
												},
												"metadata": {},
												"index": 0,
												"type": "ObojoboDraft.Chunks.MCAssessment.MCChoice",
												"children": [
													{
														"id": "7e5c229c-c6a0-4cf2-aa50-35d5392e6069",
														"content": {},
														"metadata": {},
														"index": 0,
														"type": "ObojoboDraft.Chunks.MCAssessment.MCAnswer",
														"children": [
															{
																"id": "4c4392e9-5523-472f-86ef-9c968039f6cf",
																"content": {
																	"textGroup": [
																		{
																			"text": {
																				"value": "This is the correct answer",
																				"styleList": null
																			},
																			"data": {
																				"indent": 0
																			}
																		}
																	]
																},
																"metadata": {},
																"index": 0,
																"type": "ObojoboDraft.Chunks.Text",
																"children": null
															}
														]
													}
												]
											},
											{
												"id": "28b03005-7732-4c5c-9f8e-28bcd7fc67ba",
												"content": {
													"score": 100
												},
												"metadata": {},
												"index": 0,
												"type": "ObojoboDraft.Chunks.MCAssessment.MCChoice",
												"children": [
													{
														"id": "8ea5ca82-f154-4893-a41d-d58cbfc93fc1",
														"content": {},
														"metadata": {},
														"index": 0,
														"type": "ObojoboDraft.Chunks.MCAssessment.MCAnswer",
														"children": [
															{
																"id": "1cab85c6-d7af-4a78-95bc-5dc33cb5b54e",
																"content": {
																	"textGroup": [
																		{
																			"text": {
																				"value": "This is also the right answer",
																				"styleList": null
																			},
																			"data": {
																				"indent": 0
																			}
																		}
																	]
																},
																"metadata": {},
																"index": 0,
																"type": "ObojoboDraft.Chunks.Text",
																"children": null
															}
														]
													}
												]
											}
										]
									}
								]
							},
							{
								"id": "e9eadfe7-52af-4d57-aa6f-e710b4f3e610",
								"content": {
									"choose": 1,
									"select": "random-unseen"
								},
								"metadata": {},
								"index": 0,
								"type": "ObojoboDraft.Chunks.QuestionBank",
								"children": [
									{
										"id": "05198d90-9c2a-49a1-b9a1-aa547f440e40",
										"content": {
											"shuffle": true,
											"limit": 1
										},
										"metadata": {},
										"index": 0,
										"type": "ObojoboDraft.Chunks.Question",
										"children": [
											{
												"id": "fd9e4060-72b7-4202-b7f1-ecc92857bbbb",
												"content": {
													"headingLevel": 1,
													"textGroup": [
														{
															"text": {
																"value": "1Here is a question with only one right answer",
																"styleList": null
															},
															"data": {
																"indent": 0
															}
														}
													]
												},
												"metadata": {},
												"index": 0,
												"type": "ObojoboDraft.Chunks.Heading",
												"children": null
											},
											{
												"id": "f7aa4fe3-1983-452e-8cfb-2bd2bd143878",
												"content": {
													"responseType": "pick-one"
												},
												"metadata": {},
												"index": 0,
												"type": "ObojoboDraft.Chunks.MCAssessment",
												"children": [
													{
														"id": "42d345be-e1fd-4f9d-a3e9-44f01a7eb919",
														"content": {
															"score": 100
														},
														"metadata": {},
														"index": 0,
														"type": "ObojoboDraft.Chunks.MCAssessment.MCChoice",
														"children": [
															{
																"id": "c0ced877-2eb2-45f0-be08-3ee59e4e9e57",
																"content": {},
																"metadata": {},
																"index": 0,
																"type": "ObojoboDraft.Chunks.MCAssessment.MCAnswer",
																"children": [
																	{
																		"id": "8bc7d801-42de-447f-90c4-f9f24a11c8b9",
																		"content": {
																			"textGroup": [
																				{
																					"text": {
																						"value": "This is the correct answer",
																						"styleList": null
																					},
																					"data": {
																						"indent": 0
																					}
																				}
																			]
																		},
																		"metadata": {},
																		"index": 0,
																		"type": "ObojoboDraft.Chunks.Text",
																		"children": null
																	}
																]
															}
														]
													},
													{
														"id": "2d1250e5-2d99-4054-93fb-b251b7fe9810",
														"content": {
															"score": 0
														},
														"metadata": {},
														"index": 0,
														"type": "ObojoboDraft.Chunks.MCAssessment.MCChoice",
														"children": [
															{
																"id": "13b449cc-87d3-497f-a754-17de708e08bf",
																"content": {},
																"metadata": {},
																"index": 0,
																"type": "ObojoboDraft.Chunks.MCAssessment.MCAnswer",
																"children": [
																	{
																		"id": "6cd3e32f-f833-4b9d-8231-3c44a68dfcf0",
																		"content": {
																			"textGroup": [
																				{
																					"text": {
																						"value": "This is the wrong answer",
																						"styleList": null
																					},
																					"data": {
																						"indent": 0
																					}
																				}
																			]
																		},
																		"metadata": {},
																		"index": 0,
																		"type": "ObojoboDraft.Chunks.Text",
																		"children": null
																	}
																]
															}
														]
													}
												]
											}
										]
									},
									{
										"id": "fdeec8f5-4541-4cb6-b5fe-364fffed5ed7",
										"content": {
											"shuffle": true,
											"limit": 1
										},
										"metadata": {},
										"index": 0,
										"type": "ObojoboDraft.Chunks.Question",
										"children": [
											{
												"id": "1c04bef9-1cd5-4291-ba58-da2be14050d7",
												"content": {
													"headingLevel": 1,
													"textGroup": [
														{
															"text": {
																"value": "2Here is a question with multiple correct answers",
																"styleList": null
															},
															"data": {
																"indent": 0
															}
														}
													]
												},
												"metadata": {},
												"index": 0,
												"type": "ObojoboDraft.Chunks.Heading",
												"children": null
											},
											{
												"id": "3154b294-b6de-43f7-a780-e282ef937bf1",
												"content": {
													"responseType": "pick-one-multiple-correct"
												},
												"metadata": {},
												"index": 0,
												"type": "ObojoboDraft.Chunks.MCAssessment",
												"children": [
													{
														"id": "a2ab88b4-2de8-4a78-8d94-c8cbab1d128a",
														"content": {
															"score": 100
														},
														"metadata": {},
														"index": 0,
														"type": "ObojoboDraft.Chunks.MCAssessment.MCChoice",
														"children": [
															{
																"id": "0581ef7a-e090-4c67-8ec5-539df809456d",
																"content": {},
																"metadata": {},
																"index": 0,
																"type": "ObojoboDraft.Chunks.MCAssessment.MCAnswer",
																"children": [
																	{
																		"id": "7cbf3863-ce9c-4a7f-aa7f-f85b2e7735eb",
																		"content": {
																			"textGroup": [
																				{
																					"text": {
																						"value": "This is a correct answer",
																						"styleList": null
																					},
																					"data": {
																						"indent": 0
																					}
																				}
																			]
																		},
																		"metadata": {},
																		"index": 0,
																		"type": "ObojoboDraft.Chunks.Text",
																		"children": null
																	}
																]
															}
														]
													},
													{
														"id": "12e0b80c-30ba-43fa-817b-f34dcfab8e63",
														"content": {
															"score": 100
														},
														"metadata": {},
														"index": 0,
														"type": "ObojoboDraft.Chunks.MCAssessment.MCChoice",
														"children": [
															{
																"id": "d95b0fa6-7158-4193-8e57-490816e277b3",
																"content": {},
																"metadata": {},
																"index": 0,
																"type": "ObojoboDraft.Chunks.MCAssessment.MCAnswer",
																"children": [
																	{
																		"id": "49bf3f62-9168-47e5-9bcd-a387becd7b73",
																		"content": {
																			"textGroup": [
																				{
																					"text": {
																						"value": "This is a correct answer",
																						"styleList": null
																					},
																					"data": {
																						"indent": 0
																					}
																				}
																			]
																		},
																		"metadata": {},
																		"index": 0,
																		"type": "ObojoboDraft.Chunks.Text",
																		"children": null
																	}
																]
															}
														]
													},
													{
														"id": "41e4937c-e902-4b04-bf0d-8f7e79fb673d",
														"content": {
															"score": 0
														},
														"metadata": {},
														"index": 0,
														"type": "ObojoboDraft.Chunks.MCAssessment.MCChoice",
														"children": [
															{
																"id": "5ed3bda4-83e2-4ef7-a981-cf75488a89c8",
																"content": {},
																"metadata": {},
																"index": 0,
																"type": "ObojoboDraft.Chunks.MCAssessment.MCAnswer",
																"children": [
																	{
																		"id": "7ab5f084-6ab4-4ca6-8f40-dffc29218503",
																		"content": {
																			"textGroup": [
																				{
																					"text": {
																						"value": "This is an incorrect answer",
																						"styleList": null
																					},
																					"data": {
																						"indent": 0
																					}
																				}
																			]
																		},
																		"metadata": {},
																		"index": 0,
																		"type": "ObojoboDraft.Chunks.Text",
																		"children": null
																	}
																]
															}
														]
													}
												]
											}
										]
									},
									{
										"id": "258e0d44-fc5d-4708-bb20-6ecc1b1b9a7d",
										"content": {
											"shuffle": true
										},
										"metadata": {},
										"index": 0,
										"type": "ObojoboDraft.Chunks.Question",
										"children": [
											{
												"id": "ddd35f93-394c-4a00-8354-c01d4d656e3a",
												"content": {
													"headingLevel": 1,
													"textGroup": [
														{
															"text": {
																"value": "3Here is a question with multiple correct answers but only one needs to be chosen",
																"styleList": null
															},
															"data": {
																"indent": 0
															}
														}
													]
												},
												"metadata": {},
												"index": 0,
												"type": "ObojoboDraft.Chunks.Heading",
												"children": null
											},
											{
												"id": "6bed1664-e2c3-42c7-ad2d-7d17740a2377",
												"content": {
													"responseType": "pick-one-multiple-correct"
												},
												"metadata": {},
												"index": 0,
												"type": "ObojoboDraft.Chunks.MCAssessment",
												"children": [
													{
														"id": "4a28d2b7-1f49-4514-a753-d3a86b68e205",
														"content": {
															"score": 100
														},
														"metadata": {},
														"index": 0,
														"type": "ObojoboDraft.Chunks.MCAssessment.MCChoice",
														"children": [
															{
																"id": "c352dfe0-ab23-49ef-8475-72ef8d15541e",
																"content": {},
																"metadata": {},
																"index": 0,
																"type": "ObojoboDraft.Chunks.MCAssessment.MCAnswer",
																"children": [
																	{
																		"id": "195c50b0-501c-40ea-89d3-ec606aa228e4",
																		"content": {
																			"textGroup": [
																				{
																					"text": {
																						"value": "This is a correct answer",
																						"styleList": null
																					},
																					"data": {
																						"indent": 0
																					}
																				}
																			]
																		},
																		"metadata": {},
																		"index": 0,
																		"type": "ObojoboDraft.Chunks.Text",
																		"children": null
																	}
																]
															}
														]
													},
													{
														"id": "8fbade67-7d01-400a-8453-572af0cc670b",
														"content": {
															"score": 100
														},
														"metadata": {},
														"index": 0,
														"type": "ObojoboDraft.Chunks.MCAssessment.MCChoice",
														"children": [
															{
																"id": "61be1f64-84ba-451b-a3aa-7469dc2eddc3",
																"content": {},
																"metadata": {},
																"index": 0,
																"type": "ObojoboDraft.Chunks.MCAssessment.MCAnswer",
																"children": [
																	{
																		"id": "92804f25-d9e2-4f82-a143-4b9a10583669",
																		"content": {
																			"textGroup": [
																				{
																					"text": {
																						"value": "This is a correct answer",
																						"styleList": null
																					},
																					"data": {
																						"indent": 0
																					}
																				}
																			]
																		},
																		"metadata": {},
																		"index": 0,
																		"type": "ObojoboDraft.Chunks.Text",
																		"children": null
																	}
																]
															}
														]
													},
													{
														"id": "cdc044d0-8908-4f06-bbb8-a5fd1dff9440",
														"content": {
															"score": 0
														},
														"metadata": {},
														"index": 0,
														"type": "ObojoboDraft.Chunks.MCAssessment.MCChoice",
														"children": [
															{
																"id": "126b2d2b-efbb-4576-aaa1-f99e9481127a",
																"content": {},
																"metadata": {},
																"index": 0,
																"type": "ObojoboDraft.Chunks.MCAssessment.MCAnswer",
																"children": [
																	{
																		"id": "51bbe493-ffc1-4697-bb4f-aa14e80f4839",
																		"content": {
																			"textGroup": [
																				{
																					"text": {
																						"value": "This is an incorrect answer",
																						"styleList": null
																					},
																					"data": {
																						"indent": 0
																					}
																				}
																			]
																		},
																		"metadata": {},
																		"index": 0,
																		"type": "ObojoboDraft.Chunks.Text",
																		"children": null
																	}
																]
															}
														]
													}
												]
											}
										]
									},
									{
										"id": "2ca74085-7d43-44fe-a7c3-5d10ab03fef7",
										"content": {
											"shuffle": true
										},
										"metadata": {},
										"index": 0,
										"type": "ObojoboDraft.Chunks.Question",
										"children": [
											{
												"id": "ed585a38-42b8-444d-b5c7-f8e0e8baf3ee",
												"content": {
													"headingLevel": 1,
													"textGroup": [
														{
															"text": {
																"value": "4Here is a question which contains multiple types of content in the question",
																"styleList": null
															},
															"data": {
																"indent": 0
															}
														}
													]
												},
												"metadata": {},
												"index": 0,
												"type": "ObojoboDraft.Chunks.Heading",
												"children": null
											},
											{
												"id": "c8db0fc3-554d-4fbd-91d1-6263e98c74dd",
												"content": {
													"listStyles": {
														"type": "ordered",
														"indents": {}
													},
													"textGroup": [
														{
															"text": {
																"value": "For example, this ordered list",
																"styleList": null
															},
															"data": {
																"indent": 0
															}
														},
														{
															"text": {
																"value": "With a YouTube video below...",
																"styleList": null
															},
															"data": {
																"indent": 1
															}
														}
													]
												},
												"metadata": {},
												"index": 0,
												"type": "ObojoboDraft.Chunks.List",
												"children": null
											},
											{
												"id": "8e6af441-c130-4b23-8321-105ddf76f8a9",
												"content": {
													"videoId": "zJb-Q49vD3A"
												},
												"metadata": {},
												"index": 0,
												"type": "ObojoboDraft.Chunks.YouTube",
												"children": null
											},
											{
												"id": "981b089d-a2df-4afd-876f-c4084f58a6ba",
												"content": {
													"responseType": "pick-one"
												},
												"metadata": {},
												"index": 0,
												"type": "ObojoboDraft.Chunks.MCAssessment",
												"children": [
													{
														"id": "871f5e68-ef2d-479f-865e-e997d2c52771",
														"content": {
															"score": 100
														},
														"metadata": {},
														"index": 0,
														"type": "ObojoboDraft.Chunks.MCAssessment.MCChoice",
														"children": [
															{
																"id": "c6629b42-c2e3-4f31-a6cc-1c55277b2f40",
																"content": {},
																"metadata": {},
																"index": 0,
																"type": "ObojoboDraft.Chunks.MCAssessment.MCAnswer",
																"children": [
																	{
																		"id": "0c6affff-0e23-4e23-891b-0ba67ee3facd",
																		"content": {
																			"textGroup": [
																				{
																					"text": {
																						"value": "This is the correct answer",
																						"styleList": null
																					},
																					"data": {
																						"indent": 0
																					}
																				}
																			]
																		},
																		"metadata": {},
																		"index": 0,
																		"type": "ObojoboDraft.Chunks.Text",
																		"children": null
																	}
																]
															}
														]
													},
													{
														"id": "ee108da9-09b8-4a2b-9b27-ff77bd6f0694",
														"content": {
															"score": 0
														},
														"metadata": {},
														"index": 0,
														"type": "ObojoboDraft.Chunks.MCAssessment.MCChoice",
														"children": [
															{
																"id": "520a75a9-1dcc-4fc4-ab89-cab7b2d0b487",
																"content": {},
																"metadata": {},
																"index": 0,
																"type": "ObojoboDraft.Chunks.MCAssessment.MCAnswer",
																"children": [
																	{
																		"id": "60e01cfa-171b-4d76-801e-5795a1930f84",
																		"content": {
																			"textGroup": [
																				{
																					"text": {
																						"value": "This is the incorrect answer",
																						"styleList": null
																					},
																					"data": {
																						"indent": 0
																					}
																				}
																			]
																		},
																		"metadata": {},
																		"index": 0,
																		"type": "ObojoboDraft.Chunks.Text",
																		"children": null
																	}
																]
															}
														]
													}
												]
											}
										]
									}
								]
							}
						]
					}
				]
			}
		]
	};

/***/ }

/******/ });