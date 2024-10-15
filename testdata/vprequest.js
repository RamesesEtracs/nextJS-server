export const vprequest = {
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  type: "VerifiablePresentationRequest",
  challenge: 'challenge',
  domain: "did:web:issuer:tagbilaran.com",
  credentialQuery: [
    {
      reason: "Please provide any identity credentials",
      frame: {
        type: "PhilSys",
        credentialSubject: {
          psn: {},
          dateissued: {},
          firstname: {},
          lastname: {},
          middlename: {},
          suffix: {},
          birthdate: { "@optional": true },
          civilstatus: {},
          gender: {},
          citizenship: {},
        },
      },
    },
  ],
  interact: {
    service:
      "http://www.filipizen.com/bohol_tagbilaran/obo/building_permit/12912912991j291j291j2/addsigner",
  },
};
