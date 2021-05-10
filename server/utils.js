const fetch = require('node-fetch');

async function getRandomFact() {
  try {
    const response = await fetch('https://useless-facts.sameerkumar.website/api');
    const reponseData = await response.json();

    return reponseData ? reponseData.data : null;
  } catch(e) {
    console.log('random fact API has failed with', e.message);
    return null;
  }
}

module.exports = {
  getRandomFact
}
