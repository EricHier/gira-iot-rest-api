import fetch from "node-fetch";
import https from "https";
import { default as base64 } from "base-64";

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});

export default class GiraSmartHomeClient {

    constructor(host, { username, password }, options = {}) {
        if (!host || !username || !password)
            throw Error("Invalid parameters");

        this.baseURL = `https://${host}/api/v2`;
        this.debug = options.debug || false;

        return (async () => {

            const check = await fetch(this.baseURL, {
                agent: httpsAgent,
            });

            if (check.status !== 200)
                throw Error("Unable to make request to API")

            if (this.debug)
                console.log("API request content", await check.json());

            const registration = await fetch(this.baseURL + "/clients", {
                agent: httpsAgent,
                method: "POST",
                body: JSON.stringify({
                    client: "de.gira.gdsrestapi.clients.erichier"
                }),
                headers: {
                    Authorization: "Basic " + base64.encode(username + ":" + password)
                }
            });

            if (registration.status !== 201)
                throw Error("Invalid credentials for registration");

            if (this.debug)
                console.log("Registration API content", await registration.json(), "status code", registration.status);

            this.token = (await registration.json()).token;

            return this;
        })();
    }

    get tokenParameter() {
        return "?token=" + this.token;
    }

    async getAllFunctions() {
        const request = await fetch(this.baseURL + "/uiconfig" + this.tokenParameter, { agent: httpsAgent });

        if (request.status !== 200)
            throw Error("Unable to fetch functions");

        return (await request.json()).functions;
    }

    // only data points are supportet, not function uids
    async getValue(uid) {
        const request = await fetch(this.baseURL + "/values/" + uid + this.tokenParameter, { agent: httpsAgent });

        if (request.status !== 200)
            throw Error("Unable to fetch value for uid " + uid);

        const content = await request.json();

        return content.values[0].value;
    }

    async setValue(uid, value) {
        const request = await fetch(this.baseURL + "/values/" + uid + this.tokenParameter, {
            method: "PUT",
            agent: httpsAgent,
            body: JSON.stringify({ value })
        });

        if (request.status !== 200)
            throw Error("Unable to fetch value for uid " + uid);
    }

}