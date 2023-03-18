import fetch from "isomorphic-fetch";

import { MicrosoftResponse } from "./microsoft/microsoft-oauth-response";
import { MicrosoftSettings } from "./microsoft/microsoft-oauth-settings";

import { AzureSettings, Scope } from "./minecraft-oauth-settings";

import { XBLReponse } from "./xbox/xbl-oauth-response";
import { XSTSResponse } from "./xbox/xsts-oauth-response";

import { jsonToURLEncoded } from "./utils";
import { MinecraftResponse } from "./minecraft/minecraft-oauth-response";
import { MinecraftProfileResponse } from "./minecraft/minecraft-profile-response";

export class MinecraftOAuth {
  private readonly appID: string;
  private readonly appSecret: string;
  private readonly redirectUri: string;

  private scope: Scope[];

  constructor(settings: AzureSettings) {
    this.appID = settings.appID;
    this.appSecret = settings.appSecret;
    this.redirectUri = settings.redirectUri;
    this.scope = settings.scope;
  }

  authenticate(): string {
    const body = {
      client_id: this.appID,
      response_type: "code",
      response_mode: "query",
      redirect_uri: this.redirectUri,
      scope: this.scope.join(" "),
    };

    return `https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?${jsonToURLEncoded(
      body
    )}`;
  }

  async authenticateMicrosoft(
    code: string,
    settings: MicrosoftSettings
  ): Promise<MicrosoftResponse> {
    const url = "https://login.microsoftonline.com/consumers/oauth2/v2.0/token";

    const body = {
      client_id: settings.clientID,
      scope: settings.scope,
      code: code,
      redirect_uri: settings.redirectUri,
      grant_type: "authorization_code",
      client_secret: settings.clientSecret,
    };

    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: jsonToURLEncoded(body),
    });

    return (await response.json()) as MicrosoftResponse;
  }

  async authenticateXboxLive(rpsTicket: string): Promise<XBLReponse> {
    const url = "https://user.auth.xboxlive.com/user/authenticate";

    const body = {
      RelyingParty: "http://auth.xboxlive.com",
      TokenType: "JWT",
      Properties: {
        AuthMethod: "RPS",
        SiteName: "user.auth.xboxlive.com",
        RpsTicket: `d=${rpsTicket}`,
      },
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return (await res.json()) as XBLReponse;
  }

  async authenticateXSTS(token: string): Promise<XSTSResponse> {
    const url = "https://xsts.auth.xboxlive.com/xsts/authorize";

    const body = {
      Properties: {
        SandboxId: "RETAIL",
        UserTokens: [token],
      },
      RelyingParty: "rp://api.minecraftservices.com/",
      TokenType: "JWT",
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return (await res.json()) as XSTSResponse;
  }

  async authenticateMinecraft(
    userhash: string,
    token: string
  ): Promise<MinecraftResponse> {
    const url =
      "https://api.minecraftservices.com/authentication/login_with_xbox";

    const body = {
      identityToken: `XBL3.0 x=${userhash};${token}`,
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return (await res.json()) as MinecraftResponse;
  }

  async getProfile(token: string): Promise<MinecraftProfileResponse> {
    const url = "https://api.minecraftservices.com/minecraft/profile";

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return (await res.json()) as MinecraftProfileResponse;
  }
}
