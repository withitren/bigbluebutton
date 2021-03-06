import _ from 'lodash';
import { check } from 'meteor/check';
import modifyWhiteboardAccess from '/imports/api/whiteboard-multi-user/server/modifiers/modifyWhiteboardAccess';
import clearAnnotations from '../modifiers/clearAnnotations';
import addAnnotation from '../modifiers/addAnnotation';

export default function handleWhiteboardAnnotations({ header, body }, meetingId) {
  check(header, Object);
  if (header.userId !== 'nodeJSapp') { return false; }

  check(meetingId, String);
  check(body, Object);

  const { annotations, whiteboardId, multiUser } = body;

  check(annotations, Array);
  check(whiteboardId, String);
  check(multiUser, Array);

  clearAnnotations(meetingId, whiteboardId);

  _.each(annotations, (annotation) => {
    const { wbId, userId } = annotation;
    addAnnotation(meetingId, wbId, userId, annotation);
  });

  modifyWhiteboardAccess(meetingId, whiteboardId, multiUser);
}
