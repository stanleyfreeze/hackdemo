use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use cosmwasm_std::Addr;
use cw_storage_plus::Item;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct Award {
    pub name: String,
    pub number: u32,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct Status {
    pub name: String,
    pub time: u32,
    pub task: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct Task {
    pub id: u32,
    pub name: String,
    pub award: Vec<Award>,
    pub status: Vec<Status>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct EquipBox {
    pub id: u32,
    pub name: String,
    pub descritption: String,
    pub price: u32,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct State {
    // pub count: i32,
    // pub owner: Addr,
    // pub profile: HashMap<Addr, u8>,
    pub tasks: HashMap<Addr, Task>,
    pub equip_boxes: Vec<EquipBox>,
}

pub const STATE: Item<State> = Item::new("state");
