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

	module.exports = __webpack_require__(89);


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

/***/ }

/******/ });