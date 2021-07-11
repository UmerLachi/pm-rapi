export const getConfirmEmailTextBody = (fullName, url) => {
  const body = `Hi ${fullName},\nIn order to start using your account, you need to confirm your email address by clicking the link below.\n${url}\nIf you did not sign up for this account you can ignore this email and the account will be deleted.\nThanks,\nLachi Solutions Team
  `;

  return body;
};
