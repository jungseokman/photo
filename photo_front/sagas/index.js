import backURL from "@/config/config";
import axios from "axios";
import { all, fork } from "redux-saga/effects";
//

import photoSaga from "./photo";

axios.defaults.baseURL = backURL;
axios.defaults.withCredentials = false;

export default function* rootSaga() {
  yield all([fork(photoSaga)]);
}
