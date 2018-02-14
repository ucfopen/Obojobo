/**
	util simply contains helper functions
*/

if(!window['obo'])
{
	window['obo'] = {};
}

obo.util = function()
{
	// @private
	var pReplaceRules = [
		['align', 'text-align', ''],
		['face', 'font-family', ''],
		['color', 'color', ''],
		['size', 'font-size', '%'],
		['letterspacing', 'letter-spacing', 'px']
	];

	var tfReplaceRules = [
		['indent', 'text-indent', 'px'],
		['leftmargin', 'margin-left', 'px'],
		['rightmargin', 'margin-right', 'px']
	];

	var patternEmptyTFsToBrs = /<font[^>]*(?:\/>|>(?:\s|&nbsp;)*<\/font>)/gi;
	var patternStrictTfToLI = /<\s*textformat([a-z=A-Z"'0-9 ]*)?\s*><\s*li\s*>/gi;
	var patternStrictTfToDiv = /<\s*textformat(\s+[\s\S]*?=(?:"|')[\s\S]*?(?:"|'))\s*>/gi;
	var patternStrictTFClose = /<\/li><\/textformat>/gi;
	var patternStrictPFont = /<\s*p(\s+align=(?:"|')(?:left|right|center|justify)(?:"|'))?\s*><\s*font(\s+[\s\S]*?=(?:"|')[\s\S]*?(?:"|'))\s*>/gi;
	var patternStrictPFontClose = /<\/font><\/p>/gi;
	var patternStrictFont = /<\s*font(\s+[\s\S]*?=(?:"|')[\s\S]*?(?:"|'))\s*>/gi;
	var patternStrictFontClose = /<\/font>/gi;
	var patternStrictRemoveUL = /<\/?ul>/gi;
	var patternStrictAddUL = /(<li([\s\S]*?)?>([\s\S]*?)<\/li>)/gi;
	var patternStrictRemoveExtraUL = /<\/ul><ul>/gi;
	var patternStrictEmpty1 = /<(\w+?)[^>]*?>(\s*?)<\/\1>/gi;
	var patternStrictEmpty2 = /<(\w+)>(\s*?)<\/\1>/gi;
	var patternStrictOMLTooltip = /\[\s*?tooltip\s+?text\s*?=\s*?(?:"|')([\s\S]+?)(?:"|')\s*?]([\s\S]+?)\[\/tooltip\]/gi;
	var patternStrictOMLPageLink = /\[\s*?page\s+?id\s*?=\s*?(?:"|')([\s\S]+?)(?:"|')\s*?]([\s\S]+?)\[\/page\]/gi;
	var patternStrictRemainingTf = /<\/?textformat[\s\S]*?>/gi;

	var patternTF = /<\/?textformat\s?[\s\S]*?>/gi;
	var patternPFont = /<\s*p(\s+align=(?:"|')(left|right|center|justify)(?:"|'))?\s*><\s*font(\s+[\s\S]*?=(?:"|')[\s\S]*?(?:"|'))\s*>/gi;
	var patternPFontClose = /<\/font><\/p>/gi;
	var patternFont = /<font[\s\S]*?>/gi;
	var patternFontClose = /<\/font>/gi;
	var patternEmpty1 = /<(\w+?)[^>]*?>(\s*?)<\/\1>/gi;
	var patternEmpty2 = /<(\w+)>(\s*?)<\/\1>/gi;
	var patternRemoveUL = /<\/?ul>/gi;
	var patternAddUL = /<LI>([\s\S]*?)<\/LI>/gi;
	var patternRemoveExtraUL = /<\/ul><ul>/gi;

	var patternIE8ConvertApos = /&apos;/gi;

	var patternAttributionOpen = /<u><a /gi;
	var patternAttributionClose = /<\/a>\s*?<\/u>/gi;
	var patternAttributionTarget = /target\s*?=\s*?(?:"|')[\s\S]*?/gi;
	var patternAttributionHref = / href\s*?=\s*?(?:"|')event:/gi;

	// @TODO ul and p should have margin = 0
	/** This attempts to recreate HTML from flash HTML exactly **/
	var cleanFlashHTMLStrict = function(input)
	{
		var groups;
		var groupString;
		var lastIndex;
		//convert <textformat><p><font></font></p></textformat> into <br>
		input = input.replace(patternEmptyTFsToBrs, "<br>");
		//Convert <textformat ...><li> into <li style='...'>
		var matchFound = true;
		while(matchFound)
		{
			patternStrictTfToLI.lastIndex = 0;
			groups = patternStrictTfToLI.exec(input);
			lastIndex = patternStrictTfToLI.lastIndex;
			if(groups && groups.length >= 2)
			{
				groupString = groups[1];
				var style = generateStyleFromFlashHTMLTag(groupString, tfReplaceRules);
				//We only want to add this span if there are styles associated with it
				if(style.length > 0)
				{
					input = input.substr(0, lastIndex).replace(patternStrictTfToLI, '<li style="' + style + '">') + input.substr(lastIndex);
				}
				else
				{
					input = input.substr(0, lastIndex).replace(patternStrictTfToLI, '<li>') + input.substr(lastIndex);
				}
			}
			else
			{
				matchFound = false;
			}
		}

		input = input.replace(patternStrictTFClose, "</li>");
//patternStrictTfToDiv.lastIndex = 0;
		var matchFound = true;
		// @TODO: handle textformat with no style options
		//Convert <textformat> into <div>
		var i = 0;
		while(matchFound)
		{
			matchFound = false;
			i = i + 1;
			patternStrictTfToDiv.lastIndex = 0;
			groups = patternStrictTfToDiv.exec(input);
			lastIndex = patternStrictTfToDiv.lastIndex;
			if(groups && groups.length >= 2)
			{
				groupString = groups[1];
				var style = generateStyleFromFlashHTMLTag(groupString, tfReplaceRules);
				//We only want to add this span if there are styles associated with it
				if(style.length > 0)
				{
					input = input.substr(0, lastIndex).replace(patternStrictTfToDiv, '<div style="' + style + '">') + input.substr(lastIndex);
				}
				else
				{
					input = input.substr(0, lastIndex).replace(patternStrictTfToDiv, '<div>') + input.substr(lastIndex);
				}
			}
			else
			{
				matchFound = false;
			}
		}
//return 'test';
		input = input.replace(patternStrictTFClose, "</div>");

		//Convert <p><font> into <p>
		var matchFound = true;
		var j = 0;
		while(matchFound)
		{
				j = j + 1;
			patternStrictPFont.lastIndex = 0;
			groups = patternStrictPFont.exec(input);
			lastIndex = patternStrictPFont.lastIndex;
			if(groups && groups.length >= 3)
			{
				groupString = groups[1] + ' ' + groups[2];

				input = input.substr(0, lastIndex).replace(patternStrictPFont, '<p style="' + generateStyleFromFlashHTMLTag(groupString, pReplaceRules) + '">') + input.substr(lastIndex);

			}
			else
			{
				matchFound = false;
			}
			//matchFound = false; // @TODO
			//if(j > 3) return;
		}

		input = input.replace(patternStrictPFontClose, "</p>");

		//Convert single <font> into <span>
		var matchFound = true;
		while(matchFound)
		{
			patternStrictFont.lastIndex = 0;
			groups = patternStrictFont.exec(input);
			lastIndex = patternStrictFont.lastIndex;
			if(groups && groups.length >= 2)
			{
				groupString = groups[1];
				input = input.substr(0, lastIndex).replace(patternStrictFont, '<span style="' + generateStyleFromFlashHTMLTag(groupString, pReplaceRules) + '">') + input.substr(lastIndex);
			}
			else
			{
				matchFound = false;
			}
			//matchFound = false; // @TODO
		}

		input = input.replace(patternStrictFontClose, "</span>");

		// remove any previously added ul tags
		input = input.replace(patternStrictRemoveUL, "");

		// add <ul></ul> arround list items
		input = input.replace(patternStrictAddUL, "<ul>$1</ul>");

		// kill extra </ul><ul> that are back to back - this will make proper lists
		input = input.replace(patternStrictRemoveExtraUL, "");

		// find empty tags keeping space in them
		input = input.replace(patternStrictEmpty1, "$2");
		input = input.replace(patternStrictEmpty2, "$2");

		var matchFound = true;
		while(matchFound)
		{
			// find empty tags keeping space in them
			patternStrictEmpty1.lastIndex = 0;
			groups = patternStrictEmpty1.exec(input);
			lastIndex = patternStrictEmpty1.lastIndex;
			if(groups && groups.length >= 3)
			{
				groupString = groups[2];
				input = input.substr(0, lastIndex).replace(patternStrictEmpty1, groupString) + input.substr(lastIndex);
			}
			else
			{
				matchFound = false;
			}
			//matchFound = false; // @TODO
		}

		var matchFound = true;
		while(matchFound)
		{
			patternStrictEmpty2.lastIndex = 0;
			groups = patternStrictEmpty2.exec(input);
			lastIndex = patternStrictEmpty2.lastIndex;
			if(groups && groups.length >= 3)
			{
				groupString = groups[1];
				input = input.substr(0, lastIndex).replace(patternStrictEmpty2, groupString) + input.substr(lastIndex);
			}
			else
			{
				matchFound = false;
			}
			//matchFound = false; // @TODO
		}
		input = input.replace(patternStrictRemainingTf, '')
		input = createOMLTags(input);

		return input;
	};

	var generateStyleFromFlashHTMLTag = function(attribs, rules)
	{
		var style = '';
		var reg;
		var match;
		var len = rules.length;
		for(var a = 0; a < len; a++)
		{
			reg = new RegExp(rules[a][0] + '\s*=\s*(?:\'|")(.+?)(?:\'|")', 'gi');
			match = reg.exec(attribs);
			if(match != null && match.length >= 2)
			{
				// special case: convert px to % for font size
				if(rules[a][0] === 'size')
				{
					// we multiply by 90 to make 14px = 90%
					style += rules[a][1] + ':' + ((parseFloat(match[1]) / 14) * 90) + rules[a][2] + ';';
				}
				else
				{
					style += rules[a][1] + ':' + match[1] + rules[a][2] + ';';
				}
			}
		}
		return style;
	};

	var createOMLTags = function(input)
	{
		var pattern;

		/*Find OML tooltips*/
		// @TODO: Img
		input = input.replace(patternStrictOMLTooltip, '<span title="$1" class="oml oml-tip">$2</span>');

		/*Find OML page links*/
		// @TODO: Left or right arrow depending on if that would be foward or back
		var l = getBaseURL();
		if(l.substr(l.length - 1, 1) != '/')
		{
			l += '/';
		}
		input = input.replace(patternStrictOMLPageLink, '<a class="oml oml-page-link" data-page-id="$1" href="' + l + '#/content/$1" title="' + '&rarr; Page $1">$2</a>');
		/*input = input.replace(pattern, '<a class="oml oml-page-link" data-page-id="$1" href="http://www.google.com/" title="Go to page $1">$2</a>');*/
		// @TODO: Fix quote issues (" --> &quot;)

		return input;
	};

	// @public
	getRGBA = function(colorInt, alpha)
	{
		return 'rgba(' + ((colorInt >> 16) & 255) + ',' + ((colorInt >> 8) & 255) + ',' + (colorInt & 255) + ',' + alpha + ')';
	};

	getURLFromEmbeddedSwf = function($objectElement)
	{
		if(typeof $objectElement.attr('data') !== 'undefined')
		{
			return $objectElement.attr('data')
		}
		else
		{
			$param = $objectElement.find('param[name="movie"]');
			if(typeof $param !== 'undefined' && typeof $param.attr('value') !== 'undefined' && $param.attr('value') !== null)
			{
				return $param.attr('value');
			}
		}

		return undefined;
	}

	// Old learning objects were saved using flash's textfields - which suck at html
	cleanFlashHTML = function(input, strict)
	{
		// first, handle a special case where IE8 can't handle &apos;
		if(isIE8())
		{
			input = input.replace(patternIE8ConvertApos, "'");
		}

		if(strict === true)
		{
			return cleanFlashHTMLStrict(input);
		}

		// get rid of all the textformat tags
		input = input.replace(patternTF, "");

		// combine <p><font>...</font></p> tags to just <p></p>
		// input = input.replace(pattern, '<p style="font-family:$2;font-size:$3px;color:$4;">');
		//input = input.replace(patternPFont, '<p>');
		var matchFound = true;
		var groups;
		var lastIndex;
		while(matchFound)
		{
			patternPFont.lastIndex = 0;
			groups = patternPFont.exec(input);
			lastIndex = patternPFont.lastIndex;
			if(groups && groups.length >= 0)
			{
				if(groups.length >= 3)
				{
					var align = groups[2].toLowerCase();
					//input = input.replace(patternPFont, '<p style="text-align:' + align + ';">');
					input = input.substr(0, lastIndex).replace(patternPFont, '<p style="text-align:' + align + ';">') + input.substr(lastIndex);
				}
				else
				{
					input = input.substr(0, lastIndex).replace(patternPFont, '<p>') + input.substr(lastIndex);
				}
			}
			else
			{
				matchFound = false;
			}
		}

		/*//Convert single <font> into <span>
		var matchFound = true;
		while(matchFound)
		{
			groups = patternStrictFont.exec(input);
			lastIndex = patternStrictFont.lastIndex;
			if(groups && groups.length >= 2)
			{
				groupString = groups[1];
				input = input.substr(0, lastIndex).replace(patternStrictFont, '<span style="' + generateStyleFromFlashHTMLTag(groupString, pReplaceRules) + '">') + input.substr(lastIndex);
			}
			else
			{
				matchFound = false;
			}
			//matchFound = false; // @TODO
		}*/

		input = input.replace(patternPFontClose, "</p>");
		// convert lone <font>...</font> tags to spans
		// input = input.replace(pattern, '<span style="font-family:$1;font-size:$2px;color:$3;">');
		input = input.replace(patternFont, '<span>');

		input = input.replace(patternFontClose, "</span>");
		// find empty tags keeping space in them
		// we loop here to help transform nested empty tags such as "<li><b></b></li>"
		matchFound = true;
		while(matchFound)
		{
			patternEmpty1.lastIndex = 0;
			groups = patternEmpty1.exec(input);
			if(groups && groups.length >= 2)
			{
				input = input.replace(patternEmpty1, "$2");
			}
			else
			{
				matchFound = false;
			}
		}

		matchFound = true;
		while(matchFound)
		{
			patternEmpty2.lastIndex = 0;
			groups = patternEmpty2.exec(input);
			if(groups && groups.length >= 2)
			{
				input = input.replace(patternEmpty2, "$2");
			}
			else
			{
				matchFound = false;
			}
		}

		// remove any previously added ul tags
		input = input.replace(patternRemoveUL, "");

		// add <ul></ul> arround list items
		input = input.replace(patternAddUL, "<ul><li>$1</li></ul>"); // @TODO DOES THIS WORK??????????

		// kill extra </ul><ul> that are back to back - this will make proper lists
		input = input.replace(patternRemoveExtraUL, "");

		input = createOMLTags(input);

		return input;
	};

	createCombinedAttributionString = function(items)
	{
		var a = [];
		var item;
		var len = items.length;
		for(var i = 0; i < len; i++)
		{
			item = items[i];
			if(typeof item.media === 'object' && item.media.length && item.media.length > 0 && item.media[0].attribution === 1)
			{
				a.push(item.media[0].copyright);
			}
		}

		var r = '';
		if(a.length == 1)
		{
			r = a[0];
		}
		else if(a.length > 1)
		{
			r = 'Photos used under Creative Commons from ';
			len = a.length;
			var join = ', ';
			for(i = 0; i < len; i++)
			{
				if(i == len - 2)
				{
					join = ' and ';
				}
				else if(i == len - 1)
				{
					join = '';
				}

				r += a[i].substr(a[i].indexOf('<U>')) + join;
			}
		}

		return cleanAttributionCopyrightHTML(r);
	};

	// Modfies creative commons attributions to be standard
	cleanAttributionCopyrightHTML = function(input)
	{
		//blah blah <U><A HREF="event:http://..."></U></A>
		input = input.replace(patternAttributionOpen, '<a ');
		input = input.replace(patternAttributionClose, '</a>');
		input = input.replace(patternAttributionTarget, '');
		input = input.replace(patternAttributionHref, ' target="_blank" href="');

		return input;
	};

	strip = function(html)
	{
		return html.replace(/</g,'v').replace(/>/g,'&gt;').replace(/&/g,'&amp;').replace(/\"/g, '');
	};

	// @TODO: Get rid of this?
	/*
	getURLParam = function(strParamName)
	{
		var strReturn = "";
		var strHref = window.location.href;
		if ( strHref.indexOf("?") > -1 )
		{
			var strQueryString = strHref.substr(strHref.indexOf("?")).toLowerCase();
			var aQueryString = strQueryString.split("&");
			for ( var iParam = 0; iParam < aQueryString.length; iParam++ )
			{
				if ( aQueryString[iParam].indexOf(strParamName.toLowerCase() + "=") > -1 )
				{
					var aParam = aQueryString[iParam].split("=");
					strReturn = aParam[1];
					break;
				}
			}
		}
		return unescape(strReturn);
	};*/

	// given a answer array it will return the answer object matching answerID
	getAnswerByID = function(answers, answerID)
	{
		var len = answers.length;
		for(var i = 0; i < len; i++)
		{
			if(answers[i].answerID === answerID)
			{
				return answers[i];
			}
		}

		return undefined;
	};

	isIOS = function()
	{
		return navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i);
	};

	isMobile = function()
	{
		return typeof window.orientation !== 'undefined';
	};

	isIE8 = function()
	{
		return $('#ie-8-stylesheet').length > 0;
	};

	isInIFrame = function()
	{
		return top.location != self.location;
	};

	// simple wrapper to delay a function call by 1ms
	doLater = function(func)
	{
		setTimeout(func, 1);
	};

	getBaseURL = function()
	{
		return location.href.substr(0, location.href.indexOf('#') === -1 ? location.href.length : location.href.indexOf('#'));
	};

	getWebURL = function()
	{
		return _webUrl;
	};

	return {
		getRGBA: getRGBA,
		cleanFlashHTML: cleanFlashHTML,
		cleanAttributionCopyrightHTML: cleanAttributionCopyrightHTML,
		strip: strip,
		getAnswerByID: getAnswerByID,
		isIOS: isIOS,
		doLater: doLater,
		createCombinedAttributionString: createCombinedAttributionString,
		getBaseURL: getBaseURL,
		getURLFromEmbeddedSwf: getURLFromEmbeddedSwf,
		isMobile: isMobile,
		isIE8: isIE8,
		getWebURL: getWebURL,
		isInIFrame: isInIFrame
	};
}();
