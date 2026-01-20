const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");
const api = require("../../api");

export const startSession = createAsyncThunk(
  "interview/start",
  async ({ role, difficulty }, { rejectWithValue }) => {
    try {
      const response = await api.post("/interview/start", { role, difficulty });
      return response.data.session;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Failed to start session",
      );
    }
  },
);

export const sendChat = createAsyncThunk(
  "interview/chat",
  async ({ sessionId, userMessage }, { rejectWithValue }) => {
    try {
      const response = await api.post("/interview/chat", {
        sessionId,
        userMessage,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Failed to send message",
      );
    }
  },
);

const initialState = {
  currentSession: null,
  chatHistory: [],
  loading: false,
  error: null,
};

const interviewSlice = createSlice({
  name: "interview",
  initialState,
  reducers: {
    clearSession(state) {
      state.activeSession = null;
      state.chatHistory = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(startSession.fulfilled, (state, action) => {
        state.loading = false;
        state.activeSession = action.payload;
        state.chatHistory = [];
      })
      .addCase(sendChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendChat.fulfilled, (state, action) => {
        state.loading = false;
        state.chatHistory = action.payload.history;
      })
      .addCase(sendChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSession } = interviewSlice.actions;
export default interviewSlice.reducer;
