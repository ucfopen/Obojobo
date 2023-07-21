import React from 'react'
import Loading from './loading'
import { act, create } from 'react-test-renderer'
import CourseScoreDataDialog from './course-score-data-dialog'
import CourseScoreDataListItem from './course-score-data-list-item'
import CourseStatsTypeSelect from './stats/course-stats-type-select'

const VIEW_MODE_FINAL_ASSESSMENT_SCORE = 'final-assessment-scores'
const VIEW_MODE_ALL_ATTEMPTS = 'all-attempts'

jest.mock('./stats/course-stats', () => props => {
	return <mock-CourseStats {...props} />
})

jest.mock('react-transition-group', () => ({
	// eslint-disable-next-line react/display-name
	CSSTransition: props => <mock-CSSTransition {...props}>{props.children}</mock-CSSTransition>
}))

describe('CourseScoreDataDialog', () => {
	const originalFetch = global.fetch

	const dialogProps = () => ({
		draftId: 'mock-draft-id',
		title: 'mock-title',
		onClose: jest.fn(),
		isCoursesLoading: true,
		courses: []
	})

	const courses = [
		{
			contextTitle: 'Mock Course 1',
			contextLabel: 'mock-course-1',
			userCount: '10',
			lastAccessed: '2023-06-21 13:33:03.34966+00',
			contextId: 'S3294471'
		},
		{
			contextTitle: 'Mock Course 2',
			contextLabel: 'mock-course-2',
			userCount: '200',
			lastAccessed: '2023-06-22 14:33:03.34966+00',
			contextId: 'S3294472'
		},
		{
			contextTitle: 'Mock Course 3',
			contextLabel: 'mock-course-3',
			userCount: '3000',
			lastAccessed: '2023-06-23 15:33:03.34966+00',
			contextId: 'S3294473'
		}
	]

	beforeEach(() => {
		jest.resetAllMocks()

		global.fetch = jest.fn()
	})

	afterAll(() => {
		global.fetch = originalFetch
	})

	test('Modal renders correctly when history is loading', () => {
		const component = create(<CourseScoreDataDialog {...dialogProps()} />)

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('Modal renders correctly when no course data', () => {
		const component = create(<CourseScoreDataDialog {...dialogProps()} isCoursesLoading={false} />)

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('Modal renders correctly with courses', () => {
		const component = create(
			<CourseScoreDataDialog {...dialogProps()} isCoursesLoading={false} courses={courses} />
		)

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('Modal - clicking the close button calls onClose', () => {
		const onClose = jest.fn()
		const component = create(<CourseScoreDataDialog {...dialogProps()} onClose={onClose} />)

		expect(onClose).not.toHaveBeenCalled()
		component.root
			.findByProps({ className: 'close-button' })
			.props.onClick({ target: 'mock-target' })
		expect(onClose).toHaveBeenCalledWith({ target: 'mock-target' })
	})

	describe('CourseMenu', () => {
		beforeEach(() => {
			jest.resetAllMocks()
		})

		const assignments = [
			{
				user_username: 'sis:tstlearner15',
				user_first_name: 'Test4',
				user_last_name: 'Learner4',
				user_roles: '{Learner}',
				assessment_score_id: 13,
				user_id: 15,
				draft_id: 'ff85b3d8-a6c8-4446-a25a-bf0c16d5a8b9',
				assessment_id: 'my-assessment',
				attempt_id: '33d4335b-48fb-4897-aedd-7e6abc17e3fb',
				assessment_score: 100,
				is_preview: false,
				assessment_score_details: {
					status: 'passed',
					rewardTotal: 0,
					attemptScore: 100,
					rewardedMods: [],
					attemptNumber: 1,
					assessmentScore: 100,
					assessmentModdedScore: 100
				},
				draft_content_id: '8d108c19-4f67-4237-a78d-c9827af4053e',
				is_imported: false,
				imported_assessment_score_id: null,
				attempt_state: {
					chosen: [
						{
							id: 'e32101dd-8f0e-4bec-b519-968270efb426',
							type: 'ObojoboDraft.Chunks.Question'
						},
						{
							id: 'f1ebeb0e-606f-4d1e-b8b9-2ba4fbfbfa0f',
							type: 'ObojoboDraft.Chunks.Question'
						},
						{
							id: 'fa4c4db0-30f1-4386-9ce9-956aaf228378',
							type: 'ObojoboDraft.Chunks.Question'
						},
						{
							id: '5345c7c6-ac69-4e9f-80da-6037765fa612',
							type: 'ObojoboDraft.Chunks.QuestionBank'
						},
						{
							id: 'af4ea08a-e488-4156-a2a0-c0f9a64c58eb',
							type: 'ObojoboDraft.Chunks.QuestionBank'
						}
					]
				},
				attempt_result: {
					attemptScore: 100,
					questionScores: [
						{
							id: 'e32101dd-8f0e-4bec-b519-968270efb426',
							score: 100
						},
						{
							id: 'f1ebeb0e-606f-4d1e-b8b9-2ba4fbfbfa0f',
							score: 100
						},
						{
							id: 'fa4c4db0-30f1-4386-9ce9-956aaf228378',
							score: 100
						}
					]
				},
				created_at: '2023-06-20 14:32:55.07198+00',
				completed_at: '2023-06-20 14:33:03.34966+00',
				resource_link_id: 'course_3',
				imported_attempt_id: null,
				lti_status: 'success',
				lti_status_details: null,
				lti_gradebook_status: 'ok_gradebook_matches_assessment_score',
				lti_score_sent: 1,
				context_id: 'S3294478',
				course_title: 'Obojobo Local Dev 103',
				resource_link_title: null,
				launch_presentation_return_url: null,
				module_title: 'Obojobo Example Document Copy'
			}
		]

		test('Menu renders correctly with courses', () => {
			const component = create(
				<CourseScoreDataDialog {...dialogProps()} isCoursesLoading={false} courses={courses} />
			)

			expect(
				component.root.findAllByProps({ className: 'course-score-data-list--item' }).length
			).toBe(3)
			const tree = component.toJSON()
			expect(tree).toMatchSnapshot()
		})

		test('Menu filters correctly with text that matches all items', () => {
			const component = create(
				<CourseScoreDataDialog {...dialogProps()} isCoursesLoading={false} courses={courses} />
			)

			const courseSearch = component.root
				.findAllByProps({ className: 'course-search' })[0]
				.findByType('input')
			// execute
			act(() => {
				const mockChangeEvent = { target: { value: 'mock' } }
				courseSearch.props.onChange(mockChangeEvent)
			})
			expect(
				component.root.findAllByProps({ className: 'course-score-data-list--item' }).length
			).toBe(3)
		})

		test('Menu filters correctly with text that matches no items', () => {
			const component = create(
				<CourseScoreDataDialog {...dialogProps()} isCoursesLoading={false} courses={courses} />
			)

			const courseSearch = component.root
				.findAllByProps({ className: 'course-search' })[0]
				.findByType('input')
			// execute
			act(() => {
				const mockChangeEvent = { target: { value: 'unused-mock' } }
				courseSearch.props.onChange(mockChangeEvent)
			})
			expect(
				component.root.findAllByProps({ className: 'course-score-data-list--item' }).length
			).toBe(0)
		})

		test('Menu filters correctly with text that matches some items', () => {
			const component = create(
				<CourseScoreDataDialog {...dialogProps()} isCoursesLoading={false} courses={courses} />
			)

			const courseSearch = component.root
				.findAllByProps({ className: 'course-search' })[0]
				.findByType('input')
			// execute
			act(() => {
				const mockChangeEvent = { target: { value: 'mock-course-3' } }
				courseSearch.props.onChange(mockChangeEvent)
			})
			expect(
				component.root.findAllByProps({ className: 'course-score-data-list--item' }).length
			).toBe(1)
		})

		test('Menu hides and expands correctly', () => {
			const componentTemplate = (
				<CourseScoreDataDialog {...dialogProps()} isCoursesLoading={false} courses={courses} />
			)

			let component
			act(() => {
				component = create(componentTemplate)
			})

			// The menu starts out open (prop: in == true)
			expect(component.root.findByType(Loading).children[0].props.in).toBe(true)

			// component.root.toggleMenu = jest.fn()
			// const toggleButtons = component.root.findAllByProps({ className: 'toggle-button' })
			// toggleButtons[0].props.onClick()
			const courseList = component.root.findByProps({ className: 'course-score-data-list' })
			const toggleButtons = courseList.findAllByType('button')

			act(() => {
				toggleButtons[0].props.onClick()
				component.update(componentTemplate)
			})
			expect(component.root.findByType(Loading).children[0].props.in).toBe(false)

			// Click again to open (prop: in == true)
			act(() => {
				toggleButtons[1].props.onClick()
				component.update(componentTemplate)
			})
			expect(component.root.findByType(Loading).children[0].props.in).toBe(true)
		})

		test('Menu selects course when clicked on', async () => {
			const mockFetch = jest.fn(() =>
				Promise.resolve({
					json: () => Promise.resolve({ value: assignments })
				})
			)
			global.fetch = mockFetch

			const component = create(
				<CourseScoreDataDialog {...dialogProps()} isCoursesLoading={false} courses={courses} />
			)

			const course1Button = component.root.findAllByType(CourseScoreDataListItem)[0]
			const course2Button = component.root.findAllByType(CourseScoreDataListItem)[1]
			const course3Button = component.root.findAllByType(CourseScoreDataListItem)[2]
			const course1ButtonIndex = course1Button.props.index
			const course2ButtonIndex = course2Button.props.index
			const course3ButtonIndex = course3Button.props.index

			// Initially, no buttons are selected
			expect(course1Button.props.isSelected).toBe(false)
			expect(course2Button.props.isSelected).toBe(false)
			expect(course3Button.props.isSelected).toBe(false)

			// Test if nothing is sent: this is to test for if(selectedCourse == contextId)
			await act(async () => {
				await course3Button.props.courseClick(null)
			})
			expect(course1Button.props.isSelected).toBe(false)
			expect(course2Button.props.isSelected).toBe(false)
			expect(course3Button.props.isSelected).toBe(false)

			// Click the first course, and it should be selected
			await act(async () => {
				await course1Button.props.courseClick(course1ButtonIndex)
			})
			expect(course1Button.props.isSelected).toBe(true)
			expect(course2Button.props.isSelected).toBe(false)
			expect(course3Button.props.isSelected).toBe(false)

			// Click the second course, and it should be selected and the first should deselect.
			await act(async () => {
				await course2Button.props.courseClick(course2ButtonIndex)
			})
			expect(course1Button.props.isSelected).toBe(false)
			expect(course2Button.props.isSelected).toBe(true)
			expect(course3Button.props.isSelected).toBe(false)

			// Click the second course AGAIN, and it should stay selected.
			await act(async () => {
				await course2Button.props.courseClick(course2ButtonIndex)
			})
			expect(course1Button.props.isSelected).toBe(false)
			expect(course2Button.props.isSelected).toBe(true)
			expect(course3Button.props.isSelected).toBe(false)

			// Click the third course, and it should be selected
			await act(async () => {
				await course3Button.props.courseClick(course3ButtonIndex)
			})
			expect(course1Button.props.isSelected).toBe(false)
			expect(course2Button.props.isSelected).toBe(false)
			expect(course3Button.props.isSelected).toBe(true)
		})

		test('Changing the view type is caught and saved', async () => {
			const mockFetch = jest.fn(() =>
				Promise.resolve({
					json: () => Promise.resolve({ value: assignments })
				})
			)
			global.fetch = mockFetch

			const component = create(
				<CourseScoreDataDialog {...dialogProps()} isCoursesLoading={false} courses={courses} />
			)

			const course1Button = component.root.findAllByType(CourseScoreDataListItem)[0]
			const course1ButtonIndex = course1Button.props.index

			// Initially, no buttons are selected
			expect(course1Button.props.isSelected).toBe(false)

			// Click the first course, and it should be selected
			await act(async () => {
				await course1Button.props.courseClick(course1ButtonIndex)
			})
			expect(course1Button.props.isSelected).toBe(true)

			const typeSelector = component.root.findByType(CourseStatsTypeSelect)
			expect(typeSelector.props.viewMode).toBe(VIEW_MODE_FINAL_ASSESSMENT_SCORE)
			act(() => {
				typeSelector.props.onChangeViewMode(VIEW_MODE_ALL_ATTEMPTS)
			})
			expect(typeSelector.props.viewMode).toBe(VIEW_MODE_ALL_ATTEMPTS)
		})
	})
})
