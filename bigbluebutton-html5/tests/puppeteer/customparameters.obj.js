const Page = require('./core/page');
const CustomParameters = require('./customparameters/customparameters');
const c = require('./customparameters/constants');
const util = require('./customparameters/util');

const customParametersTest = () => {
  beforeEach(() => {
    jest.setTimeout(50000);
  });

  // This test spec sets the userdata-autoJoin parameter to false
  // and checks that the users don't get audio modal on login
  test('Auto join', async () => {
    const test = new CustomParameters();
    const page = new Page();
    let response;
    try {
      const testName = 'autoJoin';
      page.logger('before ', testName);
      response = await test.autoJoin(testName, Page.getArgs(), undefined, c.autoJoin);
      page.logger('after ', testName);
    } catch (e) {
      page.logger(e);
    } finally {
      await test.closePage(test.page1);
    }
    expect(response).toBe(true);
  });

  // This test spec sets the userdata-listenOnlyMode parameter to false
  // and checks that the users can't see or use listen Only mode
  test('Listen Only Mode', async () => {
    const test = new CustomParameters();
    const page = new Page();
    let response;
    try {
      const testName = 'listenOnlyMode';
      page.logger('before ', testName);
      response = await test.listenOnlyMode(testName, Page.getArgsWithAudio(), undefined, c.listenOnlyMode);
      page.logger('after ', testName);
    } catch (e) {
      page.logger(e);
    } finally {
      await test.close(test.page1, test.page2);
    }
    expect(response).toBe(true);
  });

  // This test spec sets the userdata-forceListenOnly parameter to false
  // and checks that the Viewers can only use listen only mode
  test('Force Listen Only', async () => {
    const test = new CustomParameters();
    const page = new Page();
    let response;
    try {
      const testName = 'forceListenOnly';
      page.logger('before ', testName);
      response = await test.forceListenOnly(testName, Page.getArgsWithAudio(), undefined, c.forceListenOnly);
      page.logger('after ', testName);
    } catch (e) {
      page.logger(e);
    } finally {
      await test.closePage(test.page2);
    }
    expect(response).toBe(true);
  });

  // This test spec sets the userdata-skipCheck parameter to true
  // and checks that the users automatically skip audio check when clicking on Microphone
  test('Skip audio check', async () => {
    const test = new CustomParameters();
    const page = new Page();
    let response;
    try {
      const testName = 'skipCheck';
      page.logger('before ', testName);
      response = await test.skipCheck(testName, Page.getArgsWithAudio(), undefined, c.skipCheck);
      page.logger('after ', testName);
    } catch (e) {
      page.logger(e);
    } finally {
      await test.closePage(test.page1);
    }
    expect(response).toBe(true);
  });

  // This test spec sets the userdata-clientTitle parameter to some value
  // and checks that the meeting window name starts with that value
  test('Client title', async () => {
    const test = new CustomParameters();
    const page = new Page();
    let response;
    try {
      const testName = 'clientTitle';
      page.logger('before ', testName);
      response = await test.clientTitle(testName, Page.getArgs(), undefined, c.clientTitle);
      page.logger('after ', testName);
    } catch (e) {
      page.logger(e);
    } finally {
      await test.closePage(test.page1);
    }
    expect(response).toBe(true);
  });

  // This test spec sets the userdata-askForFeedbackOnLogout parameter to true
  // and checks that the users automatically get asked for feedback on logout page
  test('Ask For Feedback On Logout', async () => {
    const test = new CustomParameters();
    const page = new Page();
    let response;
    try {
      const testName = 'askForFeedbackOnLogout';
      page.logger('before ', testName);
      response = await test.askForFeedbackOnLogout(testName, Page.getArgs(), undefined, c.askForFeedbackOnLogout);
      page.logger('after ', testName);
    } catch (e) {
      page.logger(e);
    } finally {
      await test.closePage(test.page1);
    }
    expect(response).toBe(true);
  });

  // This test spec sets the userdata-displayBrandingArea parameter to true and add a logo link
  // and checks that the users see the logo displaying in the meeting
  test('Display Branding Area', async () => {
    const test = new CustomParameters();
    const page = new Page();
    let response;
    try {
      const testName = 'displayBrandingArea';
      page.logger('before ', testName);
      const parameterWithLogo = `${c.displayBrandingArea}&${c.logo}`;
      response = await test.displayBrandingArea(testName, Page.getArgs(), undefined, parameterWithLogo);
      page.logger('after ', testName);
    } catch (e) {
      page.logger(e);
    } finally {
      await test.closePage(test.page1);
    }
    expect(response).toBe(true);
  });

  // This test spec sets the userdata-shortcuts parameter to one or a list of shortcuts parameters
  // and checks that the users can use those shortcuts
  test('Shortcuts', async () => {
    const test = new CustomParameters();
    const page = new Page();
    let response;
    try {
      const testName = 'shortcuts';
      page.logger('before ', testName);
      response = await test.shortcuts(testName, Page.getArgs(), undefined, encodeURI(c.shortcuts));
      page.logger('after ', testName);
    } catch (e) {
      page.logger(e);
    } finally {
      await test.closePage(test.page1);
    }
    expect(response).toBe(true);
  });

  // This test spec sets the userdata-enableScreensharing parameter to false
  // and checks that the Moderator can not see the Screen sharing button
  test('Enable Screensharing', async () => {
    const test = new CustomParameters();
    const page = new Page();
    let response;
    try {
      const testName = 'enableScreensharing';
      page.logger('before ', testName);
      response = await test.enableScreensharing(testName, Page.getArgs(), undefined, c.enableScreensharing);
      page.logger('after ', testName);
    } catch (e) {
      page.logger(e);
    } finally {
      await test.closePage(test.page1);
    }
    expect(response).toBe(true);
  });

  // This test spec sets the userdata-enableVideo parameter to false
  // and checks that the Moderator can not see the Webcam sharing button
  test('Enable Webcam', async () => {
    const test = new CustomParameters();
    const page = new Page();
    let response;
    try {
      const testName = 'enableVideo';
      page.logger('before ', testName);
      response = await test.enableVideo(testName, Page.getArgsWithVideo(), undefined, c.enableVideo);
      page.logger('after ', testName);
    } catch (e) {
      page.logger(e);
    } finally {
      await test.closePage(test.page1);
    }
    expect(response).toBe(true);
  });

  // This test spec sets the userdata-autoShareWebcam parameter to true
  // and checks that the Moderator sees the Webcam Settings Modal automatically at his connection to meeting
  test('Auto Share Webcam', async () => {
    const test = new CustomParameters();
    const page = new Page();
    let response;
    try {
      const testName = 'autoShareWebcam';
      page.logger('before ', testName);
      response = await test.autoShareWebcam(testName, Page.getArgsWithVideo(), undefined, c.autoShareWebcam);
      page.logger('after ', testName);
    } catch (e) {
      page.logger(e);
    } finally {
      await test.closePage(test.page1);
    }
    expect(response).toBe(true);
  });

  // This test spec sets the userdata-multiUserPenOnly parameter to true
  // and checks that at multi Users whiteboard other users can see only pencil as drawing tool
  test('Multi Users Pen Only', async () => {
    const test = new CustomParameters();
    const page = new Page();
    let response;
    try {
      const testName = 'multiUserPenOnly';
      page.logger('before ', testName);
      response = await test.multiUserPenOnly(testName, Page.getArgs(), undefined, c.multiUserPenOnly);
      page.logger('after ', testName);
    } catch (e) {
      page.logger(e);
    } finally {
      await test.close(test.page1, test.page2);
    }
    expect(response).toBe(true);
  });

  // This test spec sets the userdata-presenterTools parameter to an interval of parameters
  // and checks that at multi Users whiteboard Presenter can see only the set tools from the interval
  test('Presenter Tools', async () => {
    const test = new CustomParameters();
    const page = new Page();
    let response;
    try {
      const testName = 'presenterTools';
      page.logger('before ', testName);
      response = await test.presenterTools(testName, Page.getArgs(), undefined, encodeURI(c.presenterTools));
      page.logger('after ', testName);
    } catch (e) {
      page.logger(e);
    } finally {
      await test.closePage(test.page1);
    }
    expect(response).toBe(true);
  });

  // This test spec sets the userdata-multiUserTools parameter to an interval of parameters
  // and checks that at multi Users whiteboard other users can see only the set tools from the interval
  test('Multi Users Tools', async () => {
    const test = new CustomParameters();
    const page = new Page();
    let response;
    try {
      const testName = 'multiUserTools';
      page.logger('before ', testName);
      response = await test.multiUserTools(testName, Page.getArgs(), undefined, encodeURI(c.multiUserTools));
      page.logger('after ', testName);
    } catch (e) {
      page.logger(e);
    } finally {
      await test.close(test.page1, test.page2);
    }
    expect(response).toBe(true);
  });

  // This test spec sets the userdata-customStyle parameter to an interval of styles
  // and checks that the meeting displays what was called in the styles interval
  test('Custom Styles', async () => {
    const test = new CustomParameters();
    const page = new Page();
    let response;
    try {
      const testName = 'customStyle';
      page.logger('before ', testName);
      response = await test.customStyle(testName, Page.getArgs(), undefined, encodeURI(c.customStyle));
      page.logger('after ', testName);
    } catch (e) {
      page.logger(e);
    } finally {
      await test.closePage(test.page1);
    }
    expect(response).toBe(true);
  });

  // This test spec sets the userdata-customStyleUrl parameter to a styles URL
  // and checks that the meeting displays what was called in the styles URL
  test('Custom Styles URL', async () => {
    const test = new CustomParameters();
    const page = new Page();
    let response;
    try {
      const testName = 'customStyleUrl';
      page.logger('before ', testName);
      response = await test.customStyleUrl(testName, Page.getArgs(), undefined, encodeURI(c.customStyleUrl));
      page.logger('after ', testName);
    } catch (e) {
      page.logger(e);
    } finally {
      await test.closePage(test.page1);
    }
    expect(response).toBe(true);
  });

  // This test spec sets the userdata-autoSwapLayout parameter to true
  // and checks that at any webcam share, the focus will be on the webcam,
  // and the presentation gets minimized and the available shared webcam will replace the Presentation
  test('Auto Swap Layout', async () => {
    const test = new CustomParameters();
    const page = new Page();
    let response;
    try {
      const testName = 'autoSwapLayout';
      page.logger('before ', testName);
      response = await test.autoSwapLayout(testName, Page.getArgs(), undefined, encodeURI(c.autoSwapLayout));
      page.logger('after ', testName);
    } catch (e) {
      page.logger(e);
    } finally {
      await test.closePage(test.page1);
    }
    expect(response).toBe(true);
  });

  // This test spec sets the userdata-hidePresentation parameter to true
  // and checks that the Presentation is totally hidden, and its place will be displaying a message
  test('Hide Presentation', async () => {
    const test = new CustomParameters();
    const page = new Page();
    let response;
    try {
      const testName = 'hidePresentation';
      page.logger('before ', testName);
      response = await test.hidePresentation(testName, Page.getArgs(), undefined, encodeURI(c.hidePresentation));
      page.logger('after ', testName);
    } catch (e) {
      page.logger(e);
    } finally {
      await test.closePage(test.page1);
    }
    expect(response).toBe(true);
  });

  // This test spec sets the userdata-bannerText parameter to some text
  // and checks that the meeting has a banner bar containing the same text
  test('Banner Text', async () => {
    const test = new CustomParameters();
    const page = new Page();
    let response;
    try {
      const testName = 'bannerText';
      page.logger('before ', testName);
      response = await test.bannerText(testName, Page.getArgs(), undefined, encodeURI(c.bannerText));
      page.logger('after ', testName);
    } catch (e) {
      page.logger(e);
    } finally {
      await test.closePage(test.page1);
    }
    expect(response).toBe(true);
  });

  // This test spec sets the userdata-bannerColor parameter to some hex color value
  // and checks that the meeting has a banner bar containing that color in rgb(r, g, b)
  test('Banner Color', async () => {
    const test = new CustomParameters();
    const page = new Page();
    let response;
    try {
      const testName = 'bannerColor';
      page.logger('before ', testName);
      const colorToRGB = util.hexToRgb(c.color);
      response = await test.bannerColor(testName, Page.getArgs(), undefined, `${c.bannerColor}&${encodeURI(c.bannerText)}`, colorToRGB);
      page.logger('after ', testName);
    } catch (e) {
      page.logger(e);
    } finally {
      await test.closePage(test.page1);
    }
    expect(response).toBe(true);
  });

  // This test spec sets the userdata-bbb_show_public_chat_on_login parameter to false
  // and checks that the users don't see that box by default
  test('Show Public Chat On Login', async () => {
    const test = new CustomParameters();
    const page = new Page();
    let response;
    try {
      const testName = 'showPublicChatOnLogin';
      page.logger('before ', testName);
      response = await test.showPublicChatOnLogin(testName, Page.getArgs(), undefined, `${c.showPublicChatOnLogin}`);
      page.logger('after ', testName);
    } catch (e) {
      page.logger(e);
    } finally {
      await test.closePage(test.page1);
    }
    expect(response).toBe(true);
  });

  // This test spec sets the userdata-bbb_force_restore_presentation_on_new_events parameter to true
  // and checks that the viewers get the presentation restored forcefully when the Moderator zooms
  // in/out the presentation or publishes a poll or adds an annotation
  test('Force Restore Presentation On New Events', async () => {
    const test = new CustomParameters();
    const page = new Page();
    let response;
    try {
      const testName = 'forceRestorePresentationOnNewEvents';
      page.logger('before ', testName);
      response = await test.forceRestorePresentationOnNewEvents(testName, Page.getArgs(), undefined, `${c.forceRestorePresentationOnNewEvents}`);
      page.logger('after ', testName);
    } catch (e) {
      page.logger(e);
    } finally {
      await test.close(test.page1, test.page2);
    }
    expect(response).toBe(true);
  });
};
module.exports = exports = customParametersTest;
