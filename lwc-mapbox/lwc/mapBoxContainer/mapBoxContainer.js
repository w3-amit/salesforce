import { LightningElement } from 'lwc';
import communityBasePath from '@salesforce/community/basePath';

export default class MapBoxContainer extends LightningElement {
    dataPayload = {
        access_token: "access_token_here",
        message: "Message from parent LWC",
        ulrParams: {}
    };

    iframeRef = {};

    apexPageUrl = window.location.origin + '/apex/MapBox';
    originUrl = window.location.origin;

    renderedCallback() {
        // get reference to the iFrame
        this.iframeRef = this.template.querySelector("iframe");

        // get the URL params
        this.dataPayload.ulrParams = Object.fromEntries(new URLSearchParams(location.search));

        console.log(this.iframeRef, this.dataPayload, this.iframeRef.contentWindow);

		// listen for events
        this.setEventsListener();
    }

    setEventsListener() {
        console.log("setEventsListener");
        window.addEventListener("message", (event) => {
            console.log("message received LWC", event.origin == this.originUrl, event.data.type);

            if (event.origin !== this.originUrl) {
                // Not the expected origin: Reject the message!
                return;
            }

            switch (event.data.type) {
                case "body_load":
                    // this.passDataToiFrame(this.dataPayload, this.originUrl);
                    this.iframeRef.contentWindow.postMessage(this.dataPayload, this.originUrl);
                    break;

                default:
                    break;
            }

        }, false);
    }
}