import produce from "../util/produce";

export const initialState = {
  photos: [],

  //
  st_photoUploadLoading: false,
  st_photoUploadDone: false,
  st_photoUploadError: null,
  //
};

export const PHOTO_UPLOAD_REQUEST = "PHOTO_UPLOAD_REQUEST";
export const PHOTO_UPLOAD_SUCCESS = "PHOTO_UPLOAD_SUCCESS";
export const PHOTO_UPLOAD_FAILURE = "PHOTO_UPLOAD_FAILURE";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case PHOTO_UPLOAD_REQUEST:
        draft.st_photoUploadLoading = true;
        draft.st_photoUploadDone = false;
        draft.st_photoUploadError = null;
        break;

      case PHOTO_UPLOAD_SUCCESS:
        draft.st_photoUploadLoading = false;
        draft.st_photoUploadDone = true;
        draft.st_photoUploadError = null;
        draft.photos.push(action.data);
        break;

      case PHOTO_UPLOAD_FAILURE:
        draft.st_photoUploadLoading = false;
        draft.st_photoUploadDone = false;
        draft.st_photoUploadError = action.error;
        break;

      //////////////////////////////////////

      default:
        break;
    }
  });

export default reducer;
