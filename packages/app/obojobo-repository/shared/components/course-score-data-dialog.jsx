require('./course-score-data-dialog.scss')

const { CSSTransition } = require('react-transition-group')
const { useState, useEffect, createRef } = require('react')
const ModuleImage = require('./module-image')
const Button = require('./button')
const Loading = require('./loading')
const ReactModal = require('react-modal')
const CourseScoreDataListItem = require('./course-score-data-list-item')
const dayjs = require('dayjs')
const CourseStats = require('./stats/course-stats')
const AssessmentStatsFilterControls = require('./stats/assessment-stats-filter-controls')
const AssessmentStatsSearchControls = require('./stats/assessment-stats-search-controls')
const Search = require('./search')

const VIEW_MODE_FINAL_ASSESSMENT_SCORE = 'final-assessment-scores'
const VIEW_MODE_ALL_ATTEMPTS = 'all-attempts'

const CourseScoreDataDialog = ({ draftId, title, onClose, isCoursesLoading, hasCoursesLoaded, courses }) => {

	const [fetchUrl, setFetchUrl] = useState(null)
	const [selectedIndex, setSelectedIndex] = useState(null)
	const [selectedCourse, setSelectedCourse] = useState(null)
	const [courseIsLoading, setCourseIsLoading] = useState(false)
	const [courseHasLoaded, setCourseHasLoaded] = useState(false)
	const [courseData, setCourseData] = useState(null)
	const [isMenuOpen, setIsMenuOpen] = useState(true)
	const [courseSearch, setCourseSearch] = useState('')

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
			})
	}, [fetchUrl])

	const filterCourses = (courses) => {
		if(courseSearch.trim().length == 0) {
			return courses
		}
		const lowerCaseSearch = courseSearch.trim().toLowerCase()
		return courses.filter(
			course => 
				(course.contextTitle.toLowerCase().includes(lowerCaseSearch)) ||
				(course.contextLabel.toLowerCase().includes(lowerCaseSearch))
		)
	}

	const filteredCourses = filterCourses(courses)

	const selectCourse = (contextId) => {
		setCourseData(null)
		setCourseIsLoading(true)
		setCourseHasLoaded(false)
		filteredCourses.forEach(course => {
			if(course.contextId == contextId){
				setSelectedCourse(course)
			}
		})

		const newFetchUrl = `${baseUrl}/course/${contextId}/details`
		setSelectedIndex(contextId)
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
							<div>Available Courses</div>
							<div className="desc">Recently Accessed First</div>
							<div className="course-search">
								<Search
									onChange={setCourseSearch}
									focusOnMount={true}
									placeholder="Search..."
									value={courseSearch}
								/>
							</div>
							{renderMenuToggleButton()}
						</div>
						{filteredCourses.map((course) => (
							<CourseScoreDataListItem
								courseTitle={course.contextTitle}
								courseLabel={course.contextLabel}
								courseUserCount={parseInt(course.userCount)}
								courseLastAccessed={dayjs(course.lastAccessed).format('MMM Do YYYY - h:mm A')}
								onClick={selectCourse}
								isSelected={selectedIndex === course.contextId}
								index={course.contextId}
							/>
						))}
					</div>
					<div className="menu-collapsed">{renderMenuToggleButton()}</div>
				</div>
			</CSSTransition>
		)
	}

	const onChangeViewMode = event => {
		setSearchViewMode(event.target.value)
	}

	const renderModeSelection = () => {
		return (
			<label className="view-mode">
				Show: 
				<select onChange={onChangeViewMode} value={searchViewMode}>
					<option value={VIEW_MODE_FINAL_ASSESSMENT_SCORE}>Final Assessment Scores</option>
					<option value={VIEW_MODE_ALL_ATTEMPTS}>All Attempt Scores</option>
				</select>
			</label>
		)
	}

	const validCourseSelected = selectedIndex !== null
	const currentCourseTitle = validCourseSelected && selectedCourse
		? `${selectedCourse.contextTitle} (${selectedCourse.contextLabel})`
		: 'Select a Course to View Assessment Data'
	const currentCourseAccessed = validCourseSelected && selectedCourse
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
				<Loading
					isLoading={isCoursesLoading}
					loadingText={'Loading courses...'}
				>
					{renderCourseMenu()}

					{ validCourseSelected ? (
					<div className="data-viewer">
						<div className="data-viewer--header">
							<div className="data-viewer--header--title-container">
								<div className="data-viewer--header--title">
									{currentCourseTitle}
								</div>
								{ validCourseSelected ? (<small>{currentCourseAccessed}</small>) : ''}
							</div>
							{ validCourseSelected ? 
								( <div className="data-viewer--header--filter-container">
									<AssessmentStatsSearchControls
										onChangeSearchSettings={setSearchSettings}
										onChangeSearchContent={setSearchContent}
									/>
								</div> ) : ''}
						</div>
						<div className="data-viewer--filter-controls">
							{renderModeSelection()}
							<AssessmentStatsFilterControls
								filterSettings={searchFilterSettings}
								onChangeFilterSettings={setSearchFilterSettings}
							/>
						</div>
						{ courseHasLoaded ? (
							<CourseStats
								attempts={courseData}
								viewMode={searchViewMode}
								searchSettings={searchSettings}
								searchContent={searchContent}
								filterSettings={searchFilterSettings}
							/>
						) : (<div className="text-loader">{!courseIsLoading ? '' : 'Loading course data...'}</div>)}
					</div>
					) :
					(<div className="text-loader">Select a Course to View Assessment Data</div>)}
				</Loading>
			</div>
		</div>
	)
}

module.exports = CourseScoreDataDialog
