package org.bigbluebutton.api.model.validator;

import org.bigbluebutton.api.domain.Meeting;
import org.bigbluebutton.api.model.constraint.ModeratorPasswordConstraint;
import org.bigbluebutton.api.model.shared.ModeratorPassword;
import org.bigbluebutton.api.service.ServiceUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class ModeratorPasswordValidator implements ConstraintValidator<ModeratorPasswordConstraint, ModeratorPassword> {

    private static Logger log = LoggerFactory.getLogger(MeetingExistsValidator.class);


    @Override
    public void initialize(ModeratorPasswordConstraint constraintAnnotation) {}

    @Override
    public boolean isValid(ModeratorPassword moderatorPassword, ConstraintValidatorContext context) {
        log.info("Validating password {} for meeting with ID {}",
                moderatorPassword.getPassword(), moderatorPassword.getMeetingID());

        if(moderatorPassword.getMeetingID() == null) {
            return false;
        }

        Meeting meeting = ServiceUtils.findMeetingFromMeetingID(moderatorPassword.getMeetingID());

        if(meeting == null) {
            return false;
        }

        String actualPassword = meeting.getModeratorPassword();
        String providedPassword = moderatorPassword.getPassword();

        if(providedPassword == null) {
            return false;
        }

        log.info("Actual password: {}", actualPassword);
        log.info("Provided password: {}", providedPassword);

        if(!providedPassword.equals(actualPassword)) {
            return false;
        }

        return true;
    }
}
