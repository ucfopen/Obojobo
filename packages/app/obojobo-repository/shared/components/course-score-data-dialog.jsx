require('./course-score-data-dialog.scss')

// const React = require('react')
// const ModuleImage = require('./module-image')
// const Button = require('./button')
// const Loading = require('./loading')
// const CourseStats = require('./stats/course-stats')
// const AssessmentStats = require('./stats/assessment-stats')

const { CSSTransition } = require('react-transition-group')
const React = require('react')
const ModuleImage = require('./module-image')
const Button = require('./button')
const Loading = require('./loading')
const { urlForEditor } = require('../repository-utils')
const ReactModal = require('react-modal')
const CourseScoreDataListItem = require('./course-score-data-list-item')
const dayjs = require('dayjs')

// { draftId, title, onClose, isCoursesLoading, courses }

// const CourseScoreDataDialog = ({ draftId, title, onClose, isCoursesLoading, courses }) => {
// 	return (
// 		<div className="assessment-score-data-dialog">
// 			<div className="assessment-score-data-dialog--header">
// 				<ModuleImage id={draftId} />
// 				<div className="title">{title}</div>
// 				<Button className="close-button" onClick={onClose} ariaLabel="Close dialog">
// 					×
// 				</Button>
// 			</div>
// 			<div className="assessment-score-data-dialog--body">
// 				<Loading isLoading={isCoursesLoading} loadingText={'Loading course data...'}>
// 					{<CourseStats courses={courses} /> }
// 				</Loading>
// 			</div>
// 		</div>
// 	)
// }

class CourseScoreDataDialog extends React.Component {
	constructor(props) {
		super(props)

		this.baseUrl = `/api/assessments/${props.draftId}` // `${urlForEditor(props.editor, props.draftId)}`

		this.state = {
			isMenuOpen: true,
			isConfirmDialogOpen: false,
			isLockDialogOpen: false,
			isErrorDialogOpen: false,
			editorUrl: null,
			selectedIndex: -1
		}

		this.selectCourse = this.selectCourse.bind(this)
		this.toggleMenu = this.toggleMenu.bind(this)
		this.openConfirmDialog = this.openConfirmDialog.bind(this)
		this.closeConfirmDialog = this.closeConfirmDialog.bind(this)
		this.openErrorDialog = this.openErrorDialog.bind(this)
		this.closeErrorDialog = this.closeErrorDialog.bind(this)

		this.menuRef = React.createRef()
	}

	componentDidUpdate(prevProps) {
		// When the list goes from empty to not-empty, we may choose to load the most recent data.
		// if (!prevProps.courses.length && this.props.courses.length) {
		// 	this.selectCourse(0)
		// }
	}

	editUrlForItem(index) {
		return  `${this.baseUrl}/course/${this.props.courses[index].contextId}/details`
	}

	selectCourse(index) {
		this.setState({ editorUrl: this.editUrlForItem(index) })
		this.setState({ selectedIndex: index })

		// TODO: Get the data!!!
	}

	toggleMenu() {
		this.setState({ isMenuOpen: !this.state.isMenuOpen })
	}

	openConfirmDialog() {
		this.setState({ isConfirmDialogOpen: true })
	}

	closeConfirmDialog() {
		this.setState({ isConfirmDialogOpen: false })
	}

	openErrorDialog() {
		this.setState({ isErrorDialogOpen: true })
	}

	closeErrorDialog() {
		this.setState({ isErrorDialogOpen: false })
	}

	renderMenuToggleButton() {
		return (
			<button className="toggle-button" onClick={this.toggleMenu}>
				Toggle Navigation Menu
			</button>
		)
	}

	renderCourseMenu() {
		return (
			<CSSTransition timeout={250} in={this.state.isMenuOpen}>
				<div className="course-score-data-list" ref={this.menuRef}>
					<div className="menu-expanded">
						<div className="course-score-data-list--title">
							<div>Select a Course</div>
							<div className="desc">Recently Accessed First</div>
							{this.renderMenuToggleButton()}
						</div>
						{this.props.courses.map((course, index) => (
							<CourseScoreDataListItem
								courseTitle={course.contextTitle}
								courseLabel={course.contextLabel}
								courseUserCount={parseInt(course.userCount)}
								courseLastAccessed={dayjs(course.lastAccessed).format('MMM Do YYYY - h:mm A')}
								onClick={this.selectCourse}
								isSelected={this.state.selectedIndex === index}
								index={index}
							/>
						))}
					</div>
					<div className="menu-collapsed">{this.renderMenuToggleButton()}</div>
				</div>
			</CSSTransition>
		)
	}

	render() {
		const validCourseSelected = this.state.selectedIndex > -1 && this.state.selectedIndex < this.props.courses.length
		const currentCourseTitle = validCourseSelected
			? `${this.props.courses[this.state.selectedIndex].contextTitle} (${this.props.courses[this.state.selectedIndex].contextLabel})`
			: 'Select a Course to View Assessment Data'
		const currentCourseAccessed = validCourseSelected
			? `Last Accessed ${dayjs(this.props.courses[this.state.selectedIndex].lastAccessed).format('MMM Do YYYY - h:mm A')}`
			: ''

		return (
			<div className="course-score-data-dialog">
				<div className="course-score-data-dialog--header">
					<ModuleImage id={this.props.draftId} />
					<div className="title">{this.props.title}</div>
					<Button className="close-button" onClick={this.props.onClose} ariaLabel="Close dialog">
						×
					</Button>
				</div>
				<div className="course-score-data-dialog--body">
					<Loading
						isLoading={this.props.isCoursesLoading}
						loadingText={'Loading courses...'}
					>
						{this.renderCourseMenu()}
						<div className="data-viewer">
							<div className="data-viewer--header">
								<span>{currentCourseTitle}</span>
								{ validCourseSelected ? (<small>{currentCourseAccessed}</small>) : ''}
							</div>
							<iframe src={this.state.editorUrl} frameBorder="0" loading="lazy" />
						</div>
					</Loading>
				</div>
			</div>
		)
	}
}

module.exports = CourseScoreDataDialog
