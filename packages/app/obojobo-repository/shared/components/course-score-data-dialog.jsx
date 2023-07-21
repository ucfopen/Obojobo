require('./course-score-data-dialog.scss')

const { CSSTransition } = require('react-transition-group')
const React = require('react')
const ModuleImage = require('./module-image')
const Button = require('./button')
const Loading = require('./loading')
const ReactModal = require('react-modal')
const dayjs = require('dayjs')
const CourseStats = require('./stats/course-stats')
const CourseScoreDataListItem = require('./course-score-data-list-item')
const CourseStatsTypeSelect = require('./stats/course-stats-type-select')
const CourseStatsFilterControls = require('./stats/course-stats-filter-controls')
const CourseStatsSearchControls = require('./stats/course-stats-search-controls')
const Search = require('./search')

const VIEW_MODE_FINAL_ASSESSMENT_SCORE = 'final-assessment-scores'

const CourseScoreDataDialog = ({ draftId, title, onClose, isCoursesLoading, courses }) => {
	// const [fetchUrl, setFetchUrl] = React.useState(null)
	const [selectedIndex, setSelectedIndex] = React.useState(null)
	const [selectedCourse, setSelectedCourse] = React.useState(null)
	const [courseIsLoading, setCourseIsLoading] = React.useState(false)
	const [courseHasLoaded, setCourseHasLoaded] = React.useState(false)
	const [courseData, setCourseData] = React.useState(null)
	const [isMenuOpen, setIsMenuOpen] = React.useState(true)
	const [courseSearch, setCourseSearch] = React.useState('')

	const [searchViewMode, setSearchViewMode] = React.useState(VIEW_MODE_FINAL_ASSESSMENT_SCORE)
	const [searchSettings, setSearchSettings] = React.useState('')
	const [searchContent, setSearchContent] = React.useState('')
	const [searchFilterSettings, setSearchFilterSettings] = React.useState({
		showIncompleteAttempts: false,
		showPreviewAttempts: false,
		showAdvancedFields: false
	})

	const baseUrl = `/api/assessments/${draftId}`
	const menuRef = React.createRef()

	const filterCourses = courses => {
		if (courseSearch.trim().length == 0) {
			return courses
		}
		// This turns the search string into an array of words.
		const lowerCaseArray = courseSearch
			.trim()
			.toLowerCase()
			.split(' ')
		return courses.filter(course => {
			const haystack = course.contextTitle.toLowerCase() + course.contextLabel.toLowerCase()

			// If each word in the search can be found in the course title and label, return true
			let containsAll = true
			lowerCaseArray.forEach(word => {
				if (!haystack.includes(word)) {
					containsAll = false
				}
			})
			return containsAll
		})
	}

	const filteredCourses = filterCourses(courses)

	const selectCourse = async contextId => {
		if (selectedCourse == contextId) {
			return
		}
		setCourseData(null)
		setCourseIsLoading(true)
		setCourseHasLoaded(false)
		filteredCourses.forEach(course => {
			if (course.contextId == contextId) {
				setSelectedCourse(course)
			}
		})

		const newFetchUrl = `${baseUrl}/course/${contextId}/details`
		setSelectedIndex(contextId)
		const courseData = await runFetch(newFetchUrl)
		loadCourseData(courseData)
	}

	const runFetch = fetchUrl => {
		return fetch(fetchUrl, {})
			.then(res => res.json())
			.then(res => res.value)
	}

	const loadCourseData = courseData => {
		setCourseData(courseData)
		setCourseIsLoading(false)
		setCourseHasLoaded(true)
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
							<div>Available Courses</div>
							<div className="desc">Recently Accessed First</div>
							<div className="course-search">
								<Search
									onChange={setCourseSearch}
									focusOnMount={false}
									placeholder="Search..."
									value={courseSearch}
								/>
							</div>
							{renderMenuToggleButton()}
						</div>
						{filteredCourses.length === 0 ? (
							<div className="no-courses-text">No Courses Found</div>
						) : (
							''
						)}
						{filteredCourses.map(course => (
							<CourseScoreDataListItem
								courseTitle={course.contextTitle}
								courseLabel={course.contextLabel}
								courseUserCount={parseInt(course.userCount)}
								courseLastAccessed={dayjs(course.lastAccessed).format('MMM Do YYYY - h:mm A')}
								courseClick={selectCourse}
								isSelected={selectedIndex === course.contextId}
								index={course.contextId}
								key={course.contextId}
							/>
						))}
					</div>
					<div className="menu-collapsed">{renderMenuToggleButton()}</div>
				</div>
			</CSSTransition>
		)
	}

	const changeViewMode = mode => {
		setSearchViewMode(mode)
	}

	const validCourseSelected = selectedIndex !== null
	const currentCourseTitle =
		validCourseSelected && selectedCourse
			? `${selectedCourse.contextTitle} (${selectedCourse.contextLabel})`
			: 'Select a Course to View Assessment Data'
	const currentCourseAccessed =
		validCourseSelected && selectedCourse
			? `Last Accessed ${dayjs(selectedCourse.lastAccessed).format('MMM Do YYYY - h:mm A')}`
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
				<Loading isLoading={isCoursesLoading} loadingText={'Loading courses...'}>
					{renderCourseMenu()}

					{validCourseSelected ? (
						<div className="data-viewer">
							<div className="data-viewer--header">
								<div className="data-viewer--header--title-container">
									<div className="data-viewer--header--title">{currentCourseTitle}</div>
									<small>{currentCourseAccessed}</small>
								</div>
								<div className="data-viewer--header--filter-container">
									<CourseStatsSearchControls
										searchSettings={searchSettings}
										onChangeSearchSettings={setSearchSettings}
										onChangeSearchContent={setSearchContent}
									/>
								</div>
							</div>
							<div className="data-viewer--filter-controls">
								<CourseStatsTypeSelect
									viewMode={searchViewMode}
									onChangeViewMode={changeViewMode}
								/>
								<CourseStatsFilterControls
									filterSettings={searchFilterSettings}
									onChangeFilterSettings={setSearchFilterSettings}
								/>
							</div>
							{courseHasLoaded ? (
								<CourseStats
									attempts={courseData}
									viewMode={searchViewMode}
									searchSettings={searchSettings}
									searchContent={searchContent}
									filterSettings={searchFilterSettings}
								/>
							) : (
								<div className="text-loader">
									{!courseIsLoading ? '' : 'Loading course data...'}
								</div>
							)}
						</div>
					) : (
						<div className="text-loader">Select a Course to View Assessment Data</div>
					)}
				</Loading>
			</div>
		</div>
	)
}

module.exports = CourseScoreDataDialog
