require './editorapp.scss'

Toolbar = require './toolbar'
SideMenu = require './sidemenu'
ChunkOptionsMenu = require './chunkoptionsmenu'
StylesMenu = require './stylesmenu'
LoadingModal = require './loadingmodal'
DebugMenu = require './debugmenu'
Modal = require './modal'
Selection = require './selection'
StyleBrush = require './stylebrush'
EditorPage = require './editorpage'
History = require '../history/history'
SideMenuList = require './sidemenu/sidemenulist'

# MutationPainter = require 'editor/debug/mutationpainter'
# MutationPainter.observe()

# alert 'scrollToPageBottomAfterUpdate now dont work'

Common = window.ObojoboDraft.Common
OBO = window.OBO

TextMenu = Common.components.TextMenu
ChunkUtil = Common.chunk.util.ChunkUtil
StyleType = Common.text.StyleType
Screen = Common.page.Screen
Module = Common.models.Module
Chunk = Common.models.Chunk
Page = Common.models.Page
Metadata = Common.models.Metadata
ChunkCollection = Common.models.ChunkCollection
DOMSelection = Common.selection.DOMSelection

EditorApp = React.createClass

	getInitialState: ->


		console.log('CREATE MODULE')
		module = @props.module or new Module()

		console.log(module)

		# if module.pages.length is 0
		# 	console.log('CREATE PAGE')
		# 	page = new Page()
		# 	console.log('+++++', page)

		# 	module.pages.add page
		# 	console.log(module.pages)
		# 	console.log('nice')

		# 	console.log(module.pages.at(0))
		# 	if module.pages.at(0).chunks.length is 0
		# 		module.pages.at(0).chunks.add Chunk.create()

		module.app = @
		module.initIfNeeded()
		# module.pages.at(0).app = @

		# module.fromDescriptor {"metadata":{},"pages":[{"chunks":[{"type":"ObojoboDraft.Chunks.Heading","content":{"textGroup":[{"text":{"value":"Defining Plagiarism","styleList":null},"data":{"indent":0}}],"headingLevel":1},"contentType":"json","derivedFrom":null,"index":0,"id":"cc3dab7a-28c7-414f-9f4c-f38d061151cc"},{"type":"ObojoboDraft.Chunks.Heading","content":{"textGroup":[{"text":{"value":"Academic Integrity","styleList":null},"data":{"indent":0}}],"headingLevel":2},"contentType":"json","derivedFrom":null,"index":1,"id":"25614656-760c-4acd-aaa6-544d38a6ead6"},{"type":"ObojoboDraft.Chunks.Text","content":{"textGroup":[{"text":{"value":"This module is designed to help you recognize the common causes of plagiarism and show you how to avoid them.","styleList":null},"data":{"indent":0}},{"text":{"value":"The UCF Rules of Conduct, published in The Golden Rule Student Handbook 2012-2013 notes on page 16 that “In an instructional setting, plagiarism occurs when a writer deliberately uses someone else's language, ideas, or other original (not common-knowledge) material without acknowledging its source. This definition applies to texts published in print or on-line, to manuscripts, and to the work of other student writers” (Council of Writing Program Administrators).","styleList":[{"type":"b","start":39,"end":82,"data":{}}]},"data":{"indent":0}},{"text":{"value":"Violating academic standards by plagiarizing can have serious consequences that may include receiving a failing grade for an assignment or a course -- or suspension or expulsion from the university.","styleList":null},"data":{"indent":0}}],"type":"p"},"contentType":"json","derivedFrom":null,"index":2,"id":"7b675601-db80-4a35-8708-e2649f41f6b5"},{"type":"ObojoboDraft.Chunks.Heading","content":{"textGroup":[{"text":{"value":"Detecting Plagiarism","styleList":null},"data":{"indent":0}}],"headingLevel":2},"contentType":"json","derivedFrom":null,"index":3,"id":"1e85103b-4658-4597-a87a-c0555e722436"},{"type":"ObojoboDraft.Chunks.Text","content":{"textGroup":[{"text":{"value":"Students are expected to know and follow academic standards by citing the outside sources used in their work. Some UCF instructors utilize turnitin.com, an online search tool. The turnitin software checks papers for originality by comparing a student's paper with papers submitted from other institutions and with content found on the web. After a paper is submitted, a report is sent that indicates if an author's work was properly used in the paper.","styleList":[{"type":"b","start":139,"end":151,"data":{}}]},"data":{"indent":0}}],"type":"p"},"contentType":"json","derivedFrom":null,"index":4,"id":"76c88755-c863-4633-8ddb-f65c061906d2"},{"type":"ObojoboDraft.Chunks.MultipleChoiceQuestion","content":{"textGroup":[{"text":{"value":"Which is an example of plagiarism?","styleList":null},"data":{"score":0}},{"text":{"value":"Using song lyrics in a report about cultural music","styleList":null},"data":{"score":100}},{"text":{"value":"","styleList":null},"data":{"score":0}},{"text":{"value":"Paraphrasing and citing text from an article","styleList":null},"data":{"score":0}},{"text":{"value":"","styleList":null},"data":{"score":0}},{"text":{"value":"Including George Washington's birth date in a paper","styleList":null},"data":{"score":0}},{"text":{"value":"","styleList":null},"data":{"score":0}}],"responseType":"pick-one"},"contentType":"json","derivedFrom":null,"index":5,"id":"8da20731-e180-4090-8533-2ca258c03291"},{"type":"ObojoboDraft.Chunks.Heading","content":{"textGroup":[{"text":{"value":"Causes of Plagiarism","styleList":null},"data":{"indent":0}}],"headingLevel":2},"contentType":"json","derivedFrom":null,"index":6,"id":"c19b95c2-e7ac-41d7-8a4a-b239aa0ec8a4"},{"type":"ObojoboDraft.Chunks.Text","content":{"textGroup":[{"text":{"value":"Common causes of plagiarism include:","styleList":null},"data":{"indent":0}}],"type":"p"},"contentType":"json","derivedFrom":null,"index":7,"id":"bb263299-f26f-4c9c-a616-985e1d212177"},{"type":"ObojoboDraft.Chunks.List","content":{"indent":0,"textGroup":[{"text":{"value":"using a direct quote without adding quotations and citing the source","styleList":null},"data":{"indent":0}},{"text":{"value":"paraphrasing or summarizing someone else's words or ideas without citing the source","styleList":null},"data":{"indent":0}},{"text":{"value":"submitting your own paper for more than one assignment","styleList":null},"data":{"indent":0}},{"text":{"value":"getting a friend to help you write a paper","styleList":null},"data":{"indent":0}},{"text":{"value":"borrowing or buying a paper","styleList":null},"data":{"indent":0}},{"text":{"value":"and other practices that may be identified by your professors or instructors.","styleList":null},"data":{"indent":0}}],"listStyles":{"type":"unordered","indents":{}}},"contentType":"json","derivedFrom":null,"index":8,"id":"8757d2f8-c16f-46e6-a082-7fda20a3ab78"}]},{"chunks":[{"type":"ObojoboDraft.Chunks.Heading","content":{"textGroup":[{"text":{"value":"Avoiding Plagiarism","styleList":null},"data":{"indent":0}}],"headingLevel":1},"contentType":"json","derivedFrom":null,"index":0,"id":"5e05f97d-2d4b-4ace-89eb-0e49c1a738a9"},{"type":"ObojoboDraft.Chunks.Heading","content":{"textGroup":[{"text":{"value":"Citing Sources","styleList":null},"data":{"indent":0}}],"headingLevel":2},"contentType":"json","derivedFrom":null,"index":1,"id":"9b005199-0e18-4c3d-9505-c30e53e012eb"},{"type":"ObojoboDraft.Chunks.Text","content":{"textGroup":[{"text":{"value":"To avoid plagiarism, cite all outside sources you use in your writing. The examples in this module describe how to use MLA style to cite sources. MLA style and formatting is published in the MLA Handbook for Writers of Research Papers, Seventh Edition. However, there are many other styles you may be asked to use in your courses. Check with your instructors to find out which style is required for a course. Other frequently used styles include: American Medical Association (AMA), American Psychological Association (APA), and the Chicago Manual of Style (CMS). To see detailed instructions about how to use a specific style along with formatting examples, consult the appropriate style manual. Copies of style manuals are available in the reference area of the library.","styleList":[{"type":"b","start":119,"end":128,"data":{}},{"type":"b","start":191,"end":251,"data":{}}]},"data":{"indent":0}}],"type":"p"},"contentType":"json","derivedFrom":null,"index":2,"id":"bf6effd1-42fe-4c93-bbe9-7886b53f84cc"},{"type":"ObojoboDraft.Chunks.Text","content":{"textGroup":[{"text":{"value":"Citing sources is typically a two-step process -- to cite sources using MLA style:","styleList":null},"data":{"indent":0}}],"type":"p"},"contentType":"json","derivedFrom":null,"index":3,"id":"e0716201-b267-4138-ab9e-6e809206affe"},{"type":"ObojoboDraft.Chunks.List","content":{"indent":0,"textGroup":[{"text":{"value":"Step 1 - Create a Works Cited page, which should be added at the end of your paper, to list all of the required details about each source. Depending on the citation style you use, this page may be titled References or Bibliography.","styleList":[{"type":"b","start":18,"end":29,"data":{}}]},"data":{"indent":0}},{"text":{"value":"Step 2 - Add a parenthetical citation within the body of your paper wherever you include a direct quote or any text or ideasthat are paraphrased and summarized from outside sources. Parenthetical citations (sometimes called in-text citations) refer readers to the specific entry listed on your Works Cited page.","styleList":[{"type":"b","start":15,"end":37,"data":{}},{"type":"b","start":224,"end":241,"data":{}},{"type":"b","start":294,"end":306,"data":{}}]},"data":{"indent":0}}],"listStyles":{"type":"unordered","indents":{}}},"contentType":"json","derivedFrom":null,"index":4,"id":"90442ca9-3607-4e62-8da9-8f16b8aec0f9"},{"type":"ObojoboDraft.Chunks.MultipleChoiceQuestion","content":{"textGroup":[{"text":{"value":"Read the text below and determine which answer gives the best example of how to summarize text.\n\nA total of 14 intersections (nine camera sites, three non-camera sites, and two control sites) were studied. Overall, the red light violation rate was reduced approximately 42% several months after the enforcement program began. Increases in driver compliance were not limited to the camera-equipped intersections but spilled over the non-equipped intersections as well. Results of public opinion surveys conducted approximately 6 weeks before, 6 weeks after, and 6 months after the camera enforcement began indicated that nearly 80% of Oxnard residents support using red light cameras as a supplement to police efforts to enforce traffic signal laws.\n\nRettig, Richard A., Allan F. Williams, Charles M. Farmer, and Amy F. Feldman. \"Evaluation of Red Light Camera Enforcement in Oxnard, California.\" Accident Analysis and Prevention 31.3 (1999): 169-74. Print.","styleList":null},"data":{"score":0}},{"text":{"value":"In one study red light cameras reduced violations by 42% with compliance spreading to intersections without cameras as well, with residents overwhelmingly supporting the program (Rettig 169).","styleList":null},"data":{"score":100}},{"text":{"value":"Correct. This example briefly restates the original source by conveying the main points and it properly cites the source.","styleList":null},"data":{"score":0}},{"text":{"value":"Overall, the red light violation rate was reduced approximately 42% several months after the enforcement program began\" (Rettig 169).","styleList":null},"data":{"score":0}},{"text":{"value":"Incorrect. This is an example of how to use a direct quote.","styleList":null},"data":{"score":0}},{"text":{"value":"In Rettig's analysis, red light cameras reduced violations at 14 intersections, some with cameras and some without, by 42%. Eighty percent of Oxnard residents surveyed immediately before, immediately after and 6 months after implementation supported the red light camera program (169).","styleList":null},"data":{"score":0}},{"text":{"value":"Incorrect. This is an example of how you might paraphrase the original source.","styleList":null},"data":{"score":0}}],"responseType":"pick-one"},"contentType":"json","derivedFrom":null,"index":5,"id":"7ef7940e-2cea-4112-b9d4-d9ec9b9ca42a"}]}]}
		# module.fromDescriptor {"metadata":{},"pages":[{"chunks":[{"type":"ObojoboDraft.Chunks.Heading","content":{"textGroup":[{"text":{"value":"Defining Plagiarism","styleList":null},"data":{"indent":0}}],"headingLevel":1},"contentType":"json","derivedFrom":null,"index":0,"id":"cc3dab7a-28c7-414f-9f4c-f38d061151cc"},{"type":"ObojoboDraft.Chunks.Heading","content":{"textGroup":[{"text":{"value":"Academic Integrity","styleList":null},"data":{"indent":0}}],"headingLevel":2},"contentType":"json","derivedFrom":null,"index":1,"id":"25614656-760c-4acd-aaa6-544d38a6ead6"},{"type":"ObojoboDraft.Chunks.Figure","content":{"textGroup":[{"text":{"value":"","styleList":[{"type":"i","start":0,"end":0,"data":{}}]},"data":{}}],"url":null,"size":"small"},"contentType":"json","derivedFrom":null,"index":2,"id":"0852db63-aa97-4434-8b8d-838aae95fd17"},{"type":"ObojoboDraft.Chunks.Text","content":{"textGroup":[{"text":{"value":"This module is designed to help you recognize the common causes of plagiarism and show you how to avoid them.","styleList":null},"data":{"indent":0}}],"type":"p"},"contentType":"json","derivedFrom":null,"index":3,"id":"91025d4d-e94d-4fbe-aa4f-c3c17707199c"},{"type":"ObojoboDraft.Chunks.MathEquation","content":{"latex":"y=\\sqrt{a^2+b^2}"},"contentType":"json","derivedFrom":null,"index":4,"id":"3c4ebecd-780c-4cf1-a74a-4a9f253aac85"},{"type":"ObojoboDraft.Chunks.Text","content":{"textGroup":[{"text":{"value":"The UCF Rules of Conduct, published in The Golden Rule Student Handbook 2012-2013 notes on page 16 that “In an instructional setting, plagiarism occurs when a writer deliberately uses someone else's language, ideas, or other original (not common-knowledge) material without acknowledging its source.","styleList":[{"type":"b","start":39,"end":82,"data":{}}]},"data":{"indent":0}}],"type":"p"},"contentType":"json","derivedFrom":null,"index":5,"id":"1b67c32a-d665-4ac7-a2a0-b680e1d92e70"},{"type":"ObojoboDraft.Chunks.Code","content":{"textGroup":[{"text":{"value":"var el = document.createElement('div');","styleList":null},"data":{"indent":0}},{"text":{"value":"document.body.appendChild(el);","styleList":null},"data":{"indent":0}}],"type":"p"},"contentType":"json","derivedFrom":null,"index":6,"id":"5e9fb984-4bb0-412e-b5f2-a314bb7d8572"},{"type":"ObojoboDraft.Chunks.Text","content":{"textGroup":[{"text":{"value":"This definition applies to texts published in print or on-line, to manuscripts, and to the work of other student writers” (Council of Writing Program Administrators).","styleList":null},"data":{"indent":0}}],"type":"p"},"contentType":"json","derivedFrom":null,"index":7,"id":"f8bdafb3-905e-4c3b-b07e-4b5ba0b05539"},{"type":"ObojoboDraft.Chunks.Break","content":{},"contentType":"json","derivedFrom":null,"index":8,"id":"82647907-91ac-4157-ab95-c24022d2a4d6"},{"type":"ObojoboDraft.Chunks.Text","content":{"textGroup":[{"text":{"value":"Violating academic standards by plagiarizing can have serious consequences that may include receiving a failing grade for an assignment or a course -- or suspension or expulsion from the university.","styleList":null},"data":{"indent":0}}],"type":"p"},"contentType":"json","derivedFrom":null,"index":9,"id":"dc2b138e-b4fc-42c6-ac89-613afa6f8a98"},{"type":"ObojoboDraft.Chunks.Heading","content":{"textGroup":[{"text":{"value":"Detecting Plagiarism","styleList":null},"data":{"indent":0}}],"headingLevel":2},"contentType":"json","derivedFrom":null,"index":10,"id":"1e85103b-4658-4597-a87a-c0555e722436"},{"type":"ObojoboDraft.Chunks.YouTube","content":{"videoId":"3NOdEMyq-9Q"},"contentType":"json","derivedFrom":null,"index":11,"id":"7a7190f7-2106-4f84-9cfa-dd764e1c5cd9"},{"type":"ObojoboDraft.Chunks.Text","content":{"textGroup":[{"text":{"value":"Students are expected to know and follow academic standards by citing the outside sources used in their work. Some UCF instructors utilize turnitin.com, an online search tool.","styleList":[{"type":"b","start":139,"end":151,"data":{}}]},"data":{"indent":0}}],"type":"p"},"contentType":"json","derivedFrom":null,"index":12,"id":"bdfdc870-c23b-44a8-95d1-18ba58cab419"},{"type":"ObojoboDraft.Chunks.Table","content":{"textGroup":{"textGroup":[{"text":{"value":"Good","styleList":null},"data":{}},{"text":{"value":"Bad","styleList":null},"data":{}},{"text":{"value":"Family Man","styleList":null},"data":{}},{"text":{"value":"Vampire's Kiss","styleList":null},"data":{}},{"text":{"value":"National Treasure","styleList":null},"data":{}},{"text":{"value":"Ghost Rider","styleList":null},"data":{}}],"numRows":3,"numCols":2},"position":"center","header":true},"contentType":"json","derivedFrom":null,"index":13,"id":"2c44dee8-0167-416e-8cb0-9f5e4c6cea8f"},{"type":"ObojoboDraft.Chunks.Text","content":{"textGroup":[{"text":{"value":"The turnitin software checks papers for originality by comparing a student's paper with papers submitted from other institutions and with content found on the web. After a paper is submitted, a report is sent that indicates if an author's work was properly used in the paper.","styleList":null},"data":{"indent":0}}],"type":"p"},"contentType":"json","derivedFrom":null,"index":14,"id":"e75fed81-3849-4581-837b-205e06c0b134"},{"type":"ObojoboDraft.Chunks.MultipleChoiceQuestion","content":{"textGroup":[{"text":{"value":"Which is an example of plagiarism?","styleList":null},"data":{"score":0}},{"text":{"value":"Using song lyrics in a report about cultural music","styleList":null},"data":{"score":100}},{"text":{"value":"","styleList":null},"data":{"score":0}},{"text":{"value":"Paraphrasing and citing text from an article","styleList":null},"data":{"score":0}},{"text":{"value":"","styleList":null},"data":{"score":0}},{"text":{"value":"Including George Washington's birth date in a paper","styleList":null},"data":{"score":0}},{"text":{"value":"","styleList":null},"data":{"score":0}}],"responseType":"pick-one"},"contentType":"json","derivedFrom":null,"index":15,"id":"8da20731-e180-4090-8533-2ca258c03291"},{"type":"ObojoboDraft.Chunks.Heading","content":{"textGroup":[{"text":{"value":"Causes of Plagiarism","styleList":null},"data":{"indent":0}}],"headingLevel":2},"contentType":"json","derivedFrom":null,"index":16,"id":"c19b95c2-e7ac-41d7-8a4a-b239aa0ec8a4"},{"type":"ObojoboDraft.Chunks.Text","content":{"textGroup":[{"text":{"value":"Common causes of plagiarism include:","styleList":null},"data":{"indent":0}}],"type":"p"},"contentType":"json","derivedFrom":null,"index":17,"id":"bb263299-f26f-4c9c-a616-985e1d212177"},{"type":"ObojoboDraft.Chunks.List","content":{"indent":0,"textGroup":[{"text":{"value":"using a direct quote without adding quotations and citing the source","styleList":null},"data":{"indent":0}},{"text":{"value":"paraphrasing or summarizing someone else's words or ideas without citing the source","styleList":null},"data":{"indent":0}},{"text":{"value":"submitting your own paper for more than one assignment","styleList":null},"data":{"indent":0}},{"text":{"value":"getting a friend to help you write a paper","styleList":null},"data":{"indent":0}},{"text":{"value":"borrowing or buying a paper","styleList":null},"data":{"indent":0}},{"text":{"value":"and other practices that may be identified by your professors or instructors.","styleList":null},"data":{"indent":0}}],"listStyles":{"type":"unordered","indents":{}}},"contentType":"json","derivedFrom":null,"index":18,"id":"8757d2f8-c16f-46e6-a082-7fda20a3ab78"}]},{"chunks":[{"type":"ObojoboDraft.Chunks.Heading","content":{"textGroup":[{"text":{"value":"Avoiding Plagiarism","styleList":null},"data":{"indent":0}}],"headingLevel":1},"contentType":"json","derivedFrom":null,"index":0,"id":"5e05f97d-2d4b-4ace-89eb-0e49c1a738a9"},{"type":"ObojoboDraft.Chunks.Heading","content":{"textGroup":[{"text":{"value":"Citing Sources","styleList":null},"data":{"indent":0}}],"headingLevel":2},"contentType":"json","derivedFrom":null,"index":1,"id":"9b005199-0e18-4c3d-9505-c30e53e012eb"},{"type":"ObojoboDraft.Chunks.Text","content":{"textGroup":[{"text":{"value":"To avoid plagiarism, cite all outside sources you use in your writing. The examples in this module describe how to use MLA style to cite sources. MLA style and formatting is published in the MLA Handbook for Writers of Research Papers, Seventh Edition. However, there are many other styles you may be asked to use in your courses. Check with your instructors to find out which style is required for a course. Other frequently used styles include: American Medical Association (AMA), American Psychological Association (APA), and the Chicago Manual of Style (CMS). To see detailed instructions about how to use a specific style along with formatting examples, consult the appropriate style manual. Copies of style manuals are available in the reference area of the library.","styleList":[{"type":"b","start":119,"end":128,"data":{}},{"type":"b","start":191,"end":251,"data":{}}]},"data":{"indent":0}}],"type":"p"},"contentType":"json","derivedFrom":null,"index":2,"id":"bf6effd1-42fe-4c93-bbe9-7886b53f84cc"},{"type":"ObojoboDraft.Chunks.IFrame","content":{"src":null},"contentType":"json","derivedFrom":null,"index":3,"id":"c5d325ed-b02c-463d-98cb-221e03abf00f"},{"type":"ObojoboDraft.Chunks.Text","content":{"textGroup":[{"text":{"value":"Citing sources is typically a two-step process -- to cite sources using MLA style:","styleList":null},"data":{"indent":0}}],"type":"p"},"contentType":"json","derivedFrom":null,"index":4,"id":"e0716201-b267-4138-ab9e-6e809206affe"},{"type":"ObojoboDraft.Chunks.List","content":{"indent":0,"textGroup":[{"text":{"value":"Step 1 - Create a Works Cited page, which should be added at the end of your paper, to list all of the required details about each source. Depending on the citation style you use, this page may be titled References or Bibliography.","styleList":[{"type":"b","start":18,"end":29,"data":{}}]},"data":{"indent":0}},{"text":{"value":"Step 2 - Add a parenthetical citation within the body of your paper wherever you include a direct quote or any text or ideasthat are paraphrased and summarized from outside sources. Parenthetical citations (sometimes called in-text citations) refer readers to the specific entry listed on your Works Cited page.","styleList":[{"type":"b","start":15,"end":37,"data":{}},{"type":"b","start":224,"end":241,"data":{}},{"type":"b","start":294,"end":306,"data":{}}]},"data":{"indent":0}}],"listStyles":{"type":"unordered","indents":{}}},"contentType":"json","derivedFrom":null,"index":5,"id":"90442ca9-3607-4e62-8da9-8f16b8aec0f9"},{"type":"ObojoboDraft.Chunks.MultipleChoiceQuestion","content":{"textGroup":[{"text":{"value":"Read the text below and determine which answer gives the best example of how to summarize text.\n\nA total of 14 intersections (nine camera sites, three non-camera sites, and two control sites) were studied. Overall, the red light violation rate was reduced approximately 42% several months after the enforcement program began. Increases in driver compliance were not limited to the camera-equipped intersections but spilled over the non-equipped intersections as well. Results of public opinion surveys conducted approximately 6 weeks before, 6 weeks after, and 6 months after the camera enforcement began indicated that nearly 80% of Oxnard residents support using red light cameras as a supplement to police efforts to enforce traffic signal laws.\n\nRettig, Richard A., Allan F. Williams, Charles M. Farmer, and Amy F. Feldman. \"Evaluation of Red Light Camera Enforcement in Oxnard, California.\" Accident Analysis and Prevention 31.3 (1999): 169-74. Print.","styleList":null},"data":{"score":0}},{"text":{"value":"In one study red light cameras reduced violations by 42% with compliance spreading to intersections without cameras as well, with residents overwhelmingly supporting the program (Rettig 169).","styleList":null},"data":{"score":100}},{"text":{"value":"Correct. This example briefly restates the original source by conveying the main points and it properly cites the source.","styleList":null},"data":{"score":0}},{"text":{"value":"Overall, the red light violation rate was reduced approximately 42% several months after the enforcement program began\" (Rettig 169).","styleList":null},"data":{"score":0}},{"text":{"value":"Incorrect. This is an example of how to use a direct quote.","styleList":null},"data":{"score":0}},{"text":{"value":"In Rettig's analysis, red light cameras reduced violations at 14 intersections, some with cameras and some without, by 42%. Eighty percent of Oxnard residents surveyed immediately before, immediately after and 6 months after implementation supported the red light camera program (169).","styleList":null},"data":{"score":0}},{"text":{"value":"Incorrect. This is an example of how you might paraphrase the original source.","styleList":null},"data":{"score":0}}],"responseType":"pick-one"},"contentType":"json","derivedFrom":null,"index":6,"id":"7ef7940e-2cea-4112-b9d4-d9ec9b9ca42a"}]}]}
		module.fromDescriptor {"metadata":{},"pages":[{"chunks":[{"type":"ObojoboDraft.Chunks.Heading","content":{"textGroup":[{"text":{"value":"Defining Plagiarism","styleList":null},"data":{"indent":0}}],"headingLevel":1},"contentType":"json","derivedFrom":null,"index":0,"id":"cc3dab7a-28c7-414f-9f4c-f38d061151cc"},{"type":"ObojoboDraft.Chunks.Blockquote","content":{"textGroup":[{"text":{"value":"A total of 14 intersections (nine camera sites, three non-camera sites, and two control sites) were studied. Overall, the red light violation rate was reduced approximately 42% several months after the enforcement program began. Increases in driver compliance were not limited to the camera-equipped intersections but spilled over the non-equipped intersections as well. Results of public opinion surveys conducted approximately 6 weeks before, 6 weeks after, and 6 months after the camera enforcement began indicated that nearly 80% of Oxnard residents support using red light cameras as a supplement to police efforts to enforce traffic signal laws.","styleList":null},"data":{"indent":0}},{"text":{"value":"Rettig, Richard A., Allan F. Williams, Charles M. Farmer, and Amy F. Feldman. \"Evaluation of Red Light Camera Enforcement in Oxnard, California.\" Accident Analysis and Prevention 31.3 (1999): 169-74. Print.","styleList":null},"data":{"indent":0}}],"type":"p"},"contentType":"json","derivedFrom":null,"index":1,"id":"fb20628e-3458-4394-88be-2bfc97ade5ac"},{"type":"ObojoboDraft.Chunks.Heading","content":{"textGroup":[{"text":{"value":"Academic Integrity","styleList":null},"data":{"indent":0}}],"headingLevel":2},"contentType":"json","derivedFrom":null,"index":2,"id":"25614656-760c-4acd-aaa6-544d38a6ead6"},{"type":"ObojoboDraft.Chunks.Figure","content":{"textGroup":[{"text":{"value":"","styleList":[{"type":"i","start":0,"end":0,"data":{}}]},"data":{}}],"url":null,"size":"small"},"contentType":"json","derivedFrom":null,"index":3,"id":"0852db63-aa97-4434-8b8d-838aae95fd17"},{"type":"ObojoboDraft.Chunks.Text","content":{"textGroup":[{"text":{"value":"This module is designed to help you recognize the common causes of plagiarism and show you how to avoid them.","styleList":null},"data":{"indent":0}}],"type":"p"},"contentType":"json","derivedFrom":null,"index":4,"id":"91025d4d-e94d-4fbe-aa4f-c3c17707199c"},{"type":"ObojoboDraft.Chunks.MathEquation","content":{"latex":"y=\\sqrt{a^2+b^2}"},"contentType":"json","derivedFrom":null,"index":5,"id":"3c4ebecd-780c-4cf1-a74a-4a9f253aac85"},{"type":"ObojoboDraft.Chunks.Text","content":{"textGroup":[{"text":{"value":"The UCF Rules of Conduct, published in The Golden Rule Student Handbook 2012-2013 notes on page 16 that “In an instructional setting, plagiarism occurs when a writer deliberately uses someone else's language, ideas, or other original (not common-knowledge) material without acknowledging its source.","styleList":[{"type":"b","start":39,"end":82,"data":{}}]},"data":{"indent":0}}],"type":"p"},"contentType":"json","derivedFrom":null,"index":6,"id":"1b67c32a-d665-4ac7-a2a0-b680e1d92e70"},{"type":"ObojoboDraft.Chunks.Code","content":{"textGroup":[{"text":{"value":"var el = document.createElement('div');","styleList":null},"data":{"indent":0}},{"text":{"value":"document.body.appendChild(el);","styleList":null},"data":{"indent":0}}],"type":"p"},"contentType":"json","derivedFrom":null,"index":7,"id":"5e9fb984-4bb0-412e-b5f2-a314bb7d8572"},{"type":"ObojoboDraft.Chunks.Text","content":{"textGroup":[{"text":{"value":"This definition applies to texts published in print or on-line, to manuscripts, and to the work of other student writers” (Council of Writing Program Administrators).","styleList":null},"data":{"indent":0}}],"type":"p"},"contentType":"json","derivedFrom":null,"index":8,"id":"f8bdafb3-905e-4c3b-b07e-4b5ba0b05539"},{"type":"ObojoboDraft.Chunks.Break","content":{},"contentType":"json","derivedFrom":null,"index":9,"id":"82647907-91ac-4157-ab95-c24022d2a4d6"},{"type":"ObojoboDraft.Chunks.Text","content":{"textGroup":[{"text":{"value":"Violating academic standards by plagiarizing can have serious consequences that may include receiving a failing grade for an assignment or a course -- or suspension or expulsion from the university.","styleList":null},"data":{"indent":0}}],"type":"p"},"contentType":"json","derivedFrom":null,"index":10,"id":"dc2b138e-b4fc-42c6-ac89-613afa6f8a98"},{"type":"ObojoboDraft.Chunks.Heading","content":{"textGroup":[{"text":{"value":"Detecting Plagiarism","styleList":null},"data":{"indent":0}}],"headingLevel":2},"contentType":"json","derivedFrom":null,"index":11,"id":"1e85103b-4658-4597-a87a-c0555e722436"},{"type":"ObojoboDraft.Chunks.YouTube","content":{"videoId":"3NOdEMyq-9Q"},"contentType":"json","derivedFrom":null,"index":12,"id":"7a7190f7-2106-4f84-9cfa-dd764e1c5cd9"},{"type":"ObojoboDraft.Chunks.Text","content":{"textGroup":[{"text":{"value":"Students are expected to know and follow academic standards by citing the outside sources used in their work. Some UCF instructors utilize turnitin.com, an online search tool.","styleList":[{"type":"b","start":139,"end":151,"data":{}}]},"data":{"indent":0}}],"type":"p"},"contentType":"json","derivedFrom":null,"index":13,"id":"bdfdc870-c23b-44a8-95d1-18ba58cab419"},{"type":"ObojoboDraft.Chunks.Table","content":{"textGroup":{"textGroup":[{"text":{"value":"Good","styleList":null},"data":{}},{"text":{"value":"Bad","styleList":null},"data":{}},{"text":{"value":"Family Man","styleList":null},"data":{}},{"text":{"value":"Vampire's Kiss","styleList":null},"data":{}},{"text":{"value":"National Treasure","styleList":null},"data":{}},{"text":{"value":"Ghost Rider","styleList":null},"data":{}}],"numRows":3,"numCols":2},"position":"center","header":true},"contentType":"json","derivedFrom":null,"index":14,"id":"2c44dee8-0167-416e-8cb0-9f5e4c6cea8f"},{"type":"ObojoboDraft.Chunks.Text","content":{"textGroup":[{"text":{"value":"The turnitin software checks papers for originality by comparing a student's paper with papers submitted from other institutions and with content found on the web. After a paper is submitted, a report is sent that indicates if an author's work was properly used in the paper.","styleList":null},"data":{"indent":0}}],"type":"p"},"contentType":"json","derivedFrom":null,"index":15,"id":"e75fed81-3849-4581-837b-205e06c0b134"},{"type":"ObojoboDraft.Chunks.MultipleChoiceQuestion","content":{"textGroup":[{"text":{"value":"Which is an example of plagiarism?","styleList":null},"data":{"score":0}},{"text":{"value":"Using song lyrics in a report about cultural music","styleList":null},"data":{"score":100}},{"text":{"value":"","styleList":null},"data":{"score":0}},{"text":{"value":"Paraphrasing and citing text from an article","styleList":null},"data":{"score":0}},{"text":{"value":"","styleList":null},"data":{"score":0}},{"text":{"value":"Including George Washington's birth date in a paper","styleList":null},"data":{"score":0}},{"text":{"value":"","styleList":null},"data":{"score":0}}],"responseType":"pick-one"},"contentType":"json","derivedFrom":null,"index":16,"id":"8da20731-e180-4090-8533-2ca258c03291"},{"type":"ObojoboDraft.Chunks.Heading","content":{"textGroup":[{"text":{"value":"Causes of Plagiarism","styleList":null},"data":{"indent":0}}],"headingLevel":2},"contentType":"json","derivedFrom":null,"index":17,"id":"c19b95c2-e7ac-41d7-8a4a-b239aa0ec8a4"},{"type":"ObojoboDraft.Chunks.Text","content":{"textGroup":[{"text":{"value":"Common causes of plagiarism include:","styleList":null},"data":{"indent":0}}],"type":"p"},"contentType":"json","derivedFrom":null,"index":18,"id":"bb263299-f26f-4c9c-a616-985e1d212177"},{"type":"ObojoboDraft.Chunks.List","content":{"indent":0,"textGroup":[{"text":{"value":"using a direct quote without adding quotations and citing the source","styleList":null},"data":{"indent":0}},{"text":{"value":"paraphrasing or summarizing someone else's words or ideas without citing the source","styleList":null},"data":{"indent":0}},{"text":{"value":"submitting your own paper for more than one assignment","styleList":null},"data":{"indent":0}},{"text":{"value":"getting a friend to help you write a paper","styleList":null},"data":{"indent":0}},{"text":{"value":"borrowing or buying a paper","styleList":null},"data":{"indent":0}},{"text":{"value":"and other practices that may be identified by your professors or instructors.","styleList":null},"data":{"indent":0}}],"listStyles":{"type":"unordered","indents":{}}},"contentType":"json","derivedFrom":null,"index":19,"id":"8757d2f8-c16f-46e6-a082-7fda20a3ab78"}]},{"chunks":[{"type":"ObojoboDraft.Chunks.Heading","content":{"textGroup":[{"text":{"value":"Avoiding Plagiarism","styleList":null},"data":{"indent":0}}],"headingLevel":1},"contentType":"json","derivedFrom":null,"index":0,"id":"5e05f97d-2d4b-4ace-89eb-0e49c1a738a9"},{"type":"ObojoboDraft.Chunks.Heading","content":{"textGroup":[{"text":{"value":"Citing Sources","styleList":null},"data":{"indent":0}}],"headingLevel":2},"contentType":"json","derivedFrom":null,"index":1,"id":"9b005199-0e18-4c3d-9505-c30e53e012eb"},{"type":"ObojoboDraft.Chunks.Text","content":{"textGroup":[{"text":{"value":"To avoid plagiarism, cite all outside sources you use in your writing. The examples in this module describe how to use MLA style to cite sources. MLA style and formatting is published in the MLA Handbook for Writers of Research Papers, Seventh Edition. However, there are many other styles you may be asked to use in your courses. Check with your instructors to find out which style is required for a course. Other frequently used styles include: American Medical Association (AMA), American Psychological Association (APA), and the Chicago Manual of Style (CMS). To see detailed instructions about how to use a specific style along with formatting examples, consult the appropriate style manual. Copies of style manuals are available in the reference area of the library.","styleList":[{"type":"b","start":119,"end":128,"data":{}},{"type":"b","start":191,"end":251,"data":{}}]},"data":{"indent":0}}],"type":"p"},"contentType":"json","derivedFrom":null,"index":2,"id":"bf6effd1-42fe-4c93-bbe9-7886b53f84cc"},{"type":"ObojoboDraft.Chunks.IFrame","content":{"src":null},"contentType":"json","derivedFrom":null,"index":3,"id":"c5d325ed-b02c-463d-98cb-221e03abf00f"},{"type":"ObojoboDraft.Chunks.Text","content":{"textGroup":[{"text":{"value":"Citing sources is typically a two-step process -- to cite sources using MLA style:","styleList":null},"data":{"indent":0}}],"type":"p"},"contentType":"json","derivedFrom":null,"index":4,"id":"e0716201-b267-4138-ab9e-6e809206affe"},{"type":"ObojoboDraft.Chunks.List","content":{"indent":0,"textGroup":[{"text":{"value":"Step 1 - Create a Works Cited page, which should be added at the end of your paper, to list all of the required details about each source. Depending on the citation style you use, this page may be titled References or Bibliography.","styleList":[{"type":"b","start":18,"end":29,"data":{}}]},"data":{"indent":0}},{"text":{"value":"Step 2 - Add a parenthetical citation within the body of your paper wherever you include a direct quote or any text or ideasthat are paraphrased and summarized from outside sources. Parenthetical citations (sometimes called in-text citations) refer readers to the specific entry listed on your Works Cited page.","styleList":[{"type":"b","start":15,"end":37,"data":{}},{"type":"b","start":224,"end":241,"data":{}},{"type":"b","start":294,"end":306,"data":{}}]},"data":{"indent":0}}],"listStyles":{"type":"unordered","indents":{}}},"contentType":"json","derivedFrom":null,"index":5,"id":"90442ca9-3607-4e62-8da9-8f16b8aec0f9"},{"type":"ObojoboDraft.Chunks.MultipleChoiceQuestion","content":{"textGroup":[{"text":{"value":"Read the text below and determine which answer gives the best example of how to summarize text.\n\nA total of 14 intersections (nine camera sites, three non-camera sites, and two control sites) were studied. Overall, the red light violation rate was reduced approximately 42% several months after the enforcement program began. Increases in driver compliance were not limited to the camera-equipped intersections but spilled over the non-equipped intersections as well. Results of public opinion surveys conducted approximately 6 weeks before, 6 weeks after, and 6 months after the camera enforcement began indicated that nearly 80% of Oxnard residents support using red light cameras as a supplement to police efforts to enforce traffic signal laws.\n\nRettig, Richard A., Allan F. Williams, Charles M. Farmer, and Amy F. Feldman. \"Evaluation of Red Light Camera Enforcement in Oxnard, California.\" Accident Analysis and Prevention 31.3 (1999): 169-74. Print.","styleList":null},"data":{"score":0}},{"text":{"value":"In one study red light cameras reduced violations by 42% with compliance spreading to intersections without cameras as well, with residents overwhelmingly supporting the program (Rettig 169).","styleList":null},"data":{"score":100}},{"text":{"value":"Correct. This example briefly restates the original source by conveying the main points and it properly cites the source.","styleList":null},"data":{"score":0}},{"text":{"value":"Overall, the red light violation rate was reduced approximately 42% several months after the enforcement program began\" (Rettig 169).","styleList":null},"data":{"score":0}},{"text":{"value":"Incorrect. This is an example of how to use a direct quote.","styleList":null},"data":{"score":0}},{"text":{"value":"In Rettig's analysis, red light cameras reduced violations at 14 intersections, some with cameras and some without, by 42%. Eighty percent of Oxnard residents surveyed immediately before, immediately after and 6 months after implementation supported the red light camera program (169).","styleList":null},"data":{"score":0}},{"text":{"value":"Incorrect. This is an example of how you might paraphrase the original source.","styleList":null},"data":{"score":0}}],"responseType":"pick-one"},"contentType":"json","derivedFrom":null,"index":6,"id":"7ef7940e-2cea-4112-b9d4-d9ec9b9ca42a"}]}]}

		@history = new History
		@selection = new Selection module.pages.at(0)

		@textModifiers = []
		@moduleChanged = false

		@toolbarItemsListeningForSelectionUpdate = []
		for item in @props.toolbarItems
			if item.onSelectionUpdate?
				@toolbarItemsListeningForSelectionUpdate.push item

		window.__force = (->
			@saveAndRenderModule()
		).bind(@)
		window.__history = @history
		window.__lo = module
		window.__s = @selection
		window.__sd = ( ->
			console.log JSON.stringify(@selection.getSelectionDescriptor(), null, 2)
		).bind(@)
		window.__editor = @
		window.__tg = (index) ->
			module.chunks.at(index).modelState.textGroup
		window.__tgs = ((index) ->
			new Common.textGroup.TextGroupSelection module.pages.at(@state.activePageIndex).chunks.at(index), @state.selection.virtual
		).bind(@)
		window.__editChunk = ( (index, controlsEnabled) ->
			@editChunk __lo.chunks.at(index), controlsEnabled
			__force({})
		).bind(@)

		window.__undo = @undo
		window.__redo = @redo

		window.EditorApp = @

		return (
			module: module
			activePageIndex: 0
			styleBrush: new StyleBrush()
			modalElement: null
			editingChunk: null
			textControlsEnabled: true
			sideMenuEnabled: true
			toolbarControlsEnabled: true
			loading: false
			selection: @selection
			key: 0
		)

	_getActivePageRef: ->
		@refs['editorPage' + @state.activePageIndex]

	_getActivePageContainerRef: ->
		@refs['pageContainer' + @state.activePageIndex]

	_onTextMenuCommand: (commandLabel) ->
		@selection.runTextCommands commandLabel
		@updateSelectionFromDOM()
		@saveAndRenderModule()

	_onSideMenuStartDrag: ->
		@setState { textControlsEnabled:false, toolbarControlsEnabled:false }

	_onSideMenuDrop: ->
		@setState { textControlsEnabled:true, toolbarControlsEnabled:true }

		@_getActivePageRef().forcePageRerender { callback: (->
			@saveAndRenderModule()
		).bind(@)}

	_onSideMenuClick: (position, componentClass) ->
		@setState { loading:true }

		console.time 'sideMenuClick'

		self = @
		onInsert = @props.insertItems.get(componentClass.type).onInsert

		if position is 'before'
			onInsert componentClass, 'before', self.selection.startChunk, self.selection, ->
				self.setState { loading:false }
				self.saveAndRenderModule()

		else
			newChunk = onInsert componentClass, 'after', self.selection.endChunk, self.selection, ->
				self.setState { loading:false }
				self.saveAndRenderModule()

		console.timeEnd 'sideMenuClick'

	_onAppendMenuClick: (componentClass) ->
		self = @
		onInsert = @props.insertItems.get(componentClass.type).onInsert

		page = self.state.module.pages.at(self.state.activePageIndex)

		newChunk = onInsert componentClass, 'after', page.chunks.at(page.chunks.length - 1), self.selection, ->
			self.setState { loading:false }
			self.saveAndRenderModule()

			# setTimeout (->
				# window.scrollTo 0, document.body.scrollHeight
				# console.log('@screen', @screen)

			self.scrollToPageBottomAfterUpdate = true
			# ).bind(@), 1000

	_onToolbarCommand: (command, data) ->
		command.onClick command, @state, @selection, data
		@saveAndRenderModule()

		# Hack
		window.setTimeout ( ->
			@selection.selectDOM()
		).bind(@)

	_onKeyDown: (event) ->
		# console.log 'EditorApp::_onKeyDown', event

		if event.metaKey or event.ctrlKey
			switch event.keyCode
				when 90 #z
					event.preventDefault()
					if event.shiftKey then @redo() else @undo()

				when 89 #y
					event.preventDefault()
					@redo()

				when 83 #s
					event.preventDefault()

					if event.shiftKey
						location.hash = encodeURIComponent('json:' + JSON.stringify(@state.module.toJSON()))
					else
						@state.module.save()

	_onMouseUp: (event) ->
		if not @editingChunk? and not DOMSelection.includes(ReactDOM.findDOMNode(@_getActivePageRef()))
			@renderModule()

	encodeState: ->
		console.log('ENCODE')
		console.log(JSON.stringify(@state.selection.virtual.toObject(), null, 2))

		module: @state.module.toJSON()
		styleBrush: @state.styleBrush.toObject()
		modalElement: '@TODO'
		editingChunkIndex: if @state.editingChunk? then @state.editingChunk.get('index') else -1
		textControlsEnabled: @state.textControlsEnabled
		sideMenuEnabled: @state.sideMenuEnabled
		toolbarControlsEnabled: @state.toolbarControlsEnabled
		loading: @state.loading
		selection: @state.selection.getSelectionDescriptor()
		activePageIndex: @state.activePageIndex

	restoreState: (o) ->
		@state.module.fromDescriptor o.module
		# @state.selection.virtual.fromObject o.selection

		if @state.activePageIndex isnt o.activePageIndex
			@selectPage(@state.module.pages.at(o.activePageIndex))

		@state.selection.virtual.fromObject o.selection

		console.clear()
		console.log(JSON.stringify(@state.selection.virtual.toObject(), null, 2))

		# if o.editingChunkIndex is -1
		# 	@

		# @futureSelection = o.selection
		@needSelectionUpdate = true

		@setState {
			module: @state.module
			styleBrush: StyleBrush.fromObject o.styleBrush
			editingChunk: if o.editingChunkIndex is -1 then null else @state.module.chunks.at(o.editingChunkIndex)
			textControlsEnabled: o.textControlsEnabled
			sideMenuEnabled: o.sideMenuEnabled
			toolbarControlsEnabled: o.toolbarControlsEnabled
			loading: o.loading
			selection: @state.selection
			activePageIndex: o.activePageIndex
			key: @state.key + 1
		}

	# saveAndRenderModule: (skipSave = false) ->
	saveAndRenderModule: ->
		if @saveModule() then @renderModule()

	saveModule: ->
		console.time 'history'
		@moduleChanged = @history.add @encodeState()
		console.timeEnd 'history'

		# console.log 'SAVE MODULE'
		# console.log @state.module.toJSON()

		window.localStorage.__module = JSON.stringify(@state.module.toJSON())


	renderModule: ->
		if @state.textControlsEnabled
			@needSelectionUpdate = true

		@setState {
			module: @state.module
		}

	updateSelectionFromDOM: (selectDOM = true) ->
		# console.clear()
		# console.log('USFD', @selection.page);

		@selection.update()

		if selectDOM
			@selection.selectDOM()

		for item in @toolbarItemsListeningForSelectionUpdate
			if item.onSelectionUpdate
				item.onSelectionUpdate item, @state, @selection #@TODO - editorState should be a passable object

		@setState {
			selection: @selection
		}

	# send: (fn, chunkOrChunks, data) ->
	# 	ChunkUtil.send fn, chunkOrChunks, @selection, data

	undo: ->
		history = @history.undo()
		@restoreState history

	redo: ->
		history = @history.redo()
		@restoreState history

	showModal: (component) ->
		@setState { modalElement:component }

	editChunk: (chunk, controlsEnabled = {}) ->
		# console.log 'EDIT CHUNK', controlsEnabled
		# chunk.startEditing()
		chunk.markForUpdate()

		if not controlsEnabled.textControlsEnabled    then controlsEnabled.textControlsEnabled = false
		if not controlsEnabled.sideMenuEnabled        then controlsEnabled.sideMenuEnabled = false
		if not controlsEnabled.toolbarControlsEnabled then controlsEnabled.toolbarControlsEnabled = false

		@setState {
			editingChunk: chunk
			textControlsEnabled: controlsEnabled.textControlsEnabled
			sideMenuEnabled: controlsEnabled.sideMenuEnabled
			toolbarControlsEnabled: controlsEnabled.toolbarControlsEnabled
		}

	stopEditing: ->
		if @state.editingChunk
			# @state.editingChunk.stopEditing()
			@state.editingChunk.markForUpdate()

		@setState {
			editingChunk: null
			sideMenuEnabled: true
			textControlsEnabled: true
			toolbarControlsEnabled: true
		}

		@updateSelectionFromDOM()

	setLoading: (val) ->
		@setState { loading:val }

	triggerKeyListeners: ->
		if @moduleChanged
			delete @moduleChanged

			console.time 'textListeners'
			for listener in OBO.textListeners
				listener.match @selection, @
			console.timeEnd 'textListeners'

	componentDidMount: ->
		@screen = new Screen(@refs.main)

		@state.module.pages.at(0).chunks.at(0).selectStart()
		ReactDOM.findDOMNode(@_getActivePageRef()).focus()

		document.addEventListener 'keydown', @_onKeyDown #.bind(@)

		@saveAndRenderModule()

	componentWillUpdate: ->
		@state.module.initIfNeeded()

	componentDidUpdate: ->
		if @needSelectionUpdate?
			delete @needSelectionUpdate

			# console.log 'NEEDS UPDATE'
			# console.log(JSON.stringify(@state.selection.virtual.toObject(), null, 2))

			# @_getActivePageContainerRef().focus()

			@selection.selectDOM()
			@updateSelectionFromDOM()

		if @scrollToPageBottomAfterUpdate
			delete @scrollToPageBottomAfterUpdate

			# @screen.scrollToBottom()
			# r = ReactDOM.findDOMNode(@_getActivePageRef()).getBoundingClientRect()
			ReactDOM.findDOMNode(@_getActivePageContainerRef()).scrollIntoView(false)

			@selection.selectDOM()
			@updateSelectionFromDOM()

	selectPage: (page) ->
		@selection.setPage(page)
		page.chunks.at(page.chunks.models.length - 1).selectEnd()

		@needSelectionUpdate = true

		@setState {
			activePageIndex: @state.module.pages.models.indexOf(page)
		}

	addPage: (index) ->
		newPage = new Page()
		@state.module.pages.add(newPage, { at:index + 1 })

		newPage.initIfNeeded()

		@scrollToPageBottomAfterUpdate = true

		@selectPage(newPage)

		@saveAndRenderModule()

	onPageMouseDown: (page, pageIndex) ->
		if pageIndex isnt @state.activePageIndex
			@selectPage page

	deletePage: (page) ->
		pageIndex = @state.module.pages.models.indexOf(page)
		@state.module.pages.remove(page)

		@state.module.initIfNeeded()

		pageIndex = Math.max 0, pageIndex - 1
		@selectPage @state.module.pages.at(pageIndex)

		@saveAndRenderModule()

	render: ->
		console.time 'renderEditor'

		saveHistoryFn = @saveHistory
		showModalFn = @showModal
		setLoadingFn = @setLoading
		selection = @selection
		saveAndRenderModuleFn = @saveAndRenderModule
		updateSelectionFromDOMFn = @updateSelectionFromDOM
		setControlsStateFn = @setControlsState
		addPage = @addPage
		onPageMouseDown = @onPageMouseDown
		deletePage = @deletePage

		if @state.loading or @state.modalElement?
			sideMenuEnabled = false
			textControlsEnabled = false
			toolbarControlsEnabled = false
		else
			sideMenuEnabled = @state.sideMenuEnabled
			textControlsEnabled = @state.textControlsEnabled
			toolbarControlsEnabled = @state.toolbarControlsEnabled

		editorPages = @state.module.pages.models.map(((page, index) ->
			isActive = @state.activePageIndex is index

			`<div key={index} ref={'pageContainer' + index} className={'page-container' + (isActive ? ' active' : '')}>
				<button className="add-page-btn top" onClick={addPage.bind(null, index - 1)}>+ Add Page</button>
				<EditorPage
					data-page-index={index}
					pageIndex={index}
					onMouseDown={onPageMouseDown}
					module={this.state.module}
					page={page}
					selection={this.selection}
					styleBrush={this.state.styleBrush}
					saveAndRenderModuleFn={saveAndRenderModuleFn}
					updateSelectionFromDOMFn={updateSelectionFromDOMFn}
					showModalFn={showModalFn}
					setLoadingFn={setLoadingFn}
					editChunk={this.editChunk}
					stopEditing={this.stopEditing}
					editingChunk={this.state.editingChunk}
					enabled={textControlsEnabled}
					pageEdit={this.state.editingChunk === null}
					screen={this.screen}
					triggerKeyListeners={this.triggerKeyListeners}
					deletePage={deletePage}
					ref={'editorPage' + index}
				/>
				{
					isActive
					?
					<div className="append-menu">
						<SideMenuList
							alwaysOpen
							insertItems={this.props.insertItems}
							onMouseDown={this._onAppendMenuClick}
							yPos={0}
							enabled={this.state.sideMenuEnabled}
						/>
					</div>
					:
					null
				}
				<button className="add-page-btn bottom" onClick={addPage.bind(null, index)}>+ Add Page</button>
			</div>`
		).bind(@))

		# <pre style={{fontSize:'10pt'}}>{this.state.activePageIndex}</pre>
		# <pre style={{fontSize:'10pt'}}>{JSON.stringify(this.state.selection.virtual.toObject(), null, 2)}</pre>


		return `<div className="editor--components--editor-app document"  onMouseUp={this._onMouseUp} key={this.state.key}>
			<div className={'toolbar-wrapper' + (!textControlsEnabled ? ' disabled' : '')}>
				<Toolbar selection={this.selection} commandHandler={this._onToolbarCommand} commands={this.props.toolbarItems} enabled={toolbarControlsEnabled} />
			</div>
			<main ref="main">

				<div className='wrapper'>
					<div className="guidelines" />

					{editorPages}

					<div ref="controls" className="controls">
						<DebugMenu selection={this.selection} history={this.history} controlsEl={this.refs.controls} />
						<SideMenu
							renderModuleFn={this.renderModule}
							selection={this.selection}
							module={this.state.module}
							handlerFn={this._onSideMenuClick}
							insertItems={this.props.insertItems}
							controlsEl={this.refs.controls}
							onStartDrag={this._onSideMenuStartDrag}
							onDrop={this._onSideMenuDrop}
							enabled={sideMenuEnabled}
						/>
						<TextMenu
							relativeToElement={this.refs.controls}
							selectionRect={this.state.selection.rect}
							commandHandler={this._onTextMenuCommand}
							commands={this.state.selection.textCommands}
							enabled={textControlsEnabled}
						/>
					</div>
				</div>
			</main>
			<Modal modalElement={this.state.modalElement} showModalFn={showModalFn} />
			<LoadingModal show={this.state.loading} />
		</div>`


module.exports = EditorApp