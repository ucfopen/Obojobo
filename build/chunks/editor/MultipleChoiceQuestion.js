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
/******/ ((function(modules) {
	// Check all modules for deduplicated modules
	for(var i in modules) {
		if(Object.prototype.hasOwnProperty.call(modules, i)) {
			switch(typeof modules[i]) {
			case "function": break;
			case "object":
				// Module can be created from a template
				modules[i] = (function(_m) {
					var args = _m.slice(1), fn = modules[_m[0]];
					return function (a,b,c) {
						fn.apply(this, [a,b,c].concat(args));
					};
				}(modules[i]));
				break;
			default:
				// Module is a copy of another module
				modules[i] = modules[modules[i]];
				break;
			}
		}
	}
	return modules;
}({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(174);


/***/ },

/***/ 48:
/***/ function(module, exports) {

	"use strict";

	var getCorrectAnswers;

	getCorrectAnswers = function getCorrectAnswers(textGroup) {
	  var correct, i, len, ref, textItem;
	  correct = [];
	  ref = textGroup.items;
	  for (i = 0, len = ref.length; i < len; i++) {
	    textItem = ref[i];
	    if (textItem.data.score && textItem.data.score === 100) {
	      correct.push(textItem);
	    }
	  }
	  return correct;
	};

	module.exports = {
	  getCorrectAnswers: getCorrectAnswers
	};

/***/ },

/***/ 49:
/***/ function(module, exports) {

	'use strict';

	var ObojoboDraft, SelectableAnswerItem, StyleableText, TextGroupEl;

	ObojoboDraft = window.ObojoboDraft;

	TextGroupEl = ObojoboDraft.chunk.textChunk.TextGroupEl;

	StyleableText = ObojoboDraft.text.StyleableText;

	SelectableAnswerItem = React.createClass({
	  displayName: 'SelectableAnswerItem',

	  getDefaultProps: function getDefaultProps() {
	    return {
	      type: 'preview',
	      inputType: 'radio',
	      answer: null,
	      feedback: null,
	      chunkIndex: -1,
	      checked: false,
	      open: false,
	      defaultCorrectText: new StyleableText('Correct!'),
	      defaultIncorrectText: new StyleableText('Incorrect'),
	      onSelect: function onSelect() {},
	      onDeleteAnswer: function onDeleteAnswer() {},
	      onFocus: function onFocus() {},
	      onBlur: function onBlur() {},
	      onKeyDown: function onKeyDown() {}
	    };
	  },
	  render: function render() {
	    if (this.props.answer == null || this.props.feedback == null) {
	      return null;
	    }
	    switch (this.props.type) {
	      case 'editor':
	        return this.renderEditor();
	      default:
	        return this.renderPreview();
	    }
	  },
	  renderPreview: function renderPreview() {
	    var answer, answerText, chunkIndex, defaultCorrectText, defaultIncorrectText, feedback, i;
	    answer = this.props.answer;
	    feedback = this.props.feedback;
	    i = this.props.answer.index;
	    chunkIndex = this.props.chunkIndex;
	    defaultCorrectText = this.props.defaultCorrectText;
	    defaultIncorrectText = this.props.defaultIncorrectText;
	    answerText = this.props.answer.text;
	    if (answerText.length === 0) {
	      answerText = function () {
	        switch (this.props.answer.data.score) {
	          case 100:
	            return new StyleableText('An example correct answer choice');
	          case 0:
	            return new StyleableText('An example incorrect answer choice');
	          default:
	            return new StyleableText('An example partially correct answer choice');
	        }
	      }.call(this);
	    }
	    return React.createElement(
	      'li',
	      {
	        className: 'answer' + (this.props.open ? ' open' : ' closed') + (answer.data.score === 0 ? ' incorrect' : ' correct') + (this.props.checked ? ' checked' : ' unchecked') + (this.props.answer.text.length === 0 ? ' empty' : ' non-empty'),
	        key: this.props.type + i
	      },
	      React.createElement(
	        'label',
	        { className: 'pad' },
	        React.createElement('input', {
	          className: this.props.inputType,
	          type: this.props.inputType,
	          name: chunkIndex,
	          value: i,
	          onChange: this.props.onSelect.bind(null, answer),
	          checked: this.props.checked,
	          tabIndex: this.props.shouldPreventTab ? '-1' : ''
	        }),
	        React.createElement(
	          'div',
	          { className: 'input' },
	          React.createElement(TextGroupEl, { text: answerText, groupIndex: i })
	        )
	      ),
	      this.props.open ? React.createElement(
	        'div',
	        { className: 'feedback pad ' + (answer.data.score === 0 ? 'incorrect' : 'correct') },
	        React.createElement(TextGroupEl, { text: feedback.text.length > 0 ? feedback.text : answer.data.score === 0 ? defaultIncorrectText : defaultCorrectText, groupIndex: i + 1 })
	      ) : null
	    );
	  },
	  onKeyDown: function onKeyDown(event) {
	    return this.props.onKeyDown(event);
	  },
	  renderEditor: function renderEditor() {
	    var answer, chunkIndex, correct, feedback, i;
	    answer = this.props.answer;
	    feedback = this.props.feedback;
	    i = this.props.answer.index;
	    chunkIndex = this.props.chunkIndex;
	    correct = this.props.selected;
	    return React.createElement(
	      'li',
	      { className: 'answer open' + (answer.data.score === 0 ? ' incorrect' : ' correct') },
	      React.createElement(
	        'div',
	        { className: 'label pad' },
	        React.createElement('input', { className: this.props.inputType, type: this.props.inputType, name: chunkIndex, value: i, checked: this.props.checked, onClick: this.props.onSelect.bind(null, answer) }),
	        React.createElement(
	          'div',
	          { className: 'input', contentEditable: 'true', suppressContentEditableWarning: true, onFocus: this.props.onFocus, onBlur: this.props.onBlur, onKeyDown: this.onKeyDown },
	          React.createElement(TextGroupEl, { text: answer.text, groupIndex: i }),
	          answer.text.length === 0 ? React.createElement(
	            'span',
	            { className: 'placeholder' },
	            'Answer text'
	          ) : null
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'feedback', contentEditable: 'true', suppressContentEditableWarning: true, onFocus: this.props.onFocus, onBlur: this.props.onBlur, onKeyDown: this.onKeyDown },
	        React.createElement(TextGroupEl, { text: feedback.text, groupIndex: i + 1 }),
	        feedback.text.length === 0 ? React.createElement(
	          'span',
	          { className: 'placeholder' },
	          'Feedback text'
	        ) : null
	      ),
	      React.createElement(
	        'div',
	        { className: 'delete' },
	        React.createElement(
	          'button',
	          { onClick: this.props.onDeleteAnswer.bind(null, answer) },
	          'delete'
	        )
	      )
	    );
	  }
	});

	module.exports = SelectableAnswerItem;

/***/ },

/***/ 89:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var FocusableSelectionHandler, ObojoboDraft, Question, QuestionUtil, SelectableAnswerItem, StyleableText, TextGroup, TextGroupEl, selectionHandler;

	__webpack_require__(107);

	SelectableAnswerItem = __webpack_require__(49);

	QuestionUtil = __webpack_require__(48);

	ObojoboDraft = window.ObojoboDraft;

	TextGroup = ObojoboDraft.textGroup.TextGroup;

	TextGroupEl = ObojoboDraft.chunk.textChunk.TextGroupEl;

	StyleableText = ObojoboDraft.text.StyleableText;

	FocusableSelectionHandler = ObojoboDraft.chunk.focusableChunk.FocusableSelectionHandler;

	selectionHandler = new FocusableSelectionHandler();

	Question = React.createClass({
	  displayName: 'Question',

	  statics: {
	    type: 'ObojoboDraft.Chunks.MultipleChoiceQuestion',
	    register: function register() {
	      return OBO.registerChunk(Question);
	    },
	    getSelectionHandler: function getSelectionHandler(chunk) {
	      return selectionHandler;
	    },
	    createNewNodeData: function createNewNodeData() {
	      var group;
	      group = TextGroup.create(2e308, {
	        score: 0
	      });
	      group.first.text = new StyleableText();
	      group.add(new StyleableText(), {
	        score: 100
	      });
	      group.add(new StyleableText());
	      group.add(new StyleableText(), {
	        score: 0
	      });
	      group.add(new StyleableText());
	      return {
	        textGroup: group,
	        responseType: 'pick-one'
	      };
	    },
	    cloneNodeData: function cloneNodeData(data) {
	      var clone;
	      clone = data.textGroup.clone();
	      return {
	        textGroup: clone,
	        responseType: data.responseType
	      };
	    },
	    createNodeDataFromDescriptor: function createNodeDataFromDescriptor(descriptor) {
	      return {
	        textGroup: TextGroup.fromDescriptor(descriptor.content.textGroup, 2e308, {
	          score: 0
	        }),
	        responseType: descriptor.content.responseType
	      };
	    },
	    getDataDescriptor: function getDataDescriptor(chunk) {
	      var data;
	      data = chunk.componentContent;
	      return {
	        textGroup: data.textGroup.toDescriptor(),
	        responseType: data.responseType
	      };
	    }
	  },
	  getInitialState: function getInitialState() {
	    return {
	      selectedAnswers: []
	    };
	  },
	  onSelectAnswer: function onSelectAnswer(answerItem) {
	    var index;
	    this.props.chunk.markForUpdate();
	    index = this.state.selectedAnswers.indexOf(answerItem);
	    if (index > -1) {
	      this.state.selectedAnswers.splice(index, 1);
	    } else {
	      if (this.getPreviewInputType() === 'radio') {
	        this.state.selectedAnswers = [answerItem];
	      } else {
	        this.state.selectedAnswers.push(answerItem);
	      }
	    }
	    return this.setState({
	      selectedAnswers: this.state.selectedAnswers,
	      revealAll: false
	    });
	  },
	  clearAnswers: function clearAnswers() {
	    this.props.chunk.markForUpdate();
	    return this.setState({
	      selectedAnswers: [],
	      revealAll: false
	    });
	  },
	  getCorrectAnswers: function getCorrectAnswers() {
	    return QuestionUtil.getCorrectAnswers(this.props.chunk.componentContent.textGroup);
	  },
	  revealAll: function revealAll() {
	    this.props.chunk.markForUpdate();
	    return this.setState({
	      revealAll: true
	    });
	  },
	  getPreviewInputType: function getPreviewInputType() {
	    var data;
	    data = this.props.chunk.componentContent;
	    if (data.responseType === 'pick-one' || data.responseType === 'pick-one-multiple-correct') {
	      return 'radio';
	    }
	    return 'checkbox';
	  },
	  render: function render() {
	    var answer, answers, chunkIndex, completelyCorrect, correctAnswers, data, feedback, i, incorrect, inputType, instructions, isCorrect, j, k, l, len, len1, onSelectAnswer, questionText, ref, selectedAnswers, shouldPreventTab;
	    data = this.props.chunk.componentContent;
	    instructions = function () {
	      switch (data.responseType) {
	        case 'pick-one':
	          return 'Pick the correct answer';
	        case 'pick-one-multiple-correct':
	          return 'Pick a correct answer';
	        case 'pick-one-or-more':
	          return 'Pick all the correct answers';
	      }
	    }();
	    selectedAnswers = this.state.selectedAnswers;
	    onSelectAnswer = this.onSelectAnswer;
	    chunkIndex = this.props.chunk.get('index');
	    answers = [];
	    inputType = this.getPreviewInputType();
	    correctAnswers = this.getCorrectAnswers();
	    shouldPreventTab = this.props.shouldPreventTab;
	    questionText = data.textGroup.first.text;
	    if (questionText.length === 0) {
	      questionText = new StyleableText('Your question goes here? (Double click to edit)');
	    }
	    completelyCorrect = false;
	    incorrect = false;
	    if (selectedAnswers.length > 0) {
	      switch (inputType) {
	        case 'radio':
	          if (correctAnswers.indexOf(selectedAnswers[0]) > -1) {
	            completelyCorrect = true;
	          } else {
	            incorrect = true;
	          }
	          break;
	        case 'checkbox':
	          if (this.state.revealAll) {
	            completelyCorrect = true;
	            for (j = 0, len = selectedAnswers.length; j < len; j++) {
	              answer = selectedAnswers[j];
	              if (correctAnswers.indexOf(answer) === -1) {
	                completelyCorrect = false;
	                break;
	              }
	            }
	            for (k = 0, len1 = correctAnswers.length; k < len1; k++) {
	              answer = correctAnswers[k];
	              if (selectedAnswers.indexOf(answer) === -1) {
	                completelyCorrect = false;
	                break;
	              }
	            }
	            incorrect = !completelyCorrect;
	          }
	      }
	    }
	    for (i = l = 1, ref = data.textGroup.items.length; l < ref; i = l += 2) {
	      answer = data.textGroup.get(i);
	      feedback = data.textGroup.get(i + 1);
	      isCorrect = selectedAnswers.indexOf(answer) > -1;
	      answers.push(React.createElement(SelectableAnswerItem, {
	        key: i,
	        type: 'preview',
	        inputType: inputType,
	        answer: answer,
	        feedback: feedback,
	        chunkIndex: chunkIndex,
	        onSelect: onSelectAnswer,
	        open: inputType === 'radio' ? this.state.revealAll || isCorrect : this.state.revealAll,
	        checked: isCorrect,
	        shouldPreventTab: shouldPreventTab
	      }));
	    }
	    return React.createElement(
	      'div',
	      {
	        className: 'obojobo-draft--chunks--question viewer' + (completelyCorrect ? ' correct' : '') + (incorrect ? ' incorrect' : '') + (data.textGroup.first.text.length === 0 ? ' empty' : ' non-empty'),
	        ref: 'component'
	      },
	      React.createElement(
	        'div',
	        { className: 'question pad' },
	        React.createElement(
	          'div',
	          { className: 'input' },
	          React.createElement(TextGroupEl, { text: questionText, groupIndex: '0' })
	        )
	      ),
	      React.createElement(
	        'span',
	        { className: 'instructions pad' },
	        instructions,
	        ':'
	      ),
	      React.createElement(
	        'ul',
	        null,
	        answers,
	        React.createElement(
	          'li',
	          { className: 'answer blank pad', key: '-1' },
	          React.createElement(
	            'button',
	            {
	              onClick: this.revealAll,
	              className: 'button reveal-all',
	              disabled: this.state.revealAll,
	              tabIndex: shouldPreventTab ? '-1' : ''
	            },
	            data.responseType === 'pick-one-or-more' ? 'Check your answers' : 'Show All Answers'
	          ),
	          true ? React.createElement(
	            'div',
	            { className: 'container' },
	            React.createElement(
	              'span',
	              { className: 'divider' },
	              ' - '
	            ),
	            React.createElement(
	              'button',
	              {
	                onClick: this.clearAnswers,
	                className: 'button clear',
	                disabled: !(this.state.revealAll || selectedAnswers.length > 0),
	                tabIndex: shouldPreventTab ? '-1' : ''
	              },
	              'Reset'
	            )
	          ) : null
	        )
	      )
	    );
	  }
	});

	Question.register();

	module.exports = Question;

/***/ },

/***/ 107:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 173:
/***/ function(module, exports) {

	"use strict";

	var CommandHandler,
	    Editor,
	    ObojoboDraft,
	    TextGroupCommandHandler,
	    TextGroupSelection,
	    extend = function extend(child, parent) {
	  for (var key in parent) {
	    if (hasProp.call(parent, key)) child[key] = parent[key];
	  }function ctor() {
	    this.constructor = child;
	  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
	},
	    hasProp = {}.hasOwnProperty;

	Editor = window.Editor;

	ObojoboDraft = window.ObojoboDraft;

	TextGroupCommandHandler = Editor.chunk.textChunk.TextGroupCommandHandler;

	TextGroupSelection = ObojoboDraft.textGroup.TextGroupSelection;

	module.exports = CommandHandler = function (superClass) {
	  extend(CommandHandler, superClass);

	  function CommandHandler() {
	    return CommandHandler.__super__.constructor.apply(this, arguments);
	  }

	  CommandHandler.prototype.onSelectAll = function (selection, chunk) {
	    chunk.selectAll();
	    return true;
	  };

	  CommandHandler.prototype.split = function (selection, chunk) {
	    return false;
	  };

	  CommandHandler.prototype.splitText = function (selection, chunk, shiftKey) {
	    return false;
	  };

	  CommandHandler.prototype.deleteText = function (selection, chunk, deleteForwards) {
	    var tgs;
	    tgs = new TextGroupSelection(chunk, selection.virtual);
	    if (!deleteForwards && tgs.start.isTextStart) {
	      return false;
	    }
	    if (deleteForwards && tgs.start.isTextEnd) {
	      return false;
	    }
	    return CommandHandler.__super__.deleteText.call(this, selection, chunk, deleteForwards);
	  };

	  CommandHandler.prototype.paste = function (selection, chunk, text, html) {
	    this.insertText(selection, chunk, text);
	    return true;
	  };

	  CommandHandler.prototype.canMergeWith = function (selection, digestedChunk, consumerChunk) {
	    return false;
	  };

	  CommandHandler.prototype.canRemoveSibling = function (selection, sibling) {
	    return false;
	  };

	  CommandHandler.prototype.absorb = function (selection, consumerChunk, digestedChunk) {
	    return false;
	  };

	  return CommandHandler;
	}(TextGroupCommandHandler);

/***/ },

/***/ 174:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var Anchor, Chunk, DeleteButton, EditButton, Editor, FocusableChunk, Keyboard, NonEditableChunk, OBO, ObojoboDraft, Question, QuestionUtil, SelectableAnswerItem, StyleableText, TextCommandHandler, TextGroup, TextGroupEl, TextGroupSelection, TextSelectionHandler, ToggleCommandHandler, ToggleSelectionHandler, Viewer, commandHandler, selectionHandler;

	__webpack_require__(217);

	QuestionUtil = __webpack_require__(48);

	SelectableAnswerItem = __webpack_require__(49);

	Viewer = __webpack_require__(89);

	TextCommandHandler = __webpack_require__(173);

	TextSelectionHandler = __webpack_require__(175);

	ObojoboDraft = window.ObojoboDraft;

	OBO = window.OBO;

	StyleableText = ObojoboDraft.text.StyleableText;

	TextGroup = ObojoboDraft.textGroup.TextGroup;

	Chunk = ObojoboDraft.models.Chunk;

	TextGroupEl = ObojoboDraft.chunk.textChunk.TextGroupEl;

	NonEditableChunk = ObojoboDraft.chunk.NonEditableChunk;

	FocusableChunk = ObojoboDraft.chunk.FocusableChunk;

	Anchor = ObojoboDraft.components.Anchor;

	Keyboard = ObojoboDraft.page.Keyboard;

	EditButton = ObojoboDraft.components.EditButton;

	DeleteButton = ObojoboDraft.components.DeleteButton;

	TextGroupSelection = ObojoboDraft.textGroup.TextGroupSelection;

	Editor = window.Editor;

	ToggleCommandHandler = Editor.chunk.focusableChunk.ToggleCommandHandler;

	commandHandler = new ToggleCommandHandler(new TextCommandHandler());

	ToggleSelectionHandler = ObojoboDraft.chunk.focusableChunk.ToggleSelectionHandler;

	selectionHandler = new ToggleSelectionHandler(new TextSelectionHandler());

	Question = React.createClass({
	  displayName: 'Question',

	  statics: {
	    type: 'ObojoboDraft.Chunks.MultipleChoiceQuestion',
	    register: function register() {
	      return OBO.registerChunk(Question, {
	        insertItem: {
	          label: 'MC Question',
	          icon: __webpack_require__(251),
	          onInsert: ObojoboDraft.chunk.util.Insert
	        }
	      });
	    },
	    getCommandHandler: function getCommandHandler(chunk, selection) {
	      return commandHandler;
	    },
	    getSelectionHandler: function getSelectionHandler(chunk) {
	      return selectionHandler;
	    },
	    createNewNodeData: Viewer.createNewNodeData,
	    cloneNodeData: Viewer.cloneNodeData,
	    createNodeDataFromDescriptor: Viewer.createNodeDataFromDescriptor,
	    getDataDescriptor: Viewer.getDataDescriptor
	  },
	  getInitialState: function getInitialState() {
	    return {
	      selectedAnswers: []
	    };
	  },
	  deleteAnswer: function deleteAnswer(answerItem) {
	    var data, index;
	    this.props.chunk.markDirty();
	    data = this.props.chunk.componentContent;
	    index = data.textGroup.indexOf(answerItem);
	    data.textGroup.remove(index);
	    data.textGroup.remove(index);
	    return this.props.saveAndRenderModuleFn();
	  },
	  addAnswer: function addAnswer() {
	    this.props.chunk.componentContent.textGroup.add();
	    this.props.chunk.componentContent.textGroup.add();
	    this.props.chunk.markDirty();
	    return this.props.saveAndRenderModuleFn();
	  },
	  startEditing: function startEditing() {
	    return this.enableControls();
	  },
	  getCorrectAnswers: function getCorrectAnswers() {
	    var correct, j, len, ref, textItem;
	    correct = [];
	    ref = this.props.chunk.componentContent.textGroup.items;
	    for (j = 0, len = ref.length; j < len; j++) {
	      textItem = ref[j];
	      if (textItem.data.score && textItem.data.score === 100) {
	        correct.push(textItem);
	      }
	    }
	    return correct;
	  },
	  setCorrectAnswer: function setCorrectAnswer(answerItem) {
	    var correctAnswer, correctAnswers, j, len;
	    if (this.props.chunk.componentContent.responseType === 'pick-one') {
	      correctAnswers = this.getCorrectAnswers();
	      for (j = 0, len = correctAnswers.length; j < len; j++) {
	        correctAnswer = correctAnswers[j];
	        this.setIncorrectAnswer(correctAnswer);
	      }
	    }
	    answerItem.data.score = 100;
	    this.props.chunk.markDirty();
	    return this.props.saveAndRenderModuleFn();
	  },
	  setIncorrectAnswer: function setIncorrectAnswer(answerItem) {
	    console.log('setIncorrectAnswer', answerItem);
	    answerItem.data.score = 0;
	    this.props.chunk.markDirty();
	    return this.props.saveAndRenderModuleFn();
	  },
	  toggleCorrectAnswer: function toggleCorrectAnswer(answerItem) {
	    console.log('toggleCorrectAnswer', answerItem);
	    if (answerItem.data.score === 100) {
	      return this.setIncorrectAnswer(answerItem);
	    } else {
	      return this.setCorrectAnswer(answerItem);
	    }
	  },
	  onAnchorKeyDown: function onAnchorKeyDown(event) {
	    console.log('ON ANCHOR KEY DOWN', event.keyCode);
	    this.props.onKeyDownPutChunkOnClipboard(event, this.props.chunk);
	    if (event.keyCode === 13) {
	      event.preventDefault();
	      return this.startEditing();
	    }
	  },
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    if (nextProps.shouldPreventTab !== this.props.shouldPreventTab) {
	      this.props.chunk.markForUpdate();
	    }
	    if (nextProps.isEditing && !this.props.isEditing) {
	      this.props.chunk.markDirty();
	      return this.focusOnceEditing = true;
	    }
	  },
	  shouldComponentUpdate: function shouldComponentUpdate() {
	    return this.props.chunk.needsUpdate;
	  },
	  componentDidUpdate: function componentDidUpdate() {
	    console.log('###update');
	    this.props.chunk.markUpdated();
	    if (this.focusOnceEditing) {
	      delete this.focusOnceEditing;
	      TextGroupSelection.setCaretToTextEnd(this.props.chunk, 0, this.props.selection.virtual);
	      return this.props.saveAndRenderModuleFn();
	    }
	  },
	  enableControls: function enableControls() {
	    return this.props.editChunk(this.props.chunk, {
	      textControlsEnabled: true
	    });
	  },
	  disableControls: function disableControls() {
	    return this.props.editChunk(this.props.chunk);
	  },
	  setResponseType: function setResponseType(event) {
	    var answer, correctAnswers, j, len;
	    this.props.chunk.componentContent.responseType = event.target.value;
	    if (event.target.value === 'pick-one') {
	      correctAnswers = this.getCorrectAnswers();
	      correctAnswers.shift();
	      for (j = 0, len = correctAnswers.length; j < len; j++) {
	        answer = correctAnswers[j];
	        answer.data.score = 0;
	      }
	    }
	    this.props.chunk.markDirty();
	    return this.props.saveAndRenderModuleFn();
	  },
	  getEditorInputType: function getEditorInputType() {
	    var data;
	    data = this.props.chunk.componentContent;
	    if (data.responseType === 'pick-one') {
	      return 'radio';
	    }
	    return 'checkbox';
	  },
	  allowTab: function allowTab(event) {
	    if (event.keyCode === Keyboard.TAB) {
	      event.stopPropagation();
	      return false;
	    }
	    return true;
	  },
	  onDeleteButtonClick: function onDeleteButtonClick(event) {
	    var chunk;
	    chunk = this.props.chunk;
	    chunk.revert();
	    chunk.selectStart();
	    return this.props.saveAndRenderModuleFn();
	  },
	  render: function render() {
	    var data;
	    data = this.props.chunk.componentContent;
	    switch (this.props.isEditing) {
	      case true:
	        return this.renderEditor();
	      case false:
	        return this.renderPreview();
	    }
	  },
	  renderPreview: function renderPreview() {
	    var data;
	    data = this.props.chunk.componentContent;
	    return React.createElement(
	      FocusableChunk,
	      {
	        className: 'obojobo-draft--chunks--question preview outline-on-selection highlight-on-hover',
	        ref: 'component',
	        onKeyDown: this.onAnchorKeyDown,
	        onKeyUp: this.onAnchorKeyUp,
	        onDoubleClick: this.startEditing,
	        shouldPreventTab: this.props.shouldPreventTab
	      },
	      React.createElement(
	        'div',
	        null,
	        React.createElement(EditButton, { onClick: this.startEditing, shouldPreventTab: this.props.shouldPreventTab }),
	        React.createElement(Viewer, _extends({}, this.props, { ref: 'viewer' })),
	        React.createElement(DeleteButton, { onClick: this.onDeleteButtonClick })
	      )
	    );
	  },
	  renderEditor: function renderEditor() {
	    var allowTab, answer, answers, chunkIndex, correctAnswers, data, deleteAnswer, disableControls, enableControls, feedback, i, j, ref, setCorrectAnswer, toggleCorrectAnswer;
	    data = this.props.chunk.componentContent;
	    allowTab = this.allowTab;
	    deleteAnswer = this.deleteAnswer;
	    chunkIndex = this.props.chunk.get('index');
	    setCorrectAnswer = this.setCorrectAnswer;
	    enableControls = this.enableControls;
	    disableControls = this.disableControls;
	    toggleCorrectAnswer = this.toggleCorrectAnswer;
	    correctAnswers = this.getCorrectAnswers();
	    answers = [];
	    for (i = j = 1, ref = data.textGroup.items.length; j < ref; i = j += 2) {
	      answer = data.textGroup.get(i);
	      feedback = data.textGroup.get(i + 1);
	      answers.push(React.createElement(SelectableAnswerItem, {
	        key: i,
	        type: 'editor',
	        inputType: this.getEditorInputType(),
	        answer: answer,
	        feedback: feedback,
	        chunkIndex: chunkIndex,
	        checked: correctAnswers.indexOf(answer) > -1,
	        onSelect: toggleCorrectAnswer,
	        onDeleteAnswer: deleteAnswer,
	        onFocus: enableControls,
	        onBlur: disableControls,
	        onKeyDown: allowTab
	      }));
	    }
	    return React.createElement(
	      NonEditableChunk,
	      { className: 'obojobo-draft--chunks--question editor outline-on-selection', ref: 'component' },
	      React.createElement(
	        'div',
	        { className: 'question' },
	        React.createElement(
	          'div',
	          { className: 'input', contentEditable: 'true', suppressContentEditableWarning: true, onKeyDown: this.allowTab, onFocus: this.enableControls, onBlur: this.disableControls },
	          React.createElement(TextGroupEl, { text: data.textGroup.first.text, groupIndex: '0' })
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'question-type' },
	        React.createElement(
	          'span',
	          null,
	          'Response type:'
	        ),
	        React.createElement(
	          'select',
	          { onChange: this.setResponseType, value: data.responseType },
	          React.createElement(
	            'option',
	            { value: 'pick-one' },
	            'One correct answer - Student picks one'
	          ),
	          React.createElement(
	            'option',
	            { value: 'pick-one-multiple-correct' },
	            'Multiple correct answers - Student picks one'
	          ),
	          React.createElement(
	            'option',
	            { value: 'pick-one-or-more' },
	            'Multiple correct answers - Student picks all'
	          )
	        )
	      ),
	      React.createElement(
	        'ul',
	        null,
	        answers,
	        React.createElement(
	          'li',
	          { className: 'answer blank pad', key: '-1' },
	          React.createElement(
	            'button',
	            { onClick: this.addAnswer, className: 'button add-answer' },
	            '+ New Answer Choice'
	          )
	        )
	      )
	    );
	  }
	});

	Question.register();

	module.exports = Question;

/***/ },

/***/ 175:
/***/ function(module, exports) {

	'use strict';

	var ObojoboDraft,
	    SelectionHandler,
	    TextGroupSelection,
	    TextGroupSelectionHandler,
	    extend = function extend(child, parent) {
	  for (var key in parent) {
	    if (hasProp.call(parent, key)) child[key] = parent[key];
	  }function ctor() {
	    this.constructor = child;
	  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
	},
	    hasProp = {}.hasOwnProperty;

	ObojoboDraft = window.ObojoboDraft;

	TextGroupSelectionHandler = ObojoboDraft.chunk.textChunk.TextGroupSelectionHandler;

	TextGroupSelection = ObojoboDraft.textGroup.TextGroupSelection;

	module.exports = SelectionHandler = function (superClass) {
	  extend(SelectionHandler, superClass);

	  function SelectionHandler() {
	    return SelectionHandler.__super__.constructor.apply(this, arguments);
	  }

	  SelectionHandler.prototype.selectAll = function (selection, chunk) {
	    var tgs;
	    tgs = new TextGroupSelection(chunk, selection.virtual);
	    if (tgs.type !== 'multipleTextSpan') {
	      return tgs.selectText(tgs.start.groupIndex);
	    } else {
	      return tgs.selectGroup();
	    }
	  };

	  return SelectionHandler;
	}(TextGroupSelectionHandler);

/***/ },

/***/ 217:
107,

/***/ 251:
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3Csvg id='Layer_1' data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cdefs%3E%3Cstyle%3E.cls-2%7Bopacity:0.55;%7D%3C/style%3E%3C/defs%3E%3Cg id='Layer_6' data-name='Layer 6'%3E%3Cg class='cls-2'%3E%3Cpath d='M12.08,6.84A3.41,3.41,0,0,0,9.62,8.19a1,1,0,0,1-1.35.33L7.13,8a.82.82,0,0,1-.4-1.33,7.59,7.59,0,0,1,1.94-2.1,5.58,5.58,0,0,1,3.4-1.17,5.71,5.71,0,0,1,3.12.88A4.31,4.31,0,0,1,16.61,10,6.18,6.18,0,0,1,15,11.81a5.91,5.91,0,0,0-1.64,1.7c-.24.47-.35.89-1,.89H10.69c-.64,0-1-.16-1-.77,0-1.17,1-2.41,2.54-3.73l.4-.33a3.12,3.12,0,0,0,.88-1,1.08,1.08,0,0,0-.35-1.32A1.49,1.49,0,0,0,12.08,6.84ZM14,18.11a2.3,2.3,0,0,1-.68,1.63,2.26,2.26,0,0,1-1.66.69,2.34,2.34,0,0,1-2.32-2.32A2.27,2.27,0,0,1,10,16.45a2.33,2.33,0,0,1,4,1.66Z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"

/***/ }

/******/ })));