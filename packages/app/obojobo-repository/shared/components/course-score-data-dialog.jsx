require('./course-score-data-dialog.scss')

// const React = require('react')
// const ModuleImage = require('./module-image')
// const Button = require('./button')
// const Loading = require('./loading')
// const CourseStats = require('./stats/course-stats')
const AssessmentStats = require('./stats/assessment-stats')

const { CSSTransition } = require('react-transition-group')
const { useState, useEffect, createRef } = require('react')
const ModuleImage = require('./module-image')
const Button = require('./button')
const Loading = require('./loading')
const ReactModal = require('react-modal')
const CourseScoreDataListItem = require('./course-score-data-list-item')
const dayjs = require('dayjs')
const CourseStats = require('./stats/course-stats')
const { useStore } = require('react-redux')
const AssessmentStatsFilterControls = require('./stats/assessment-stats-filter-controls')
const AssessmentStatsSearchControls = require('./stats/assessment-stats-search-controls')

const VIEW_MODE_FINAL_ASSESSMENT_SCORE = 'final-assessment-scores'
const VIEW_MODE_ALL_ATTEMPTS = 'all-attempts'

const CourseScoreDataDialog = ({ draftId, title, onClose, isCoursesLoading, hasCoursesLoaded, courses }) => {

	const [fetchUrl, setFetchUrl] = useState(null)
	const [selectedIndex, setSelectedIndex] = useState(-1)
	const [courseIsLoading, setCourseIsLoading] = useState(false)
	const [courseHasLoaded, setCourseHasLoaded] = useState(false)
	const [courseData, setCourseData] = useState(null)
	const [isMenuOpen, setIsMenuOpen] = useState(true)

	const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(true)
	const [searchViewMode, setSearchViewMode] = useState(VIEW_MODE_FINAL_ASSESSMENT_SCORE)
	const [searchSettings, setSearchSettings] = useState('')
	const [searchContent, setSearchContent] = useState('')
	const [searchFilterSettings, setSearchFilterSettings] = useState({ 
		showIncompleteAttempts: false,
		showPreviewAttempts: false,
		showAdvancedFields: false
	})

	const baseUrl = `/api/assessments/${draftId}`
	const menuRef = createRef()

	// When the fetchUrl changes, fetch the data from that URL and save it to courseData.
	useEffect(() => {
		if(!fetchUrl) { return }
		fetch(fetchUrl, {})
			.then(res => res.json())
			.then(res => {
				setCourseData(res.value)
				setCourseIsLoading(false)
				setCourseHasLoaded(true)
				console.log(res.value)
			})
	}, [fetchUrl])

	const selectCourse = (index) => {
		setCourseData(null)
		setCourseIsLoading(true)
		setCourseHasLoaded(false)

		const newFetchUrl = `${baseUrl}/course/${courses[index].contextId}/details`
		console.log(newFetchUrl)
		setSelectedIndex(index)
		setFetchUrl(newFetchUrl)
	}

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}

	const renderMenuToggleButton = () => {
		return (
			<button className="toggle-button" onClick={toggleMenu}>
				Toggle Navigation Menu
			</button>
		)
	}

	const renderCourseMenu = () => {
		return (
			<CSSTransition timeout={250} in={isMenuOpen}>
				<div className="course-score-data-list" ref={menuRef}>
					<div className="menu-expanded">
						<div className="course-score-data-list--title">
							<div>Select a Course</div>
							<div className="desc">Recently Accessed First</div>
							{renderMenuToggleButton()}
						</div>
						{courses.map((course, index) => (
							<CourseScoreDataListItem
								courseTitle={course.contextTitle}
								courseLabel={course.contextLabel}
								courseUserCount={parseInt(course.userCount)}
								courseLastAccessed={dayjs(course.lastAccessed).format('MMM Do YYYY - h:mm A')}
								onClick={selectCourse}
								isSelected={selectedIndex === index}
								index={index}
							/>
						))}
					</div>
					{renderAdvancedSearchOptions()}
					<div className="menu-collapsed">{renderMenuToggleButton()}</div>
				</div>
			</CSSTransition>
		)
	}

	const onChangeViewMode = event => {
		setSearchViewMode(event.target.value)
	}

	const renderAdvancedSearchOptions = () => {
		return (
			<div className="assessment-advanced-search-container">
				<div className="settings">
					<label className="view-mode">
						<span>Showing:</span>

						<select onChange={onChangeViewMode} value={searchViewMode}>
							<option value={VIEW_MODE_FINAL_ASSESSMENT_SCORE}>Final Assessment Scores</option>
							<option value={VIEW_MODE_ALL_ATTEMPTS}>All Attempt Scores</option>
						</select>
					</label>
					<hr />
					<div className="filters">
						<AssessmentStatsSearchControls
							onChangeSearchSettings={setSearchSettings}
							onChangeSearchContent={setSearchContent}
						/>
						<hr />
						<AssessmentStatsFilterControls
							filterSettings={searchFilterSettings}
							onChangeFilterSettings={setSearchFilterSettings}
						/>
					</div>
				</div>
			</div>
		)
	}

	const validCourseSelected = selectedIndex > -1 && selectedIndex < courses.length
	const currentCourseTitle = validCourseSelected
		? `${courses[selectedIndex].contextTitle} (${courses[selectedIndex].contextLabel})`
		: 'Select a Course to View Assessment Data'
	const currentCourseAccessed = validCourseSelected
		? `Last Accessed ${dayjs(courses[selectedIndex].lastAccessed).format('MMM Do YYYY - h:mm A')}`
		: ''

	return (
		<div className="course-score-data-dialog">
			<div className="course-score-data-dialog--header">
				<ModuleImage id={draftId} />
				<div className="title">{title}</div>
				<Button className="close-button" onClick={onClose} ariaLabel="Close dialog">
					×
				</Button>
			</div>
			<div className="course-score-data-dialog--body">
				<Loading
					isLoading={isCoursesLoading}
					loadingText={'Loading courses...'}
				>
					{renderCourseMenu()}
					<div className="data-viewer">
						<div className="data-viewer--header">
							<span>{currentCourseTitle}</span>
							{ validCourseSelected ? (<small>{currentCourseAccessed}</small>) : ''}
						</div>
						{ !courseHasLoaded ? 
							(!courseIsLoading ? 'Pick something...' : 'Loading course...') :
							<CourseStats
								attempts={courseData}
								viewMode={searchViewMode}
								searchSettings={searchSettings}
								searchContent={searchContent}
								filterSettings={searchFilterSettings}
							/>
						}
					</div>
				</Loading>
			</div>
		</div>
	)
}

module.exports = CourseScoreDataDialog
