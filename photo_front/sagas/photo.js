import {
  PHOTO_UPLOAD_FAILURE,
  PHOTO_UPLOAD_REQUEST,
  PHOTO_UPLOAD_SUCCESS,
} from "@/reducers/photo";
import axios from "axios";
import { all, call, fork, put, takeLatest } from "redux-saga/effects";

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function photoUploadAPI(data) {
  return await axios.post(`/api/upload/upload-image`, data);
}

function* photoUpload(action) {
  try {
    const result = yield call(photoUploadAPI, action.data);
    yield put({
      type: PHOTO_UPLOAD_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PHOTO_UPLOAD_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

function* watchPhotoUpload() {
  yield takeLatest(PHOTO_UPLOAD_REQUEST, photoUpload);
}

//////////////////////////////////////////////////////////////
export default function* userSaga() {
  yield all([
    fork(watchPhotoUpload),

    //
  ]);
}
