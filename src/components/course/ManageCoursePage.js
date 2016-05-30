import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as courseActions from '../../actions/courseActions';
import * as authorActions from '../../actions/authorActions';
import CourseForm from './CourseForm';
import toastr from 'toastr';

export class ManageCoursePage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      course: Object.assign({}, this.props.course),
      errors: {},
      saving: false,
    };

    this.updateCourseState = this.updateCourseState.bind(this);
    this.saveCourse = this.saveCourse.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.course || this.props.course.id !== nextProps.course.id) {
      // Necessary to populate form when existing course is loaded directly.
      this.setState({course: Object.assign({}, nextProps.course)});
    }
  }

  updateCourseState(event) {
    const field = event.target.name;
    let course = this.state.course;
    course[field] = event.target.value;
    return this.setState({course: course});
  }

  redirect() {
    toastr.success('Course Saved');
    this.setState({saving: false});
    this.context.router.push('/courses');
  }

  courseFormIsValid() {
    let formIsValid = true;
    let errors = {};

    if (this.state.course.title.length < 5) {
      errors.title = 'Title must be at least 5 chars';
      formIsValid = false;
    }

    this.setState({errors});
    return formIsValid;
  }

  saveCourse(event) {
    if (!this.courseFormIsValid) { return; }
    event.preventDefault();
    this.setState({saving: true});
    this.props.actions.saveCourse(this.state.course)
    .then(() => this.redirect())
    .catch(error => {
      this.setState({saving: false});
      toastr.error(error);
    });
  }

  render() {
    return (
      <CourseForm
        course={this.state.course}
        errors={this.state.errors}
        saving={this.state.saving}
        onChange={this.updateCourseState}
        onSave={this.saveCourse}
        allAuthors={this.props.authors}/>
    );
  }
}

ManageCoursePage.propTypes = {
  course: PropTypes.object.isRequired,
  authors: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
};



function getCourseById(courses, courseId) {
  const course = courses.filter(course => course.id === courseId);
  if (course) {
    return course[0];
  }
  else {
    return null;
  }
}

function mapStateToProps(state, ownProps) {
  const courseId = ownProps.params.id;

  let course;
  if (courseId && state.courses.length) {
    course = getCourseById(state.courses, courseId);
  }
  else {
    let course = {
      id: '',
      watchHref: '',
      title: '',
      authorId: '',
      length: '',
      category: '',
    };
  }


  const authorsFormattedForDropdown = state.authors.map(author => {
    return {
      value: author.id,
      text: `${author.firstName} ${author.lastName}`,
    };
  });

  return { course, authors: authorsFormattedForDropdown, };
}

ManageCoursePage.contextTypes = {
  router: PropTypes.object.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(courseActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursePage);
