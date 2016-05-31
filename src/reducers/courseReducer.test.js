import expect from 'expect';
import courseReducer from './courseReducer';
import * as actions from '../actions/courseActions';

describe('Course Reducer', function() {
  it('should add course when passed create course success', function() {
    //Arrange
    const initial = [
      {title: 'A'},
      {title: 'B'},
    ];

    const newCourse = {title: 'C'};

    const action = actions.createCourseSuccess(newCourse);

    //act
    const newState = courseReducer(initial, action);

    //assert
    expect(newState.length).toEqual(3);
  });
});
