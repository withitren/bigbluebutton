import React, { useContext } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import MediaService, { getSwapLayout, shouldEnableSwapLayout } from '/imports/ui/components/media/service';
import { notify } from '/imports/ui/services/notification';
import { Session } from 'meteor/session';
import PresentationService from './service';
import { Slides } from '/imports/api/slides';
import Presentation from '/imports/ui/components/presentation/component';
import PresentationToolbarService from './presentation-toolbar/service';
import { UsersContext } from '../components-data/users-context/context';
import Auth from '/imports/ui/services/auth';
import Meetings from '/imports/api/meetings';
import getFromUserSettings from '/imports/ui/services/users-settings';
import { NLayoutContext } from '../layout/context/context';
import WhiteboardService from '/imports/ui/components/whiteboard/service';

const ROLE_VIEWER = Meteor.settings.public.user.role_viewer;

const PresentationContainer = ({ presentationPodIds, mountPresentation, ...props }) => {
  const fullscreenElementId = 'Presentation';
  const newLayoutContext = useContext(NLayoutContext);
  const { newLayoutContextState, newLayoutContextDispatch } = newLayoutContext;
  const { input, output, layoutLoaded } = newLayoutContextState;
  const { presentation } = output;
  const { element } = input.fullscreen;
  const fullscreenContext = (element === fullscreenElementId);
  const { layoutSwapped, podId } = props;

  const usingUsersContext = useContext(UsersContext);
  const { users } = usingUsersContext;
  const currentUser = users[Auth.meetingID][Auth.userID];

  const userIsPresenter = (podId === 'DEFAULT_PRESENTATION_POD') ? currentUser.presenter : props.isPresenter;

  return mountPresentation
    && (
      <Presentation
        {
        ...{
          newLayoutContextDispatch,
          ...props,
          isViewer: currentUser.role === ROLE_VIEWER,
          userIsPresenter: userIsPresenter && !layoutSwapped,
          presentationBounds: presentation,
          layoutLoaded,
          fullscreenContext,
          fullscreenElementId,
        }
        }
      />
    );
};

const APP_CONFIG = Meteor.settings.public.app;
const PRELOAD_NEXT_SLIDE = APP_CONFIG.preloadNextSlides;
const fetchedpresentation = {};

export default withTracker(({ podId }) => {
  const currentSlide = PresentationService.getCurrentSlide(podId);
  const presentationIsDownloadable = PresentationService.isPresentationDownloadable(podId);
  const layoutSwapped = getSwapLayout() && shouldEnableSwapLayout();

  let slidePosition;
  if (currentSlide) {
    const {
      presentationId,
      id: slideId,
    } = currentSlide;
    slidePosition = PresentationService.getSlidePosition(podId, presentationId, slideId);
    if (PRELOAD_NEXT_SLIDE && !fetchedpresentation[presentationId]) {
      fetchedpresentation[presentationId] = {
        canFetch: true,
        fetchedSlide: {},
      };
    }
    const currentSlideNum = currentSlide.num;
    const presentation = fetchedpresentation[presentationId];

    if (PRELOAD_NEXT_SLIDE
      && !presentation.fetchedSlide[currentSlide.num + PRELOAD_NEXT_SLIDE]
      && presentation.canFetch) {
      const slidesToFetch = Slides.find({
        podId,
        presentationId,
        num: {
          $in: Array(PRELOAD_NEXT_SLIDE).fill(1).map((v, idx) => currentSlideNum + (idx + 1)),
        },
      }).fetch();

      const promiseImageGet = slidesToFetch
        .filter((s) => !fetchedpresentation[presentationId].fetchedSlide[s.num])
        .map(async (slide) => {
          if (presentation.canFetch) presentation.canFetch = false;
          const image = await fetch(slide.imageUri);
          if (image.ok) {
            presentation.fetchedSlide[slide.num] = true;
          }
        });
      Promise.all(promiseImageGet).then(() => {
        presentation.canFetch = true;
      });
    }
  }

  const layoutManagerLoaded = Session.get('layoutManagerLoaded');
  return {
    currentSlide,
    slidePosition,
    downloadPresentationUri: PresentationService.downloadPresentationUri(podId),
    isPresenter: PresentationService.isPresenter(podId),
    multiUser: WhiteboardService.hasMultiUserAccess(currentSlide && currentSlide.id, Auth.userID)
      && !layoutSwapped,
    presentationIsDownloadable,
    mountPresentation: !!currentSlide,
    currentPresentation: PresentationService.getCurrentPresentation(podId),
    notify,
    zoomSlide: PresentationToolbarService.zoomSlide,
    podId,
    layoutSwapped,
    toggleSwapLayout: MediaService.toggleSwapLayout,
    publishedPoll: Meetings.findOne({ meetingId: Auth.meetingID }, {
      fields: {
        publishedPoll: 1,
      },
    }).publishedPoll,
    currentPresentationId: Session.get('currentPresentationId') || null,
    restoreOnUpdate: getFromUserSettings(
      'bbb_force_restore_presentation_on_new_events',
      Meteor.settings.public.presentation.restoreOnUpdate,
    ),
    layoutManagerLoaded,
  };
})(PresentationContainer);
