export interface AzureSettings {
  appID: string;
  appSecret: string;
  redirectUri: string;
  scope: Scope[];
}

export enum Scope {
  SIGN_IN = "Xboxlive.signin",
  OFFLINE_ACCESS = "Xboxlive.offline_access",
}
