import { secretKey } from '../secret_key';
import { sendAnalytics } from './utils/analytics';
import {
  sleep,
  fetchDomNode,
  getInnerText,
  setInnerText,
 } from './utils/util';
import { elementMapping, LOADING_TEXT } from './element_mapping';

async function skipNetflixAndPrime() {
  const skipButton = fetchDomNode(elementMapping);

  if(!skipButton) {
    return;
  }

  const { domNode, type, selector } = skipButton;

  if(domNode) {
    const innerText = getInnerText(domNode, type);

    if (innerText.toLowerCase() === LOADING_TEXT.toLowerCase()) {
      return;
    }

    if(selector === '.nextUpCard') {
      await sleep(800);
    }

    await setInnerText(domNode, type, LOADING_TEXT);

    const data = {
      event: "Skipped",
      properties: {
        token: secretKey,
        extensionId: chrome.runtime.id,
        distinct_id: chrome.runtime.id,
        selector,
        type,
        innerTextDatum: innerText,
      },
    };

    domNode.click();
    sendAnalytics(data);
  }
}

setInterval(() =>  skipNetflixAndPrime(), 1000);