-- Mail delivery and email verification/reset flows have been removed.
-- Keep user identifiers and existing organization/course relationships intact.
DROP TABLE auth_mail_outbox;
DROP TABLE action_token;
