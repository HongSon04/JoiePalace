import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  partyTypes: [],
  isFetchingPartyTypes: false,
  isFetchingPartyTypesError: false,
};

const partyTypesSlice = createSlice({
  name: "partyTypes",
  initialState,
  reducers: {
    setPartyTypes(state, action) {
      state.partyTypes = action.payload;
    },

    fetchingPartyTypes(state) {
      state.isFetchingPartyTypes = true;
    },
    fetchingPartyTypesSuccess(state, action) {
      state.isFetchingPartyTypes = false;
      state.isFetchingPartyTypesError = false;
      state.partyTypes = action.payload;
    },
    fetchingPartyTypesFailure(state) {
      state.isFetchingPartyTypes = false;
      state.isFetchingPartyTypesError = true;
    },
  },
});

export const {
  setPartyTypes,

  fetchingPartyTypes,
  fetchingPartyTypesSuccess,
  fetchingPartyTypesFailure,
} = partyTypesSlice.actions;

export default partyTypesSlice;
