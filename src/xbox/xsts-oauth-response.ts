export interface XSTSResponse {
  IssueInstant: string;
  NotAfter: string;
  Token: string;
  DisplayClaims: {
    xui: [
      {
        uhs: string;
      }
    ];
  };
}
