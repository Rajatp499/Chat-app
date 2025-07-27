import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"user",
    initialState:{id:'', name:'',email:'', profile:'', createdAt:'', status:''},
    reducers:{
        updateUser:(state, action)=>{
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.profile = action.payload.profile;
            state.createdAt = action.payload.createdAt;
            state.status = action.payload.status;

        },
        deleteUser:()=>{
            state.id = '';
            state.name = '';
            state.email = '';
            state.profile = '';
            state.status = ''
            state.createdAt = '';

        }
    }
})

export const {updateUser, deleteUser} = userSlice.actions;
export default userSlice.reducer;