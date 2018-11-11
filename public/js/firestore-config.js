const firestore = firebase.firestore();
const settings = {timestampsInSnapshots: true};
firestore.settings(settings);