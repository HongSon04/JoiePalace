import { API_CONFIG, makeAuthorizedRequest } from "@/app/_utils/api.config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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
      state.isFetchingPartyTypesError = false;
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
  extraReducers: (builder) => {
    builder
      .addCase(getPartyTypes.pending, (state) => {
        state.isFetchingPartyTypes = true;
        state.isFetchingPartyTypesError = false;
      })
      .addCase(getPartyTypes.fulfilled, (state, action) => {
        state.isFetchingPartyTypes = false;
        state.isFetchingPartyTypesError = false;
        state.partyTypes = action.payload;
      })
      .addCase(getPartyTypes.rejected, (state) => {
        state.isFetchingPartyTypes = false;
        state.isFetchingPartyTypesError = true;
      });
  },
});

// Fetch category dishes
export const getPartyTypes = createAsyncThunk(
  "partyTypes/getPartyTypes",
  async ({ params = {}, signal = null }, { dispatch, rejectWithValue }) => {
    dispatch(fetchingPartyTypes());

    const response = await makeAuthorizedRequest(
      API_CONFIG.PARTY_TYPES.GET_ALL(params),
      "GET",
      null,
      { signal }
    );

    if (response.success) {
      dispatch(fetchingPartyTypesSuccess(response.data));
      return response.data;
    } else {
      dispatch(fetchingPartyTypesFailure(response));
      return rejectWithValue(response.message);
    }
  }
);

export const {
  setPartyTypes,

  fetchingPartyTypes,
  fetchingPartyTypesSuccess,
  fetchingPartyTypesFailure,
} = partyTypesSlice.actions;

export default partyTypesSlice;
