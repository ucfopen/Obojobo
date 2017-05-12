let Adapter = {
	construct(model, attrs) {
		// choose: How many "groups" in the QuestionBank to display
		// groupSize: The number of items in a "group"
		// select: One of the following
		//	* sequential: Select groups in document order
		//	* random-unseen: Select groups at random. Additional attempts select previously unselected items
		//	* random-all: Select groups at random. Additional attempts may select the same questions
		// shuffleGroup: If true the items in a group are shuffled randomly, otherwise they are presented in document order
		// resetWhenEmpty: If true the saved state of an assessment will be cleared when the assessment has no more questions to show (i.e. Sequential banks start back at the first question, random banks being selecting seen questions, etc)
		if (__guard__(attrs != null ? attrs.content : undefined, x => x.choose) != null) {
			model.modelState.choose = attrs.content.choose;
		} else {
			model.modelState.choose = Infinity;
		}

		if (__guard__(attrs != null ? attrs.content : undefined, x1 => x1.groupSize) != null) {
			model.modelState.groupSize = attrs.content.groupSize;
		} else {
			model.modelState.groupSize = 1;
		}

		if (__guard__(attrs != null ? attrs.content : undefined, x2 => x2.select) != null) {
			model.modelState.select = attrs.content.select;
		} else {
			model.modelState.select = "sequential"; //random-unseen | random-all | sequential
		}

		if (__guard__(attrs != null ? attrs.content : undefined, x3 => x3.shuffleGroup) != null) {
			return model.modelState.shuffleGroup = attrs.content.shuffleGroup;
		} else {
			return model.modelState.shuffleGroup = false;
		}
	},

		// if attrs?.content?.resetWhenEmpty?
		// 	model.modelState.resetWhenEmpty = attrs.content.resetWhenEmpty
		// else
		// 	model.modelState.resetWhenEmpty = true

	clone(model, clone) {
		clone.modelState.choose         = model.modelState.choose;
		clone.modelState.groupSize      = model.modelState.groupSize;
		clone.modelState.select         = model.modelState.select;
		return clone.modelState.resetWhenEmpty = model.modelState.resetWhenEmpty;
	},

	toJSON(model, json) {
		json.content.choose         = model.modelState.choose;
		json.content.groupSize      = model.modelState.groupSize;
		json.content.select         = model.modelState.select;
		return json.content.resetWhenEmpty = model.modelState.resetWhenEmpty;
	}
};


export default Adapter;
function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}