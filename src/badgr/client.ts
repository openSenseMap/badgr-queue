interface BadgrClientProps {
  accessToken?: string;
  debug?: boolean;
  endpoint?: string;
  username?: string;
  password?: string;
  admin?: boolean;
  client_id?: string;
  client_secret?: string;
}

export class BadgrClient {
  debug: boolean;
  endpoint: string | undefined;
  username: string | undefined;
  password: string | undefined;
  accessToken: string | undefined;
  admin: boolean;
  client_id: string | undefined;
  client_secret: string | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  init: any;

  constructor({
    accessToken,
    debug = false,
    endpoint,
    username,
    password,
    admin = false,
    client_id,
    client_secret,
  }: BadgrClientProps = {}) {
    this.debug = debug;
    this.endpoint = endpoint;
    this.username = username;
    this.password = password;
    this.accessToken = accessToken;
    this.admin = admin;
    this.client_id = client_id;
    this.client_secret = client_secret;

    this.init =
      username && password
        ? this.getAccessToken()
        : accessToken
        ? Promise.resolve({ accessToken })
        : null;
  }

  async getAccessToken({
    endpoint,
    username,
    password,
    admin = false,
  }: Pick<
    BadgrClientProps,
    "endpoint" | "username" | "password" | "admin"
  > = {}) {
    try {
      endpoint = endpoint || this.endpoint;
      password = password || this.password;
      username = username || this.username;
      admin = admin || this.admin;

      if (!username || !password)
        throw new Error("username and password required");

      const url = endpoint + "/o/token";

      const scopes = ["rw:backpack", "rw:issuer", "rw:profile"];
      if (admin) scopes.push("rw:serverAdmin");

      const formData = new FormData();
      formData.append("grant_type", "password");
      formData.append("client_id", this.client_id || "");
      formData.append("client_secret", this.client_secret || "");
      formData.append("scope", scopes.join(" "));
      formData.append("username", username);
      formData.append("password", password);

      const req = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const data = await req.json();

      const accessToken = data.access_token;
      const refreshToken = data.refresh_token;
      const expiresIn = data.expires_in;
      const currentDate = new Date();
      const expirationDate = new Date(
        currentDate.getTime() + expiresIn * 60 * 1000,
      );
      return { accessToken, refreshToken, expiresIn, expirationDate };
    } catch (error) {
      throw new Error(`failed to get access token${error ? ": " + error : ""}`);
    }
  }

  async grant({
    accessToken,
    endpoint = this.endpoint,
    badgeClassEntityId,
    createNotification = false,
    email,
    evidence = [],
    issuerEntityId,
    narrative = "",
  }: Partial<Pick<BadgrClientProps, "endpoint" | "accessToken" | "debug">> & {
    badgeClassEntityId: string;
    createNotification?: boolean;
    email: string;
    evidence?: string[];
    issuerEntityId: string;
    narrative?: string;
  }) {
    try {
      if (!accessToken && this.init)
        accessToken = (await this.init).accessToken;
      if (!accessToken) throw new Error("ACCESS TOKEN REQUIRED");
      if (!badgeClassEntityId)
        throw new Error("You must supply a badgeClassEntityId");
      if (!issuerEntityId) throw new Error("You must supply a issuerEntityId");
      if (!email)
        throw new Error("You must supply an email to grant the badge to");

      const req = await fetch(
        `${endpoint}/v1/issuer/issuers/${issuerEntityId}/badges/${badgeClassEntityId}/assertions`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            badge_class: badgeClassEntityId,
            create_notification: createNotification,
            evidence_items: evidence,
            issuer: issuerEntityId,
            narrative,
            recipient_identifier: email,
            recipient_type: "email",
          }),
        },
      );

      if (!req.ok) throw new Error(`failed to grant badge: ${req.statusText}`);

      return true;
    } catch (error) {
      throw new Error(`failed to grant badge: ${error}`);
    }
  }
}
