declare const chrome: any;

let defaultOptions = { debug: false };

interface Props {
  cd?: string;
  dp?: string;
  ec?: string;
  el?: string;
  ea?: string;
  ev?: any;
  t?: string;
}

class Serializable {
  properties: Props;

  constructor(props: Props) {
    this.properties = props || {};
  }

  toObject() {
    return this.properties;
  }

  toString() {
    return JSON.stringify(this.toObject());
  }

  toJSON() {
    return JSON.stringify(this.properties);
  }

  toQueryString() {
    const str = [];
    const obj = this.toObject() as { [key: string]: any };
    for (const p in obj) {
      if (obj.hasOwnProperty(p) && obj[p]) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    }
    return str.join("&");
  }
}

class Hit extends Serializable {
  sent: boolean;

  constructor(props: Props) {
    super(props);
    this.sent = false;
  }
}

class PageHit extends Hit {
  constructor(screenName: string) {
    super({ dp: screenName, t: "pageview" });
  }
}

class ScreenHit extends Hit {
  constructor(screenName: string) {
    super({ cd: screenName, t: "screenview" });
  }
}

class AnalyticsEvent extends Hit {
  constructor(
    category: string,
    action: string,
    label?: string,
    value?: string | number
  ) {
    super({ ec: category, ea: action, el: label, ev: value, t: "event" });
  }
}

class Analytics {
  customDimensions: Array<any>;
  propertyId: string;
  options: any;
  userAgent: string;
  parameters: any;

  waitOnPromise: Promise<any>;
  clientId: string;

  constructor(
    propertyId: string,
    additionalParameters = {},
    options = defaultOptions
  ) {
    this.customDimensions = [];
    this.propertyId = propertyId;
    this.options = options;
    this.clientId = "";

    this.userAgent = window.navigator.userAgent;

    this.parameters = {
      ...additionalParameters
    };

    const storageKey = "analytics_id";

    // Get the client ID from local storage
    this.waitOnPromise = new Promise((resolve, _reject) => {
      chrome.storage.local.get(
        [storageKey],
        (result: { [key: string]: string }) => {
          const clientId = result[storageKey];
          if (clientId) {
            this.clientId = clientId;
          } else {
            this.clientId = genClientID();
            const obj = {} as { [key: string]: string };
            obj[storageKey] = this.clientId;

            chrome.storage.local.set(obj);
          }
          resolve();
        }
      );
    });
  }

  hit(hit: Hit) {
    // send only after the user agent is saved
    return this.send(hit);
  }

  event(event: AnalyticsEvent) {
    // send only after the user agent is saved
    return this.send(event);
  }

  addParameter(name: string, value: string) {
    this.parameters[name] = value;
  }

  addCustomDimension(index: number, value: string) {
    this.customDimensions[index] = value;
  }

  removeCustomDimension(index: number) {
    delete this.customDimensions[index];
  }

  send(hit: Hit) {
    /* format: https://www.google-analytics.com/collect? +
     * &tid= GA property ID (required)
     * &v= GA protocol version (always 1) (required)
     * &t= hit type (pageview / screenview)
     * &dp= page name (if hit type is pageview)
     * &cd= screen name (if hit type is screenview)
     * &cid= anonymous client ID (optional if uid is given)
     * &uid= user id (optional if cid is given)
     * &ua= user agent override
     * &an= app name (required for any of the other app parameters to work)
     * &aid= app id
     * &av= app version
     * &sr= screen resolution
     * &cd{n}= custom dimensions
     * &z= cache buster (prevent browsers from caching GET requests -- should always be last)
     */
    console.log("==> Sending to Google", hit);
    return this.waitOnPromise.then(() => {
      const customDimensions = this.customDimensions
        .map((value, index) => `cd${index}=${value}`)
        .join("&");

      const params = new Serializable(this.parameters).toQueryString();

      const url = `https://www.google-analytics.com/collect?tid=${
        this.propertyId
      }&v=1&cid=${
        this.clientId
      }&${hit.toQueryString()}&${params}&${customDimensions}&z=${Math.round(
        Math.random() * 1e8
      )}`;

      let options = {
        method: "get",
        headers: {
          "User-Agent": this.userAgent
        }
      };

      return fetch(url, options);
    });
  }
}

function genClientID() {
  return Date.now() + "_" + Math.floor(Math.random() * 1000);
}

const UaString = "UA-11032269-7";

const analytics = new Analytics(UaString);

function newEvent(
  category: string,
  action: string,
  label?: string,
  value?: string | number
) {
  return new AnalyticsEvent(category, action, label, value);
}

export function sendEvent(
  category: string,
  action: string,
  label?: string,
  value?: string | number
) {
  const evt = newEvent(category, action, label, value);
  return analytics.event(evt);
}

export function sendPageHit(pageName: string) {
  const hit = new PageHit(pageName);
  return analytics.hit(hit);
}
