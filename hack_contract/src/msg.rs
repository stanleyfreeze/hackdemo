use cosmwasm_schema::{cw_serde, QueryResponses};

use crate::state;

#[cw_serde]
pub struct InstantiateMsg {
    pub count: i32,
}

#[cw_serde]
pub enum ExecuteMsg {
    // Increment {},
    // Reset { count: i32 },
    // UpdateUserAge { age: u8 },
    UpdateTask {
        id: u32,
        name: String,
        award: state::Award,
        status: state::Status,
    },
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    // GetCount returns the current count as a json-encoded number
    // #[returns(GetCountResponse)]
    // GetCount {},
    #[returns(GetTaskResponse)]
    GetTask { id: u32 },
}

// We define a custom struct for each query response
// #[cw_serde]
// pub struct GetCountResponse {
//     pub count: i32,
// }

#[cw_serde]
pub struct GetTaskResponse {
    pub task: state::Task,
}
