import React, { PureComponent } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import _ from 'lodash';
import Button from '/imports/ui/components/button/component';
import { Session } from 'meteor/session';
import logger from '/imports/startup/client/logger';
import { styles } from './styles';
import Service from './service';
import BreakoutRoomContainer from './breakout-remaining-time/container';
import VideoService from '/imports/ui/components/video-provider/service';
import { PANELS, ACTIONS } from '../layout/enums';
import { screenshareHasEnded } from '/imports/ui/components/screenshare/service';
import UserListService from '/imports/ui/components/user-list/service';
import AudioManager from '/imports/ui/services/audio-manager';
import cx from "classnames";

const intlMessages = defineMessages({
  breakoutTitle: {
    id: 'app.createBreakoutRoom.title',
    description: 'breakout title',
  },
  breakoutAriaTitle: {
    id: 'app.createBreakoutRoom.ariaTitle',
    description: 'breakout aria title',
  },
  breakoutDuration: {
    id: 'app.createBreakoutRoom.duration',
    description: 'breakout duration time',
  },
  breakoutRoom: {
    id: 'app.createBreakoutRoom.room',
    description: 'breakout room',
  },
  breakoutJoin: {
    id: 'app.createBreakoutRoom.join',
    description: 'label for join breakout room',
  },
  breakoutJoinAudio: {
    id: 'app.createBreakoutRoom.joinAudio',
    description: 'label for option to transfer audio',
  },
  breakoutReturnAudio: {
    id: 'app.createBreakoutRoom.returnAudio',
    description: 'label for option to return audio',
  },
  generatingURL: {
    id: 'app.createBreakoutRoom.generatingURL',
    description: 'label for generating breakout room url',
  },
  generatedURL: {
    id: 'app.createBreakoutRoom.generatedURL',
    description: 'label for generate breakout room url',
  },
  endAllBreakouts: {
    id: 'app.createBreakoutRoom.endAllBreakouts',
    description: 'Button label to end all breakout rooms',
  },
  alreadyConnected: {
    id: 'app.createBreakoutRoom.alreadyConnected',
    description: 'label for the user that is already connected to breakout room',
  },
  extendTimeInMinutes: {
    id: 'app.createBreakoutRoom.extendTimeInMinutes',
    description: 'Label for input to extend time (minutes)',
  },
  extendTimeLabel: {
    id: 'app.createBreakoutRoom.extendTimeLabel',
    description: 'Button label to incresce breakout rooms time',
  },
  extendTimeCancel: {
    id: 'app.createBreakoutRoom.extendTimeCancel',
    description: 'Button label to cancel extend breakout rooms time',
  },
  extendTimeHigherThanMeetingTimeError: {
    id: 'app.createBreakoutRoom.extendTimeHigherThanMeetingTimeError',
    description: 'Label for error when extend breakout rooms time would be higher than remaining time in parent meeting',
  },
});

class BreakoutRoom extends PureComponent {
  static sortById(a, b) {
    if (a.userId > b.userId) {
      return 1;
    }

    if (a.userId < b.userId) {
      return -1;
    }

    return 0;
  }

  constructor(props) {
    super(props);
    this.renderBreakoutRooms = this.renderBreakoutRooms.bind(this);
    this.getBreakoutURL = this.getBreakoutURL.bind(this);
    this.renderDuration = this.renderDuration.bind(this);
    this.transferUserToBreakoutRoom = this.transferUserToBreakoutRoom.bind(this);
    this.changeExtendTime = this.changeExtendTime.bind(this);
    this.showExtendTimeForm = this.showExtendTimeForm.bind(this);
    this.resetExtendTimeForm = this.resetExtendTimeForm.bind(this);
    this.renderUserActions = this.renderUserActions.bind(this);
    this.returnBackToMeeeting = this.returnBackToMeeeting.bind(this);
    this.state = {
      requestedBreakoutId: '',
      waiting: false,
      joinedAudioOnly: false,
      breakoutId: '',
      visibleExtendTimeForm: false,
      visibleExtendTimeHigherThanMeetingTimeError: false,
      extendTime: 5,
    };
  }

  componentDidUpdate() {
    const {
      breakoutRoomUser,
      setBreakoutAudioTransferStatus,
      isMicrophoneUser,
      isReconnecting,
    } = this.props;

    const {
      waiting,
      requestedBreakoutId,
      joinedAudioOnly,
    } = this.state;

    if (waiting) {
      const breakoutUser = breakoutRoomUser(requestedBreakoutId);

      if (!breakoutUser) return;
      if (breakoutUser.redirectToHtml5JoinURL !== '') {
        window.open(breakoutUser.redirectToHtml5JoinURL, '_blank');
        _.delay(() => this.setState({ waiting: false }), 1000);
      }
    }

    if (joinedAudioOnly && (!isMicrophoneUser || isReconnecting)) {
      this.clearJoinedAudioOnly();
      setBreakoutAudioTransferStatus({
        breakoutMeetingId: '',
        status: AudioManager.BREAKOUT_AUDIO_TRANSFER_STATES.DISCONNECTED,
      });
    }
  }

  getBreakoutURL(breakoutId) {
    Session.set('lastBreakoutOpened', breakoutId);
    const { requestJoinURL, breakoutRoomUser } = this.props;
    const { waiting } = this.state;
    const hasUser = breakoutRoomUser(breakoutId);
    if (!hasUser && !waiting) {
      this.setState(
        {
          waiting: true,
          requestedBreakoutId: breakoutId,
        },
        () => requestJoinURL(breakoutId),
      );
    }

    if (hasUser) {
      window.open(hasUser.redirectToHtml5JoinURL, '_blank');
      this.setState({ waiting: false });
    }
    return null;
  }

  clearJoinedAudioOnly() {
    this.setState({ joinedAudioOnly: false });
  }

  changeExtendTime(event) {
    const newExtendTime = Number.parseInt(event.target.value, 10) || 0;
    this.setState({ extendTime: newExtendTime >= 0 ? newExtendTime : 0 });
  }

  showExtendTimeForm() {
    this.setState({ visibleExtendTimeForm: true });
  }

  showExtendTimeHigherThanMeetingTimeError(show) {
    this.setState({ visibleExtendTimeHigherThanMeetingTimeError: show });
  }

  resetExtendTimeForm() {
    this.setState({ visibleExtendTimeForm: false, extendTime: 5 });
  }

  transferUserToBreakoutRoom(breakoutId) {
    const { transferToBreakout } = this.props;
    transferToBreakout(breakoutId);
    this.setState({ joinedAudioOnly: true, breakoutId });
  }

  returnBackToMeeeting(breakoutId) {
    const { transferUserToMeeting, meetingId } = this.props;
    transferUserToMeeting(breakoutId, meetingId);
    this.setState({ joinedAudioOnly: false, breakoutId });
  }

  renderUserActions(breakoutId, joinedUsers, number) {
    const {
      isMicrophoneUser,
      amIModerator,
      intl,
      isUserInBreakoutRoom,
      exitAudio,
      setBreakoutAudioTransferStatus,
      getBreakoutAudioTransferStatus,
    } = this.props;

    const {
      joinedAudioOnly,
      breakoutId: _stateBreakoutId,
      requestedBreakoutId,
      waiting,
    } = this.state;

    const {
      breakoutMeetingId: currentAudioTransferBreakoutId,
      status,
    } = getBreakoutAudioTransferStatus();

    const isInBreakoutAudioTransfer = status
      === AudioManager.BREAKOUT_AUDIO_TRANSFER_STATES.CONNECTED;

    const stateBreakoutId = _stateBreakoutId || currentAudioTransferBreakoutId;
    const moderatorJoinedAudio = isMicrophoneUser && amIModerator;
    const disable = waiting && requestedBreakoutId !== breakoutId;
    const audioAction = joinedAudioOnly || isInBreakoutAudioTransfer
      ? () => {
        setBreakoutAudioTransferStatus({
          breakoutMeetingId: breakoutId,
          status: AudioManager.BREAKOUT_AUDIO_TRANSFER_STATES.RETURNING,
        });
        this.returnBackToMeeeting(breakoutId);
        return logger.debug({
          logCode: 'breakoutroom_return_main_audio',
          extraInfo: { logType: 'user_action' },
        }, 'Returning to main audio (breakout room audio closed)');
      }
      : () => {
        setBreakoutAudioTransferStatus({
          breakoutMeetingId: breakoutId,
          status: AudioManager.BREAKOUT_AUDIO_TRANSFER_STATES.CONNECTED,
        });
        this.transferUserToBreakoutRoom(breakoutId);
        return logger.debug({
          logCode: 'breakoutroom_join_audio_from_main_room',
          extraInfo: { logType: 'user_action' },
        }, 'joining breakout room audio (main room audio closed)');
      };
    return (
      <div className={styles.breakoutActions}>
        {isUserInBreakoutRoom(joinedUsers)
          ? (
            <span className={styles.alreadyConnected}>
              {intl.formatMessage(intlMessages.alreadyConnected)}
            </span>
          )
          : (
            <Button
              label={intl.formatMessage(intlMessages.breakoutJoin)}
              data-test="breakoutJoin"
              aria-label={`${intl.formatMessage(intlMessages.breakoutJoin)} ${number}`}
              onClick={() => {
                this.getBreakoutURL(breakoutId);
                // leave main room's audio,
                // and stops video and screenshare when joining a breakout room
                exitAudio();
                logger.debug({
                  logCode: 'breakoutroom_join',
                  extraInfo: { logType: 'user_action' },
                }, 'joining breakout room closed audio in the main room');
                VideoService.storeDeviceIds();
                VideoService.exitVideo();
                if (UserListService.amIPresenter()) screenshareHasEnded();
              }
              }
              disabled={disable}
              className={styles.joinButton}
            />
          )
        }
        {
          moderatorJoinedAudio
            ? [
              ('|'),
              (
                <Button
                  label={
                    stateBreakoutId === breakoutId
                      && (joinedAudioOnly || isInBreakoutAudioTransfer)
                      ? intl.formatMessage(intlMessages.breakoutReturnAudio)
                      : intl.formatMessage(intlMessages.breakoutJoinAudio)
                  }
                  className={styles.button}
                  disabled={stateBreakoutId !== breakoutId && joinedAudioOnly}
                  key={`join-audio-${breakoutId}`}
                  onClick={audioAction}
                />
              ),
            ]
            : null
        }
      </div>
    );
  }


  renderBreakoutRooms() {
    const {
      breakoutRooms,
      intl,
    } = this.props;

    const {
      waiting,
      requestedBreakoutId,
    } = this.state;

    const roomItems = breakoutRooms.map(breakout => (
      <div
        className={styles.breakoutItems}
        key={`breakoutRoomItems-${breakout.breakoutId}`}
      >
        <div className={styles.content} key={`breakoutRoomList-${breakout.breakoutId}`}>
          <span className={styles.breakoutRoomListNameLabel} aria-hidden>
            { breakout.isDefaultName
              ? intl.formatMessage(intlMessages.breakoutRoom, { 0: breakout.sequence })
              : breakout.shortName }
            <span className={styles.usersAssignedNumberLabel}>
              (
              {breakout.joinedUsers.length}
              )
            </span>
          </span>
          {waiting && requestedBreakoutId === breakout.breakoutId ? (
            <span>
              {intl.formatMessage(intlMessages.generatingURL)}
              <span className={styles.connectingAnimation} />
            </span>
          ) : this.renderUserActions(
            breakout.breakoutId,
            breakout.joinedUsers,
            breakout.sequence.toString(),
          )}
        </div>
        <div className={styles.joinedUserNames}>
          {breakout.joinedUsers
            .sort(BreakoutRoom.sortById)
            .filter((value, idx, arr) => !(value.userId === (arr[idx + 1] || {}).userId))
            .sort(Service.sortUsersByName)
            .map(u => u.name)
            .join(', ')}
        </div>
      </div>
    ));

    return (
      <div className={styles.breakoutColumn}>
        <div className={styles.breakoutScrollableList}>
          {roomItems}
        </div>
      </div>
    );
  }

  renderDuration() {
    const {
      intl, breakoutRooms, amIModerator, isMeteorConnected, extendBreakoutsTime, isExtendTimeHigherThanMeetingRemaining,
    } = this.props;
    const { extendTime, visibleExtendTimeForm, visibleExtendTimeHigherThanMeetingTimeError } = this.state;
    return (
      <div className={styles.durationContainer}>
        { amIModerator && visibleExtendTimeForm ? (
          <div className={styles.extendTimeContainer}>
            <label
              htmlFor="inputExtendTimeSelector"
              className={cx(styles.label, styles.labelSmall)}
            >
              {intl.formatMessage(intlMessages.extendTimeInMinutes)}
            </label>
            <br />
            <input
              id="inputExtendTimeSelector"
              type="number"
              className={styles.extendDuration}
              min="1"
              value={extendTime}
              onChange={this.changeExtendTime}
              aria-label={intl.formatMessage(intlMessages.extendTimeInMinutes)}
            />
            <br />
            <br />
            { visibleExtendTimeHigherThanMeetingTimeError ? (
              <span className={styles.withError}>
                {intl.formatMessage(intlMessages.extendTimeHigherThanMeetingTimeError)}
                <br />
                <br />
              </span>
            ) : null }
            <Button
              color="default"
              disabled={!isMeteorConnected}
              size="sm"
              label={intl.formatMessage(intlMessages.extendTimeCancel)}
              className={styles.endButton}
              onClick={this.resetExtendTimeForm}
            />
            <Button
              color="primary"
              disabled={!isMeteorConnected}
              size="sm"
              label={intl.formatMessage(intlMessages.extendTimeLabel)}
              className={styles.endButton}
              onClick={() => {
                this.showExtendTimeHigherThanMeetingTimeError(false);

                if (isExtendTimeHigherThanMeetingRemaining(extendTime)) {
                  this.showExtendTimeHigherThanMeetingTimeError(true);
                } else if (extendBreakoutsTime(extendTime)) {
                  this.resetExtendTimeForm();
                }
              }}
            />
          </div>
        ) : null }
        <span className={styles.duration}>
          <BreakoutRoomContainer
            messageDuration={intlMessages.breakoutDuration}
            breakoutRoom={breakoutRooms[0]}
          />
          { !visibleExtendTimeForm
            ? (
              <Button
                onClick={this.showExtendTimeForm}
                color="default"
                icon="add"
                circle
                hideLabel
                size="sm"
                label={intl.formatMessage(intlMessages.extendTimeLabel)}
                aria-label={intl.formatMessage(intlMessages.extendTimeLabel)}
                disabled={!isMeteorConnected}
              />
            )
            : null }
        </span>
      </div>
    );
  }

  render() {
    const {
      isMeteorConnected,
      intl,
      endAllBreakouts,
      amIModerator,
      newLayoutContextDispatch,
    } = this.props;
    return (
      <div className={styles.panel}>
        <Button
          icon="left_arrow"
          label={intl.formatMessage(intlMessages.breakoutTitle)}
          aria-label={intl.formatMessage(intlMessages.breakoutAriaTitle)}
          className={styles.header}
          onClick={() => {
            newLayoutContextDispatch({
              type: ACTIONS.SET_SIDEBAR_CONTENT_IS_OPEN,
              value: false,
            });
            newLayoutContextDispatch({
              type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL,
              value: PANELS.NONE,
            });
          }}
        />
        {this.renderBreakoutRooms()}
        {this.renderDuration()}
        {
          amIModerator
            ? (
              <Button
                color="primary"
                disabled={!isMeteorConnected}
                size="lg"
                label={intl.formatMessage(intlMessages.endAllBreakouts)}
                className={styles.endButton}
                onClick={() => {
                  newLayoutContextDispatch({
                    type: ACTIONS.SET_SIDEBAR_CONTENT_IS_OPEN,
                    value: false,
                  });
                  newLayoutContextDispatch({
                    type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL,
                    value: PANELS.NONE,
                  });
                  endAllBreakouts();
                }}
              />
            ) : null
        }
      </div>
    );
  }
}

export default injectIntl(BreakoutRoom);
