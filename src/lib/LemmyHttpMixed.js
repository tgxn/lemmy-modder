// Re-Export LemmyHttp with Version Helpers

import { LemmyHttp } from "lemmy-js-client18";
import { LemmyHttp as LemmyHttp19 } from "lemmy-js-client";

export default class LemmyHttpMixed {
  constructor(baseUrl, options = {}) {
    this.lemmyClient = new LemmyHttp(baseUrl, options);
    this.lemmyClient19 = new LemmyHttp19(baseUrl, options);
  }

  async getSiteVersion() {
    // call getSite and store version
    const siteData = await this.lemmyClient.getSite();

    return siteData.version;
  }

  async setupAuth(userJwt) {
    this.userJwt = userJwt;

    this.lemmyClient19.setHeaders({
      Authorization: `Bearer ${userJwt}`,
    });
  }

  async call(method, formData) {
    // get and cache version
    if (!this.version) {
      this.version = await this.getSiteVersion();
    }
    console.log("this.version", this.version);

    // check version
    if (this.version.indexOf("0.18") === -1) {
      // call super
      return await this.lemmyClient19[method](formData);
    } else {
      // call super
      return await this.lemmyClient[method]({
        auth: this.userJwt,
        ...formData,
      });
    }
  }
}
